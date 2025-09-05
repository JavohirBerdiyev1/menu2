const fs = require('fs');
const path = require('path');

function setupServer() {
  try {
    // Uploads papkasini yaratish
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory:', uploadsDir);
    } else {
      console.log('✅ Uploads directory already exists:', uploadsDir);
    }
    
    // File permissions ni tekshirish
    try {
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      console.log('✅ Uploads directory is writable');
    } catch (err) {
      console.error('❌ Uploads directory is not writable:', err);
      process.exit(1);
    }
    
    // .gitkeep faylini yaratish
    const gitkeepPath = path.join(uploadsDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '# Bu fayl uploads papkasini git\'da saqlash uchun\n# Rasm fayllar avtomatik yaratiladi');
      console.log('✅ Created .gitkeep file');
    }
    
    console.log('🎉 Server setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Server setup failed:', error);
    process.exit(1);
  }
}

setupServer();
