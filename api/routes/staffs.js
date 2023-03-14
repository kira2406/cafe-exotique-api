const express = require('express')

const router = express.Router()

const StaffController = require('../controllers/staffController')
const checkAuth = require('../middleware/checkAuth')


router.post('/addStaff', StaffController.addStaff)

router.post('/login', StaffController.staffLogin)

router.post('/getStaffDetails', StaffController.getStaffDetails)

router.delete('/:userId', checkAuth, StaffController.deleteStaff)

module.exports = router