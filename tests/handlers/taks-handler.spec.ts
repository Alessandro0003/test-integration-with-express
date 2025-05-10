import { Task, User } from "@prisma/client"
import { prisma } from "../../src/config/prisma-client"
import request from 'supertest'
import app from '../../src/app'

describe('Give the taks resources', () => {
  let user: User

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@acme.com'
      }
    })
  })

  afterAll(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('Get  /tasks', () => {
    let tasks: Task[]

    beforeAll(async () => {
      await prisma.task.createMany({
        data: [
          {
            title: "Realizar deploy",
            description: "Terá que ser feito o deploy da ultima sprint",
            userId: user.id
          },

          {
            title: "Realizar push",
            description: "Terá que ser feito o push da ultima sprint",
            userId: user.id
          }
        ]
      })

      tasks = await prisma.task.findMany({})
    })

    it('should be able to list all tasks', async () => {
      const response = await request(app).get('/tasks')

      expect( response.status).toBe(200)
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(tasks))
    })
  })

  describe('POST /tasks', () => {
    it('should be able to create a task', async () => {
      const response = await request(app).post('/tasks').send({
        userId: user.id,
        title: 'Realizar deploy',
        description: 'Terá que ser feito o deploy da ultima sprint'
      })

      const taskInDatabase = await prisma.task.findUnique({
        where: {
          id: response.body.id
        }
      })

      expect(response.status).toBe(201)
      expect(taskInDatabase).toBeTruthy()
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(taskInDatabase))
    })
  })
})