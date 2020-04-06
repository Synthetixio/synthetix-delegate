import { createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeEnhancer } from './utils';

import rootSaga from './rootSaga';
import rootReducer from './rootReducer';
import { RootState } from './types';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];
const enhancer = composeEnhancer(applyMiddleware(...middlewares));

const store: Store<RootState> = createStore(rootReducer, {}, enhancer);

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;

export default store;
