const { chai, server, should } = require("./testConfig");
const JobModel = require("../models/JobModel");

/**
 * Test cases to test all the job APIs
 * Covered Routes:
 * (1) Login
 * (2) Store job
 * (3) Get all jobs
 * (4) Get single job
 * (5) Update job
 * (6) Delete job
 */

describe("Job", () => {
	//Before each test we empty the database
	before((done) => { 
		JobModel.deleteMany({}, (err) => { 
			done();           
		});        
	});

	// Prepare data for testing
	const userTestData = {
		"password":"Test@123",
		"email":"test1234@test.com"
	};

	// Prepare data for testing
	const testData = {
		"title":"testing job",
		"description":"testing job desc",
		"company":"test"
	};

	/*
  * Test the /POST route
  */
	describe("/POST Login", () => {
		it("it should do user Login for job", (done) => {
			chai.request(server)
				.post("/api/auth/login")
				.send({"email": userTestData.email,"password": userTestData.password})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Login Success.");
					userTestData.token = res.body.data.token;
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Job Store", () => {
		it("It should send validation error for store job", (done) => {
			chai.request(server)
				.post("/api/job")
				.send()
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Job Store", () => {
		it("It should store job", (done) => {
			chai.request(server)
				.post("/api/job")
				.send(testData)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Job add Success.");
					done();
				});
		});
	});

	/*
  * Test the /GET route
  */
	describe("/GET All job", () => {
		it("it should GET all the jobs", (done) => {
			chai.request(server)
				.get("/api/job")
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					testData._id = res.body.data[0]._id;
					done();
				});
		});
	});

	/*
  * Test the /GET/:id route
  */
	describe("/GET/:id job", () => {
		it("it should GET the jobs", (done) => {
			chai.request(server)
				.get("/api/job/"+testData._id)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					done();
				});
		});
	});

	/*
  * Test the /PUT/:id route
  */
	describe("/PUT/:id job", () => {
		it("it should PUT the jobs", (done) => {
			chai.request(server)
				.put("/api/job/"+testData._id)
				.send(testData)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Job update Success.");
					done();
				});
		});
	});

	/*
  * Test the /DELETE/:id route
  */
	describe("/DELETE/:id job", () => {
		it("it should DELETE the jobs", (done) => {
			chai.request(server)
				.delete("/api/job/"+testData._id)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Job delete Success.");
					done();
				});
		});
	});
});