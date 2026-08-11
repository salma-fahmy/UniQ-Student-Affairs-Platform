export function isStudent(role:string){
    return role === "student" 
}


export function refreshTokenExpiration(isStudent:boolean){
    const HOURS = 60 * 60 * 1000;
	const DAYS = 24 * HOURS;
	const expiresAt = new Date(
	Date.now() + ( isStudent? 6 * HOURS : 7 * DAYS)
	);

    return expiresAt;
}