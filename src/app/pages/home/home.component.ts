/**
 * Title: home.component.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: home component for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import Statements
import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";
import { Employee } from "src/app/shared/models/employee.interface";
import { Item } from "src/app/shared/models/item.interface";
import { TaskService } from "src/app/shared/task.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from "@angular/cdk/drag-drop";

// Defining component metadata
@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})

// Component class definition
export class HomeComponent implements OnInit {
	// Class properties
	serverMessages: Message[] = [];
	employee: Employee;
	todo: Item[];
	done: Item[];
	empId: number;
	newTaskId: string;
	newTaskMessage: string;

	// Creating taskForm FormGroup with validation
	taskForm: FormGroup = this.fb.group({
		task: [
			null,
			Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(35),
			]),
		],
	});

	constructor(
		private taskService: TaskService,
		private cookieService: CookieService,
		private fb: FormBuilder,
		private dialog: MatDialog
	) {
		// Setting empId value to session_user value obtained from cookieService
		this.empId = parseInt(this.cookieService.get("session_user"), 10);
		this.employee = {} as Employee;
		this.todo = [];
		//this.doing = [];
		this.done = [];
		this.newTaskId = "";
		this.newTaskMessage = "";

		// Retrieving all the tasks by employee id
		this.taskService.findAllTasks(this.empId).subscribe({
			next: (res) => {
				this.employee = res;
				console.log("--Employee Data--");
				console.log(this.employee);
			},
			error: (err) => {
				console.error(err.message);
				this.serverMessages = [
					{
						severity: "error",
						summary: "Error",
						detail: err.message,
					},
				];
			},
			complete: () => {
				this.todo = this.employee.todo;
				this.done = this.employee.done;

				console.log("--ToDo and Done Data--");
				console.log(this.todo);
				console.log(this.done);
			},
		});
	}

	ngOnInit(): void {}

	createTask() {
		const newTask = this.taskForm.controls["task"].value;

		// Creating a new task using taskService
		this.taskService.createTask(this.empId, newTask).subscribe({
			next: (res) => {
				this.newTaskId = res.data.id;
				this.newTaskMessage = res.message;
				console.log("--New Task ID--");
				console.log(this.newTaskId);
			},
			error: (err) => {
				console.error(err.message);
				this.serverMessages = [
					{
						severity: "error",
						summary: "Error",
						detail: err.message,
					},
				];
			},
			complete: () => {
				let task = {
					_id: this.newTaskId,
					text: newTask,
				} as Item;
				this.todo.push(task);
				this.newTaskId = "";
				this.taskForm.controls["task"].setErrors({ incorrect: false });

				this.serverMessages = [
					{
						severity: "success",
						summary: "Success",
						detail: this.newTaskMessage,
					},
				];
			},
		});
	}

	// Delete task
	deleteTask(taskId: string) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: {
				header: "Delete Task Dialog",
				body: "Are you sure you want to delete this task?",
			},
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe({
			next: (result) => {
				if (result === "confirm") {
					// Deleting task using taskService
					this.taskService.deleteTask(this.empId, taskId).subscribe({
						next: (res) => {
							this.todo = this.todo.filter((task) => task._id !== taskId);
							//this.doing = this.doing.filter((task) => task._id !== taskId);
							this.done = this.done.filter((task) => task._id !== taskId);

							this.serverMessages = [
								{
									severity: "success",
									summary: "Success:",
									detail: "Task Deleted Successfully",
								},
							];

							console.log(res);
						},

						error: (err) => {
							console.error(err.message);

							this.serverMessages = [
								{
									severity: "error",
									summary: "Error:",
									detail: err.message,
								},
							];
						},
					});
				} else {
					this.serverMessages = [
						{
							severity: "info",
							summary: "Info:",
							detail: "Deletion cancelled",
						},
					];
				}
			},
		});
	}

	// Update task
	updateTaskList(empId: number, todo: Item[], done: Item[]) {
		// updating task using taskService
		this.taskService.updateTask(empId, todo, done).subscribe({
			next: (res) => {
				console.log(res);

				this.todo = todo;

				this.done = done;
			},

			error: (err) => {
				console.error(err.message);

				this.serverMessages = [
					{
						severity: "error",
						summary: "Error:",
						detail: err.message,
					},
				];
			},
		});
	}
	// Drag and drop function
	drop(event: CdkDragDrop<any[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);

			console.log("Tasks Reordered");
			this.updateTaskList(this.empId, this.todo, this.done);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);

			console.log("Task moved to new list");
			this.updateTaskList(this.empId, this.todo, this.done);
		}
	}
}
