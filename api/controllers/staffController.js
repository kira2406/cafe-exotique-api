const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Staff = require('../models/staff')
const mongoose = require('mongoose')

exports.staffLogin = (req, res, next) => {
    Staff.find({ $or: [{ email: req.body.username }, { phone_number: req.body.username }] })
        .exec()
        .then(staff => {
            console.log(staff)
            if (staff.length < 1) {
                res.status(401).json({
                    message: 'Wrong email or phone number'
                })
            } else {
                bcrypt.compare(req.body.password, staff[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: staff[0].email,
                            userId: staff[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            },
                        )
                        req.session.staffId = staff[0]._id
                        req.session.role = staff[0].role
                        req.session.email = staff[0].email
                        return res.status(200).json({
                            _id: staff[0]._id,
                            message: 'Auth successful',
                            token: token
                        })
                    } else {
                        return res.status(401).json({
                            message: 'Auth failed',
                        })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.deleteStaff = (req, res, next) => {
    Staff.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            if (result.deletedCount) {
                res.status(200).json({
                    message: "Staff data deleted"
                })
            } else {
                res.status(500).json({
                    error: "Staff data could not be deleted"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.addStaff = (req, res, next) => {
    Staff.find({ $or: [{ email: req.body.email }, { phone_number: req.body.phoneNumber }] })
        .exec()
        .then(staff => {
            console.log(staff)
            if (staff.length > 0) {
                res.status(409).json({
                    message: 'Email / Phone number already exists'
                })    // 409 - conflict, 422 - unprocessable request
            } else {
                const staff = new Staff({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    phone_number: req.body.phoneNumber,
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    role: req.body.role,
                })
                staff.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'Staff user created'
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
            }
        })

}

exports.getStaffDetails = (req, res, next) => {

}