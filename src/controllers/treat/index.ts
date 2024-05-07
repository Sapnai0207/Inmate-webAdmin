import { treatService } from '../../services/treat'
import { TreatmentController } from './types'

export const treatmentController: TreatmentController = {
  changeStates: async (req, res, next) => {
    try {
      const { authorization } = req.headers
      const result = await treatService.changeTreatmentStates({ token: authorization, ...req.body })

      res.send(result)
    } catch (e: any) {
      next(e)
    }
  },
  getAllTreatment: async (req, res, next) => {
    try {
      const { authorization } = req.headers
      const result = await treatService.getAllTreatment({ token: authorization, ...req.query })

      res.send(result)
    } catch (e: any) {
      next(e)
    }
  },
  addTreatment: async (req, res, next) => {
    try {
      const { authorization } = req.headers
      const result = await treatService.addTreatment({ token: authorization, treatment: req.body })

      res.send(result)
    } catch (e: any) {
      next(e)
    }
  },
  deleteTreatment: async (req, res, next) => {
    try {
      const { authorization } = req.headers
      const result = await treatService.deleteTreatment({ token: authorization, ...req.body })

      res.send(result)
    } catch (e: any) {
      next(e)
    }
  },
  addDiagnose: async (req, res, next) => {
    try {
      const { authorization } = req.headers
      const result = await treatService.addDiagnose({ token: authorization, diagnose: req.body })

      res.send(result)
    } catch (e: any) {
      next(e)
    }
  },
  deleteDiagnose: async (req, res, next) => {
    try {
      const { authorization } = req.headers
      const result = await treatService.deleteDiagnose({ token: authorization, ...req.body })

      res.send(result)
    } catch (e: any) {
      next(e)
    }
  }
}
