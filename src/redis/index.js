const redis = require('redis')

const redisClient = redis.createClient({ url: `redis://${process.env.CACHE_SERVER}:6379` })
redisClient.on('connect', () => {
    console.log('Connected to redis')
})
redisClient.on('error', (err) => {
    console.log('Error connection to redis', err)
}).connect()

module.exports = redisClient