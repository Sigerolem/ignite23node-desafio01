import { randomUUID } from 'node:crypto'

import { Database } from "./database.js"
import { buildPathRegex } from './utils/build-path-regex.js'


const db = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildPathRegex('/tasks'),
    handler: (req, res) => {
      const tasks = db.select('tasks', req.query)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildPathRegex('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description) { return res.writeHead(400).end('Dados Inválidos') }
      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
      db.insert('tasks', newTask)
      return res.writeHead(201).end('Criada nova task!')
    }
  },
  {
    method: 'PUT',
    path: buildPathRegex('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body
      const newTaskInfo = {
        title,
        description,
        updated_at: new Date()
      }
      const result = db.update('tasks', req.params.id, newTaskInfo)
      return res.writeHead(result).end()
    }
  },
  {
    method: 'PATCH',
    path: buildPathRegex('/tasks/:id'),
    handler: (req, res) => {
      const result = db.patch('tasks', req.params.id)
      return res.writeHead(result).end()
    }
  },
  {
    method: 'DELETE',
    path: buildPathRegex('/tasks/:id'),
    handler: (req, res) => {
      const result = db.delete('tasks', req.params.id)
      return res.writeHead(result).end()
    }
  }
]