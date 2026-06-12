const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

router.get('/logs', whatsappController.getLogs);
router.post('/test-send', whatsappController.sendTestMessage);

module.exports = router;
