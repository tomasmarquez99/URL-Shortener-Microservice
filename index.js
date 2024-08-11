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

async function saveAndFindRecord(req) {
  try {
    const recordToInsert = new Model({
      url: req.body.url.toString(),
      id: parseInt(Math.random() * 999999)
    });

    const savedDoc = await recordToInsert.save();
    console.log('Saved Document:', savedDoc);

    const foundDoc = await Model.findOne({ url: req.body.url });
    if (foundDoc) {
      console.log('Found Document:', foundDoc);
      res.json({
        "original_url": foundDoc.url,
        "short_url": foundDoc.id
        })
    } else {
      console.log('No document found with that URL.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

saveAndFindRecord(req);
   
   

//dns.lookup(reply.url,options ,(err,address) => {
 // console.log(address)
//})
 // res.json({original_url: reply._conditions.url, short_url: reply._conditions.id })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
