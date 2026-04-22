import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const build_path = path.join(__dirname, 'dist')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(build_path))

app.get(/.*/, (req, res) => {
	res.sendFile(path.join(build_path, 'index.html'))
})

app.listen(PORT, () => {
	console.log(`Server listening on:\nhttp://localhost:${PORT}`)
})
