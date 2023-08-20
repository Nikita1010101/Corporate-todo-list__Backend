import { IDefaultValues } from './default.type'

export interface IToken extends IDefaultValues {
	refresh_token: string
	userId: number
}
