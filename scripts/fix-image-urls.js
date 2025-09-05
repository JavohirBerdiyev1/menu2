const fs = require('fs');
const path = require('path');

// Mavjud rasm fayllarini tekshirish va noto'g'ri nomlarni to'g'rilash
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

function fixImageFilenames() {
  try {
    const files = fs.readdirSync(uploadsDir);
    
    files.forEach(file => {
      const oldPath = path.join(uploadsDir, file);
      const stats = fs.statSync(oldPath);
      
      if (stats.isFile()) {
        // Fayl nomida maxsus belgilar bor-yo'qligini tekshirish
        const hasSpecialChars = /[^a-zA-Z0-9._-]/.test(file);
        
        if (hasSpecialChars) {
          // Yangi xavfsiz nom yaratish
          const ext = path.extname(file);
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 10);
          const newName = `${timestamp}_${randomString}${ext}`;
          const newPath = path.join(uploadsDir, newName);
          
          console.log(`Renaming: ${file} -> ${newName}`);
          fs.renameSync(oldPath, newPath);
        }
      }
    });
    
    console.log('Image filename fixing completed!');
  } catch (error) {
    console.error('Error fixing image filenames:', error);
  }
}

fixImageFilenames();
