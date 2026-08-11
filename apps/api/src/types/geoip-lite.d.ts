declare module "geoip-lite" {
	type Lookup = {
		range: [number, number];
		country: string;
		region?: string;
		city?: string;
		ll: [number, number];
		metro?: number;
		zip?: string;
	};

	function lookup(ip: string): Lookup | null;

	export = { lookup };
}
