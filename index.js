const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Dresses = require('./model/Dress');
const connectToMongoDb = require('./db');

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors());

// Configure multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original filename
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Express Validator middleware for request validation
const { body, validationResult } = require('express-validator');

app.post('/upload', upload.single('image'), [
  body('dressType').notEmpty().withMessage('Dress type is required.'),
  body('brand').notEmpty().withMessage('Brand is required.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  const { dressType, brand, size } = req.body;

  try {
    // Create a new Dress document in MongoDB
    const dress = new Dresses({
      image: imageUrl,
      dressType: dressType,
      brand: brand,
      size: size
    });

    await dress.save(); // Save dress document to MongoDB

    res.status(200).send('File uploaded successfully: ' + req.file.filename);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await connectToMongoDb(); // Connect to MongoDB
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});
