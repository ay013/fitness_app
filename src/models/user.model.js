import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
   


const userschema =new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            indexx:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,

        },
        fullName:{
            type:String,
            required:true,
            index:true,
            trim:true
        },
        password:{
            type:String,
            required:[true,'pass required']
        },
        refreshToken:{
            type:String 

        }
    },
    {
        timestamps:true
    })

    userschema.pre("save", async function () { // 1. Remove 'next' from arguments
        if (!this.isModified("password")) return; // 2. Just return, don't call next()

        this.password = await bcrypt.hash(this.password, 10);
        // 3. No need to call next() at the end, the function finishes automatically
    });
// })
userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

}



userschema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userschema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userschema)