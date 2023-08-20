import { IUser } from './user.type'

export interface IRegistration extends IUser {
  supervisor_id?: number
}

export interface ILogin {
	email: string
	password: string
}
