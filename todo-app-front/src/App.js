import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateTodo from "./components/CreateTodo";
import UpdateTodo from "./components/UpdateTodo";
import PdfViewerButton from "./components/Download";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateTodo />} />
          <Route path="/update/:id" element={<UpdateTodo />} />
          <Route path="/download" element={<PdfViewerButton />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
