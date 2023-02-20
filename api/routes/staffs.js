const express = require('express')

const router = express.Router()

const StaffController = require('../controllers/staffController')


router.post('/addStaff', StaffController.addStaff)

router.post('/login', StaffController.staffLogin)

router.delete('/:userId', StaffController.deleteStaff)

module.exports = router