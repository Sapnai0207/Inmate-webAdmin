import { ApiErrorCode, ApiException, HttpStatus } from './express'
import { isNil } from './utils'
import jwt from 'jsonwebtoken'

export const authValidate = (authHeader?: string): Record<string, any> => {
  try {
    if (authHeader === undefined) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, ApiErrorCode.UNAUTHORIZED, 'unauthorized')
    }
    const [authType, authToken] = authHeader.split(' ', 2)
    if (authType.match(/^bearer$/gi) === null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, ApiErrorCode.UNAUTHORIZED, 'invalid token type')
    }

    const tokenData = vaildateJWT(authToken)

    if (isNil(tokenData)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, ApiErrorCode.UNAUTHORIZED, 'invalid token')
    }
    return tokenData
  } catch (e) {
    throw new ApiException(HttpStatus.UNAUTHORIZED, ApiErrorCode.UNAUTHORIZED, 'internal error')
  }
}

export const vaildateJWT = (token?: string): Record<string, any> | undefined => {
  if (token !== undefined) {
    const res = jwt.verify(token, process.env.SECRET_KEY ?? '') as Record<string, any>
    return res
  }

  return undefined
}
