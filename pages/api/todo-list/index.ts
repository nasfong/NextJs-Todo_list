import type { NextApiRequest, NextApiResponse } from 'next'
import connected from '../connectDb'
import TodoModel from './TodoModel'
import NextCors from 'nextjs-cors'


export interface Data {
  status?: number | string
  data?: string[] | string | unknown
  error?: string | any
  message?: string
  validate?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  connected().catch(error => console.log('connect error' + error.message))

  const { method } = req
  //GET
  if (method === 'GET') {
    return TodoModel
      .find()
      .select('-__v')
      .then(todo => res.status(200).json({
        status: 'success',
        data: todo
      }))
      .catch((error) => res.status(500).json({ error }))
  }
  //POST
  if (method === 'POST') {
    const query_todo = req.body.todo
    TodoModel.findOne({ todo: query_todo }, async (err: any, todo: any) => {
      if (err) console.log(err)
      todo = new TodoModel(req.body)
      try {
        try {
          await todo.save()
          res.status(200).json({
            status: 'success',
            data: todo
          })
        } catch (validate: any) {
          res.status(202).json({
            status: 'validate',
            validate: validate
          })
        }
      } catch (error: any) {
        res.status(500).json({ error })
      }

    })

  }
}
