class BaseResponse {
	constructor(httpCode, message, data) {
		this.httpCode = httpCode;
		this.message = message;
		this.data = data;
	}

	toObject() {
		return {
			httpCode: this.httpCode,
			message: this.message,
			data: this.data,
			timeStamp: new Date().toLocaleString("en-US"),
		};
	}
}

module.exports = BaseResponse;
