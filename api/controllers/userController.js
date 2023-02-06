const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const User = require("../models/user")

exports.userSignup = (req, res, next) => {
    return res.status(200).json({
        "message": "Hi register here"
    })
}

exports.userLogin = (req, res, next) => {
    res.status(200).json({
        "message": "Hi login here"
    })
}

exports.deleteUser = (req, res, next) => {
    res.status(200).json({
        "message": "Hi delete here"
    })
}