const express = require('express');
const cors = require('cors');
const Dresses = require('./model/Dress');
const connectToMongoDb = require('./db');
const app = express();
const PORT = 5000;
const path = require('path');

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//dress
app.use("/", require('./routes/dress'))

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await connectToMongoDb(); // Connect to MongoDB
   
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});
