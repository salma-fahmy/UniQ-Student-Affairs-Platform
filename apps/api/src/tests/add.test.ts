import { add } from "../utils/utils";

describe("add test", () => {
	it("Adding 1 + 2  equals  3 ", () => {
		expect(add(1, 2)).toBe(3);
	});
});
