var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');

// Create Server
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

// Static files for frontend
app.set('views', path.join(__dirname, 'static'));
app.use('/', express.static(path.join(__dirname, 'static')));

// Configs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.disable('x-powered-by');

// CORS
app.use(function (req, res, next) {
	res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.append('Access-Control-Allow-Credentials', 'true');
	res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE']);
	res.append('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Admin-Authorization');
	next();
});
app.enable('trust proxy');

// Start server
server.listen(port, function () {
	console.log('Server running on port ' + port);
});
