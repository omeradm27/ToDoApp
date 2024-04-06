const express = require('express');
const router = express.Router();
const {
    login,
    register,
}= require( "./users.controller");


// POST /users/login
router.post("/login/", login);
// POST /users/register
router.post("/register/", register);


module.exports = router;