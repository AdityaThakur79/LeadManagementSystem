import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { userSchema } from "../validationSchema/validationSchema.js";
import { ActivityLog } from "../models/activityModel.js";
import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";

const pendingUsers = new Map();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "adityathakur80070@gmail.com",
        pass: "pmjf vmqu pxqf mxnf",
      },
    });

    let mailOptions = {
      from: "leadmanagementapp@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

//Register
export const registerController = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ message: "Validation Error", details: error.details });
    }

    const { name, email, password, answer } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Check if a pending user already exists for this email
    if (pendingUsers.has(email)) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please verify your email.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Store user details and OTP temporarily
    pendingUsers.set(email, {
      name,
      email,
      hashedPassword,
      answer,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message:
        "Account created successfully. Please verify your email with the OTP sent.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

// Verify OTP Controller
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Check if the email exists in pending users
    if (!pendingUsers.has(email)) {
      return res
        .status(400)
        .json({ message: "No registration found for this email" });
    }

    const pendingUser = pendingUsers.get(email);

    // Validate OTP
    if (pendingUser.otp !== otp || Date.now() > pendingUser.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Create the user in the database
    const newUser = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.hashedPassword,
      answer: pendingUser.answer,
      status: true,
    });

    // Remove the user from pending list
    pendingUsers.delete(email);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. User registered!",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Login
export const loginContoller = async (req, res) => {
  try {
    // const { error } = userSchema.validate(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({ message: "Validation Error", details: error.details });
    // }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

//Logout
export const logoutController = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Log out",
    });
  }
};

//Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

//Update User Controller
export const updateUserController = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    if (!name || !profilePhoto) {
      return res.status(500).send({
        message: "All field is required",
        success: false,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    //if an image already exist, extract publicId of old image from the url
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }

    //upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;
    const updatedData = { name, photoUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).send({
      message: "User Updated Successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Update User Profile",
    });
  }
};

export const forgotController = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "answer is required" });
    }
    if (!newpassword) {
      return res.status(400).send({ message: "new password is required" });
    }

    const user = await User.findOne({ email, answer });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "user not found",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newpassword, salt);
    await User.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).send({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Something went Wrong",
        error,
      });
  }
};

export const createUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ message: "Validation Error", details: error.details });
    }
    const { name, email, password, role, answer } = req.body;

    if (!name || !email || !password || !role || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      answer,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        answer: user.answer,
      },
    });

    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: null,
      action: "created",
      details: "New User Created",
    });
    activityLog.save();
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ message: "Validation Error", details: error.details });
    }
    const { id } = req.params;
    const { name, email, role, answer } = req.body;

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role, answer },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: null,
      action: "created",
      details: "New User Created",
    });
    activityLog.save();
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: id || null,
      action: "created",
      details: "User Deleted",
    });
    activityLog.save();
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error,
    });
  }
};

export const fetchUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users sorted by createdAt in descending order
    const { page = 1, limit = 1 } = req.query;
    const skip = Number((page - 1) * limit);
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      message: "Users fetched successfully",
      users,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error,
    });
  }
};

export const getSupportAgents = async (req, res) => {
  try {
    // Fetch all users who have a role of 'supportAgent'
    const supportAgents = await User.find({ role: "supportAgent" });

    if (!supportAgents || supportAgents.length === 0) {
      return res.status(404).json({ message: "No support agents found" });
    }

    res.status(200).json(supportAgents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching support agents", error });
  }
};
