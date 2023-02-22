const express = require('express')
const { clientSign, emailVerify, clientLogin, validateCookie, clientLogout, clientPage, agentSign } = require('../controllers/clientController');
const { role,protect } = require('../middlewares/adminMiddleware');
const router = express.Router()

// Public signup
router.post('/sign', clientSign)

// Email verification
router.get("/verify/:id/:token", emailVerify);

// Public login
router.post('/login', clientLogin)

// Client landing page
router.get('/success', validateCookie, clientPage)

// Client logout
router.get('/logout', clientLogout)


// Agent signup
router.post('/agentSign',protect,role('admin'), agentSign)

module.exports = router