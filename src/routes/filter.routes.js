const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { filterDocuments } = require('../controllers/filter.controller');

router.get('/filter', auth, filterDocuments);
module.exports = router;
