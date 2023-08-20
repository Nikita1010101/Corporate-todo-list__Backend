import { IDefaultValues } from './default.type'
import { IUser } from './user.type'

export interface ITask extends IDefaultValues {
	title: string
	description: string
	deadline: string
	update_date: string
	priority: number
	status: boolean
	userId: number
	user: IUser
}

export interface ICreateTask extends ITask {
	creator_id: number
	responsible_id: number
}
