export const AuthError = {
	USER_EXIST: (email: string) => `User with the Email ${email} yet exist!`,
	EMAIL_NOT_FOUND: (email: string) => `User with the Email ${email} not found!`,
	DONT_CORRECT_PASSWORD: (password: string) =>
		`Dont correct password! ${password}`
}
