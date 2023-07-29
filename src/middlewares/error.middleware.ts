import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../exceptions/api.error'

export const errorMiddleWare = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message, errors: error.errors })
  }

  return res.status(500).json({ message: error.message, errors: error.errors })
}
