require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')
const mongoose = require('mongoose');
const { type } = require('express/lib/response');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json())
app.use(express.urlencoded());

mongoose.connect(process.env.MONGO_URI);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


const InputRecord = new mongoose.Schema({
  url:{
    type: String
  },
  id: Number
});

const Model = mongoose.model("Model", InputRecord);

app.post('/api/shorturl', function(req,res) {
//console.log(req.body)
const options = { 
  all:true, 
}; 

let record_to_insert = new Model({
  url: req.body.url.toString(),
  id: parseInt(Math.random() * 999999)
})

record_to_insert
   .save()
   .then((doc) => {
    console.log(doc)
   })
   .catch((err) => {
    console.log(err)
   })

console.log(req.body.url.toString() + "Im here!")
dns.lookup(req.body.url.toString(),options ,(err,address) => {
  console.log(address)
})
  res.json({original_url: req.body.url, short_url: "here"})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
