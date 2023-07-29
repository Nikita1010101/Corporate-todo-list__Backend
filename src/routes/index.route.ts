import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authMiddleWare } from '../middlewares/auth.middleware'
import { body } from 'express-validator'

const router = Router()

router.get('/refresh/:token', authMiddleWare, UserController.refresh)

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	UserController.registration
)
router.post('/login', UserController.login)
router.post('/logout', authMiddleWare, UserController.logout)

export const authRouter = router


