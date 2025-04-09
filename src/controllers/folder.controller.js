const prisma = require('../prisma/client');

// Get all root folders for the logged-in user
exports.getRootFolders = async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            where: {
                userId: req.user.id,
                parentFolder: null,
            },
        });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch folders', details: err.message });
    }
};

// Get subfolders and documents inside a specific folder
exports.getFolderContent = async (req, res) => {
    const { folderId } = req.params;
    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: {
                subfolders: true,
                documents: true,
            },
        });

        if (!folder || folder.userId !== req.user.id) {
            return res.status(404).json({ error: 'Folder not found or access denied' });
        }

        res.json(folder);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get folder content', details: err.message });
    }
};

// Create a new folder
exports.createFolder = async (req, res) => {
    const { name, parentFolder } = req.body;
    try {
        // Validate parent folder if provided
        if (parentFolder) {
            const existingParent = await prisma.folder.findUnique({ where: { id: parentFolder } });
            if (!existingParent) {
                return res.status(400).json({ error: 'Parent folder does not exist' });
            }
        }

        const newFolder = await prisma.folder.create({
            data: {
                name,
                parentFolder: parentFolder || null,
                userId: req.user.id,
            },
        });

        res.status(201).json(newFolder);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create folder', details: err.message });
    }
};

// Update folder name
exports.updateFolder = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const folder = await prisma.folder.findUnique({ where: { id } });

        if (!folder || folder.userId !== req.user.id) {
            return res.status(404).json({ error: 'Folder not found or access denied' });
        }

        const updatedFolder = await prisma.folder.update({
            where: { id },
            data: { name },
        });

        res.json(updatedFolder);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update folder', details: err.message });
    }
};

// Delete a folder (with basic child check or future recursive delete)
exports.deleteFolder = async (req, res) => {
    const { id } = req.params;

    try {
        const folder = await prisma.folder.findUnique({
            where: { id },
            include: {
                subfolders: true,
                documents: true,
            },
        });

        if (!folder || folder.userId !== req.user.id) {
            return res.status(404).json({ error: 'Folder not found or access denied' });
        }

        // Prevent deletion if it has subfolders or documents
        if (folder.subfolders.length || folder.documents.length) {
            return res.status(400).json({ error: 'Folder contains items. Delete them first or implement recursive delete.' });
        }

        await prisma.folder.delete({ where: { id } });

        res.json({ message: 'Folder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete folder', details: err.message });
    }
};
