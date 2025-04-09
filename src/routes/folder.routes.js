const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/folder.controller');

router.get('/viewstore', auth, ctrl.getRootFolders);
router.get('/viewstore/:folderId', auth, ctrl.getFolderContent);
router.post('/folders', auth, ctrl.createFolder);
router.put('/folders/:id', auth, ctrl.updateFolder);
router.delete('/folders/:id', auth, ctrl.deleteFolder);

module.exports = router;
