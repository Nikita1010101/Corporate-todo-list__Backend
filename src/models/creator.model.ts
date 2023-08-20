import { DataTypes } from 'sequelize'

export const creatorModelData = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	user_id: { type: DataTypes.INTEGER, allowNull: false }
}
