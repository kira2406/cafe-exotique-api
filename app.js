const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const redis = require('redis')
const session = require('express-session')
let RedisStore = require('connect-redis').default

const redisClient = redis.createClient({
    password: "ovrXttY0VUJPfcUPRkxPWhYqNfB4Ebnw",
    socket: {
        host: 'redis-13338.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13338
    }
});

redisClient.connect();

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@cluster0.nuy52.mongodb.net/CafeExotique?retryWrites=true&w=majority')

const staffRoutes = require('./api/routes/staffs')

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })) // extended : true => supporst extended bodies with rich data
app.use(bodyParser.json())

app.use((req, res, next) => {

    // Preventing CORS error
    res.header('Access-Control-Allow-Origin', '*') // Defining access to client
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization') // Define which kind of headers we want to accept

    // Browsers send an OPTIONS request before sending a POST or PATCH request
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }

    next();
})

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.JWT_KEY,
    resave: false, // if you make a call and do not udpate the session, we will not force/overwrite the session storage
    saveUninitialized: false, // if you make a request and not adding anything to session object, not writing it to DB
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))

app.use('/staff', staffRoutes)

app.use((req, res, next) => {
    const error = new Error('url not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app