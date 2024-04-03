const { Prisma, prisma } = require("../../prisma/PrismaClient");
// const { Validation }=require( './user.validation');
const jwt = require("jsonwebtoken");
const { LoginValidation } = require("./users.validation");
const bcrypt = require("bcrypt");
const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({ orderBy: { id: "asc" } });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ error: "Id is required" });
    }
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const validationSchema = LoginValidation(req);
    const response = await validationSchema.validate(req.body);
    if (response.error) {
      return res.status(400).send({ error: error.errors[0] });
    }

    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required" });
    }
    const user = await prisma.users.findUnique({
      where: { username: username },
    });
    if (!user) return res.status(404).send({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWt_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send(error.errors);
  }
};
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ error: "Username and password  are required" });
  }
  try {
    const isAdded = await prisma.users.findUnique({
      where: { username: username },
    });

    if (isAdded) {
      return res
        .status(400)
        .send({
          error: "This username is not available. Please choose another",
        });
    }

    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: await bcrypt.hash(password, 10),
      },
    });

    res
      .status(200)
      .send({ message: "User has been created", data: newUser.id });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: "Id is required" });
  }
  try {
    const userToDelete = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!userToDelete) {
      return res.status(404).send({ error: "User not found" });
    }

    const deletedUser = await prisma.users.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send({ message: `${deletedUser.username} is deleted` });
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: "Id is required" });
  }
  try {
    const userToUpdate = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!userToUpdate) {
      return res.status(404).send({ error: "User not found" });
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        ...req.body,
      },
    });
    res.status(200).send({ message: "User deleted successfully", updatedUser });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
module.exports = {
  getUsers,
  getUserById,
  login,
  register,
  deleteUserById,
  updateUserById,
};
