var mongoose = require("mongoose");

var Schema = mongoose.Schema;
//id, type, url,created_at,company,company_url,location,title,description,how_to_apply,company_logo
var JobSchema = new Schema({
	id: {type: String, required: true},
	type: {type: String, required: true},
	url: {type: String, required: true},
	company: {type: String, required: true},
	company_url: {type: String, required: true},
	location: {type: String, required: true},
	title: {type: String, required: true},
	description: {type: String, required: true},
	how_to_apply: {type: String, required: true},
	company_logo: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Job", JobSchema);