/**
 * Title: base-layout.component.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: base-layout component for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import Statements
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Component, OnInit } from "@angular/core";
import {
	ConfirmationService,
	ConfirmEventType,
	MessageService,
} from "primeng/api";

// Defining component metadata
@Component({
	selector: "app-base-layout",
	templateUrl: "./base-layout.component.html",
	styleUrls: ["./base-layout.component.css"],
	providers: [ConfirmationService, MessageService],
})

// Component class definition
export class BaseLayoutComponent implements OnInit {
	sessionName: string;
	year: number;

	constructor(
		private cookieService: CookieService,
		private router: Router,
		private messageService: MessageService,
		private confirmationService: ConfirmationService
	) {
		this.sessionName = this.cookieService.get("session_name");
		this.year = Date.now();
	}

	ngOnInit(): void {}

	logout() {
		// Confirmation dialog
		this.confirmationService.confirm({
			message: "Are you sure that you want to proceed?",
			header: "Log out Confirmation",
			icon: "pi pi-exclamation-triangle",
			// Delete all cookies and redirect user to the login page when the user clicks accept
			accept: () => {
				this.cookieService.deleteAll();
				this.router.navigate(["/session/login"]);
			},
			// If the user clicks cancel, display cancelation message
			reject: (type: any) => {
				switch (type) {
					case ConfirmEventType.REJECT:
						this.messageService.add({
							severity: "info",
							summary: "Cancelled",
							detail: "Logout cancelled",
						});
						break;
					// Display cancelation message if the user closes the dialog box
					case ConfirmEventType.CANCEL:
						this.messageService.add({
							severity: "info",
							summary: "Cancelled",
							detail: "Logout cancelled",
						});
						break;
				}
			},
		});
	}
}
