import { Router } from "express";
import { createTodo, getallTodoWithPagination, getAllTodo, getSingleTodo, deleteTodo, updateTodo, patchTodo, getAdminTodo } from "../controller/todos/todo_controller.js";
import { paginationMiddleware } from "../miffleware/pagination_middleware.js";
import { authenticateJWT } from '../miffleware/jwt_middleware.js';


const todoRouter = Router();

todoRouter.use(authenticateJWT);

// Create TODO route
todoRouter.post("/create-todo", createTodo);


// Fetch All TODO route
todoRouter.get("/getalltodo", getAllTodo);

// Fetch Single Todo route
todoRouter.get("/getsingletodo", getSingleTodo);

// Delete todo Route
todoRouter.delete("/deletetodo", deleteTodo);

// Update todo Route
todoRouter.put("/updatetodo", updateTodo);

// Update single content in a todo Route 
todoRouter.patch("/patchtodo", patchTodo);

// Fetch All Admin Todo Route
todoRouter.get("/getadmintodo", getAdminTodo);

// Fetch All TODO With PAgination route
todoRouter.get("/getalltodowithpag", paginationMiddleware, getallTodoWithPagination);

export default todoRouter;