import { Employee } from "./employeeOrgApp.interface";
export interface StackState {
    oldEmployee: Employee,
    newSupervisor : Employee,
    oldSupervisor: Employee,
    oldSubordinates: Employee[]
}