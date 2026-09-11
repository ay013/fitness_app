import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // This URL must exactly match the "Authorized redirect URI" you put in Google Cloud Console
            callbackURL: "http://localhost:8000/api/v1/users/auth/google/callback",
        },
        // This callback function runs immediately after Google verifies the user
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Extract the email from Google's profile payload
                const email = profile.emails[0].value;

                // 2. Check if a user with this email already exists in our database
                let user = await User.findOne({ email });

                if (user) {
                    // 3. If they exist but originally signed up via standard email/password, 
                    // we gracefully link their new Google ID to their existing account.
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        user.authProvider = "google";
                        await user.save({ validateBeforeSave: false });
                    }
                    // Pass the user to the next step of the Express route
                    return done(null, user);
                }

                // 4. If the user does NOT exist, we create a brand new account for them
                // We generate a random username since Google doesn't provide one
                const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);

                const newUser = await User.create({
                    fullName: profile.displayName,
                    email: email,
                    username: generatedUsername.toLowerCase(),
                    googleId: profile.id,
                    authProvider: "google"
                    // Notice we are NOT providing a password or height/weight here
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;