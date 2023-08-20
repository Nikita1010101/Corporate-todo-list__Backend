import { DataTypes } from 'sequelize'

export const supervisorModelData = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	subordinate_id: { type: DataTypes.INTEGER, allowNull: false }
}
