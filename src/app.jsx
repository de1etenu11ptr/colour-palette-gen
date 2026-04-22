import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ColourPicker from './pages/colour-picker/colour-picker.jsx'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ColourPicker />} />
			</Routes>
		</BrowserRouter>
	)
}
