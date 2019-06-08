import { compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const store = createStore(
	rootReducer,
	process.env.NODE_ENV === 'development' ? composeWithDevTools() : compose()
);

export default store;
