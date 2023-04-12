const express = require("express");
const Employee = require("../models/employee");
const createError = require("http-errors");
const Ajv = require("ajv");
const { debugLogger, errorLogger } = require("../logs/logger");
const BaseResponse = require("../models/base-response");

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
router.get("/:empId/tasks", async (req, res, next) => {
	let empId = req.params.empId;
	const err = checkNum(empId);

	if (err === false) {
		try {
			const emp = await Employee.findOne(
				{ empId: empId },
				"empId todo doing done"
			);

			if (emp) {
				console.log("This is the employee data: ", emp);

				debugLogger({ filename: myFile, message: emp });

				res.send(emp);
			} else {
				console.error(createError(404));

				errorLogger({ filename: myFile, message: createError(404) });

				next(createError(404));
			}
		} catch (err) {
			errorLogger({ filename: myFile, message: err });

			next(err);
		}
	} else {
		const errorString = `empId is not a number: ${empId}`;

		console.error(errorString);

		errorLogger({
			filename: myFile,
			message: errorString,
		});

		next(err);
	}
});

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
	let empId = req.params.empId;
	
	const err = checkNum(empId);

	if (err === false) {
		try {
			let emp = await Employee.findOne({ empId: empId });

			// returns query
			if (emp) {
				const newTask = req.body;
				const validator = ajv.compile(taskSchema);
				const valid = validator(newTask);

				if (!valid) {
					const err = Error("Bad Request");
					err.status = 400;
					console.error(
						"Bad Request. Unable to validate req.body against the defined schema"
					);
					errorLogger({ filename: myFile, message: errorString });
					next(err);
				} else {
					emp.todo.push(newTask);
					const result = await emp.save();
					console.log(result);
					debugLogger({ filename: myFile, message: result });

					const task = result.todo.pop();
					const newTaskResponse = new BaseResponse(
						201,
						"Task successfully added",
						{ id: task._id }
					);
					res.status(201).send(newTaskResponse);
				}
			} else {
				console.error(createError(404));
				errorLogger({ filename: myFile, message: createError(404) });
				next(createError(404));
			}
		} catch (err) {
			next(err);
		}
	} else {
		console.error("req.params.empId must be a number", empId);
		errorLogger({
			filename: myFile,
			message: `req.params.empId must be a number ${empId}`,
		});
	}
});

/**
 * updateTasks
 * @openapi
 * /api/employees/{id}/tasks:
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
	let empId = req.params.empId;
	console.log("hello");
	empId = parseInt(empId, 10);

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
		let emp = await Employee.findOne({ empId: empId });

		if (!emp) {
			console.error(createError(404));
			errorLogger({ filename: myFile, message: createError(404) });
			next(createError(404));
			return;
		}

		const tasks = req.body;
		const validator = ajv.compile(tasksSchema);
		const valid = validator(tasks);

		if (!valid) {
			const err = Error("Bad Request");

			err.status = 400;

			console.error(
				"Bad Request. Unable to validate req.body schema against tasksSchema"
			);

			errorLogger({
				filename: myFile,
				message:
					"Bad Request. Unable to validate req.body schema against tasksSchema",
			});

			next(err);
			return;
		}

		emp.set({
			todo: req.body.todo,
			//doing: req.body.doing,
			done: req.body.done,
		});

		const result = await emp.save();

		console.log(result);

		debugLogger({ filename: myFile, message: result });

		res.status(204).send();
	} catch (err) {
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
	let taskId = req.params.taskId;
	let empId = req.params.id;

	empId = parseInt(empId, 10);
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
		let emp = await Employee.findOne({ empId: empId });

		if (!emp) {
			console.error(createError(404));
			errorLogger({ filename: myFile, message: createError(404) });
			next(createError(404));
			return;
		}
		const todoTask = getTask(taskId, emp.todo);
		const doneTask = getTask(taskId, emp.done);

		if (todoTask !== undefined) {
			emp.todo.id(todoTask._id).remove();
		}
		if (doneTask !== undefined) {
			emp.done.id(doneTask._id).remove();
		}

		if (todoTask === undefined && doneTask === undefined) {
			const err = Error("Not Found");
			err.status = 404;
			console.error("TaskId not Found", taskId);
			errorLogger({ filename: myFile, message: `TaskId not found ${taskId}` });
			next(err);
			return;
		}

		const result = await emp.save();
		debugLogger({ filename: myFile, message: result });
		res.status(204).send({
			message: "Delete successful",
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
