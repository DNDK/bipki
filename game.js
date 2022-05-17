const router = require("express").Router();
const path = require("path");

router.use((req, res, next) => {
	console.log(Date.now());
	next();
});

router.get("/", (req, res) => {
	if(req.session.username != undefined){
		res.sendFile(path.resolve(__dirname, "client/game.html"));
	}
	else{
		res.redirect("/users/login");
	}
})

module.exports = router;
