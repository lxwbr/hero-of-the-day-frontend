import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './service-worker'
import thunk from 'redux-thunk'
import { applyMiddleware, createStore, Store, AnyAction } from 'redux'
import { Provider } from 'react-redux'
import { rootReducer, AppState } from './store'

const middlewares = [thunk]
export const store: Store<AppState, AnyAction> = createStore(rootReducer, applyMiddleware(...middlewares))

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
