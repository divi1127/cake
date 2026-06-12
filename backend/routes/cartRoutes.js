const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/sync', cartController.syncCart);
router.get('/abandoned', cartController.getAbandonedCarts);
router.post('/convert', cartController.convertCart);

module.exports = router;
