const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require("dotenv").config();
var log4js = require('log4js');
var log = log4js.getLogger("index");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then((result) =>
    {
        console.log("Mongo DB Connected");
    }).catch((err) =>
    {
        console.log(err);
    });

app.use(express.json());
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/users");
// const movieRoute = require("./src/routes/movies");
// const listRoute = require("./src/routes/lists");

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
// app.use("/api/movies", movieRoute);
// app.use("/api/lists", listRoute);


const PORT = 4000
app.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
});