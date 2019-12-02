// index.js
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("./config/passport");
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://aktwlq:qjtemfdmlaktwlq@cluster0-shard-00-00-magbn.mongodb.net:27017,cluster0-shard-00-01-magbn.mongodb.net:27017,cluster0-shard-00-02-magbn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority');
var db = mongoose.connection;
db.once("open", function(){
		console.log("DB connected");
});
db.on("error", function(err){
		console.log("DB error: ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:"MySecret",resave:true,saveUninitialized:true}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});


// Routes
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

//Port setting
app.listen(3000, function(){
		console.log("server on! http://ec2-54-208-111-187.compute-1.amazonaws.com:3000");
});
