const Job = require("../models/JobModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const request = require('request');

request('http://dev3.dansmultipro.co.id/api/recruitment/positions.json', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});

// Job Schema
function JobData(data) {
	this.id = data.id;
	this.type = data.type;
	this.url = data.url;
	this.created_at = data.created_at;
	this.company = data.company;
	this.company_url = data.company_url;
	this.location = data.location;
	this.title = data.title;
	this.description = data.description;
	this.how_to_apply = data.how_to_apply;
	this.company_logo = data.company_logo;
}

/**
 * Job List.
 * 
 * @returns {Object}
 */

exports.jobList = [
	auth,
	function (req, res) {
		try {
			Job.find({user: req.user._id},"_id type url created_at company company_url location title description how_to_apply company_logo").then((jobs)=>{
				if(jobs.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", jobs);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Job Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.jobDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Job.findOne({_id: req.params.id,user: req.user._id},"_id title description isbn createdAt").then((job)=>{                
				if(job !== null){
					let jobData = new JobData(job);
					return apiResponse.successResponseWithData(res, "Operation success", jobData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Job store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      company
 * 
 * @returns {Object}
 */
exports.jobStore = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var job = new Job(
				{ title: req.body.title,
					user: req.user,
					description: req.body.description
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save job.
				job.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let jobData = new JobData(job);
					return apiResponse.successResponseWithData(res,"Job add Success.", jobData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Job update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * 
 * @returns {Object}
 */
exports.jobUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var job = new Job(
				{ title: req.body.title,
					description: req.body.description,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Job.findById(req.params.id, function (err, foundJob) {
						if(foundJob === null){
							return apiResponse.notFoundResponse(res,"Job not exists with this id");
						}else{
							//Check authorized user
							if(foundJob.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update job.
								Job.findByIdAndUpdate(req.params.id, job, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let jobData = new JobData(job);
										return apiResponse.successResponseWithData(res,"Job update Success.", jobData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Job Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.jobDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Job.findById(req.params.id, function (err, foundJob) {
				if(foundJob === null){
					return apiResponse.notFoundResponse(res,"Job not exists with this id");
				}else{
					//Check authorized user
					if(foundJob.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete job.
						Job.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Job delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];