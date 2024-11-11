import { Router } from "express";
import {
    automaticRefreshToken,
    changeRole,
    deleteU,
    fetchAll,
    fetchAllWithPagination,
    getUserByIDAdmin,
    logIn,
    logOut,
    profile,
    register,
    update,
} from "../controller/auth/auth_Controller.js";
import { authenticateJWT } from "../miffleware/jwt_middleware.js";
import { paginationMiddleware } from "../miffleware/pagination_middleware.js";

const userRouter = Router();
// Login route
userRouter.post("/user-login", logIn);

// Register route
userRouter.post("/user-regester", register);

// Logout route
userRouter.get("/user-logout", logOut);

userRouter.use(authenticateJWT);
// User profile route
userRouter.get("/user-profile", profile);

// only admin can get userby id
userRouter.get("/get-user-by-id-admin", getUserByIDAdmin);

// Get All Users Route
userRouter.get("/users", fetchAll);

// Delete User Route
userRouter.delete("/delete-user", deleteU);

// Update User Route
userRouter.put("/update-user", update);
// Update User Role Route
userRouter.patch("/update-user-role", changeRole);

// Refresh Token Route
userRouter.get("/refresh-token", automaticRefreshToken);

// Get All Users With Pagination Route
userRouter.get("/userswpag", paginationMiddleware, fetchAllWithPagination);

export default userRouter;
