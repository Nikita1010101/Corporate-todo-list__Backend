import { Router } from 'express'

import { authRouter } from './auth.route'
import { taskRouter } from './task.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/task', taskRouter)

export const mainRouter = router


