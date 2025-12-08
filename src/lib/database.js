import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "predimundial"
    })
    console.log(mongoose.connection.name)
    isConnected = true;
    console.log('MongoDB connected')
    
  } catch (error) {
    const e = { status: "ERROR", info: `MongoDB ${error}` }
    return e
  }
}