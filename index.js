const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("./client"));

app.set('trust proxy', 1);

app.use(session({
	cookie: {},
	resave: true,
	saveUninitialized: true,
	secret: "penis"
}));

const mongoose = require("mongoose");
let mongo_uri = `mongodb+srv://admin:${process.env.DB_PW}@cluster0.v8u9a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, "mongodb error"));

const path = require("path");

app.get("/", (req, res) => {
	res.redirect("/game");
})

app.use("/game", require("./game.js"));

app.use("/users", require("./users.js"));


app.listen(8000, () => {
	console.log("started");
})
