require('dotenv').config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { authRouter } from './routes/index.route'
import { sequlize } from './db'
import { authMiddleWare } from './middlewares/auth.middleware'

const app = express()

const PORT = process.env.PORT || 7000

app.use(express.json())
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL
	})
)
app.use(cookieParser())
app.use('/api', authRouter)
app.use(authMiddleWare)

const start = async () => {
	try {
		await sequlize.authenticate()
		await sequlize.sync()

		app.listen(PORT, () => {
			console.log(`Сервер успешно запущен на ${PORT} порту`)
		})
	} catch (error) {
		throw error
	}
}

start()