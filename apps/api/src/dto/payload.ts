export default interface PayloadType {
	userId: string;
	studentId?:number ;
	role: string;
	email?: string;
	permissions?: string[];
}
