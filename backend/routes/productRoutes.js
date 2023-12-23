const express= require('express')
const {
    getAllProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
}= require('../controllers/productController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getAllProducts)

//get single product
router.get('/:id', getProduct)

//post new Product
router.post('/', createProduct)

//delete Product
router.delete('/:id', deleteProduct)

//Update Product
router.patch('/:id',updateProduct)

module.exports = router