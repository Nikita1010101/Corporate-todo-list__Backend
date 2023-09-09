import { Model } from 'sequelize'

import {
	CreatorModel,
	ResponsibleModel,
	SupervisorModel,
	TaskModel,
	UserModel
} from '../../models/index.model'
import { ICreateTask, ITask } from '../../types/task.type'
import { ApiError } from '../../exceptions/api.error'
import { ICreator, IResponsible, ISupervisor, IUser } from '../../types/user.type'
import {
	checkIsSubordinate,
	formatResponsibleFromTasks,
	getCreatedTasksId,
	checkIsCreator
} from './task.hepler'
import { TaskError } from './task.error'

export const TaskService = {
	async getTasks(user_id: number) {
		const responsibledTasks = await ResponsibleModel.findAll<
			Model<IResponsible>
		>({
			where: { user_id }
		})

		const createdTasks = await CreatorModel.findAll<Model<ICreator>>({
			where: { user_id }
		})

		const tasksId = getCreatedTasksId(responsibledTasks, createdTasks)

		const tasks = await TaskModel.findAll<Model<ITask & { user: IUser }>>({
			where: { id: tasksId },
			include: { model: UserModel }
		})

		const formatedTasks = formatResponsibleFromTasks(tasks)

		return formatedTasks
	},

	async addTask({ creator_id, responsible_id, ...data }: ICreateTask) {
		if (creator_id === responsible_id) {
			throw ApiError.BadRequest(TaskError.DONT_CORRECT)
		}

		const subordinates = await SupervisorModel.findAll<Model<ISupervisor>>({
			where: { userId: creator_id }
		})

		const is_subordinate = checkIsSubordinate(subordinates, [responsible_id])

		if (!is_subordinate) {
			throw ApiError.BadRequest(TaskError.NOT_SUBORDINATE)
		}

		const task = await TaskModel.create<Model<ITask>>({
			...data,
			userId: responsible_id
		})

		await CreatorModel.create<Model<ICreator>>({
			user_id: creator_id,
			taskId: task.dataValues.id
		})

		await ResponsibleModel.create<Model<IResponsible>>({
			user_id: responsible_id,
			taskId: task.dataValues.id
		})

		return task
	},

	async changeTask(user_id: number, { id, ...data }: Partial<ITask>) {
		const task = await TaskModel.findOne<Model<ITask>>({
			where: { id }
		})

		if (!task) {
			throw ApiError.BadRequest(TaskError.NOT_FOUND)
		}

		const subordinates = await SupervisorModel.findAll<Model<ISupervisor>>({
			where: { userId: user_id }
		})

		const creator = await CreatorModel.findOne<Model<ICreator>>({
			where: { taskId: task.dataValues.id }
		})

		const is_subordinate = checkIsSubordinate(subordinates, [
			task.dataValues.userId,
			user_id
		])
		const is_creator = checkIsCreator(creator, user_id)

		if (!is_subordinate || !is_creator) {
			throw ApiError.Forbbiden(TaskError.ACCESS_DENIED)
		}

		return task.update(data)
	}
}
