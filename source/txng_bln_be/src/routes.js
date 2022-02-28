const express = require('express');
const router = express.Router();


require('./api/router')(router);

module.exports = router;