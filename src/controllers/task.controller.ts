import { NextFunction, Request, RequestHandler, Response } from 'express'

import { TaskService } from '../services/task/task.service'
import { ICreateTask, ITask } from '../types/task.type'
import { TRequestWithUser } from '../types/user.type'

class TaskControllerClass {
	getTasks: RequestHandler = async (
		req: TRequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const user_id = req.user.id

			const tasks = await TaskService.getTasks(user_id)

			res.send(tasks)
		} catch (error) {
			next(error)
		}
	}

	addTask: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const data = req.body as ICreateTask

			const task = await TaskService.addTask(data)

			res.send(task)
		} catch (error) {
			next(error)
		}
	}

	changeTask: RequestHandler = async (
		req: TRequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const data = req.body as Partial<ITask>

			const task = await TaskService.changeTask(req.user.id, data)

			res.send(task)
		} catch (error) {
			next(error)
		}
	}
}

export const TaskController = new TaskControllerClass()
