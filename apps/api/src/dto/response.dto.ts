export default interface IResponseOutput {
	code: string;
	message: string;
	statusCode: number;
	data: object | Array<object> | [] | null;
	meta?: object | Array<object> | [] | null;
}
