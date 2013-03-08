var deferred = require("deferred");
var jsdom = require("jsdom").jsdom;
var fs = require("fs");

var stub_html = fs.readFileSync("./public/stub.html").toString();

function renderPage() {
    var def = deferred();
    try {
        var doc = jsdom(stub_html, null, {
            'url': 'http://127.0.0.1:3000/stub.html'
        });
        var ww = doc.createWindow();
        ww.console = console;
        ww.browzooRenderInstance = {};
        ww.browzooRenderInstance.done = function() {
            def.resolve(ww);
        }
        setTimeout(function() {
            if (ww.document.errors) {
                for (var i in ww.document.errors) {
                    console.error(ww.document.errors[i].data.error);
                }
            }
        }, 100)
    } catch (e) {
        def.resolve(e);
    }
    return def.promise;
}


var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/index.html', function(req, res) {
    renderPage().then(function(ww) {
        if (ww.document.errors && ww.document.errors.length > 0) {
            console.log(ww.document.errors.length);
        }
        res.set('Content-Type', 'text/html');
        res.send(ww.document.innerHTML);
    }, function(err) {
        console.log(err);
        res.set('Content-Type', 'text/plain');
        res.statusCode = 500;
        res.send('Failed');
    }).end();
});

app.listen(3000);
