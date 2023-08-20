import { sequlize } from '../db'

import { creatorModelData } from './creator.model'
import { responsibleModelData } from './responsible.model'
import { supervisorModelData } from './supervisor.model'
import { taskModelData } from './task.model'
import { tokenModelData } from './token.model'
import { userModelData } from './user.model'

export const UserModel = sequlize.define('user', userModelData)
export const TaskModel = sequlize.define('task', taskModelData)
export const TokenModel = sequlize.define('token', tokenModelData)
export const CreatorModel = sequlize.define('creator', creatorModelData)
export const ResponsibleModel = sequlize.define('responsible', responsibleModelData)
export const SupervisorModel = sequlize.define('supervisor', supervisorModelData)

UserModel.hasMany(TaskModel)
TaskModel.belongsTo(UserModel)

UserModel.hasOne(TokenModel)
TokenModel.belongsTo(UserModel)

UserModel.hasMany(SupervisorModel)
SupervisorModel.belongsTo(UserModel)

TaskModel.hasOne(CreatorModel)
CreatorModel.belongsTo(TaskModel)

TaskModel.hasOne(ResponsibleModel)
ResponsibleModel.belongsTo(TaskModel)