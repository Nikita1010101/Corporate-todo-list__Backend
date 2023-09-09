import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'

import { ApiError } from '../exceptions/api.error'
import { AuthService } from '../services/auth/auth.service'
import { REFRESH_TOKEN } from '../constants/token'
import { ILogin, IRegistration } from '../types/auth.type'

class AuthControllerClass {
	static setCookies(res: Response, refresh_token: string) {
		res.cookie(REFRESH_TOKEN, refresh_token, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true,
			sameSite: 'none',
			secure: true
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

			const body = req.body as IRegistration

			const user = await AuthService.registration(body)

			AuthControllerClass.setCookies(res, user.refresh_token)

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
			const { email, password } = req.body as ILogin

			const user = await AuthService.login(email, password)

			AuthControllerClass.setCookies(res, user.refresh_token)

			res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)
			res.header('Access-Control-Allow-Crendentials', 'true')

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
			const { refresh_token } = req.cookies

			const token = await AuthService.logout(refresh_token)

			res.clearCookie(REFRESH_TOKEN)

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
			const { refresh_token } = req.cookies

			const user = await AuthService.refresh(refresh_token)

			AuthControllerClass.setCookies(res, user.refresh_token)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}
}

export const AuthController = new AuthControllerClass()
