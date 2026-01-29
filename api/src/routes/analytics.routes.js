const express = require('express');
const router = express.Router();
const hdfsService = require('../services/hdfs.service');

router.get('/trips-per-hour', async (req, res) => {
    try {
        const data = await hdfsService.readFileFromHDFS('/data/nyc/analytics/trips-by-hour');
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/average-fare', async (req, res) => {
    try {
        const data = await hdfsService.readFileFromHDFS('/data/nyc/analytics/avg-fare');
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;