const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");


const productRouter = require('./routers/product.router');
const usersRouter = require('./routers/users.router');
const orderRouter = require('./routers/order.router');
const contactRouter = require('./routers/contact.router');



// express app initialization
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
// cors
app.use(
    cors({
        origin: "https://e-commerce-dokan.vercel.app",
        // origin: "http://localhost:3000",
        credentials: true,
    })
)
const port = process.env.PORT;

// Health check endpoint (add this!)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


// connect to mongoose
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB'));

// routes
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/contact', contactRouter);


// default error handler
const errorHandler = (err, req, res, next) => {
    if(res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err.message });
};

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})