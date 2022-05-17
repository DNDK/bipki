const mongoose = require("mongoose");

const user = new mongoose.Schema({
	username: String,
	password_hash: String,
	highscore: {type: Number, default: 0}
});
exports.User = mongoose.model("User", user);
