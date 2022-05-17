const express = require("express");
const router = express.Router();
const path = require("path");
router.use((req, res, next) => {
	console.log(Date.now());
	console.log(req.session.username);
	next();
});

router.use(express.static("./client"));

const {User} = require("./db");

router.get("/list", (req, res) => {
	User.find().select({"_id": 0, "password_hash": 0}).exec((err, users) => {
		if(err) throw err;
		res.send({users, curr: req.session.username});
	});
	console.log("aaa");
});

router.get("/reg", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client/auth.html"))
})

router.post("/reg", (req, res) => {
	User.find({username: req.body.username}).exec((err, users) => {
		if(users.length === 0){
			let user = new User({
				username: req.body.username,
				password_hash: req.body.password_hash
			});
			user.save().then((user)=>{
				req.session.user_id = user._id;
				res.send({
					ok: "true"
				})
			})
		}
		else{
			res.send({message: "username is already taken"});
		}
	})
})

router.get("/login", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client/login.html"));	
});

router.post("/login", (req, res) => {
	User.findOne({username: req.body.username}).exec((err, user) => {
		if(err) throw err;
		if(user.password_hash === req.body.password_hash){
			req.session.loggedin = true;
			req.session.username = user.username;
			console.log(req.session.username);
			return res.send({ok: "true"});
		}
		else{
			res.status(401);
			res.send({message: "bad credentials"});
		}
	})
})

router.post("/sethi", (req, res) => {
	if(req.session.loggedin){
		console.log(req.body);
		let user = User.findOneAndUpdate({username: req.session.username, highscore: {"$lt": req.body.highscore}}, {highscore: req.body.highscore}).exec();
		res.send({message: "ok"})
	}
	else{
		res.send({message: "no user"});
	}
})

module.exports = router;
