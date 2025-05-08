import util from 'util'
import { config } from 'dotenv'
import crypto from 'crypto'
import { exec } from 'child_process'

const execSync = util.promisify(exec)

export default async () => {
  console.info('\nMontando suíte de testes...')

  config({ path: '.env.test' })

  global.__SCHEMA__ = `test_${crypto.randomUUID()}`

  process.env.DATABASE_URL = `${process.env.DATABASE_URL}?schema=${global.__SCHEMA__}`

  await execSync(`npx prisma migrate deploy`)

  console.info('Suite pronta. Iniciando testes....\n')
}
