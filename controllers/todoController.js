var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Connect to the database
const uri = 'mongodb+srv://killiandunne1:<password_here>@killiancluster-gzj06.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // useUnifiedTopology: true
  client.close();
})

//Create a schema
var todoSchema = Schema({
  item: String
});
var Todo = mongoose.model('Todo', todoSchema);

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'learn to code'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = (app) => {

  app.get('/todo', (req, res) => {
    // get data from mongodb and pass it to the view
    Todo.find({}, (err, data) => {
      if (err) throw err;
      res.render('todo', {todos: data});
    });
  });

  app.post('/todo', urlencodedParser, (req, res) => {
    // get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save((err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', (req, res) => {
    // delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove((err) => {
      if (err) throw err;
      res.json(data);
    });
  });

};
