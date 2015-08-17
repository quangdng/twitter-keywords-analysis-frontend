/*'Group 21 - COMP90024 Cluster and Cloud Computing'*/

// Core Elements of Server
var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
var http = require('http');
var request = require('request');

// Configuration on ports and public file serving mechanism
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');
app.use(require('body-parser')());

// Set up handlebars template vview engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Routing
app.get('/', function(req, res){
    res.render('index');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n'; res.send(s);
});


app.post('/home', function(req, res){
    res.render('home', {
        keyword: req.body.keyword
    });
});

app.get('/home', function(req, res){
    res.redirect('/');
});

// API Request Handling
// Return JSON for suburbs
app.get('/api/suburbs/:keyword', function(req, res, next) {

    request('http://115.146.95.184:5984/cloud_computing/_design/application/_view/mainview?startkey=[%22' + req.params.keyword
        +'%22]&endkey=[%22' + req.params.keyword + '%22,{}]&group_level=3',
        function ( error, response, body) {
        if (!error && response.statusCode == 200)
        {
            var json = JSON.parse(body);
            var result = {};

            for (i = 0; i < json.rows.length; i++) {
                //console.log(json.rows[i].key);
                result[json.rows[i].key[2]] = {Negative: 0, Neutral:0, Positive:0};
            };

            var total = 0;
            for (i = 0; i < json.rows.length; i++) {
                //console.log(json.rows[i].key);
                result[json.rows[i].key[2]][json.rows[i].key[1]] = json.rows[i].value;
                total += json.rows[i].value;
            };
            res.json(result);
        }
        else
        {
            res.send(404);
        }
    });
});

// Return JSON for country
app.get('/api/country/:keyword', function(req, res, next) {

    request('http://115.146.95.184:5984/cloud_computing/_design/application/_view/mainview?startkey=[%22' + req.params.keyword
        +'%22]&endkey=[%22' + req.params.keyword + '%22,{}]&group_level=2',
        function ( error, response, body) {
            if (!error && response.statusCode == 200)
            {
                var sg = JSON.parse(body);
                var singapore = {};
                var sum = 0;
                for (i = 0; i < sg.rows.length; i++) {
                    singapore[sg.rows[i].key[1]] = sg.rows[i].value;
                    sum += sg.rows[i].value;
                }
                singapore.Total = sum;
                res.json(singapore);
            }
            else
            {
                res.send(404);
            }
        });
});

// Return JSON for frequency count
app.get('/api/:keyword', function(req, res, next) {

    request('http://115.146.95.184:5984/cloud_computing/_design/application/_view/mainview?startkey=[%22' + req.params.keyword
        +'%22]&endkey=[%22' + req.params.keyword + '%22,{}]&group_level=1',
        function ( error, response, body) {
            if (!error && response.statusCode == 200)
            {
                var json = JSON.parse(body);
                var result = {};
                result.keyword = json.rows[0].key[0];
                result.frequency = json.rows[0].value;
                res.json(result);
            }
            else
            {
                res.send(404);
            }
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

// Scale server based on demand
function startServer() { http.createServer(app).listen(app.get('port'), function(){
    console.log( 'Express started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.' );
});
}
if(require.main === module){
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function // to create server
    module.exports = startServer;
}