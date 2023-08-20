import { Model } from 'sequelize'

import { ITask } from '../../types/task.type'
import { UserDto } from '../../dtos/user.dto'
import { ICreator, IResponsible, ISupervisor } from '../../types/user.type'

export const formatResponsibleFromTasks = (tasks: Model<ITask>[]) => {
	return tasks.map(task => {
		const { user, ...data } = task.dataValues
		const userDto = new UserDto(user)

		return { ...data, responsible: userDto }
	})
}

export const getCreatedTasksId = (
	responsibledTasks: Model<IResponsible>[],
	createdTasks: Model<ICreator>[]
) => {
	const responsibledId = responsibledTasks.map(user => user.dataValues.taskId)
	const createdId = createdTasks.map(user => user.dataValues.taskId)

	return [...responsibledId, ...createdId]
}

export const checkIsSubordinate = (
	subordinates: Model<ISupervisor>[],
	id: number[]
) => {
	return subordinates.some(
		user => id.includes(user.dataValues.subordinate_id)
	)
}

export const checkIsCreator = (creator: Model<ICreator>, user_id: number) => {
	return creator.dataValues.user_id === user_id
}
