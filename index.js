require('dotenv').config()

const express = require('express')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require("socket.io");
const bodyParser = require('body-parser')
const passport = require('passport');
const rateLimit = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const path = require('path')
const { Redis } = require('ioredis')

const { handleError, cacheMiddleware, cacheInterceptor, invalidateInterceptor, verifyJWT } = require('./src/middlewares/index.js')

const dbConnect = require('./src/db/db.js')
const bookRouter = require('./src/routes/book.js')
const userRouter = require('./src/routes/user.js')
const courseRouter = require('./src/routes/course.js')
const authRouter = require('./src/routes/auth.js');
const jwtStrategy = require('./src/common/strategy/jwt.js');
const redisClient = require('./src/redis/index.js');
const fileRouter = require('./src/routes/file.js');
const chatRouter = require('./src/routes/chat.js');
const ChatModel = require('./src/models/chat.js');
const roleRouter = require('./src/routes/role.js');
const permissionsRouter= require('./src/routes/permissions.js')
const cors = require('cors')

const { createAdapter } = require("@socket.io/redis-adapter");
const setupSwagger = require('./src/swagger/index.js');

const pubClient = new Redis({
    port: 6379, // Redis port
    host: process.env.CACHE_SERVER, // Redis host
});
const subClient = pubClient.duplicate();
const app = express()
app.use(cors())
const server = createServer(app, (req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers)
        res.end()
        return
    }

    if (['GET', 'POST'].indexOf(req.method) > -1) {
        res.writeHead(200, headers)
        // console.log("Hello World")
        res.end('Hello World')
        return
    }

    res.writeHead(405, headers)
    res.end(`${req.method} is not allowed for the request.`)
});
const io = new Server(server, {
    cors: {
        origin: '*'
    },
    adapter: createAdapter(pubClient, subClient)
})

// app.get('/', (req, res) => {
//     return res.sendFile(path.join(__dirname, 'index.html'))
// })
// protocol: http, express


// protocal: websocket, socket.io
io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('send-message', async (payload) => {
        const chat = new ChatModel({
            byUser: payload.id,
            text: payload.text
        })
        await chat.save()
        await chat.populate('byUser')
        // Recieve
        // Save chat to DB
        io.emit('re-message', chat)
    })
})

dbConnect().catch((err) => {
    console.log(err)
})
// redisClient.connect()

const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 30, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many requests from this IP, please try again later.' },
})
// console.log("Restart")

const loginLimit = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many login attampt' },
})

passport.use(jwtStrategy)

app.use("/uploads", express.static("uploads"))

// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)

app.use('/v1/auth', authRouter)
app.use('/v1/chats', chatRouter)

// app.use(limiter)
app.use('/v1/files', passport.authenticate('jwt', { session: false }), fileRouter)
//app.use('/v1/files',  fileRouter)

//Redis Cache
// app.use(passport.authenticate('jwt', { session: false }))
// app.use(cacheMiddleware)
// app.use(cacheInterceptor(3 * 60))
// app.use(invalidateInterceptor)
// Cachable Routes
app.use('/v1/courses',
    passport.authenticate('jwt', { session: false }),
    cacheMiddleware,
    cacheInterceptor(3 * 60),
    invalidateInterceptor,
    courseRouter)
app.use('/v1/books',
    passport.authenticate('jwt', { session: false }),
    cacheMiddleware,
    cacheInterceptor(3 * 60),
    invalidateInterceptor,
    bookRouter)
app.use('/v1/users',
    passport.authenticate('jwt', { session: false }),
    cacheMiddleware,
    // cacheInterceptor(3 * 60),
    invalidateInterceptor,
    userRouter)
app.use('/v1/roles',
        passport.authenticate('jwt', { session: false }),
        cacheMiddleware,
        // cacheInterceptor(3 * 60),
        invalidateInterceptor,
    roleRouter)
app.use('/v1/permissions',
        passport.authenticate('jwt', { session: false }),
        cacheMiddleware,
        // cacheInterceptor(3 * 60),
        invalidateInterceptor,
    permissionsRouter)
app.use(handleError)

setupSwagger(app)

server.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})