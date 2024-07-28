require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json())
app.use(express.urlencoded());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req,res) {
//console.log(req.body)
const options = { 
  all:true, 
}; 
console.log(req.body.url.toString() + "Im here!")
dns.lookup(req.body.url.toString(),options ,(err,address) => {
  console.log(address)
})
  res.json({original_url: req.body.url, short_url: "here"})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
