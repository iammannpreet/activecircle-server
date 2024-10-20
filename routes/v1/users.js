const express = require('express');
const router = express.Router();
const { createUser, getUserById, getAllUsers, deleteUserById } = require('../../services/userService');

// POST /api/v1/users/register - Register a new user
router.post('/register', async (req, res, next) => {
    try {
        const savedUser = await createUser(req.body);
        res.status(201).json(savedUser);
    } catch (err) {
        next(err);
    }
});

// GET /api/v1/users/:id - Get a user by ID
router.get('/:id', async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// GET /api/v1/users - Get all users
router.get('/', async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/v1/users/:id - Delete a user by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedUser = await deleteUserById(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
