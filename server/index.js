const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const createError = require("http-errors");
const EmployeeRoute = require("./routes/employee-route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

// default server port value.
const PORT = process.env.PORT || 3000;

const CONN =
	"mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.5vradwb.mongodb.net/nodebucket?retryWrites=true&w=majority";

mongoose
	.connect(CONN)
	.then(() => {
		console.log("Connection to the database was successful");
	})
	.catch((err) => {
		console.log("MongoDB Error: " + err.message);
	});

app.use("/api/employees", EmployeeRoute);

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

app.listen(PORT, () => {
	console.log("Application started and listening on PORT: " + PORT);
});
