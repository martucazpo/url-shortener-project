'use strict';

var express = require('express');
var mongoose = require('mongoose');
//remove if make with out database
const db = 'mongodb://localhost/urlParser';
const shortUrl = require('./models/ShortUrl');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
//this is the body parser that comes with express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({
    greeting: 'hello API'
  });
});

app.get("/shorturl", (req, res) => {
  shortUrl.find({}, (err, urls) => {
    res.send(urls);
  });
});

app.post("/api/shorturl/new", async (req,res) => {
  await shortUrl.create({ full: req.body.url, short: req.body.shortUrl });
  res.redirect('/shorturl');
});

app.get('/:shortUrl', async (req, res) => {
  const sUrl = await shortUrl.findOne({ short: req.params.shortUrl });
   res.redirect(sUrl.full);
 });

// this will need to be taken out if no database
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log('while the (mon)goose is on the loose...');
  });

app.listen(port, function () {
  console.log('Server is always just listening on port ' + port);
});