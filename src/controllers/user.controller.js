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
        user.refreshToken = refreshtoken
      await  user.save({ validateBeforeSave: false })
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
const {fullName,email,username,password,height,weight}=req.body
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

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        height: height || null, // Optional: will safely be null if not provided during signup
        weight: weight || null  // Optional: will safely be null if not provided during signup
    });
    const createuser=await User.findById(user._id).select(
      "  -password     -refreshToken" 
    )

    if (!createuser){
        throw new ApiError(500,"something went wrong ")

    }
    return  res.status(201).json(new ApiResponse(201,createuser,"user registered"))






})

const loginuser = asynchandler(async (req, res) => {
    console.log(" i came ")
    const { email, password } = req.body
    // console.log(email,username)
    if (!email ) {
        throw new ApiError(400, "email or  username is required ")

    }
    const user = await User.findOne({
        $or: [{ email }]
    })
    console.log("hey")

    if (!user) {
        throw new ApiError(404, "user does not exist ")
    }
    const ispasswordvalid = await user.isPasswordCorrect(password)
    if (!ispasswordvalid) {
        throw new ApiError(404, "user doesnt exist ")
    }
    console.log("hello")
    const { accesstoken, refreshtoken } = await generateAccessAndRefreshTokens(user._id)
    const loggedinuser = await User.findById(user._id).select("-password  -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).
        cookie("accesstoken", accesstoken, options).
        cookie("refreshtoken", refreshtoken, options).
        json(
            new ApiResponse(
                200,
                {
                    user: loggedinuser, accesstoken, refreshtoken

                },
                "user logged in sucseffuly "))




})
// Add this below your loginuser function
const handleGoogleCallback = asynchandler(async (req, res) => {
    // Passport automatically attaches the verified user to req.user
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Google authentication failed");
    }

    // Generate tokens using your existing utility
    const { accesstoken, refreshtoken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    // For backend testing, we will just return the JSON. 
    // Later, when you build a frontend, you will change this to res.redirect("http://localhost:3000/dashboard")
    return res.status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new ApiResponse(200, { user, accesstoken, refreshtoken }, "Google OAuth login successful")
        );
});
const logout=asynchandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:1
        }
    },
{
    new :true
})
const options ={
    httpOnly:true,
    secure:true
}

return res.status(200).clearCookie("accessToken",options).clearCookie("refreshtoken",options).json(new ApiResponse(200,{},"User logged out"))
}
)

export {registeruser,loginuser,logout,handleGoogleCallback}