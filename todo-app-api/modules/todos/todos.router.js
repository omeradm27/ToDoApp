const express = require('express');
const router = express.Router();
const {
    getTodos,
    getTodoById,
    getTodoByUserId,
    deleteTodoById,
    updateTodoById,
    createTodo,
}= require( "./todos.controller");


// GET /todos/
router.get("/", getTodos);
// GET /todos/:id
router.get("/:id", getTodoById);
// GET /todos/:user_id
router.get("/user/:id", getTodoByUserId);

// POST /todos/create
router.post("/", createTodo);

// DELETE /todos/:id
router.delete("/:id", deleteTodoById);

// UPDATE /todos/:id
router.put("/:id", updateTodoById);

module.exports = router;