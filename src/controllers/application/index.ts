import { ApplicationController } from './types'
import crypto from 'crypto'

export const applicationController: ApplicationController = {
  list: async (req, res, next) => {
    try {
      const secretKey = crypto.randomBytes(32).toString('hex')
      console.log('secretKey', secretKey)
      res.send(secretKey)
    } catch (e: any) {
      next(e)
    }
  }
}
