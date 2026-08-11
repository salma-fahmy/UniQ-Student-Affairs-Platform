// jest.config.ts
export default {
	preset: "ts-jest", // Use ts-jest to compile TypeScript files
	testEnvironment: "node", // Run tests in Node.js environment
	roots: ["./src/tests"], // Where Jest should look for test files
	transform: {
		"^.+\\.ts?$": "ts-jest", // Transform all .ts files using ts-jest
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$", // Regex to match test files
	moduleFileExtensions: ["ts", "js", "json", "node"], // File types that can be imported in tests
};
