import { Router } from 'express'
import { body } from 'express-validator'

import { AuthController } from '../controllers/auth.controller'

const router = Router()

router.get('/refresh', AuthController.refresh)

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	AuthController.registration
)
router.post(
	'/login',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	AuthController.login
)
router.delete('/logout', AuthController.logout)

export const authRouter = router
