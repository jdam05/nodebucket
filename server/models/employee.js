/**
 * Title: employee.js
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: This file contains the employee Schema
 * Sources:
 * Source code from class GitHub Repository
 * W3Schools.com
 * Stackabuse.com
 * Instructor provided assignment specific instructions
 */

// Require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = require("./item");

// Defining employee Schema
let employeeSchema = new Schema(
	{
		empId: { type: Number, unique: true, required: true },
		firstName: { type: String },
		lastName: { type: String },
		todo: [itemSchema],
		done: [itemSchema],
	},
	{ collection: "employees" }
);

// Exporting employeeSchema
module.exports = mongoose.model("Employee", employeeSchema);
