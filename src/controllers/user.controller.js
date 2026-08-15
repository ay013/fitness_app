import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
// import { uploadoncloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()
        user.refreshtoken = refreshtoken
        user.save({ validateBeforeSave: false })
        return { accesstoken, refreshtoken }

    }
    catch (error) {
        throw new ApiError(500,
            "somehting went wrong while generating refersh token and access token"
        )

    }
}


const registeruser=asynchandler(async(req,res)=>{
console.log("test");
const {fullName,email,username,password}=req.body
// console.log(test2);

// console.log(fullName);

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")

    }


    const existeduser=await User.findOne({
        $or:[{username},{email}]

    })
    if (existeduser){
        throw new ApiError(409,"user with email or username existed")

    }

    const user=await User.create({
        fullName,
        email,
        password,
        username:username.toLowerCase()
    })
    const createuser=await User.findById(user._id).select(
      "  -password     -refreshToken" 
    )

    if (!createuser){
        throw new ApiError(500,"something went wrong ")

    }
    return  res.status(201).json(new ApiResponse(201,createuser,"user registered"))






})


export {registeruser}