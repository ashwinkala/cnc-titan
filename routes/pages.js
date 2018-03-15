var express = require('express');
var router = express.Router();
var pageController = require('../controllers/pageController');

router.get('/', pageController.ensure_authenticated, pageController.get_index);
router.get('/settings', pageController.ensure_authenticated, pageController.get_settings);

module.exports = router;