/**
 * Title: index.js
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: Index.js file
 * Sources:
 * Source code from class GitHub Repository
 * W3Schools.com
 * Stackabuse.com
 * Instructor provided assignment specific instructions
 */

// Require statements
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const createError = require("http-errors");
const EmployeeRoute = require("./routes/employee-route");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Assigning instance of Express to app variable
const app = express();

// Adding middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

// Setting value of port to PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const CONN =
	"mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.5vradwb.mongodb.net/nodebucket?retryWrites=true&w=majority";

// Connecting to mongoDB using mongoose
mongoose
	.connect(CONN)
	.then(() => {
		console.log("Connection to the database was successful");
	})
	.catch((err) => {
		console.log("MongoDB Error: " + err.message);
	});

// Swagger API documentation options
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "NodeBucket API's",
			version: "1.0.0",
		},
	},
	apis: ["./server/routes/*.js"],
};

// Defining options for Swagger UI
const openapiSpecification = swaggerJsdoc(options);

// Defining routes for serving Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use("/api/employees", EmployeeRoute);

// Error handling middleware
app.use(function (req, res, next) {
	next(createError404);
});
app.use(function (err, req, res, next) {
	res.status(err.status || 500);

	res.send({
		type: "error",
		status: err.status,
		message: err.message,
		stack: req.app.get("env") === "development" ? err.stack : undefined,
	});
});

// Wiring-up Express server
app.listen(PORT, () => {
	console.log("Application started and listening on PORT: " + PORT);
});
