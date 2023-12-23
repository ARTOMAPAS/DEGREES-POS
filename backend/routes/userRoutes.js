const express= require('express')
const {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}= require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


router.use(requireAuth)
//login route


router.get('/', getAllUsers)

//get single user
router.get('/:id', getUser)

//post new User
router.post('/', createUser)

//delete User
router.delete('/:id', deleteUser)

//Update User
router.patch('/:id',updateUser)

module.exports = router