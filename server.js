const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const os = require('os');

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

var logSchema = new mongoose.Schema({
  ip: String,
  deviceName: String,
  date: Date
});

const Log = mongoose.model('Log', logSchema);

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

app.post('/api/checklogspass', async(req, res) => {
  try{
    if(req.body.password == "poggers"){
      res.end(JSON.stringify({response : "true"}));
    }
    else{
      res.end(JSON.stringify({response : "false"}));
    }
  }
  catch(err){
    console.log(err);
  }
});

//logs
app.get('/api/getlogdata', async(req, res) => {
  try{
    let logs = await Log.find({}).sort({"date" : -1});
    res.json(logs)
  }
  catch(err){
    console.log(err)
  }
});

app.post('/api/logdata', async(req, res) => {
  try{

    // if(os.hostname() != "DESKTOP-9DAP77M"){
      // let networkDataLog = os.networkInterfaces();
      // let ipLog = networkDataLog['eth0'][0]['address'];

      // let ipLog = req.headers['x-forwarded-for'];

      Log.collection.insertOne({
        ip: req.ip,
        date: new Date()
      });
    // }


  }
  catch(err){
    console.log(err);
  }
});

//posts
app.get('/api/getposts', async(req, res) => {
  try{
      let posts = await Post.find({}).sort({"date" : -1});
      res.json(posts);
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
