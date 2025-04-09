const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

const uploadFile = async (file) => {
    return `/uploads/${file.filename}`; // simulate storage URL
};

module.exports = { upload, uploadFile };
