const express = require('express');
const app = express();
const cors = require('cors'); // New
const analyticsRoutes = require('./routes/analytics.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use(cors()); // New
app.use(express.json());

app.use('/api', analyticsRoutes);
app.use('/api/v2', dashboardRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;