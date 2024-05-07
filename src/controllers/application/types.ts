import { ApiGet, ApiNextFunction, ApiResponse } from '../../misc/express'

export interface ApplicationController {
  list: (req: ApiGet<{}>, res: ApiResponse, next: ApiNextFunction) => any
}
