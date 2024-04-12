
const Dresses = require('../model/Dress');


const deleteDress =async (req, res) => {
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
  }

  module.exports = deleteDress