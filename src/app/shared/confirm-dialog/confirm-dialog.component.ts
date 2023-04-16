/**
 * Title: confirm-dialog.component.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: confirm-dialog component for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import Statements
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../models/dialog.data.interface";

// Defining component metadata
@Component({
	selector: "app-confirm-dialog",
	templateUrl: "./confirm-dialog.component.html",
	styleUrls: ["./confirm-dialog.component.css"],
})

// Component class definition
export class ConfirmDialogComponent implements OnInit {
	dialogData: DialogData;

	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
		this.dialogData = data;
	}

	ngOnInit(): void {}
}
