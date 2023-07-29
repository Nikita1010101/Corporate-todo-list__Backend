export interface IUserDto {
	name: string
	last_name: string
	sure_name: string
}

export interface IUser extends IUserDto {
	id: number
	email: string
	password: string
}
