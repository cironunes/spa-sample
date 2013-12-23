var restify = require('restify');
var mongoose = require('mongoose');
var Schema;

mongoose.connect('mongodb://localhost/items');
Schema = mongoose.Schema;

var itemSchema = new Schema({
	name: String,
	price: Number
});

mongoose.model('Item', itemSchema);
var Item = mongoose.model('Item');

var server = restify.createServer({
  name: 'spa-sample',
  version: '1.0.0'
});
server.use(restify.CORS({
	origins: ['*']
}));
server.use(restify.fullResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/items', function (req, res) {
	Item.find(function(err, items) {
		res.send(200, items);
	});
});

server.get('/item/:id', function (req, res) {
	Item.find({_id: req.params.id}, function(err, item) {
		if (!err) {
			res.send(200, item);
		}
	});
});

server.post('/items', function (req, res) {
	var item = new Item();
	item.name = req.params.name;
	item.price = req.params.price;

	item.save(function(err) {
		if (!err) {
			res.send(201, req.body);
		}
	});
});

server.put('/item/:id', function (req, res) {
	Item.find({_id: req.params.id}, function(err, item) {
		if (!err) {
			item[0]['name'] = req.params.name || item.name;
			item[0]['price'] = req.params.price || item.price;
			item[0].save();
			res.send(200);
		}
	});
});

server.del('/item/:id', function (req, res) {
	Item.remove({_id: req.params.id}, function(err) {
		if (!err) {
			res.send(200);
		}
	});
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});