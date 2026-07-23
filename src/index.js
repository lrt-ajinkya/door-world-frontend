import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import { configureStore } from "@reduxjs/toolkit";
import { createStore } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer'

// Suppress ResizeObserver errors from browser extensions and hide React overlay
window.addEventListener('error', (e) => {
  if (e.message && (
    e.message.includes('ResizeObserver loop limit exceeded') ||
    e.message.includes('ResizeObserver loop completed with undelivered notifications')
  )) {
    // Hide webpack dev server overlay
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
    
    if (resizeObserverErr) {
      resizeObserverErr.style.display = 'none';
    }
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.style.display = 'none';
    }
    
    // Also try to hide Create React App overlay
    const reactOverlay = document.querySelector('iframe[title="runtime error"]');
    if (reactOverlay) {
      reactOverlay.style.display = 'none';
    }
    
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

// Suppress console errors for ResizeObserver
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && (
    args[0].includes('ResizeObserver loop limit exceeded') ||
    args[0].includes('ResizeObserver loop completed with undelivered notifications')
  )) {
    return;
  }
  originalError.apply(console, args);
};

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['navigation']
}


const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
let persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
