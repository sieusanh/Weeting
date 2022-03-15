import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { StoreProvider } from './store'
import App from './App'


ReactDOM.render(
	<React.StrictMode>
		<Router>
			<StoreProvider>
				<App />
			</StoreProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)
