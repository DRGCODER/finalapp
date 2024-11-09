import { Router } from "express";
import { changeRole, deleteU, fetchAll, fetchAllWithPagination, logIn, logOut, profile, register, update } from "../controller/auth/auth_Controller.js";





const userRouter = Router();


// Login route
userRouter.post("/user-login", logIn);

// Register route
userRouter.post("/user-regester", register);

// User profile route
userRouter.get("/user-profile", profile);

// Logout route
userRouter.get("/user-logout", logOut);

// Get All Users Route
userRouter.get("/users", fetchAll);
// Get All Users With Pagination Route
userRouter.get("/userswpag", fetchAllWithPagination);

// Delete User Route 
userRouter.delete("/delete-user", deleteU);

// Update User Route
userRouter.put("/update-user", update);
// Update User Role Route
userRouter.patch("/update-user-role", changeRole);


export default userRouter;