require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')
const mongoose = require('mongoose');
const { type } = require('express/lib/response');
const { url } = require('inspector');
const { json } = require('body-parser');
const { Console } = require('console');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json())
app.use(express.urlencoded());

mongoose.connect(process.env.MONGO_URI);

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


const InputRecord = new mongoose.Schema({
  url: {
    type: String
  },
  id: Number
});

const Model = mongoose.model("Model", InputRecord);

app.post('/api/shorturl', function (req, res) {
  //console.log(req.body)
  const options = {
    all: true,
  };

  async function saveAndFindRecord(req) {
    try {
      const recordToInsert = new Model({
        url: req.body.url.toString(),
        id: parseInt(Math.random() * 999999)
      });
      
      const URLstring = req.body.url

      console.log(URLstring)

      const URLisValid = (url) => {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i.test(url);
      };
    

     if(URLisValid(URLstring)){
      console.log("running formula")
      const recordToInsert = new Model({
        url: req.body.url.toString(),
        id: parseInt(Math.random() * 999999)
      });
      
      const savedDoc = await recordToInsert.save();
      console.log('Saved Document:', savedDoc);
     } else {
      res.send({ error: 'invalid url' })
     }

      

      const foundDoc = await Model.findOne({ url: req.body.url });
      if (foundDoc) {
        console.log('Found Document:', foundDoc);
        res.json({
          "original_url": foundDoc.url,
          "short_url": foundDoc.id
        })
      } else {
       res.json({ error: 'invalid url' })
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

app.get("/api/shorturl/:urlId", (req, res) => {

  const options = {
    all: true,
  };

  async function routeById(req) {
    try {
      const { urlId } = req.params;

      // console.log("urlId: " + JSON.stringify(urlId))

      //const newObjectId = new mongoose.Types.ObjectId(urlId);

      const numberId = JSON.parse(urlId);
      { url: req.body.url }
      console.log(numberId)

      const routeByUrl = await Model.findOne({ id: Number(numberId) });

      if (routeByUrl) {
        console.log("Found record: ", routeByUrl);
        res.redirect(routeByUrl.url);
      } else {
        console.log("Found record: ", routeByUrl);
        console.log('that didnt work')
      }
    } catch (err) {
      console.error('Error by console: ', err)
    }

  }

  routeById(req);

})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
