jest.setTimeout(30000);
require('dotenv').config({ path: './backend/.env' });
import * as mongoose from 'mongoose';
import '../backend/entities/User.model';

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
});

afterAll(() => mongoose.disconnect());
