import { Router } from 'express';
import { prisma } from '../config/prisma-client'

const taskHandlers = Router()

taskHandlers.get('/tasks', async (request, response) => {
  const tasks = await prisma.task.findMany()
  
  response.status(200).json(tasks)
})

taskHandlers.post('/tasks', async (request, response) => {
  const { title, description, userId } = request.body

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId
    }
  })

  response.status(201).json(task)
})

taskHandlers.put('/tasks/:id', async (request, response) => {
  const { id } = request.params
  const { title, description, completed } = request.body

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      completed
    }
  })

  response.status(201).json(task)
})

export { taskHandlers }	