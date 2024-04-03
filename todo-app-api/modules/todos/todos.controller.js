const { prisma } = require("../../prisma/PrismaClient");

const { Validation } = require("./todos.validation");
const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todos.findMany({
      orderBy: { id: "asc" },
      include: { user: { select: { username: true } } },
    });
    res.status(200).send(todos);
  } catch (error) {
    console.error("Error fetching todos", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getTodoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id?.toString() || "0");
    if (!id) {
      return res.status(400).send({ error: "The request url does not exist." });
    }
    const todo = await prisma.todos.findFirst({
      where: { id: id },
    });
    if (!todo) {
      return res.status(404).send({ error: "Todo not found" });
    }
    res.status(200).send(todo);
  } catch (error) {
    console.error("Error fetching todos", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const createTodo = async (req, res) => {
  const { user_id, time, text, checked } = req.body;

  try {
    const valid = await Validation(req);
    if (valid.success !== true) {
      return res.status(422).send(valid.errors);
    }

    const isAdded = await prisma.todos.findFirst({
      where: { text: text },
    });
    if (isAdded) {
      return res.status(400).send({
        error: "This ToDo is already exists. Please try with another todo",
      });
    }
    const newTodo = await prisma.todos.create({
      data: {
        user_id: user_id,
        time: time,
        text: text,
        checked: checked,
      },
    });

    res.status(200).send({ message: "Todo has been created", data: newTodo });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteTodoById = async (req, res) => {
  const id = parseInt(req.params.id?.toString() || "0");
  if (!id) {
    return res.status(400).send({ error: "The request url does not exist." });
  }
  try {
    const todoToDelete = await prisma.todos.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!todoToDelete) {
      return res.status(404).send({ error: "Todo is not found" });
    }

    const deletedTodo = await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send({ message: "Todo deleted successfully", deletedTodo });
  } catch (error) {
    console.error("Error updating todo", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateTodoById = async (req, res) => {
  const id = parseInt(req.params.id?.toString() || "0");
  if (!id) {
    return res.status(400).send({ error: "The request url does not exist." });
  }
  try {
    const valid = await Validation(req);
    if (valid.success !== true) {
      return res.status(422).send(valid.errors);
    }
    const todoToUpdate = await prisma.todos.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!todoToUpdate) {
      return res.status(404).send({ error: "Todo not found" });
    }

    const updatedTodo = await prisma.todos.update({
      where: {
        id: Number(id),
      },
      data: {...req.body,updated_at: new Date()},
    });
    res.status(200).send({ message: "Todo updated successfully", updatedTodo });
  } catch (error) {
    console.error("Error deleting todo", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  deleteTodoById,
  updateTodoById,
};
