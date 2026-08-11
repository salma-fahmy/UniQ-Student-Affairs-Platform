export interface INotification {
	userId: string;
	title: string;
	message: string;
	notificationType:
		| "request_update"
		| "payment"
		| "complaint"
		| "course_update"
		| "system"
		| "announcement";
	actionUrl?: string;
}