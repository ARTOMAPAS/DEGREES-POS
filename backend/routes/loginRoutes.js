const express = require('express')
const {loginUser,forgotPassword,resetPassword} = require('../controllers/loginController')

const router = express.Router()

router.post('/', loginUser)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:id/:token', resetPassword)
router.get('/resetpassword/:id/:token', resetPassword)

module.exports = router