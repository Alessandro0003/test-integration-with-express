import { Router } from 'express';
import { prisma } from '../config/prisma-client'
import { Prisma } from '@prisma/client';

const userHandlers = Router()

userHandlers.get('/users', async (request, response) => {
  const users = await prisma.user.findMany()
  
  response.status(200).json(users)
})

userHandlers.post('/users', async (request, response): Promise<any> => {
  const { email, name } = request.body
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    })
    response.status(201).json(user)
  } catch(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return response.status(409).json({ message: `User already exists  ${email}`})
      }
    }

    response.status(500).json({ message: 'Internal server error'})
  }
  

  
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