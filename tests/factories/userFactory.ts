import * as mongoose from 'mongoose';
const User = mongoose.model('User');

User.findOne({ slug: 'sason@ae8538e3-92d7-493e-a53c-872074f68a0f' }).then(
	user => {
		console.log(user);
	}
);
