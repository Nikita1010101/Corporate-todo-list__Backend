import { NextFunction, Response } from 'express'

import { TokenService } from '../services/token/token.service'
import { ApiError } from '../exceptions/api.error'
import { IUser, TRequestWithUser } from '../types/user.type'

export const authMiddleWare = (
	req: TRequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const autorization_header = req.headers.authorization

		if (!autorization_header) {
			throw next(ApiError.UnautorizedError())
		}

		const access_token = autorization_header.split(' ')[1]

		if (!access_token) {
			throw next(ApiError.UnautorizedError())
		}

		const user = TokenService.validateAccessToken(access_token)

		if (!user) {
			throw next(ApiError.UnautorizedError())
		}

		req.user = user as IUser

		next()
	} catch (error) {
		return next(ApiError.UnautorizedError())
	}
}
