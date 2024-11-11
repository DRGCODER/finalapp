import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const checkAccessTokenExpiration = (token) => {
    try {
        // This will automatically verify and check if the token is expired
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Token is valid. Decoded payload:", decoded);
        return decoded; // Access token is still valid
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.error("Access token has expired:", err.message);
            return null; // Token has expired
        } else {
            console.error("Invalid token:", err.message);
            return null; // Invalid token (could be malformed or tampered)
        }
    }
};