const express = require('express');
const router = express.Router();

const pdf = require('./routes/pdfExport.js')

router.use('/pdf', pdf);

module.exports = router;
