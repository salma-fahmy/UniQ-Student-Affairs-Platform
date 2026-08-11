import { redisClient } from "@repo/config";
export const getOrSetCache = async <T>(
	key: string,
	cb: () => Promise<T>,
	ttl = 300, // seconds
): Promise<T> => {
	const cached = await redisClient.get(key);
	if (cached) {
		console.log("from cached");
		return JSON.parse(cached);
	}

	const result = await cb();

	await redisClient.set(key, JSON.stringify(result), "EX", ttl);

	return result;
};
