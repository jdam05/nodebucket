/**
 * Title: logger.js
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: File for logging server errors
 * Sources:
 * Source code from class GitHub Repository
 * W3Schools.com
 * Stackabuse.com
 * Instructor provided assignment specific instructions
 */

// Require statements
const { appendFileSync } = require("fs");
const { join } = require("path");

// Setting log location
const debugLog = join(__dirname, "debug.log");
const errorLog = join(__dirname, "error.log");

// Getting date and time
const getDateTime = () => {
	const now = new Date();
	return now.toLocaleString("en-US");
};

// Logging debug information
module.exports.debugLogger = (data) => {
	const logString = `[${getDateTime()}] server\t ${data.filename} - ${
		data.message
	}\n`;
	appendFileSync(debugLog, logString);
};

// Logging error information
module.exports.errorLogger = (data) => {
	const logString = `[${getDateTime()}] server\t ${data.filename} - ${
		data.message
	}\n`;
	appendFileSync(errorLog, logString);
};
