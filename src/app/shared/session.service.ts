import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class SessionService {
	constructor(private http: HttpClient) {}

	findEmployeeById(empId: number): Observable<any> {
		return this.http.get("api/employees/" + empId);
	}
}
