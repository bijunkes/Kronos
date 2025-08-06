const express = require('express');
const router = express.Router();
const db = requise('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;