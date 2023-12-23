const express= require('express')
const {
    getAllReports,
    getReport,
    createReport,
    deleteReport,
    updateReport
}= require('../controllers/reportController')

const router = express.Router()

router.get('/', getAllReports)

//get single report
router.get('/:id', getReport)

//post new Report
router.post('/', createReport)

//delete Report
router.delete('/:id', deleteReport)

//Update Report
router.patch('/:id',updateReport)

module.exports = router