// import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";





export const verifyJWT = asynchandler(async (req, res, next) => {
    try {




        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer", "")

        //this seccond part we have done for the non web users where there is no concept of cookies 
        //This is the cleaning step. The library jwt.verify is very strict.

        // It expects: eyJhbGci... (The raw token code).

        // It received: Bearer eyJhbGci... (The standard header format).

        // If you feed the "Bearer" string into jwt.verify, it will fail because "Bearer" is not part of the encrypted signature.So, we use.replace("Bearer ", "") to replace the word "Bearer "(notice the space) with an empty string "".This effectively deletes it, leaving only the raw token.
        if (!token) {
            throw new ApiError(401, "unauthorize request ")

        }
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedtoken, "****")
        console.log(token, "***")
        console.log(process.env.ACCESS_TOKEN_SECRET)


        const user = await User.findById(decodedtoken?._id).select("-password -refreshToken")
        //1. The "Banned User" Problem (Security)
        // Imagine this scenario:

        //      10:00 AM: Aarav logs in.The server checks his password and gives him a token valid for 24 hours.

        // 10: 30 AM: Aarav does something bad, and the Admin bans or deletes his account in the database.

        // 11:00 AM: Aarav tries to upload a photo using his token.


        if (!user) {



            throw new ApiError(401, "invalid access token")
        }
        req.user = user;//we have taken all the information regarding the user for moving to the next step 
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")


    }



})



