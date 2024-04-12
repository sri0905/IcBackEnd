const express = require('express')
const multer = require('multer');
const path = require('path');
const router = express.Router()
const Vibrant = require('node-vibrant');
const colorNamer = require('color-namer');
const { body, validationResult } = require('express-validator');
const ColorNamer = require('color-namer');
const Dresses = require('../model/Dress');
const getImageColor = require('get-image-colors')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, (file.originalname));
  }
});

const upload = multer({ storage: storage });
router.post('/upload', upload.single('image'), [
  body('dressType').notEmpty().withMessage('Dress type is required.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  const { dressType, brand, size, color } = req.body;
 
  const Vibrant = require('node-vibrant');
  try {
    const vibrant = new Vibrant(`uploads/${req.file.filename}`);
    vibrant.getPalette(async (err, palette) => {
      if (err) {
        console.error('Error extracting color palette:', err);
        return res.status(500).send('Internal Server Error');
      }

      const dominantColorHex = palette.Vibrant.getHex();
      console.log(dominantColorHex);

      

      const dress = new Dresses({
        image: imageUrl,
        dressType: dressType,
        brand: brand,
        size: size,
        colorName:color,
        colorHex: dominantColorHex
      });

      await dress.save();
      console.log('File uploaded successfully:', req.file.filename);
      res.status(200).send('File uploaded successfully');
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
});


//api to get all the dresses--------------------------------------------------------------------------------------------------------
router.post('/getAllUploads', async (req, res) => {
  const dresses = await Dresses.find();
  if (dresses.length === 0) { return res.status(404).send("No dressess in your collection, Please add a dress") }
  res.json(dresses)
})

//api to delete dress----------------------------------------------------------------------------------------------------------------
router.delete("/deleteDress/:id", require('./deleteDress') )

//api to fetch a single dress --------------------------------------------------------------------------------------------------
router.post("/dressDetails/:id", async(req, res)=>{
  try {
    const dressId = req.params.id
    const dress = await Dresses.findById(dressId)
    if (!dress){ return res.status(404).send("Dress not found")}
    res.send(dress)
  } catch (error) {
  }
} )

module.exports = router
