import mongoose, { Document, Schema } from "mongoose"

export interface TodoList {
  name: string
  isCompleted: boolean
}


const TodoList: Schema = new Schema(
  {
    todo: {
      type: String,
      unique: true,
      required: true
    },
    isCompleted: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.models.TodoList || mongoose.model('TodoList', TodoList)

