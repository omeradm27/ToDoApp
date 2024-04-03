const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    login,
    register,
    deleteUserById,
    updateUserById,
}= require( "./users.controller");


// GET /users/
router.get("/", getUsers);
// GET /users/:user_id
router.get("/:user_id", getUserById);

// POST /users/login
router.post("/login/", login);
// POST /users/register
router.post("/register/", register);

// DELETE /users/:user_id
router.delete("/:user_id", deleteUserById);

// UPDATE /users/:user_id
router.put("/:user_id", updateUserById);

module.exports = router;