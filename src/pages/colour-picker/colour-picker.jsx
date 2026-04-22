import React, { useState, useEffect } from 'react'
import { Shuffle, Copy, Check } from 'lucide-react'
import { OPTIONS, hsl_2_hex } from '../../utility/colour-generation.js'
import ColourPalette from '../../components/colour-palette/colour-palette.jsx'
import './colour-picker.css'

function get_math_random() {
	return Math.random() * 360
}

export default function ColourPicker() {
	const [base_hue, set_base_hue] = useState(get_math_random())
	const [palette, set_palette] = useState([])
	const [copied_index, set_copied_index] = useState(null)
	const [locked, set_locked] = useState({})
	const [palette_mode, set_palette_mode] = useState('monochromatic')

	const handle_shuffle = () => {
		const new_hue = get_math_random()
		set_base_hue(new_hue)
	}

	const toggle_lock = (index) => {
		set_locked((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	const copy_to_clipboard = (hex, index) => {
		navigator.clipboard.writeText(hex)
		set_copied_index(index)
		setTimeout(() => set_copied_index(null), 2000)
	}

	useEffect(() => {
		for (const opt of OPTIONS) {
			if (opt.key === palette_mode) {
				set_palette(opt.fn(base_hue, locked, palette))
			}
		}
	}, [base_hue, palette_mode])

	return (
		<div className="chromatic-root">
			<div className="chromatic-bg-texture"></div>

			<div className="chromatic-container">
				<div className="chromatic-header">
					<h1 className="chromatic-title">Chromatic</h1>
					<p className="chromatic-subtitle">
						Generate harmonious colour palettes
					</p>
				</div>

				<div className="chromatic-mode-selector">
					<div className="chromatic-selector-wrapper">
						<label className="chromatic-selector-label">
							Palette Mode:
						</label>
						<select
							value={palette_mode}
							onChange={(e) => {
								set_palette_mode(e.target.value)
								set_locked({})
							}}
							className="chromatic-select"
						>
							{OPTIONS.map((opt) => {
								return (
									<option key={opt.key} value={opt.key}>
										{opt.name}
									</option>
								)
							})}
						</select>
					</div>
				</div>

				<ColourPalette
					palette={palette}
					locked={locked}
					set_locked={set_locked}
					copied_index={copied_index}
					set_copied_index={set_copied_index}
				/>

				<div className="chromatic-controls">
					<button
						onClick={handle_shuffle}
						className="chromatic-generate-btn"
					>
						<Shuffle className="chromatic-shuffle-icon" />
						Generate New Palette
					</button>

					<button
						onClick={() => {
							const all_hexes = palette
								.map((c) => c.hex)
								.join('\n')
							navigator.clipboard.writeText(all_hexes)
							set_copied_index(-1)
							setTimeout(() => set_copied_index(null), 2000)
						}}
						className="chromatic-copy-all-btn"
					>
						{copied_index === -1 ? 'Copied All!' : 'Copy All Hex'}
					</button>
				</div>

				<p className="chromatic-footer">
					Click any colour to copy. Lock colours to keep them while
					generating new palettes.
				</p>
			</div>
		</div>
	)
}
