import { createT } from "./create_todo.js";
import { deleteT } from "./deletetodo.js";
import { getadmintodos } from "./getadmintodos.js";
import { getAllT } from "./getalltodos.js";
import { getAllTodosWPAG } from "./getalltodowithpagination.js";
import { getSingleT } from "./getsingletodo.js";
import { patchT } from "./patchtodo.js";
import { updateT } from "./updatetodo.js";

export const createTodo = createT
export const getallTodoWithPagination = getAllTodosWPAG
export const getAllTodo = getAllT
export const getSingleTodo = getSingleT
export const deleteTodo = deleteT
export const updateTodo = updateT
export const patchTodo = patchT
export const getAdminTodo = getadmintodos