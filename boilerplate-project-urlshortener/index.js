require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require("valid-url");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let counter = 0;
let shortURLs = {};
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  if(validUrl.isWebUri(url)) {
    shortURLs[counter] = url;
    res.json({ original_url: url, short_url: counter });
    counter++;
  }
  else {
    res.json({error: "invalid url"});
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const {shorturl} = req.params;
  const originalURL = shortURLs[shorturl];
  if(originalURL) {
    res.redirect(originalURL);
  }
  else{
    res.json({err: "URL not found"});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
