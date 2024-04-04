const { Prisma, prisma } = require("../../prisma/PrismaClient");
// const { Validation }=require( './user.validation');
const jwt = require("jsonwebtoken");
const { LoginValidation, RegisterValidation } = require("./users.validation");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({ orderBy: { id: "asc" } });
    res.status(200).send({success: true, data:users});
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ success: false, success: false,error: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ success: false,error: "Id is required" });
    }
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).send({ success: false,error: "User not found" });
    }
    res.status(200).send({success: true, data:user});
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ success: false,error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const valid = await LoginValidation(req);
    if (valid.success !== true) {
      return res.status(422).send(valid.errors);
    }
    const user = await prisma.users.findUnique({
      where: { username: username },
    });
    if (!user) return res.status(404).send({success: false, username: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({success: false, password: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWt_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({success: true, message: "Login successful", token ,data: user});
  } catch (error) {
    res.status(500).send({success: false,error:error.errors});
  }
};
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const valid = await RegisterValidation(req);
    if (valid.success !== true) {
      return res.status(422).send(valid.errors);
    }
    const isAdded = await prisma.users.findUnique({
      where: { username: username },
    });

    if (isAdded) {
      return res.status(400).send({
        success: false,
        username: "This username is not available. Please choose another",
      });
    }
    const newUser = await prisma.users.create({
      data: {username: username,password: await bcrypt.hash(password, 10)},
    });
    res.status(200).send({ success: true, message: "User has been created", data: newUser.id });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false,error: "Internal Server Error" });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ success: false,error: "Id is required" });
  }
  try {
    const userToDelete = await prisma.users.findUnique({
      where: {id: Number(id)}
    });
    if (!userToDelete) {
      return res.status(404).send({ success: false,error: "User not found" });
    }

    const deletedUser = await prisma.users.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send({ success: true, message: `${deletedUser.username} is deleted` });
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).send({ success: false,error: "Internal Server Error" });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ success: false,error: "Id is required" });
  }
  try {
    const userToUpdate = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!userToUpdate) {
      return res.status(404).send({ success: false,error: "User not found" });
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        ...req.body,
      },
    });
    res.status(200).send({ success: true, message: "User deleted successfully", updatedUser });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send({ success: false,error: "Internal Server Error" });
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
