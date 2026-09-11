import {Router} from "express";
import { loginuser, logout, registeruser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from "passport";
import { handleGoogleCallback } from "../controllers/user.controller.js";


const router=Router()


router.route("/register").post(registeruser)
router.route("/login").post(loginuser)
router.route("/logout").post(verifyJWT,logout)


// ... your existing routes (register, login, etc.)

// Route 1: The Redirect
// This redirects the user's browser to Google's consent screen
// Route 1: The Redirect
router.route("/auth/google").get(
    passport.authenticate("google", {
        scope: ["profile", "email"], // <-- THIS is what Google is asking for!
        session: false // Keeps our API stateless since we use JWTs
    })
);

// Route 2: The Callback
// Google sends the user here after they log in
router.route("/auth/google/callback").get(
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login?error=true" // Where to send them if they cancel
    }),
    handleGoogleCallback // Fires if authentication is successful
);





export default router
