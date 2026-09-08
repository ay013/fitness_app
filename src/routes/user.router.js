import {Router} from "express";
import { loginuser, logout, registeruser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()


router.route("/register").post(registeruser)
router.route("/login").post(loginuser)
router.route("/logout").post(verifyJWT,logout)





export default router
