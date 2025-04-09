const prisma = require('../prisma/client');

// Get total document count for a user
exports.getTotalDocuments = async (req, res) => {
    try {
        const count = await prisma.document.count({
            where: { userId: req.user.id },
        });
        res.json({ totalDocuments: count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get document count', details: err.message });
    }
};
