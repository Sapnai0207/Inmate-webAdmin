import { getLogger } from 'log4js'
import { ClientSession, ClientSessionOptions, Collection, Db, DbOptions, MongoClient } from 'mongodb'

const logger = getLogger('db')

class Database {
  private static instance: Database | null = null
  private mongo: Promise<MongoClient> | null = null

  private constructor () {
  }

  public static getInstance (): Database {
    if (Database.instance === null) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect (): Promise<MongoClient> {
    if (this.mongo == null) {
      const URL: string = process.env.MONGO_URL ?? ''
      const client = new MongoClient(URL)
      this.mongo = client.connect()
      this.mongo.then(() => {
        logger.info('🔗 Connected to Mongo')
      }).catch((e: any) => {
        logger.error('mongo connect error', e.message)
      })
    }
    const conn = await this.mongo
    return conn
  }

  async database (dbname?: string, options?: DbOptions): Promise<Db> {
    const conn: MongoClient = await this.connect()
    const DB_NAME: string = process.env.MONGO_DB ?? dbname ?? 'mobiweb'
    return conn.db(DB_NAME, options)
  }

  async session (options?: ClientSessionOptions): Promise<ClientSession> {
    const conn: MongoClient = await this.connect()
    return conn.startSession(options ?? {})
  }
}

class Mongo {
  async database (): Promise<Db> {
    return await Database.getInstance().database()
  }

  async session (): Promise<ClientSession> {
    return await Database.getInstance().session()
  }
}

export function MongoCollection<T extends { [key: string]: any }> (name: string): (conn: Db) => Collection<T> {
  return (conn) => {
    return conn.collection(name)
  }
}
export const MongoDatabase = new Mongo().database
export const MongoSession = new Mongo().session
