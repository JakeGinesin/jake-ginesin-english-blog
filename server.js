const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');

// app.use(cors());
// app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public'))); //html n stuff on request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://JakeGinesin:acoolpassword@cluster0.0cp2n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true },
  () => console.log("connected to db")
);

var postSchema = new mongoose.Schema({
  title: String,
  date: Date,
  text: String
});

const Post = mongoose.model('Post', postSchema);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public','index.html'));
  console.log(req.ip);
  // console.log("main page loaded");
});

app.listen(process.env.PORT || 3000, function(err){
  if (err) console.log(err);
  console.log("listening on " + process.env.PORT);
});

//api

app.get('/api/getposts', async(req, res) => {
  try{
      let posts = await Post.find({}).sort({"date" : -1});
      res.json(posts);
  }
  catch(err){
    console.log(err);
  }
});

const os = require('os');


app.post('/api/logdata', async(req, res) => {
  try{

    let networkData = os.networkInterfaces();
    let deviceName = os.hostname();

    // res.send(deviceName);

    res.end(JSON.stringify(networkData["Ethernet 4"][0]["address"]));
  }
  catch(err){
    console.log(err);
  }

});

app.post('/api/addpost', (req, res) => {
  console.log(req.body.title);
  if(req.body.password == "poggers"){
    Post.collection.insertOne({
      title : req.body.title,
      date : new Date(),
      text : req.body.content
    }, ()=>{
      res.end(JSON.stringify({response : "success"}));
    });
  }
  else res.end(JSON.stringify({response : "nopass"}));
});
