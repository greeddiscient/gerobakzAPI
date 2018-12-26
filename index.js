// server.js
const express = require('express');
const path = require('path');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const dburl             = "mongodb://djurus:djurus710@ds117423.mlab.com:17423/heroku_x0f6x9g5"


MongoClient.connect(dburl, (err, db) => {
  var app = express();
  app.use(bodyParser.json());

  // API routes
  //
  //
  app.get('/api/orders/',(req,res)=>{
    var obj=[];
    db.collection('orders').find({}, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {

        result.each(function(err, docs){
            console.log("item", docs);

            if (docs == null){
                res.send(obj);
            }
            obj.push(docs);

        });

      }
    });
  })
  app.post('/api/new_order/',(req,res)=>{
    var query = req.body
    console.log(req.body);

    db.collection('orders').insert(query, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
        console.log(result);
      }
    });
  })


  app.post('/api/login', (req, res) => {
    db.collection('users').findOne({username: req.body.username,password: req.body.password}, (err, result) => {
      if (err) {
        res.send({'failed': 'login'})
      } else {
        if(result===null){
          res.send({'failed': 'login'})
        }
        else{
          console.log(result)
          res.send(result)
        }
      }
    });
  });


  app.use('/',express.static(path.resolve(__dirname, 'build')));

  // Always return the main index.html, so react-router render the route in the client
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
  const PORT = process.env.PORT || 9000;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });

})
