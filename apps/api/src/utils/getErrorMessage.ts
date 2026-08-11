const getErrorMessage = (error: unknown) => {
	if (error instanceof Error) {
		return error.message;
	} else if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}
	if (typeof error === "string") {
		return error;
	}

	return "AN error occurred";
};

export default getErrorMessage;
