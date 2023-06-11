require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB is connected'));

// Middleware to parse URL-encoded data: to read form data
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// to parse the cookies, and get the jwt
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')));

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
    // if(!req.user){
    //     return res.redirect("/user/signup");
    // }

    const allBlogs = await Blog.find({}).sort({createdAt: -1});
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    })
})

app.listen(PORT, () => {
    console.log('Server started at PORT:', PORT);
})