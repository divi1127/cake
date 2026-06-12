const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.get('/', campaignController.getCampaigns);
router.post('/', campaignController.createCampaign);
router.post('/:id/trigger', campaignController.triggerCampaign);

module.exports = router;
