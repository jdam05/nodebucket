const express = require("express");
const Employee = require("../models/employee");
//const createError

const router = express.Router();
const myFile = "employee-route.js";

/**
 * findEmployeeById
 * @openapi
 * /api/employee/{empId}:
 *   get:
 *     description: API that shows employees using an employeeId
 *     summary: Returns employee info from employeeId
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: Number
 *     responses:
 *       "200":
 *         description: Employee document
 *       "401":
 *         description: Invalid Employee ID
 *       "500":
 *         description: Server Exception
 *       "501":
 *         description: MongoDB Exception
 */

router.get("/:id", (req, res, next) => {
	let empId = req.params.id;
	empId = parseInt(empId, 10);

	if (isNaN(empId)) {
		const err = new Error("Bad Request");
		err.status = 400;
		console.error("empId can not be found: ", err.message);
		next(err);
	} else {
		Employee.findOne({ empId: req.params.id }, function (err, emp) {
			if (err) {
				console.error("MongoDB error:", err);
				next(err);
			} else {
				console.log("emp:", emp);
				res.send(emp);
			}
		});
	}
});

/**
 * findAllTasks
 * 400 - Bad Request: route.params.id is not a number
 * 404 - Not Found: MongoDB returns a null record; employee not found
 * 200 - success
 * 500 - server error for all other use cases
 */

router.get("/:empId/tasks", async (req, res, next) => {
	let empId = req.params.empId;
	empId = parseInt(empId, 10);
	if (isNaN(empId)) {
		const err = Error("Bad Request");
		err.status = 400;
		const errorString = `req.params must be a number: ${empId}`;
		console.log(errorString);
		errorLogger({ filename: myFile, message: errorString });
		next(err);
	} else {
		try {
			const emp = await Employee.findOne({ empId: empId }, "empId todo done");
			if (emp) {
				console.log(emp);
				debugLogger({ filename: myFile, message: emp });
			}
		} catch (err) {
			errLogger({ filename: myFile, message: err });
			next(err);
		}
	}
});

module.exports = router;
