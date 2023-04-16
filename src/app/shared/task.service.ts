/**
 * Title: task.service.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: task service for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import statements
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Item } from "./models/item.interface";

@Injectable({
	providedIn: "root",
})

// TaskService class
export class TaskService {
	constructor(private http: HttpClient) {}

	// Getting employee tasks by task ID
	findAllTasks(empId: number): Observable<any> {
		return this.http.get(`/api/employees/${empId}/tasks`);
	}

	// Creating tasks
	createTask(empId: number, task: string): Observable<any> {
		return this.http.post(`api/employees/${empId}/tasks`, {
			text: task,
		});
	}

	// Updating employee tasks
	updateTask(empId: number, todo: Item[], done: Item[]): Observable<any> {
		return this.http.put(`/api/employees/${empId}/tasks`, {
			todo,
			done,
		});
	}

	// Deleting employee task
	deleteTask(empId: number, taskId: string): Observable<any> {
		return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`);
	}
}
