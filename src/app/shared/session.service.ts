/**
 * Title: session.service.ts
 * Author: Jamal Eddine Damir
 * Date: April 14, 2023
 * Description: session service for nodebucket
 * Sources:
 * Source code from class GitHub Repository
 * Instructor provided assignment specific instructions
 */

// Import statements
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class SessionService {
	constructor(private http: HttpClient) {}

	// Returning Observable that retrieves employee data from employees collection
	findEmployeeById(empId: number): Observable<any> {
		return this.http.get("api/employees/" + empId);
	}
}
