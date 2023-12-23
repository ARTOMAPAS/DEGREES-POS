const express= require('express')
const {
    getAllItemTypes,
    getItemType,
    createItemType,
    deleteItemType,
    updateItemType,
}= require('../controllers/itemTypeController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getAllItemTypes)

//get single itemType
router.get('/:id', getItemType)

//post new ItemType
router.post('/', createItemType)

//delete ItemType
router.delete('/:id', deleteItemType)

//Update ItemType
router.patch('/:id',updateItemType)

module.exports = router