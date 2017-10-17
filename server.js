var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var router = express.Router();
var User = require('./public/models/user');

mongoose.connect('mongodb://localhost/vehicleapp');
var Schema = mongoose.Schema;

var VehicleDataSchema = new Schema({
	name: String,
	category: String,
	cost: Number,
	date: String,
	description: String
});
mongoose.model('VehicleData', VehicleDataSchema);
var VehicleData = mongoose.model('VehicleData');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
app.get('/', function(req, res){
	return res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/', function(req, res, next){
	if(req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf){
			
			var userData = {
				email: req.body.email,
				username: req.body.username,
				password: req.body.password,
				passwordConf: req.body.passwordConf
			}
			
			User.create(userData, function(err, user){
				if(err){
					return next(err);
				}
				else{
					return res.redirect('home.html');
				}
			});
			console.log('hi');
		}
		console.log(req.body.email);
		console.log(req.body.username);
		console.log(req.body.password);
		console.log(req.body.passwordConf);
		console.log("hi");
});

app.get('/data', function(req, res){
	res.sendFile(__dirname + '/public/data.html');
});

app.get('/api/vehicledatas', function(req,res){
	VehicleData.find(function(err, docs){
		docs.forEach(function(item){
			console.log('received a GET request for _id ' + item._id);
		});
		res.send(docs);
	});
});

app.post('/api/vehicledatas', function(req,res){
	console.log('received a POST request');
	for(var key in req.body){
		console.log(key + ': ' + req.body[key]);
	}
	var vehicleData = new VehicleData(req.body);
	vehicleData.save(function(err,doc){
		res.send(doc);
	});
});

app.delete('/api/vehicledatas/:id', function(req,res){
	console.log('received a DELETE request for _id ' + req.params.id);
	VehicleData.remove({_id: req.params.id}, function(err){
		res.send({_id: req.params.id});
	});
});

app.put('/api/vehicledatas/:id', function(req,res){
	console.log('received an UPDATE request for _id: ' + req.params.id);
	VehicleData.update({_id: req.params.id}, req.body, function(err){
		res.send({id: req.params.id});
	});
});

var port = 3000;

app.listen(port);
console.log('server on ' + port);