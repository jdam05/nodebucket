import { Item } from "./item.interface";

export interface Employee {
	empId: number;
	firstName: string;
	lastName: string;
	todo: Item[];
	done: Item[];
}
