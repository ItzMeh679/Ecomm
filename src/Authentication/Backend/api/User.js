const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const UserOTPVerification = require('../models/UserOTPVerification');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const path = require("path");
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Nodemailer configuration
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error setting up transporter:", error);
    } else {
        console.log("Ready for messages", success);
    }
});

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({
            status: "FAILED",
            message: "Access denied. No token provided."
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            status: "FAILED",
            message: "Invalid token."
        });
    }
};

// Google OAuth Signup/Signin
router.post('/google-auth', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture, email_verified } = payload;
        
        if (!email_verified) {
            return res.json({
                status: "FAILED",
                message: "Google email not verified"
            });
        }
        
        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (user) {
            // User exists, update Google ID if not present
            if (!user.googleId) {
                user.googleId = googleId;
                user.verified = true; // Google users are automatically verified
                await user.save();
            }
            
            const token = generateToken(user._id);
            
            return res.json({
                status: "SUCCESS",
                message: "Google signin successful",
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        verified: user.verified,
                        profilePicture: user.profilePicture || picture
                    },
                    token
                }
            });
        } else {
            // Create new user
            const newUser = new User({
                name,
                email,
                googleId,
                verified: true,
                profilePicture: picture,
                dateOfBirth: new Date(), // Default date, user can update later
            });
            
            const savedUser = await newUser.save();
            const token = generateToken(savedUser._id);
            
            return res.json({
                status: "SUCCESS",
                message: "Google signup successful",
                data: {
                    user: {
                        id: savedUser._id,
                        name: savedUser.name,
                        email: savedUser.email,
                        verified: savedUser.verified,
                        profilePicture: savedUser.profilePicture
                    },
                    token
                }
            });
        }
    } catch (error) {
        console.error("Google auth error:", error);
        res.json({
            status: "FAILED",
            message: "Google authentication failed"
        });
    }
});

// Regular Signup route
router.post('/signup', async (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;

    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (!name || !email || !password || !dateOfBirth) {
        return res.json({
            status: "FAILED",
            message: "Empty input fields",
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.json({
            status: "FAILED",
            message: "Invalid name entered",
        });
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (!new Date(dateOfBirth).getTime()) {
        return res.json({
            status: "FAILED",
            message: "Invalid Date of Birth entered",
        });
    } else if (password.length < 8) {
        return res.json({
            status: "FAILED",
            message: "Password must be at least 8 characters long",
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "User with the provided email already exists",
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            verified: false,
        });

        const result = await newUser.save();
        await sendOTPVerificationEmail(result, res);
    } catch (err) {
        console.error("Signup error:", err);
        res.json({
            status: "FAILED",
            message: "An error occurred while creating the user account",
        });
    }
});

// Send OTP Verification Email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your Email - Just Small Gifts",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: #333; margin-bottom: 20px;">Welcome to Just Small Gifts!</h1>
                        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Enter this verification code in the app to complete your signup:</p>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px;">${otp}</span>
                        </div>
                        <p style="color: #999; font-size: 14px;">This code <strong>expires in 1 hour</strong>.</p>
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        
        res.json({
            status: "PENDING",
            message: "Verification OTP email sent",
            data: {
                userId: _id,
                email,
            },
        });
    } catch (error) {
        console.error("OTP email error:", error);
        res.json({
            status: "FAILED",
            message: "Failed to send verification email",
        });
    }
};

// Verify OTP
router.post("/verifyOTP", async (req, res) => {
    try {
        let { userId, otp } = req.body;
        
        if (!userId || !otp) {
            throw new Error("Empty OTP details are not allowed");
        }

        const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });
        
        if (UserOTPVerificationRecords.length <= 0) {
            throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
        }

        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            throw new Error("Code has expired. Please request again.");
        }

        const validOTP = await bcrypt.compare(otp, hashedOTP);

        if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.");
        }

        await User.updateOne({ _id: userId }, { verified: true });
        await UserOTPVerification.deleteMany({ userId });
        
        const user = await User.findById(userId).select('-password');
        const token = generateToken(user._id);
        
        res.json({
            status: "SUCCESS",
            message: "User email verified successfully.",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    verified: user.verified
                },
                token
            }
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
});

// Resend OTP Verification Code
router.post("/resendOTPVerificationCode", async (req, res) => {
    try {
        let { userId, email } = req.body;

        if (!userId || !email) {
            throw new Error("Empty user details are not allowed");
        }

        await UserOTPVerification.deleteMany({ userId });
        await sendOTPVerificationEmail({ _id: userId, email }, res);
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
});

// Signin route
router.post('/signin', async (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.json({
            status: "FAILED",
            message: "Empty credentials supplied",
        });
    }

    try {
        const userData = await User.findOne({ email });
        
        if (!userData) {
            return res.json({
                status: "FAILED",
                message: "Invalid credentials entered",
            });
        }

        if (!userData.verified) {
            return res.json({
                status: "FAILED",
                message: "Email hasn't been verified yet. Please check your inbox.",
                requiresVerification: true,
                userId: userData._id
            });
        }

        const hashedPassword = userData.password;
        const result = await bcrypt.compare(password, hashedPassword);
        
        if (result) {
            const token = generateToken(userData._id);
            
            res.json({
                status: "SUCCESS",
                message: "Signin successful",
                data: {
                    user: {
                        id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        verified: userData.verified,
                        profilePicture: userData.profilePicture
                    },
                    token
                }
            });
        } else {
            res.json({
                status: "FAILED",
                message: "Invalid password entered",
            });
        }
    } catch (err) {
        console.error("Signin error:", err);
        res.json({
            status: "FAILED",
            message: "An error occurred while checking for the existing user",
        });
    }
});

// Get current user (protected route)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found"
            });
        }

        res.json({
            status: "SUCCESS",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                    profilePicture: user.profilePicture,
                    dateOfBirth: user.dateOfBirth
                }
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Server error"
        });
    }
});

// Password reset request route
router.post("/requestPasswordReset", async (req, res) => {
    const { email, redirectUrl } = req.body;

    try {
        const userData = await User.findOne({ email });
        
        if (!userData) {
            return res.json({
                status: "FAILED",
                message: "No account with the supplied email exists!",
            });
        }

        if (!userData.verified) {
            return res.json({
                status: "FAILED",
                message: "Email hasn't been verified yet. Check your inbox!",
            });
        }

        await sendResetEmail(userData, redirectUrl, res);
    } catch (error) {
        console.error("Password reset request error:", error);
        res.json({
            status: "FAILED",
            message: "An error occurred while checking for the existing user",
        });
    }
});

// Function to send password reset email
const sendResetEmail = async ({ _id, email }, redirectUrl, res) => {
    const resetString = uuidv4() + _id;

    try {
        await PasswordReset.deleteMany({ userId: _id });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Password Reset - Just Small Gifts",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center;">Password Reset</h1>
                        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">We heard you lost your password. Don't worry, use the link below to reset it.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${redirectUrl}/${_id}/${resetString}" 
                               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                               Reset Password
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px; text-align: center;">This link <strong>expires in 60 minutes</strong>.</p>
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
                        </div>
                    </div>
                </div>
            `,
        };

        const saltRounds = 10;
        const hashedResetString = await bcrypt.hash(resetString, saltRounds);
        
        const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newPasswordReset.save();
        await transporter.sendMail(mailOptions);
        
        res.json({
            status: "PENDING",
            message: "Password reset email sent!",
        });
    } catch (error) {
        console.error("Reset email error:", error);
        res.json({
            status: "FAILED",
            message: "An error occurred while sending reset email!",
        });
    }
};

// Reset password route
router.post("/resetPassword", async (req, res) => {
    let { userId, resetString, newPassword } = req.body;

    try {
        const result = await PasswordReset.find({ userId });
        
        if (result.length > 0) {
            const { expiresAt, resetString: hashedResetString } = result[0];

            if (expiresAt < Date.now()) {
                await PasswordReset.deleteOne({ userId });
                return res.json({
                    status: "FAILED",
                    message: "Password reset link has expired.",
                });
            }

            const match = await bcrypt.compare(resetString, hashedResetString);
            
            if (match) {
                const saltRounds = 10;
                const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
                
                await User.updateOne({ _id: userId }, { password: hashedNewPassword });
                await PasswordReset.deleteOne({ userId });
                
                res.json({
                    status: "SUCCESS",
                    message: "Password has been reset successfully.",
                });
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid password reset details provided.",
                });
            }
        } else {
            res.json({
                status: "FAILED",
                message: "Password reset request not found.",
            });
        }
    } catch (error) {
        console.error("Password reset error:", error);
        res.json({
            status: "FAILED",
            message: "Checking for existing password reset record failed.",
        });
    }
});

// Logout route (optional - mainly for token blacklisting in production)
router.post('/logout', verifyToken, (req, res) => {
    // In a real application, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
        status: "SUCCESS",
        message: "Logged out successfully"
    });
});

module.exports = router;