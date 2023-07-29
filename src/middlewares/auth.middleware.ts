import { NextFunction, Request, Response } from 'express'
import { TokenService } from '../services/token.service'
import { ApiError } from '../exceptions/api.error'

export const authMiddleWare = (
	req: Request,
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

		const is_valid_token = TokenService.validateAccessToken(access_token)

		if (!is_valid_token) {
			throw next(ApiError.UnautorizedError())
		}

		next()
	} catch (error) {
		return next(ApiError.UnautorizedError())
	}
}
