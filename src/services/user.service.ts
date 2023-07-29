import { Model } from 'sequelize'
import bcrypt from 'bcrypt'

import { UserModel } from '../models/index.model'
import { IUser } from '../types/user.type'
import { TokenService } from './token.service'
import { UserDto } from '../dtos/user.dto'
import { ApiError } from '../exceptions/api.error'

class UserServiceClass {
	static async returnData(user: Model<IUser>) {
		const userDto = new UserDto(user.dataValues)
		const tokens = TokenService.genereteTokens({ ...userDto })
		await TokenService.saveToken(tokens.refresh_token, user.dataValues.id)
		return { ...tokens, user: userDto }
	}

	async registration({ email, password, ...data }: IUser) {
		const is_account = await UserModel.findOne<Model<IUser, string>>({
			where: { email: email }
		})

		if (is_account) {
			throw ApiError.BadRequest(`User with the Email ${email} yet exist!`)
		}

		const hash_password = await bcrypt.hash(password, 12)

		const user = await UserModel.create<Model<IUser>>({
			email,
			password: hash_password,
			...data
		})

		return UserServiceClass.returnData(user)
	}

	async login(email: string, password: string) {
		const user = await UserModel.findOne<Model<IUser>>({ where: { email } })

		if (!user) {
			throw ApiError.BadRequest('User with the email dont found!')
		}

		const is_passwords_equals = await bcrypt.compare(
			password,
			user.dataValues.password
		)

		if (!is_passwords_equals) {
			throw ApiError.BadRequest(
				`Dont correct password! ${password} ${user.dataValues.password}`
			)
		}

		return UserServiceClass.returnData(user)
	}

	async logout(refresh_token: string) {
		const token = await TokenService.removeToken(refresh_token)
		return token
	}

	async refresh(refresh_token: string) {
		if (!refresh_token) {
			throw ApiError.UnautorizedError()
		}

		const is_valid_token = await TokenService.validateRefreshToken(
			refresh_token
		)
		const token_from_db = await TokenService.findToken(refresh_token)

		if (!is_valid_token || !token_from_db) {
			throw ApiError.UnautorizedError()
		}

		const user = await UserModel.findOne({
			where: { id: token_from_db.dataValues.userId }
		})

		return UserServiceClass.returnData(user)
	}
}

export const UserService = new UserServiceClass()
