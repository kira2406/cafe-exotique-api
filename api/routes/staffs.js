const express = require('express')

const router = express.Router()

const StaffController = require('../controllers/staffController')

router.post('/signup', StaffController.staffSignup)

router.post('/login', StaffController.staffLogin)

router.delete('/:userId', StaffController.deleteStaff)

module.exports = router