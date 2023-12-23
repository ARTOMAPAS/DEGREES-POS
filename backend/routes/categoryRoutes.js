const express= require('express')
const {
    getAllCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory
}= require('../controllers/categoryController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getAllCategories)

//get single category
router.get('/:id', getCategory)

//post new Category
router.post('/', createCategory)

//delete Category
router.delete('/:id', deleteCategory)

//Update Category
router.patch('/:id',updateCategory)

module.exports = router