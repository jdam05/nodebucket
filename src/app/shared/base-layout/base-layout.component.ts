import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Component, OnInit } from "@angular/core";
import {
	ConfirmationService,
	ConfirmEventType,
	MessageService,
} from "primeng/api";

@Component({
	selector: "app-base-layout",
	templateUrl: "./base-layout.component.html",
	styleUrls: ["./base-layout.component.css"],
	providers: [ConfirmationService, MessageService],
})
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
		this.confirmationService.confirm({
			message: "Are you sure that you want to proceed?",
			header: "Log out Confirmation",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				this.cookieService.deleteAll();
				this.router.navigate(["/session/login"]);
			},
			reject: (type: any) => {
				switch (type) {
					case ConfirmEventType.REJECT:
						this.messageService.add({
							severity: "info",
							summary: "Cancelled",
							detail: "Logout cancelled",
						});
						break;
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
