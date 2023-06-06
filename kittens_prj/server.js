const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Define a route to handle image downloads
app.get('/api/download', async (req, res) => {
  const imageUrl = req.query.url;
  const imageFilename = path.basename(imageUrl);
  const imagePath = path.join(__dirname, imageFilename);

  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(imagePath));
    response.data.on('end', () => {
      res.download(imagePath, 'kitten.jpg', (error) => {
        if (error) {
          console.error('Error downloading image:', error);
        }
        fs.unlinkSync(imagePath); // Remove the temporary file
      });
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
