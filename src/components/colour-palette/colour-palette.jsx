import React from 'react'
import { Shuffle, Copy, Check } from 'lucide-react'
import './colour-palette.css'

function get_contrast_text(hex) {
	const color = hex.replace('#', '')

	const r = parseInt(color.substring(0, 2), 16)
	const g = parseInt(color.substring(2, 4), 16)
	const b = parseInt(color.substring(4, 6), 16)

	const luminance = 0.299 * r + 0.587 * g + 0.114 * b

	return luminance > 186 ? '#000000' : '#ffffff'
}

export default function ColourPalette({
	palette,
	locked,
	set_locked,
	copied_index,
	set_copied_index,
}) {
	const toggle_lock = (index) => {
		set_locked((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
		console.log(locked)
	}

	const copy_to_clipboard = (hex, index) => {
		navigator.clipboard.writeText(hex)
		set_copied_index(index)
		setTimeout(() => set_copied_index(null), 2000)
	}

	return (
		<div className="chromatic-palette">
			{palette.map((colour, idx) => (
				<div
					key={colour.id}
					className="chromatic-colour-card"
					style={{
						backgroundColor: colour.hsl,
						color: get_contrast_text(colour.hex),
					}}
					onClick={() => copy_to_clipboard(colour.hex, idx)}
				>
					<div className="chromatic-card-overlay">
						<div className="chromatic-colour-info">
							<p className="chromatic-colour-name">
								{colour.name}
							</p>
							<p className="chromatic-colour-hex">{colour.hex}</p>
						</div>

						<div className="chromatic-card-actions">
							<button
								onClick={(e) => {
									e.stopPropagation()
									e.preventDefault()
									toggle_lock(idx)
								}}
								className={`chromatic-lock-btn ${locked[idx] ? 'locked' : ''}`}
							>
								<svg
									className="chromatic-lock-icon"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									{locked[idx] ? (
										<path
											fillRule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										/>
									) : (
										<path
											fillRule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											opacity="0.5"
										/>
									)}
								</svg>
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation()
									copy_to_clipboard(colour.hex, idx)
								}}
								className="chromatic-copy-btn"
							>
								{copied_index === idx ? (
									<Check className="chromatic-copy-icon chromatic-copy-icon-success" />
								) : (
									<Copy className="chromatic-copy-icon" />
								)}
							</button>
						</div>
					</div>

					<div className="chromatic-card-display">
						<p className="chromatic-hex-text">{colour.hex}</p>
					</div>
				</div>
			))}
		</div>
	)
}
