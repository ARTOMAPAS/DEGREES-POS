const express= require('express')
const {
    getAllBranchs,
    getBranch,
    createBranch,
    deleteBranch,
    updateBranch,
    updateAvailability
}= require('../controllers/branchController')
// const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// router.use(requireAuth)

router.get('/', getAllBranchs)

//get single branch
router.get('/:id', getBranch)

//post new Branch
router.post('/', createBranch)

//delete Branch
router.delete('/:id', deleteBranch)

//Update Branch
router.patch('/updateAvailability/:id',updateAvailability)

router.patch('/:id',updateBranch)


module.exports = router