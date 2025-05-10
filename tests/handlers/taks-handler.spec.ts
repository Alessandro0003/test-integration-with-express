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

  describe('Get /tasks', () => {
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

  describe('PUT /tasks/:id', () => {
    it('should be able to update a task', async () => {
      const tasks = await prisma.task.create({
        data: {
          userId: user.id,
          title: 'Criar esteira de testes',
          description: 'Terá que ser feito assim que for dado o push na branch master'
        }
      })

      const response = await request(app).put(`/tasks/${tasks.id}`).send({
        title: 'Criar esteira de testes de integração',
        description: 'Terá que ser feito o deploy da ultima sprint'
      })

      const taskInDatabase = await prisma.task.findUnique({
        where: {
          id: tasks.id
        }
      })

      expect(response.status).toBe(201)
      expect(taskInDatabase).toBeTruthy()
      expect(taskInDatabase?.title).toEqual('Criar esteira de testes de integração')
    })
  })

  describe('DELETE /tasks/:id', () => {
    it('should be able to delete a task', async () => {
      const task = await prisma.task.create({
        data: {
          userId: user.id,
          title: 'Alterar layout da page de login',
          description: 'Terá que trocar todo o layout da page de login'
        }
      })

      const response = await request(app).delete(`/tasks/${task.id}`).send()
      const taskInDatabase = await prisma.task.findUnique({
        where: {
          id: task.id
        }
      })

      expect(response.status).toBe(200)
      expect(taskInDatabase).toBeNull()
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(task))
    })

    it('should return 404 if task not found', async ()  => {
      const nonExistentTaskId = 'non-existent-task-id'

      const response = await request(app).delete(`/tasks/${nonExistentTaskId}`).send()

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Task not found' });
    })
  })
})