import log4js, { ConsoleAppender, getLogger } from 'log4js'
import { AsyncLocalStorage } from 'async_hooks'
import { Request, Response, NextFunction } from 'express'
import dayjs from 'dayjs'

const pattern = '%[[%d{hh:mm:ss.SSS}][%p][%c][%f{2}:%l][%x{reqId}]%] %m'

const loggerPath = process.env.LOGGER_PATH ?? '/var/log/inmate/info'

const reqIdStorage = new AsyncLocalStorage()

const consoleAppender: ConsoleAppender = {
  type: 'console',
  layout: {
    pattern,
    type: 'pattern',
    tokens: {
      reqId: (event) => {
        const reqId = reqIdStorage.getStore()
        if (reqId !== null && reqId !== undefined) {
          return reqId
        }
        return ''
      }
    }
  }
}

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    default: {
      type: 'dateFile',
      filename: loggerPath,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true
    },
    console: consoleAppender
  },
  categories: {
    default: { appenders: ['out', 'default'], level: 'info' }
  }
})

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const logger = getLogger('http')
  const reqId = Math.random()
  const oldEnd = res.end
  const ts = dayjs().toDate().getTime()
  res.end = (cb?: any): any => {
    logger.info(res.statusCode, dayjs().toDate().getTime() - ts, 'ms')
    // @ts-expect-error
    oldEnd.apply(res, arguments)
  }
  res.setHeader('X-Request-Id', reqId)
  reqIdStorage.run(reqId, () => {
    logger.info(req.method, req.originalUrl)
    next()
  })
}
