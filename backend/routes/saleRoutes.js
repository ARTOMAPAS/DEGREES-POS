const express= require('express')
const {
    getAllSales,
    getSale,
    createSale,
    deleteSale,
    updateSale,
    getSaleCount,
}= require('../controllers/saleController')

const router = express.Router()

router.get('/', getAllSales)

router.get('/count', getSaleCount);

//get single sale
router.get('/:id', getSale)


//post new Sale
router.post('/', createSale)

//delete Sale
router.delete('/:id', deleteSale)

//Update Sale
router.patch('/:id',updateSale)


module.exports = router