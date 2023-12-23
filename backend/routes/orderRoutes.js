const express= require('express')
const {
    getAllOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
}= require('../controllers/orderController')

const router = express.Router()

router.get('/', getAllOrders)

//get single order
router.get('/:id', getOrder)

//post new Order
router.post('/', createOrder)

//delete Order
router.delete('/:id', deleteOrder)

//Update Order
router.patch('/:id',updateOrder)

module.exports = router