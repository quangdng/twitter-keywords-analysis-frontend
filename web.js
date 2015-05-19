/**
 * Created by Quang Nguyen on 1/05/2015.
 */

var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();


app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');
app.use(require('body-parser')());

// Test show condition
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n'; res.send(s);
});

app.get('/about', function(req, res){
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: fortune.getFortune()});
});

app.post('/home', function(req, res){
    res.render('home', {
        keyword: req.body.keyword
    });
});

// custom 404 page
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});