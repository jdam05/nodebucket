/**
 * Title: employee-route.js
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: This file contains the employee route
 * Sources:
 * Source code from class GitHub Repository
 * W3Schools.com
 * Stackabuse.com
 * Instructor provided assignment specific instructions
 */

// Require statements
const express = require("express");
const Employee = require("../models/employee");
const createError = require("http-errors");
const Ajv = require("ajv");
const { debugLogger, errorLogger } = require("../logs/logger");
const BaseResponse = require("../models/base-response");

// Creating router object
const router = express.Router();

// Assigning file path to myFile constant
const myFile = "employee-route.js";

// Creating new Ajv object
const ajv = new Ajv();

// Checking if id is a number
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

// Task validating schema
const taskSchema = {
	type: "object",
	properties: {
		text: { type: "string" },
		_id: { type: "string" },
	},
	required: ["text"],
	additionalProperties: false,
};

// Tasks validating schema
const tasksSchema = {
	type: "object",
	required: ["todo", "done"],
	additionalProperties: false,
	properties: {
		todo: {
			type: "array",
			additionalProperties: false,
			items: {
				type: "object",
				properties: {
					text: { type: "string" },
					_id: { type: "string" },
				},
				required: ["text", "_id"],
				additionalProperties: false,
			},
		},
		done: {
			type: "array",
			additionalProperties: false,
			items: {
				type: "object",
				properties: {
					text: { type: "string" },
					_id: { type: "string" },
				},
				required: ["text", "_id"],
				additionalProperties: false,
			},
		},
	},
};

// Function that returns a task object from the tasks array
function getTask(id, tasks) {
	const task = tasks.find((item) => item._id.toString() === id);
	return task;
}

// findEmployeeById API

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

// Getting employee by id
router.get("/:id", (req, res, next) => {
	let empId = req.params.id;

	// Parsing empId as integer
	empId = parseInt(empId, 10);

	// Checking if empId is not a number and logging the proper error
	if (isNaN(empId)) {
		const err = new Error("Bad Request");
		err.status = 400;
		console.error("empId can not be found: ", err.message);
		next(err);
	} else {
		// Finding document that matches the id parameter
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

// findAllTasks API

/**
 * findAllTasks
 * @openapi
 * /api/employees/{id}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for viewing tasks by employee
 *     summary: view all tasks by employee ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request route.params.id is not a number
 *       '404':
 *         description: Not Found MondoDB returns null record; employee not found
 *       '500':
 *         description: server error for all other use cases
 */

// Getting tasks by employee id
router.get("/:empId/tasks", async (req, res, next) => {
	// Assigning employee id from the request parameter to empId variable
	let empId = req.params.empId;

	// Checking if empId is a number
	const err = checkNum(empId);

	// If empId is a number
	if (err === false) {
		try {
			// Finding employee by empId
			const emp = await Employee.findOne(
				{ empId: empId },
				"empId todo doing done"
			);

			// If the employee is found
			if (emp) {
				// Log the employee data to the console
				console.log("This is the employee data: ", emp);

				// Adding information to debug logger
				debugLogger({ filename: myFile, message: emp });

				// Sending emp object as a response to the HTTP request
				res.send(emp);
				// If the employee can't be found in the collection
			} else {
				// Logging error 404 to the console
				console.error(createError(404));
				// // Adding information to error logger
				errorLogger({ filename: myFile, message: createError(404) });
				// Passing the 404 error object to the next middleware function
				next(createError(404));
			}
		} catch (err) {
			// Logging any errors to the error log
			errorLogger({ filename: myFile, message: err });
			// Passing errors to the next middleware function
			next(err);
		}
	} else {
		// Creating error string indicating that empId is not a number
		const errorString = `empId is not a number: ${empId}`;
		// Logging error to the console
		console.error(errorString);

		// Logging error message to error logger
		errorLogger({
			filename: myFile,
			message: errorString,
		});

		// Passing the error object as an argument to the next function
		next(err);
	}
});

// createTask API

/**
 * createTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     description: API that creates a new task by empId
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

router.post("/:empId/tasks", async (req, res, next) => {
	// Assigning employee id from the request parameter to empId variable
	let empId = req.params.empId;
	// Checking if empId is a number
	const err = checkNum(empId);

	// If empId is a number
	if (err === false) {
		try {
			// Finding employee by empId
			let emp = await Employee.findOne({ empId: empId });

			// If the employee is found
			if (emp) {
				// Assigning request body data to newTask variable
				const newTask = req.body;
				// Validating newTask against taskSchema
				const validator = ajv.compile(taskSchema);
				const valid = validator(newTask);

				// If the new task can't be validated against taskSChema
				if (!valid) {
					// Create and log error
					const err = Error("Bad Request");
					err.status = 400;
					console.error(
						"Bad Request. Unable to validate req.body against the defined schema"
					);
					// Update error log
					errorLogger({ filename: myFile, message: errorString });
					next(err);
				} else {
					// Add new task to the todo array
					emp.todo.push(newTask);
					// Saving emp object changes to the database and assigning the result to result variable
					const result = await emp.save();
					// Logging result to the console
					console.log(result);
					// Updating debug log
					debugLogger({ filename: myFile, message: result });

					// Assigning the last task in the todo array to task variable
					const task = result.todo.pop();

					// Creating response object with a success message
					const newTaskResponse = new BaseResponse(
						201,
						"Task successfully added",
						{ id: task._id }
					);
					// Sending the response with the status code to the client
					res.status(201).send(newTaskResponse);
				}
			} else {
				// Logging the 404 error to the console
				console.error(createError(404));
				// Updating error log
				errorLogger({ filename: myFile, message: createError(404) });
				// Generating a not-found error and passing it to the next middleware
				next(createError(404));
			}
		} catch (err) {
			// Passing the error object as an argument to the next function
			next(err);
		}
	} else {
		// Logging error to the console
		console.error("req.params.empId must be a number", empId);
		// Updating error logger
		errorLogger({
			filename: myFile,
			message: `req.params.empId must be a number ${empId}`,
		});
	}
});

// updateTasks API

/**
 * updateTasks
 * @openapi
 * /api/employees/{empId}/tasks:
 *   put:
 *     tags:
 *       - Employees
 *     description: API that updates the employee tasks
 *     summary: updates the employee tasks array
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: number
 *     requestBody:
 *       description: employee Tasks array
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todo
 *               - done
 *             properties:
 *               todo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *               done:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *     responses:
 *       '204':
 *         description: Tasks updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 */

router.put("/:empId/tasks", async (req, res, next) => {
	// Assigning employee id from the request parameter to empId variable
	let empId = req.params.empId;
	// Log emId to the console
	console.log(empId);
	// Parsing empId as integer
	empId = parseInt(empId, 10);

	// Checking if empId is not a number and logging the proper error
	if (isNaN(empId)) {
		const err = Error("Input must be a number");
		err.status = 400;
		console.error("Input must be a number", empId);
		errorLogger({
			filename: myFile,
			message: `Input must be a number: ${empId}`,
		});
		next(err);
		return;
	}

	try {
		// Finding employee by empId
		let emp = await Employee.findOne({ empId: empId });

		// If employee is not found create and log 404 error
		if (!emp) {
			console.error(createError(404));
			errorLogger({ filename: myFile, message: createError(404) });
			next(createError(404));
			return;
		}

		// Assigning request body to tasks variable
		const tasks = req.body;
		// Validating tasks against tasksSchema
		const validator = ajv.compile(tasksSchema);
		const valid = validator(tasks);

		// If tasks can't be validated against tasksSchema
		if (!valid) {
			// Create and log error
			const err = Error("Bad Request");
			err.status = 400;
			console.error(
				"Bad Request. Unable to validate req.body schema against tasksSchema"
			);

			// Update error log
			errorLogger({
				filename: myFile,
				message:
					"Bad Request. Unable to validate req.body schema against tasksSchema",
			});
			// Passing the error object as an argument to the next function
			next(err);
			return;
		}

		// Updating todo and done tasks with the request body values
		emp.set({
			todo: req.body.todo,
			done: req.body.done,
		});

		// Saving emp object changes to the database and assigning the result to result variable
		const result = await emp.save();

		// Logging result to the console
		console.log(result);

		// Updating the debug log
		debugLogger({ filename: myFile, message: result });

		// Sending the response with the status code to the client
		res.status(204).send();
	} catch (err) {
		// Passing the error object as an argument to the next function
		next(err);
	}
});

/**
 * deleteTask
 * @openapi
 * /api/employees/{id}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     description: API for deleting a task by empId
 *     summary: Delete task by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         scheme:
 *           type: number
 *       - name: taskId
 *         in: path
 *         required: true
 *         scheme:
 *           type: string
 *     responses:
 *       '204':
 *         description: Tasks Deleted
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.delete("/:id/tasks/:taskId", async (req, res, next) => {
	// Assigning task ID id from the request parameter to empId variable
	let taskId = req.params.taskId;
	// Assigning employee id from the request parameter to empId variable
	let empId = req.params.id;
	// Parsing empId as integer
	empId = parseInt(empId, 10);

	// Checking if empId is not a number and logging the proper error
	if (isNaN(empId)) {
		const err = new Error("Input must be number");
		err.status = 400;
		console.error("req.params.empId must be a number: ", empId);
		errorLogger({
			filename: myFile,
			message: `req.params.empId must be a number ${empId}`,
		});
		next(err);
		return;
	}
	try {
		// Finding employee by empId
		let emp = await Employee.findOne({ empId: empId });

		// If employee is not found create and log 404 error
		if (!emp) {
			console.error(createError(404));
			errorLogger({ filename: myFile, message: createError(404) });
			next(createError(404));
			return;
		}

		// Assigning the task object from the todo array to the todoTask variable
		const todoTask = getTask(taskId, emp.todo);
		// Assigning the task object from the done array to the doneTask variable
		const doneTask = getTask(taskId, emp.done);

		// If the todo task is found
		if (todoTask !== undefined) {
			// Remove the todo task from the todo array
			emp.todo.id(todoTask._id).remove();
		}

		// If the done task is found
		if (doneTask !== undefined) {
			// Remove the done task from the done array
			emp.done.id(doneTask._id).remove();
		}

		// If todo or done task can't be found, create and log the 404 error
		if (todoTask === undefined && doneTask === undefined) {
			const err = Error("Not Found");
			err.status = 404;
			console.error("TaskId not Found", taskId);
			errorLogger({ filename: myFile, message: `TaskId not found ${taskId}` });
			next(err);
			return;
		}

		// Saving emp object changes to the database and assigning the result to result variable
		const result = await emp.save();

		// Update the debug log
		debugLogger({ filename: myFile, message: result });

		// Sending the response with the status code to the client
		res.status(204).send({
			message: "Delete successful",
		});
	} catch (err) {
		// Passing the error object as an argument to the next function
		next(err);
	}
});

// Exporting the router
module.exports = router;
