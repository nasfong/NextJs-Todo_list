import mongoose from 'mongoose';

const connectDb = async () => {
  mongoose.connect(
    'mongodb+srv://newuser:rening007@crud.057ti.mongodb.net?retryWrites=true&w=majority'
  );
  console.log('Database Connected');
};
export default connectDb;
