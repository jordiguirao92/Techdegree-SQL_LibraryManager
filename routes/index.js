const express = require('express');
const router = express.Router();

//get / - Home route should redirect to the /books route.
router.get('/', (req, res, next) => {
    res.redirect("/books")
  });

module.exports = router;