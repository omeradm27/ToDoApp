require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./modules/todos/todos.router');
const userRoutes = require('./modules/users/users.router');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors( {
    credentials: true,
}));



app.use("/users/", userRoutes);
app.use("/todos/", todoRoutes);


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})