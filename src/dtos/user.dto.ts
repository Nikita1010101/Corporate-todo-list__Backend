import { IUser } from '../types/user.type'

export class UserDto {
	public id: number
	public name: string
	public last_name: string
	public sure_name: string
	
	constructor(user: IUser) {
		this.id = user.id
		this.name = user.name
		this.last_name = user.last_name
		this.sure_name = user.sure_name
	}
}
