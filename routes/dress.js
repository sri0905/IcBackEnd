const express = require('express')
const multer = require('multer');
const path = require('path');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Dresses = require('../model/Dress');
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
  
  const Color = JSON.parse(color)
  try {
    const dress = new Dresses({
      image: imageUrl,
      dressType: dressType,
      brand: brand,
      size: size,
      color: {name:Color.name, hex:Color.hex}
    });
    
    await dress.save();
    console.log('File uploaded successfully:', req.file.filename);
    res.status(200).send('File uploaded successfully');
    
  } catch (error) {
    console.log("error storing dress: ", error)
  }   
});



//api to get all the dresses--------------------------------------------------------------------------------------------------------
router.post('/getAllUploads', async (req, res) => {
  
  const dresses = await Dresses.find();
  if (dresses.length === 0) { return res.status(404).send("No dressess in your collection, Please add a dress") }
  res.json(dresses)
})

//api to delete dress----------------------------------------------------------------------------------------------------------------
router.delete("/deleteDress/:id", async (req, res) => {
  try {
    const dressId = req.params.id
    const dress = await Dresses.findById(dressId)
    if (!dress) {
      res.status(404).send("Invalid Id")
    }
    await dress.deleteOne()
    res.status(200).send("Dress deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
} )

//api to fetch a single dress --------------------------------------------------------------------------------------------------
router.post("/dressDetails/:id", async(req, res)=>{
  try {
    const dressId = req.params.id
    const dress = await Dresses.findById(dressId)
    if (!dress){ return res.status(404).send("Dress not found")}
    res.send(dress)
  } catch (error) {
    res.status(400).send("Internal Server Error")
  }
} )

//api to fetch types of dresses
router.post("/dressTypes", async(req, res)=>{
  try {
    const dressTypes  = await Dresses.distinct('dressType')
      res.json({dressTypes})
  } catch (error) {
    res.status(400).send("Internal Server Error")
  }
})


//api to generate random dress
router.post('/generateARandomDress', upload.none(), [
], async (req, res) => {
  try {
    const types = req.body
    let generatedDresses = [];
    await Promise.all(types.map(async(type, index)=>{
      const dresses = await Dresses.find({dressType: type})
      const randomNumber = Math.floor(Math.random() * (((dresses.length)-1)-0) ) + 0
      console.log(randomNumber)
      generatedDresses.push(dresses[randomNumber]) 
      console.log(generatedDresses)
    }))
    res.status(200).json({generatedDresses});
    generatedDresses=[]
    
  } catch (error) {
    console.log("error storing dress: ", error)
  }   
});
module.exports = router
