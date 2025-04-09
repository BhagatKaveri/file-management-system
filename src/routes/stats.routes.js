const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getTotalDocuments } = require('../controllers/stats.controller');

router.get('/total-documents', auth, getTotalDocuments);
module.exports = router;
