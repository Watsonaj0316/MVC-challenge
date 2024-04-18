const router = require('express').Router(); // import express router

const apiRoutes = require('./api-routes'); // import api routes 
const htmlRoutes = require('./html-routes'); // import html routes

router.use(htmlRoutes); // use html routes
router.use(apiRoutes); // use api routes

module.exports = router; // export router 