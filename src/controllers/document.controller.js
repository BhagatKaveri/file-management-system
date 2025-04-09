const prisma = require('../prisma/client');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('../utils/upload'); // Simulated upload handler

// GET /documents/:id
exports.getDocument = async (req, res) => {
    try {
        const doc = await prisma.document.findUnique({
            where: { id: req.params.id },
            include: {
                versions: true,
                folder: true,
            },
        });

        if (!doc) return res.status(404).json({ error: 'Document not found' });

        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get document', details: err.message });
    }
};

// POST /documents
// exports.createDocument = async (req, res) => {
//     const { title, content, folder } = req.body;
//     const file = req.file;

//     try {
//         const newDoc = await prisma.document.create({
//             data: {
//                 title,
//                 content,
//                 folderId: folder,
//             },
//         });

//         // Add first version (1.0)
//         const fileUrl = await uploadFile(file);
//         await prisma.version.create({
//             data: {
//                 documentId: newDoc.id,
//                 version: '1.0',
//                 fileUrl,
//             },
//         });

//         res.status(201).json(newDoc);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to create document', details: err.message });
//     }
// };

// POST /documents
exports.createDocument = async (req, res) => {
    const { title, content, folder: folderId } = req.body; // get `folder` and rename it to `folderId`
    const file = req.file;

    if (!folderId) {
        return res.status(400).json({ error: 'folder (folderId) is required' });
    }

    if (!file) {
        return res.status(400).json({ error: 'File is required' });
    }

    try {
        // Upload file and get path
        const fileUrl = await uploadFile(file);

        // Create document with version 1.0
        const newDoc = await prisma.document.create({
            data: {
                title,
                content,
                folderId,
                userId: req.user.id, // make sure auth middleware attaches this
                versions: {
                    create: {
                        version: '1.0',
                        fileUrl,
                        uploadedAt: new Date()
                    }
                }
            },
            include: {
                versions: true
            }
        });

        res.status(201).json(newDoc);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to create document',
            details: err.message
        });
    }
};


// POST /documents/:id/version
exports.addVersion = async (req, res) => {
    const { versionNumber } = req.body;
    const file = req.file;

    try {
        const doc = await prisma.document.findUnique({
            where: { id: req.params.id },
        });

        if (!doc) return res.status(404).json({ error: 'Document not found' });

        const fileUrl = await uploadFile(file);

        const version = await prisma.version.create({
            data: {
                documentId: req.params.id,
                version: versionNumber,
                fileUrl,
            },
        });

        res.status(201).json(version);
    } catch (err) {
        res.status(500).json({ error: 'Failed to upload version', details: err.message });
    }
};

// GET /documents/:id/versions
exports.getVersions = async (req, res) => {
    try {
        const versions = await prisma.version.findMany({
            where: { documentId: req.params.id },
            orderBy: { uploadedAt: 'desc' },
        });
        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get versions', details: err.message });
    }
};

// PUT /documents/:id
exports.updateDocument = async (req, res) => {
    const { title, content } = req.body;

    try {
        const updated = await prisma.document.update({
            where: { id: req.params.id },
            data: { title, content },
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update document', details: err.message });
    }
};

// DELETE /documents/:id
exports.deleteDocument = async (req, res) => {
    try {
        await prisma.version.deleteMany({ where: { documentId: req.params.id } });
        await prisma.document.delete({ where: { id: req.params.id } });

        res.json({ message: 'Document and versions deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete document', details: err.message });
    }
};
