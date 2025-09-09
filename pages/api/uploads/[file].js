import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const { file } = req.query
  const uploadDir = process.env.UPLOAD_DIR && process.env.UPLOAD_DIR.trim()
    ? process.env.UPLOAD_DIR
    : path.join(process.cwd(), 'public', 'uploads')

  const abs = path.join(uploadDir, path.basename(String(file || '')))
  if (!fs.existsSync(abs)) {
    res.status(404).end('Not found')
    return
  }

  const ext = path.extname(abs).toLowerCase()
  const type = (
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    ext === '.png' ? 'image/png' :
    ext === '.gif' ? 'image/gif' :
    ext === '.webp' ? 'image/webp' :
    'application/octet-stream'
  )
  res.setHeader('Content-Type', type)
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  fs.createReadStream(abs).pipe(res)
}


