import mongoose from 'mongoose';
import { app } from './app';

const dotenv = require('dotenv');

dotenv.config();

const PORT = parseInt(process.env.PORT!);

if (!process.env.REDIS_PASSWORD) {
  throw new Error('REDIS_PASSWORD must be defined');
}

const connect = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_ATLAS_URI) {
    throw new Error('MONGO-URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_ATLAS_URI);
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!!!`);
});

connect();
