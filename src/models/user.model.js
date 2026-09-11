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
            index:true
        },
        
            height:{
                type: Number,
                required:false,
                unique:false,
                trim:true


            },
            weight:{
                type: Number,
                required:false,
                unique:false,
                trim:true

            },
            enabled:{
                type:Boolean,
                unique:false,
                default: true ,
                required:false


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
        password: {
            type: String,
            // REMOVED 'required: true' so Google users can be saved without a password
        },
        // NEW OAUTH FIELDS BELOW
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true // This is crucial!//If an interviewer asks you to explain the googleId field, this is where you can really impress them.

//When you make a field unique: true, MongoDB ensures no two documents have the same value.However, since googleId is optional(local users won't have one), multiple local users will have a null value for their googleId. MongoDB will actually crash and throw a "Duplicate Key Error" because it sees multiple null values!

                //By adding sparse: true, you tell MongoDB: "Only enforce the unique rule if the field actually exists." It is a subtle but advanced database optimization that shows you deeply understand MongoDB's indexing engine.
        },
        refreshToken:{
            type:String 

        }
    },
    {
        timestamps:{ createdAt: 'created_at', updatedAt: 'modified_at'}
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