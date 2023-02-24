var express = require("express");
const JobController = require("../controllers/JobController");

var router = express.Router();

router.get("/", JobController.jobList);
router.get("/:id", JobController.jobDetail);
router.post("/", JobController.jobStore);
router.put("/:id", JobController.jobUpdate);
router.delete("/:id", JobController.jobDelete);

module.exports = router;