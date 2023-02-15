/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
axios.defaults.baseURL = 'http://localhost:3000/api'

interface ErrorType {
  errors: {
    todo?: {
      message?: string
    },
    isCompleted?: {
      message?: string
    }
  }
  keyValue?: {
    todo?: string
  }
}

interface TodoType {
  _id: number
  todo: string,
  isCompleted: boolean
  createdAt?: string
}

function page() {

  const initstate = {
    todo: '',
    isCompleted: false
  }
  const [formInput, setFormInput] = useState(initstate)
  const [errors, setErrors] = useState<ErrorType>() as any
  const [todos, setTodos] = useState<TodoType[]>([])

  const [updateStatus, setUpdateStatus] = useState(false)
  const [updateId, setupdateId] = useState<number>()
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('/todo-list')
      .then((resp) => {
        if (resp.data.status === 'success') {
          setTodos(((resp.data.data).filter((todo: any) => todo.isCompleted === false)).concat((resp.data.data).filter((todo: any) => todo.isCompleted === true)))
        }
      })
      .catch((e) => console.log(e))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors()
    const { value, name } = e.target
    setFormInput({ ...formInput, [name]: value })
  }
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target
    setFormInput({ ...formInput, [name]: checked })
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }





  const filterSearch = useMemo(
    () => todos.filter((todo) => todo.todo.toLocaleLowerCase().includes(search.toLowerCase()))
    , [search, todos])

  const handleEdit = async (i: number) => {
    await axios
      .get(`/todo-list/${i}`)
      .then((resp) => {
        if (resp.data.status === 'success')
          setFormInput({
            ...formInput,
            todo: resp.data.data.todo,
            isCompleted: !resp.data.data.isCompleted
          })
      })
      .catch(e => console.log(e))
    setUpdateStatus(true)
    setupdateId(i)
  }
  const handleDelete = async (i: number) => {
    await axios.delete(`/todo-list/${i}`).then((resp) => {
      if (resp.data.status === 'success') {
        setTodos(todos.filter((todo) => todo._id !== i))
      }
    })
      .catch(e => console.log(e))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (updateStatus) {
      await axios
        .put(`/todo-list/${updateId}`, formInput)
        .then((resp) => {
          if (resp.data.status === 'success') {
            setTodos(todos.map((todo) => todo._id === updateId ? resp.data.data : todo))
            setFormInput(initstate)
          } else if (resp.data.status === "validate") {
            setErrors(resp.data.validate)
          }
        })
        .catch((e) => console.log(e))
    } else {
      await axios
        .post('/todo-list', formInput)
        .then((resp) => {
          console.log(resp.data)
          if (resp.data.status === 'success') {
            setTodos(todos.concat(resp.data.data))
            setFormInput(initstate)
          } else if (resp.data.status === 'validate') {
            setErrors(resp.data.validate)
          }
        })
        .catch((e) => console.log(e))
    }
  }
  const handleClick = async ({ _id, todo, isCompleted }: TodoType) => {
    await
      axios.put(`/todo-list/${_id}`, {
        todo: todo,
        isCompleted: !isCompleted
      })
        .then((resp) => {
          if (resp.data.status === 'success') {
            setTodos(todos.map((todo) => todo._id === _id ? resp.data.data : todo))
            setFormInput(initstate)
          } else if (resp.data.status === "validate") {
            setErrors(resp.data.validate)
          }
        })
        .catch((e) => console.log(e))
  }


  return (
    <div className='m-3'>
      {/* Filter */}
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-3'>
          <input
            className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type='text'
            name='todo'
            onChange={handleChange}
            value={formInput.todo}
          />
          <label className='text-red-500'>{errors?.keyValue?.todo || errors?.errors?.todo?.message}</label>
        </div>

        <br></br>
        <input
          id='checkbox'
          className='text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          type='checkbox'
          name='isCompleted'
          onChange={(handleCheckbox)}
          checked={formInput.isCompleted ? true : false}
        />
        <label htmlFor='checkbox'>Compeleted</label>
        <label>{errors?.errors?.isCompleted?.message}</label>
        <br></br>
        <button type='submit' className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" >Submit</button>
      </form>
      {/* Form Input */}

      {/* show list in table */}
      <div className='my-3 grid grid-cols-3'>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          onChange={handleSearch}
          placeholder='Search'
        />
      </div>
      <table className="table-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Todo</th>
            <th>Iscomplete</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filterSearch.map((todo) => {
            return (
              <tr key={todo._id} style={{ background: todo.isCompleted ? 'green' : 'white' }}>
                <td className="border px-4 py-2">{todo._id}</td>
                <td className="border px-4 py-2">{todo.todo}</td>
                <td className="border px-4 py-2">{todo.isCompleted ?
                  <span>
                    Complete
                  </span>
                  :
                  <span>
                    Incomplete
                  </span>
                }
                </td>
                <td className="border px-4 py-2">{todo.createdAt}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l mx-1"
                    onClick={() => handleClick({
                      _id: todo._id,
                      todo: todo.todo,
                      isCompleted: todo.isCompleted
                    })}
                  >
                    {todo.isCompleted ? 'Change to Incompleted' : 'Change to Completed'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default page;
