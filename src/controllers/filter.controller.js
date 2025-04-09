const prisma = require('../prisma/client');

// Recursive path builder
async function buildFolderPath(folderId) {
    const folder = await prisma.folder.findUnique({ where: { id: folderId }, include: { parent: true } });
    if (!folder) return '';
    const parentPath = folder.parent ? await buildFolderPath(folder.parent.id) : '';
    return `${parentPath}${parentPath ? '/' : ''}${folder.name}`;
}

// GET /filter?search=
exports.filterDocuments = async (req, res) => {
    const { search } = req.query;

    try {
        const docs = await prisma.document.findMany({
            where: {
                OR: [
                    { title: { contains: search || '', mode: 'insensitive' } },
                    { content: { contains: search || '', mode: 'insensitive' } },
                ],
            },
            include: {
                folder: true,
            },
        });

        const response = await Promise.all(
            docs.map(async (doc) => ({
                id: doc.id,
                title: doc.title,
                folderPath: await buildFolderPath(doc.folderId),
            }))
        );

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: 'Failed to filter documents', details: err.message });
    }
};
