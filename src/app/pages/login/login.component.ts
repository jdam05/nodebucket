/**
 * Title: login.component.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: login component for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import Statements
import { Employee } from "src/app/shared/models/employee.interface";
import { SessionService } from "./../../shared/session.service";
import { CookieService } from "ngx-cookie-service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Message } from "primeng/api";

// Defining component metadata
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})

// Component class definition
export class LoginComponent implements OnInit {
	// Class properties
	errorMessages: Message[] = [];
	employee: Employee;

	// Creating login  FormGroup with validation
	loginForm: FormGroup = this.fb.group({
		empId: [
			null,
			Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")]),
		],
	});

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private cookieService: CookieService,
		private sessionService: SessionService
	) {
		// Initializing employee property to empty object conforming to Employee interface
		this.employee = {} as Employee;
	}

	ngOnInit(): void {}

	// Login method
	login() {
		// Getting employee id from user input
		const empId = this.loginForm.controls["empId"].value;

		// Finding employee by id using sessionService
		this.sessionService.findEmployeeById(empId).subscribe({
			next: (res: any) => {
				// If employee ID exists
				if (res) {
					// Setting employee property to response data
					this.employee = res;
					// Setting cookie with employee ID
					this.cookieService.set(
						"session_user",
						this.employee.empId.toString(),
						1
					);
					// Setting cookie with employee first and last name
					this.cookieService.set(
						"session_name",
						`${this.employee.firstName} ${this.employee.lastName}`,
						1
					);
					// Navigating user to the root path
					this.router.navigate(["/"]);
				} else {
					// Displaying error if employee ID is not valid
					this.errorMessages = [
						{
							severity: "error",
							summary: "error",
							detail: "Please enter a valid employee ID to continue",
						},
					];
				}
			},
			error: (err) => {
				// Create and log any errors
				console.error(err);
				this.errorMessages = [
					{ severity: "error", summary: "error", detail: err.message },
				];
			},
		});
	}
}
