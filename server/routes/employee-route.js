const express = require("express");
const Employee = require("../models/employee");
const createError = require("http-errors");
const Ajv = require("ajv");
const { debugLogger, errorLogger } = require("../logs/logger");

//const createError

const router = express.Router();
const myFile = "employee-route.js";

const ajv = new Ajv();

const checkNum = (id) => {
	id = parseInt(id, 10);

	if (isNaN(id)) {
		const err = new Error("Bad Request");

		err.status = 400;
		return err;
	} else {
		return false;
	}
};

const taskSchema = {
	type: "object",
	properties: {
		text: { type: "string" },
	},
	required: ["text"],
	additionalProperties: false,
};

const tasksSchema = {
	type: "object",
	required: ["todo", "done"],
	additionalProperties: false,
	properties: {
		todo: {
			type: "array",
			additionalProperties: false,
			items: taskSchema,
		},
		done: {
			type: "array",
			additionalProperties: false,
			items: taskSchema,
		},
	},
};

function getTask(id, tasks) {
	const task = tasks.find((item) => item._id.toString() === id);
	return task;
}

/**
 * findEmployeeById
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API that returns employees by employeeId
 *     summary: returns employee by employeeId
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Employees ID
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '401':
 *         description: Invalid employeeId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
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

/**
 * createTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     description: Creates a new task by empId
 *     summary: createTask
 *     parameters:
 *        - name: empId
 *          in: path
 *          required: true
 *          description: Create task by empId
 *          schema:
 *            type: number
 *     requestBody:
 *       description: Creates a new task by empId
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New task added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// createTask
router.post("/:empId/tasks", async (req, res, next) => {
	let empId = req.params.empId;
	const err = checkNum(empId);

	if (err === false) {
		// try catch block
		try {
			// attempts to retrieve the empId from mongoDB
			let emp = await Employee.findOne({ empId: empId });

			// returns query
			if (emp) {
				const newTask = req.body;
				const validator = ajv.compile(taskSchema);
				const valid = validator(newTask);

				// 400 error handling
				if (!valid) {
					const err = Error("Bad Request");
					err.status = 400;
					console.error(
						"Bad Request. Unable to validate req.body against the defined schema"
					);
					errorLogger({ filename: myFile, message: errorString });
					next(err);

					// creates new task in mongoDB
				} else {
					emp.todo.push(newTask);
					const result = await emp.save();
					console.log(result);
					debugLogger({ filename: myFile, message: result });
					// Response to Client
					const task = result.todo.pop();
					const newTaskResponse = new BaseResponse(
						201,
						"Task item added successfully",
						{ id: task._id }
					);
					res.status(201).send(newTaskResponse);
				}

				// null record
			} else {
				console.error(createError(404));
				errorLogger({ filename: myFile, message: createError(404) });
				next(createError(404));
			}

			// server error handling
		} catch (err) {
			next(err);
		}

		// invalid empId error
	} else {
		console.error("req.params.empId must be a number", empId);
		errorLogger({
			filename: myFile,
			message: `req.params.empId must be a number ${empId}`,
		});
	}
});

module.exports = router;
