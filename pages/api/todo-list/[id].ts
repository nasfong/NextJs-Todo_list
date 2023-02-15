import type { NextApiRequest, NextApiResponse } from 'next'
import TodoModel from './TodoModel'
import { ObjectId } from 'mongoose'
import { Data } from './index'


// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { id } = req.query
  const { method } = req

  if (method === 'GET') {
    return TodoModel
      .findById(id)
      .select('-__v')
      .then(todo => todo ?
        res.status(200).json({
          status: 'success',
          data: todo
        }) : res.status(404).json({ message: 'Not found' }))
      .catch(error => res.status(500).json({ error }))
  }

  if (method === 'PUT') {
    return TodoModel
      .findById(id)
      .select('-__v')
      .then(todo => {
        if (todo) {
          todo.set(req.body)
          
          return todo
            .save()
            .then((todo: Data) => res.status(200).json({
              status: 'success',
              data: todo
            }))
            .catch((error: Data) => res.status(500).json({ error }))
        } else {
          res.status(404).json({ message: 'Not found' })
        }
      }
      )
      .catch(error => res.status(500).json({ error }))
  }

  if (method === 'DELETE') {
    return TodoModel.findByIdAndDelete(id)
      .then(todo => todo ? res.status(200).json({
        status: 'success',
        message: 'Deleted'
      }) : res.status(404).json({ message: 'Not found' }))
      .catch(error => res.status(500).json({ error }))
  }


}