const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};
