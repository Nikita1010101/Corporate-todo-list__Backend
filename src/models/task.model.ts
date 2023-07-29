import { DataTypes } from 'sequelize'

export const taskModelData = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false },
	deadline: { type: DataTypes.STRING, allowNull: false },
	update_date: { type: DataTypes.STRING, allowNull: false },
	priority: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
	status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}
