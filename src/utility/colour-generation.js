export const hsl_2_hex = (h, s, l) => {
	l /= 100
	const a = (s / 100) * Math.min(l, 1 - l)
	const f = (n) => {
		const k = (n + h / 30) % 12
		const colour = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
		return Math.round(255 * colour)
			.toString(16)
			.padStart(2, '0')
	}
	return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

const get_random_lightness_values = () => {
	// Option 4: Weighted random (more likely to pick balanced)
	if (Math.random() > 0.5) {
		return [70, 40]
	}
	return [
		Math.floor(Math.random() * 21 + 60), // 60-80
		Math.floor(Math.random() * 26 + 25), // 25-50
	]
}

const generate_monochromatic_palette = (hue, locked, current_palette) => {
	// If any color is locked, use its hue as the base instead of random hue
	let base_hue = hue
	for (let idx in locked) {
		if (locked[idx] && current_palette[idx]) {
			const hsl_match = current_palette[idx].hsl.match(/hsl\((\d+)/)
			if (hsl_match) {
				base_hue = parseInt(hsl_match[1])
				break // Use the first locked color's hue
			}
		}
	}

	const colours = [
		{ lightness: 95, name: 'Lightest' },
		{ lightness: 80, name: 'Light' },
		{ lightness: 65, name: 'Medium-Light' },
		{ lightness: 50, name: 'Medium' },
		{ lightness: 30, name: 'Dark' },
		{ lightness: 15, name: 'Darkest' },
	]

	return colours.map((colour, idx) => {
		if (locked[idx] && current_palette[idx]) {
			return current_palette[idx]
		}
		return {
			...colour,
			hsl: `hsl(${base_hue}, 100%, ${colour.lightness}%)`,
			hex: hsl_2_hex(base_hue, 100, colour.lightness),
			id: idx,
		}
	})
}

const generate_analogous_palette = (base_hue, locked, current_palette) => {
	let actual_base_hue = base_hue
	for (let idx in locked) {
		if (locked[idx] && current_palette[idx]) {
			const hsl_match = current_palette[idx].hsl.match(/hsl\((\d+)/)
			if (hsl_match) {
				actual_base_hue = parseInt(hsl_match[1])
				break // Use the first locked color's hue
			}
		}
	}

	// Analogous colours are 30 degrees apart on the colour wheel
	const hue1 = actual_base_hue
	const hue2 = (actual_base_hue + 30) % 360
	const hue3 = (actual_base_hue - 30 + 360) % 360

	const hues = [hue1, hue2, hue3]
	const colours = []
	const lightness_values = get_random_lightness_values()

	hues.forEach((hue, hue_idx) => {
		lightness_values.forEach((lightness, idx) => {
			const color_idx = hue_idx * 3 + idx
			if (locked[color_idx] && current_palette[color_idx]) {
				colours.push(current_palette[color_idx])
			} else {
				colours.push({
					lightness,
					name: `Color ${hue_idx + 1} - ${['Light', 'Medium', 'Dark'][idx]}`,
					hsl: `hsl(${hue}, 100%, ${lightness}%)`,
					hex: hsl_2_hex(hue, 100, lightness),
					id: color_idx,
				})
			}
		})
	})

	return colours
}

const generate_complementary_palette = (base_hue, locked, current_palette) => {
	let actual_base_hue = base_hue

	for (let idx in locked) {
		if (locked[idx] && current_palette && current_palette[idx]) {
			const hsl_match = current_palette[idx].hsl.match(/hsl\((\d+)/)
			if (hsl_match) {
				actual_base_hue = parseInt(hsl_match[1])
				break
			}
		}
	}

	// Complementary is 180° opposite on color wheel
	const hue1 = actual_base_hue
	const hue2 = (actual_base_hue + 180) % 360

	const hues = [hue1, hue2]
	const lightness_values = [30, 50, 70]
	const shade_names = ['Dark', 'Medium', 'Light']
	const colours = []

	hues.forEach((hue, hue_idx) => {
		lightness_values.forEach((lightness, idx) => {
			const color_idx = hue_idx * 3 + idx

			if (
				locked[color_idx] &&
				current_palette &&
				current_palette[color_idx]
			) {
				colours.push(current_palette[color_idx])
			} else {
				colours.push({
					lightness,
					name: `Color ${hue_idx + 1} - ${shade_names[idx]}`,
					hsl: `hsl(${hue}, 100%, ${lightness}%)`,
					hex: hsl_2_hex(hue, 100, lightness),
					id: color_idx,
				})
			}
			lightness_values.reverse()
			shade_names.reverse()
		})
	})

	return colours
}

// Generate split complementary palette with 6 colours (3 hues × 2 shades)
// Uses base hue + 2 hues that are 150° and 210° away (instead of opposite)
const generate_split_complementary_palette = (
	base_hue,
	locked,
	current_palette
) => {
	let actual_base_hue = base_hue

	for (let idx in locked) {
		if (locked[idx] && current_palette && current_palette[idx]) {
			const hsl_match = current_palette[idx].hsl.match(/hsl\((\d+)/)
			if (hsl_match) {
				actual_base_hue = parseInt(hsl_match[1])
				break
			}
		}
	}

	// Split complementary: base + 150° + 210° (instead of just 180°)
	// This creates a more balanced triangle on the color wheel
	const hue1 = actual_base_hue
	const hue2 = (actual_base_hue + 150) % 360
	const hue3 = (actual_base_hue + 210) % 360

	const hues = [hue1, hue2, hue3]
	const lightness_values = get_random_lightness_values()
	const shade_names = ['Light', 'Dark']
	const colours = []

	hues.forEach((hue, hue_idx) => {
		lightness_values.forEach((lightness, idx) => {
			const color_idx = hue_idx * 2 + idx

			if (
				locked[color_idx] &&
				current_palette &&
				current_palette[color_idx]
			) {
				colours.push(current_palette[color_idx])
			} else {
				colours.push({
					lightness,
					name: `Color ${hue_idx + 1} - ${shade_names[idx]}`,
					hsl: `hsl(${hue}, 100%, ${lightness}%)`,
					hex: hsl_2_hex(hue, 100, lightness),
					id: color_idx,
				})
			}
		})
	})

	return colours
}

// Generate triadic palette with 6 colours (3 hues × 2 shades)
// Triadic uses hues 120° apart on the color wheel
const generate_triadic_palette = (base_hue, locked, current_palette) => {
	let actual_base_hue = base_hue

	for (let idx in locked) {
		if (locked[idx] && current_palette && current_palette[idx]) {
			const hsl_match = current_palette[idx].hsl.match(/hsl\((\d+)/)
			if (hsl_match) {
				actual_base_hue = parseInt(hsl_match[1])
				break
			}
		}
	}

	// Triadic: 3 hues equally spaced 120° apart
	const hue1 = actual_base_hue
	const hue2 = (actual_base_hue + 120) % 360
	const hue3 = (actual_base_hue + 240) % 360

	const hues = [hue1, hue2, hue3]
	const lightness_values = get_random_lightness_values()
	const shade_names = ['Light', 'Dark']
	const colours = []

	hues.forEach((hue, hueIdx) => {
		lightness_values.forEach((lightness, idx) => {
			const color_idx = hueIdx * 2 + idx

			if (
				locked[color_idx] &&
				current_palette &&
				current_palette[color_idx]
			) {
				colours.push(current_palette[color_idx])
			} else {
				colours.push({
					lightness,
					name: `Color ${hueIdx + 1} - ${shade_names[idx]}`,
					hsl: `hsl(${hue}, 100%, ${lightness}%)`,
					hex: hsl_2_hex(hue, 100, lightness),
					id: color_idx,
				})
			}
		})
	})

	return colours
}

// Generate tetradic palette with 8 colours (4 hues × 2 shades)
// Tetradic uses hues 90° apart on the color wheel (a square)
const generate_tetradic_palette = (base_hue, locked, current_palette) => {
	let actual_base_hue = base_hue

	for (let idx in locked) {
		if (locked[idx] && current_palette && current_palette[idx]) {
			const hsl_match = current_palette[idx].hsl.match(/hsl\((\d+)/)
			if (hsl_match) {
				actual_base_hue = parseInt(hsl_match[1])
				break
			}
		}
	}

	// Tetradic: 4 hues equally spaced 90° apart (square on color wheel)
	const hue1 = actual_base_hue
	const hue2 = (actual_base_hue + 90) % 360
	const hue3 = (actual_base_hue + 180) % 360
	const hue4 = (actual_base_hue + 270) % 360

	const hues = [hue1, hue2, hue3, hue4]
	const lightness_values = get_random_lightness_values()
	const shade_names = ['Light', 'Dark']
	const colours = []

	hues.forEach((hue, hueIdx) => {
		lightness_values.forEach((lightness, idx) => {
			const color_idx = hueIdx * 2 + idx

			if (
				locked[color_idx] &&
				current_palette &&
				current_palette[color_idx]
			) {
				colours.push(current_palette[color_idx])
			} else {
				colours.push({
					lightness,
					name: `Color ${hueIdx + 1} - ${shade_names[idx]}`,
					hsl: `hsl(${hue}, 100%, ${lightness}%)`,
					hex: hsl_2_hex(hue, 100, lightness),
					id: color_idx,
				})
			}
		})
	})

	return colours
}

export const OPTIONS = [
	{
		key: 'monochromatic',
		name: 'Monochromatic',
		fn: generate_monochromatic_palette,
	},
	{
		key: 'analogous',
		name: 'Analogous',
		fn: generate_analogous_palette,
	},
	{
		key: 'complementary',
		name: 'Complementary',
		fn: generate_complementary_palette,
	},
	{
		key: 'split_complementary',
		name: 'Split Complementary',
		fn: generate_split_complementary_palette,
	},
	{
		key: 'triadic',
		name: 'Triadic',
		fn: generate_triadic_palette,
	},
	{
		key: 'tetradic',
		name: 'Tetradic',
		fn: generate_tetradic_palette,
	},
]
