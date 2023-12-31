import { Model } from 'sequelize'
import jwt from 'jsonwebtoken'

import { TokenModel } from '../../models/index.model'
import { IUserDto } from '../../types/user.type'
import { IToken } from '../../types/token.type'

export const TokenService = {
	genereteTokens(user: IUserDto): {
		access_token: string
		refresh_token: string
	} {
		const payload = { ...user }
		const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
			expiresIn: '15m'
		})
		const refresh_token = jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET_KEY,
			{ expiresIn: '15d' }
		)

		return { access_token, refresh_token }
	},

	async findToken(refresh_token: string) {
		const token = await TokenModel.findOne<Model<IToken>>({
			where: { refresh_token }
		})

		return token
	},

	async saveToken(refresh_token: string, user_id: number) {
		const existing_token = await TokenModel.findOne<Model<IToken>>({
			where: { userId: user_id }
		})

		if (existing_token) {
			return await existing_token.update({
				refresh_token
			})
		}

		const token = await TokenModel.create<Model<IToken>>({
			refresh_token,
			userId: user_id
		})

		return token
	},

	async removeToken(refresh_token: string) {
		const token = await TokenModel.destroy<Model<IToken>>({
			where: { refresh_token }
		})
		return token
	},

	validateAccessToken(access_token: string) {
		try {
			const user = jwt.verify(
				access_token,
				process.env.JWT_ACCESS_SECRET_KEY
			)
			return user
		} catch (error) {
			throw error
		}
	},

	validateRefreshToken(refresh_token: string) {
		try {
			const user = jwt.verify(
				refresh_token,
				process.env.JWT_REFRESH_SECRET_KEY
			)
			return user
		} catch (error) {
			throw error
		}
	}
}
