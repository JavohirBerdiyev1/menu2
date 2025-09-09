import { verify } from '@/lib/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify authentication
  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Ensure upload directory exists (configurable for production)
    // In production, prefer a durable absolute path (e.g., /var/www/nargile/uploads)
    const uploadDir = process.env.UPLOAD_DIR && process.env.UPLOAD_DIR.trim()
      ? process.env.UPLOAD_DIR
      : path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created uploads directory:', uploadDir);
    }
    
    // Check if directory is writable
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log('Uploads directory is writable');
    } catch (err) {
      console.error('Uploads directory is not writable:', err);
      return res.status(500).json({ message: 'Upload directory not writable' });
    }

    const form = formidable({
      multiples: false,
      maxFileSize: 1024 * 1024, // 1MB limit (matches client expectation)
      uploadDir,
      keepExtensions: true,
      filter: (part) => Boolean(part.mimetype && part.mimetype.startsWith('image/')),
      filename: (_name, _ext, part) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 10);
        const ext = path.extname(part.originalFilename || '') || '.jpg';
        // Faqat xavfsiz belgilar ishlatish
        const safeFilename = `${timestamp}_${randomString}${ext}`;
        return safeFilename;
      },
    });

    return new Promise((resolve) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Formidable error:', err);
          res.status(400).json({ message: 'Invalid form data' });
          return resolve();
        }

        // Normalize file extraction (Formidable v3 may return arrays)
        let file = files.image;
        if (Array.isArray(file)) file = file[0];
        if (!file) {
          // Try to pick first file from any field name
          const firstKey = Object.keys(files)[0];
          const maybe = firstKey ? files[firstKey] : null;
          file = Array.isArray(maybe) ? maybe[0] : maybe;
        }

        if (!file) {
          res.status(400).json({ message: 'No image file provided' });
          return resolve();
        }

        // Size/type checks
        if (typeof file.size === 'number' && file.size > 1024 * 1024) {
          res.status(400).json({ message: 'File size must be less than 1MB' });
          return resolve();
        }
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (file.mimetype && !allowed.includes(file.mimetype)) {
          res.status(400).json({ message: 'Invalid file type. Only images are allowed.' });
          return resolve();
        }

        const filePath = file.filepath || file.path;
        if (!filePath) {
          res.status(500).json({ message: 'Upload failed: missing file path' });
          return resolve();
        }

        const fileName = path.basename(filePath);
        
        // Serve via Next API to avoid static hosting issues
        let baseUrl;
        if (process.env.NODE_ENV === 'production') {
          const protocol = req.headers['x-forwarded-proto'] || 'https';
          const host = req.headers['x-forwarded-host'] || req.headers.host;
          baseUrl = `${protocol}://${host}`;
        } else {
          baseUrl = `http://localhost:${process.env.PORT || 3000}`;
        }
        const fileUrl = `${baseUrl}/api/uploads/${fileName}`;
        console.log('Uploaded file URL:', fileUrl);
        console.log('File saved to:', filePath);
        
        res.status(200).json({ 
          url: fileUrl, 
          fileName: fileName,
          message: 'File uploaded successfully' 
        });
        resolve();
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

