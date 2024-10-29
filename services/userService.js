// services/userService.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Create a new user
const createUser = async (userData) => {
    try {
        // Destructure and validate required fields
        const { name, email, password, preferences } = userData;
        if (!name || !email || !password) {
            throw new Error('Missing required fields: name, email, or password');
        }

        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);  // Salt rounds set to 10

        // Create a new user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            preferences: preferences || [],  // Optional preferences
            joinedActivities: []  // Default value
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Exclude the password before returning the response
        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.password;

        return userWithoutPassword;
    } catch (err) {
        throw new Error(`Error creating user: ${err.message}`);
    }
};

// Get a user by ID
const getUserById = async (id) => {
    try {
        const user = await User.findById(id).select('-password');  // Exclude password from the result
        if (!user) throw new Error('User not found');
        return user;
    } catch (err) {
        throw new Error(`Error retrieving user: ${err.message}`);
    }
};

// Get all users
const getAllUsers = async () => {
    try {
        const users = await User.find().select('-password');  // Exclude password from all users
        return users;
    } catch (err) {
        throw new Error(`Error retrieving users: ${err.message}`);
    }
};

// Delete a user by ID
const deleteUserById = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('User not found');
        return { message: 'User deleted' };
    } catch (err) {
        throw new Error(`Error deleting user: ${err.message}`);
    }
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    deleteUserById
};
