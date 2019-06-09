jest.setTimeout(30000);
import * as mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/chatty', {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
});
