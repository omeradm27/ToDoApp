# ToDoApp

ToDoApp is a full-stack application for managing your tasks efficiently. It consists of two main parts: a RESTful API backend (todo-app-api) built with Node.js and Express, and a frontend client (todo-app-front) developed with React.

## Features

- User authentication and authorization using JWT tokens.
- CRUD operations for managing tasks.
- Seamless integration of Prisma ORM for database operations.
- Responsive and intuitive user interface with React and Ant Design components.
- PDF generation of task reports with React PDF Renderer.
- Form validation using Yup and React Hook Form.
- State management with Zustand.
- Tailwind CSS for effortless styling.

## Installation


### Backend (todo-app-api)

1. Clone the repository:
   ```bash
   git clone <repository-url>

2. Navigate to the todo-app-api directory:
    cd todo-app-api

3. Install dependencies:
    npm install

#### Database Installation 

1. Set up a Postgres Database in your local which name ' TodoApp '

2. Set up prisma database configuration
  npm run setup 

3. Set up environment variables:
    example.env change name as .env

4. Start the server:
    npm start

### Frontend (todo-app-front)

1. Navigate to the todo-app-front directory:
    cd todo-app-front

2. Install dependencies:
    npm install

3. Set up environment variables:
    example.env change name as .env 

4. Start the development server:
    npm start

Visit http://localhost:3000 in your browser to view the application.

## Technologies Used

Backend
Node.js
Express.js
Prisma ORM
JWT Authentication
Bcrypt
Joi
Cors
Dotenv

Frontend
React
React Router
Ant Design
Axios
React Hook Form
Yup
Zustand
Tailwind CSS