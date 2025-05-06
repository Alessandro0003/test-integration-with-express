import { Router } from 'express';
import { prisma } from '../config/prisma-client'

const userHandlers = Router()

userHandlers.get('/users', async (request, response) => {
  const users = await prisma.user.findMany()
  
  response.status(200).json(users)
})

userHandlers.post('/users', async (request, response) => {
  const { email, name } = request.body

  const user = await prisma.user.create({
    data: {
      email,
      name
    }
  })

  response.status(201).json(user)
})

userHandlers.put('/users/:id', async (request, response) => {
  const { id } = request.params
  const { email, name } = request.body

  const user = await prisma.user.update({
    where: { id },
    data: {
      email,
      name
    }
  })

  response.status(201).json(user)
})

export { userHandlers }  