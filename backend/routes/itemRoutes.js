const express= require('express')
const {
    getAllItems,
    getItem,
    createItem,
    deleteItem,
    updateItem
}= require('../controllers/itemController')

const router = express.Router()

router.get('/', getAllItems)

//get single item
router.get('/:id', getItem)

//post new Item
router.post('/', createItem)

//delete Item
router.delete('/:id', deleteItem)

//Update Item
router.patch('/:id',updateItem)

module.exports = router