const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Define a route to handle image uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  res.status(200).json({ message: 'Image uploaded successfully' });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
