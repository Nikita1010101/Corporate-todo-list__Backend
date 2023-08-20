import { Router } from 'express'

import { TaskController } from '../controllers/task.controller'
import { authMiddleWare } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleWare, TaskController.getTasks)

router.post('/add', authMiddleWare, TaskController.addTask)

router.patch('/change', authMiddleWare, TaskController.changeTask)

export const taskRouter = router
