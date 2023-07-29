import { Model } from 'sequelize'
import jwt from 'jsonwebtoken'

import { TokenModel } from '../models/index.model'
import { IUserDto } from '../types/user.type'
import { IToken } from '../types/token.type'

class TokenServiceClass {
	genereteTokens(
		payload: IUserDto
	): { access_token: string; refresh_token: string } {
		const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
			expiresIn: '15m'
		})
		const refresh_token = jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET_KEY,
			{ expiresIn: '15d' }
		)

		return { access_token, refresh_token }
	}

	async findToken(refresh_token: string): Promise<Model<IToken>> {
		const token = await TokenModel.findOne<Model<IToken>>({
			where: { refresh_token }
		})

		return token
	}

	async saveToken(
		refresh_token: string,
		user_id: number
	): Promise<Model<IToken>> {
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
	}

	async removeToken(refresh_token: string) {
		const token = await TokenModel.destroy<
			Model<Omit<IToken, 'userId'>, string>
		>({ where: { refresh_token } })
		return token
	}

	validateAccessToken(access_token: string) {
		try {
			const is_access_token = jwt.verify(
				access_token,
				process.env.JWT_ACCESS_SECRET_KEY
			)
			return is_access_token
		} catch (error) {
			return null
		}
	}

	validateRefreshToken(refresh_token: string) {
		try {
			const is_refresh_token = jwt.verify(
				refresh_token,
				process.env.JWT_REFRESH_SECRET_KEY
			)
			return is_refresh_token
		} catch (error) {
			return null
		}
	}
}

export const TokenService = new TokenServiceClass()
