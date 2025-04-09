const router = require('express').Router();
const { upload } = require('../utils/upload'); // Fix: Destructure from module
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/document.controller');

router.get('/documents/:id', auth, ctrl.getDocument);
router.post('/documents', auth, upload.single('file'), ctrl.createDocument);
router.post('/documents/:id/version', auth, upload.single('file'), ctrl.addVersion);
router.get('/documents/:id/versions', auth, ctrl.getVersions);
router.put('/documents/:id', auth, ctrl.updateDocument);
router.delete('/documents/:id', auth, ctrl.deleteDocument);

module.exports = router;
