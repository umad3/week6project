var express = require('express');//Import the express libraries to make the app use express
var app = express(); //Making the app use express 
var bodyParser = require('body-parser');//Import the body parser libraries so you can use that middleware
var mongodb = require('mongodb'); // importing mongodb
let db;
app.engine('html', require('ejs').renderFile);//Setting the app engine to the ejs
app.set('view-engine', 'html');//Initializing the view engine for the application so it can render the html files
app.use(express.static('css'));//Allow the use of a css file from this folder for styling the html pages
app.use(express.static('images'));//Allow the use of images from this folder so they can be rendered such as the logo in the top left of your app
app.use(bodyParser.urlencoded({ //Parse the body of the url response and be able to encode the url so it can be recognized in the browser 
    extended: false //Don't use the extended view
}));

const MongoClient = mongodb.MongoClient//creating the client that will be used to create the connection 
const Task = require('./models/Task');//Explained above
let url = 'mongodb://127.0.0.1:27017/';//Setting the mongodb url to connect to. 127.0.0.1 is the same as saying localhost, and 27017 is the default mongodb port number to connect to/ In my case my db is called fit2095db so you can change it accordingly
 MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log(err) // Prints out an error if connection fails
    }
    else {
        console.log ('Connection successful');
        db = client.db('fit2095db'); // Creates a new database
        db.createCollection('Tasks'); //Creates a new collection(table)
    }
 })


app.get('/', function (req, res) { //This is used render the index.html page if nothing follows the / in the url
    res.render('index.html', { username: 'Unathi' }); //The username it will display is guest. This username value is passed to the index.html page when it is rendered
});

app.post('/newtask', function (req, res) {//The newtask router uses the app.post method because data is being written to the database
        let task1 = { //Creating a new task based on the Task model in the models folder
             
            name: req.body.taskName, //The task name is pulled from the req url when the form is submitted
            assign_To: req.body.assignTo, //The task is assigned to the developer matching the ID above
            due_Date: req.body.taskDue, //The due date is pulled the same way as the task name 
            status: req.body.taskStatus, //Status is done the same way
            description: req.body.taskDesc //Same way
        }; 
        db.collection('Tasks').insertOne(task1); // inserts new record into collection

        res.redirect('/listtask');//It then redirects you to the current list of tasks as it should
    });


app.get('/listtask', function (req, res) { //This just directs you to the listtask.html page
    db.collection('Tasks').find({}).toArray((err, data) =>  { // takes all the info from the collection & converts it toan array format
        res.render('listtask.html', {taskdb: data});//passes 'array contents' to the table
    })
});

app.get('/newtask', function (req, res) {//This is to route you to the newtask.html page
    res.render('newtask.html', {}); //Nothing is passed in this case as you can see
});

app.post('/deleteTask', function (req, res) {//Again this uses the post method because the data is being manipulated
    let id = req.body.taskID; //Declaring an id variable and assigning the ID that you will be looking for to delete that doc as the value
    db.collection('Tasks').deleteOne({_id: id}, (err, obj) => {

    }); //Take the given ID and delete the task assuming no errors are found
    res.redirect('/listtask');//Redirect to the listtask.html page as it should
});
app.get('/deleteTask', function (req, res) {
    res.render('deleteTask.html', {});
});

app.get('/update', function (req, res) {
    res.render('update.html', {});
});


app.post('/update', function (req, res) {//A task is being updated so again the post method is required
    let id = req.body.taskID; //Get the task ID you want to update and assign it to the new variable id
    let status = req.body.taskStatus; //Get the status of the task matching that ID and assign it to this variable
    db.collection('Tasks').updateOne({ _id: id }, { $set: { 'status': status } }, function (err, docs) { }); //Update only the desired document in the database based on the ID
    res.redirect('/listtask');//Redirect to listtask.html as it should
});

app.get('/deleteAll', function (req, res) {
    res.render('deleteAll.html', {});
});

app.post('/deleteAll', function (req, res) {//Delete all the tasks currenty in the database
    db.collection('Tasks').deleteMany({ 'status': 'Complete' }, function (err, docs) { });//Now we use the deleteMany because all the tasks are being deleted as long as they have a status saying Complete as shown in that condition
    res.redirect('/listtask');
});


app.listen(8080);
console.log('Running');