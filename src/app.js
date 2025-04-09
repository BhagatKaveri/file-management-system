require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const folderRoutes = require('./routes/folder.routes');
const docRoutes = require('./routes/document.routes');
const filterRoutes = require('./routes/filter.routes');
const statsRoutes = require('./routes/stats.routes');

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(authRoutes);
app.use(folderRoutes);
app.use(docRoutes);
app.use(filterRoutes);
app.use(statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
