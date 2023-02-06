const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@cluster0.nuy52.mongodb.net/CafeExotique?retryWrites=true&w=majority')

const userRoutes = require('./api/routes/users')

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })) // extended : true => supporst extended bodies with rich data
app.use(bodyParser.json())

app.use('/users', userRoutes)

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