const express = require('express');
const router = express.Router();

//POST METHOD
router.post('/post', (req, res) => {
    res.send('Post API');
});

module.exports = router;