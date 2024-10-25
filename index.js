require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 30, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many requests from this IP, please try again later.' }
})

const Loginlimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 30, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many login attempt.' }
})

const { logger, handleError, verifyJWT, handleValidation, cacheMiddleware, cacheInterceptor, invalidateInterceptor } = require('./src/middlewares/index.js')

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

passport.use(jwtStrategy)



// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)

// Router
app.use('/auth',Loginlimiter, authRouter)
app.use(limiter)
app.use('/files', fileRouter)

app.use(cacheMiddleware)
app.use(cacheInterceptor(30 * 60))
app.use(invalidateInterceptor)
app.use('/courses', passport.authenticate('jwt', { session: false }), courseRouter)
app.use('/books', verifyJWT, bookRouter)
app.use('/users', verifyJWT, userRouter)



app.use(handleError)

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})