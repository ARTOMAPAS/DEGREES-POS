const express= require('express')
const {
    getAllInventoryEntrys,
    getInventoryEntry,
    createInventoryEntry,
    deleteInventoryEntry,
    updateInventoryEntry
}= require('../controllers/inventoryEntryController')

const router = express.Router()

router.get('/', getAllInventoryEntrys)

//get single inventoryEntry
router.get('/:id', getInventoryEntry)

//post new InventoryEntry
router.post('/', createInventoryEntry)

//delete InventoryEntry
router.delete('/:id', deleteInventoryEntry)

//Update InventoryEntry
router.patch('/:id',updateInventoryEntry)

module.exports = router