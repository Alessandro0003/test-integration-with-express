import { User } from "@prisma/client"
import { prisma } from "../../src/config/prisma-client"
import request from 'supertest'
import app from '../../src/app'

describe('Given the user resources', () => {
  let users: User[]

  describe('GET /users', () => {
    beforeAll(async () => {
      await prisma.user.createMany({
        data: [
          {
            name: 'John Doe',
            email: 'john.doe@acme.com'
          },
          {
            name: 'Jana Doe',
            email: 'jana.doe@acme.com'
          }
        ]
      })

       users = await prisma.user.findMany()
    })

    it('should be able to list all users', async () => {
      const response = await request(app).get('/users')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject(users)
    })
  })

  describe('POST /users', () => {
    afterEach(async () => {
      await prisma.user.deleteMany()
    })

    it('should be able throw an error when the user is already exists', async () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@acme.com'
      }

      await request(app).post('/users').send(data)

      const response = await request(app).post('/users').send(data)

      expect(response.status).toBe(409)
      expect(response.body.message).toBe(`User already exists  ${data.email}`)
    })
  })
})