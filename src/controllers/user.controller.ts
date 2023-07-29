import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'

import { ApiError } from '../exceptions/api.error'
import { IUser } from '../types/user.type'
import { UserService } from '../services/user.service'

class UserControllerClass {
	static setCookies(res: Response, refresh_token: string) {
		res.cookie('refreshToken', refresh_token, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true
		})
	}

	registration: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Validation error!', errors.array()))
			}

			const body = req.body as IUser

			const user = await UserService.registration(body)

			UserControllerClass.setCookies(res, user.refresh_token)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}

	login: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Validation error!', errors.array()))
			}

			const { email, password } = req.body as Pick<IUser, 'email' | 'password'>

			const user = await UserService.login(email, password)

			UserControllerClass.setCookies(res, user.refresh_token)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}

	logout: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { refresh_token } = req.cookies as { refresh_token: string }

			const token = await UserService.logout(refresh_token)

			res.clearCookie('refresh_token')

			res.send(token)
		} catch (error) {
			next(error)
		}
	}

	refresh: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { refresh_token } = req.cookies as { refresh_token: string }

			const user = await UserService.refresh(refresh_token)

			UserControllerClass.setCookies(res, user.refresh_token)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}
}

export const UserController = new UserControllerClass()
