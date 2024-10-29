// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack trace for debugging
    res.status(500).json({ message: "An internal server error occurred", error: err.message });
};

module.exports = errorHandler;
