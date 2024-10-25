require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const rateLimit = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')


const { handleError, cacheMiddleware, cacheInterceptor, invalidateInterceptor } = require('./src/middlewares/index.js')

const dbConnect = require('./src/db/db.js')
const bookRouter = require('./src/routes/book.js')
const userRouter = require('./src/routes/user.js')
const courseRouter = require('./src/routes/course.js')
const authRouter = require('./src/routes/auth.js');
const jwtStrategy = require('./src/common/strategy/jwt.js');
const redisClient = require('./src/redis/index.js');
const fileRouter = require('./src/routes/file.js');

const app = express()

dbConnect().catch((err) => {
    console.log(err)
})
redisClient.connect()

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


// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)

app.use('/auth', loginLimit, authRouter)
app.use(limiter)
app.use('/files', passport.authenticate('jwt', { session: false }), fileRouter)

//Redis Cache
app.use(cacheMiddleware)
app.use(cacheInterceptor(30 * 60))
app.use(invalidateInterceptor)
// Cachable Routes
app.use('/courses', passport.authenticate('jwt', { session: false }), courseRouter)
app.use('/books', passport.authenticate('jwt', { session: false }), bookRouter)
app.use('/users', passport.authenticate('jwt', { session: false }), userRouter)

app.use(handleError)

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})