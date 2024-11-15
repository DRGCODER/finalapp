import { deleteUserFromDB } from './deleteUser.js';
import { getAllUsers } from './getAllUsers.js';
import { getAllUsersWPAG } from './getAllUsersWPAG.js';
import { handleLogin } from './loginUser.js';
import logoutUser from './logout.js';
import { registerUser } from './register.js';
import { updateUser } from './updateUser.js';
import { userProfile } from './userProfile.js';
import { changeUserRole } from './changeUSerRole.js';
import { handleRefreshToken } from './regenerate_JWT_Token.js';
import { getUserByIdAdmin } from './get_user_by_id_admin.js';



export const register = registerUser;
export const profile = userProfile;
export const update = updateUser;
export const deleteU = deleteUserFromDB;
export const fetchAll = getAllUsers;
export const logOut = logoutUser;
export const logIn = handleLogin;
export const fetchAllWithPagination = getAllUsersWPAG;
export const changeRole = changeUserRole;
export const automaticRefreshToken = handleRefreshToken;
export const getUserByIDAdmin = getUserByIdAdmin;