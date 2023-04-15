const express = require("express");
const authRoutes = require("./routes/authRoutes");
const globalErrorHandlingMiddleware = require("./controllers/errorController");
const AppError = require("./utilities/appError");
const app = express();

app.use(express.static('public'))

// Body Parser
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Server is active and ready to serve :)"
    })
});

app.use('/api/v1', authRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandlingMiddleware);

app.listen(5000, () => {
    console.log("Server is listening at port 5000")
})