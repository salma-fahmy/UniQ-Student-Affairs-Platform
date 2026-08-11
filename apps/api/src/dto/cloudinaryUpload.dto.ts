export default interface CloudinaryUploadResult {
	asset_id: string;
	public_id: string;
	version: number;
	version_id: string;
	signature: string;
	width: number;
	height: number;
	format: string;
	resource_type: string; // "image" | "raw"
	created_at: string; // ISO timestamp
	tags: string[];
	pages?: number; // only for multi-page files like PDFs
	bytes: number;
	type: string; // usually "upload"
	etag: string;
	placeholder: boolean;
	url: string;
	secure_url: string;
	asset_folder?: string;
	display_name?: string;
	original_filename?: string;
	api_key?: string;
}
