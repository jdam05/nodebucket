/**
 * Title: base-response.js
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: This file contains the base response model
 * Sources:
 * Source code from class GitHub Repository
 * W3Schools.com
 * Stackabuse.com
 * Instructor provided assignment specific instructions
 */

// model for creating base response objects
class BaseResponse {
	constructor(httpCode, message, data) {
		this.httpCode = httpCode;
		this.message = message;
		this.data = data;
	}

	// Converting instance of BaseResponse into object
	toObject() {
		return {
			httpCode: this.httpCode,
			message: this.message,
			data: this.data,
			timeStamp: new Date().toLocaleString("en-US"),
		};
	}
}

// Exporting BaseResponse
module.exports = BaseResponse;
