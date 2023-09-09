import { Model } from 'sequelize'
import bcrypt from 'bcrypt'

import { SupervisorModel, UserModel } from '../../models/index.model'
import { ISupervisor, IUser } from '../../types/user.type'
import { TokenService } from '../token/token.service'
import { UserDto } from '../../dtos/user.dto'
import { ApiError } from '../../exceptions/api.error'
import { IRegistration } from '../../types/auth.type'
import { AuthError } from './auth.error'

class AuthServiceClass {
	static async createData(user: Model<IUser>) {
		const userDto = new UserDto(user.dataValues)
		const tokens = TokenService.genereteTokens(userDto)
		await TokenService.saveToken(tokens.refresh_token, user.dataValues.id)
		return { ...tokens, user: userDto }
	}

	async registration({
		supervisor_id,
		email,
		password,
		...data
	}: IRegistration) {
		const is_account = await UserModel.findOne<Model<IUser>>({
			where: { email: email }
		})

		if (is_account) {
			throw ApiError.BadRequest(AuthError.USER_EXIST(email))
		}

		const hash_password = await bcrypt.hash(password, 12)

		const user = await UserModel.create<Model<IUser>>({
			email,
			password: hash_password,
			...data
		})

		if (supervisor_id) {
			await SupervisorModel.create<Model<ISupervisor>>({
				subordinate_id: user.dataValues.id,
				userId: supervisor_id
			})
		}

		return AuthServiceClass.createData(user)
	}

	async login(email: string, password: string) {
		const user = await UserModel.findOne<Model<IUser>>({
			where: { email: email }
		})

		if (!user) {
			throw ApiError.BadRequest(AuthError.EMAIL_NOT_FOUND(email))
		}

		const is_passwords_equals = await bcrypt.compare(
			password,
			user.dataValues.password
		)

		if (!is_passwords_equals) {
			throw ApiError.BadRequest(AuthError.DONT_CORRECT_PASSWORD(password))
		}

		return AuthServiceClass.createData(user)
	}

	async logout(refresh_token: string) {
		if (!refresh_token) {
			throw ApiError.UnautorizedError()
		}
		
		const token = await TokenService.removeToken(refresh_token)
		return token
	}

	async refresh(refresh_token: string) {
		if (!refresh_token) {
			throw ApiError.UnautorizedError()
		}

		const is_valid_token = TokenService.validateRefreshToken(refresh_token)
		const token_from_db = await TokenService.findToken(refresh_token)

		if (!is_valid_token || !token_from_db) {
			throw ApiError.UnautorizedError()
		}

		const user = await UserModel.findOne({
			where: { id: token_from_db.dataValues.userId }
		})

		return AuthServiceClass.createData(user)
	}
}

export const AuthService = new AuthServiceClass()
