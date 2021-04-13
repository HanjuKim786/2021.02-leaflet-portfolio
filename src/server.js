var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var url = require('url');
var request = require('request');
const cors = require('cors');

var app = express();
app.use(cors());
app.set('port', 8081);

http.createServer(app).listen(app.get('port'), function(){});

app.use('/' + express.static('public'), function(req, res, next){
});

var router = express.Router();
let key = "XHiudUotyiX6kf1gFkFGsQREn4%2FA2ATc6cV9D6vShNAimorBRn64%2BPe5yKP7aCKtHKxtQCwWcRNxdFBMS%2BP3JQ%3D%3D";
    
router.route('/getStationByPos/:x/:y/:radius').get(function(req, res){
    console.log(req.params.x+"/"+req.params.y+ "/"+req.params.radius);
    request("http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?serviceKey="+key+"&tmX="+req.params.x+"&tmY="+req.params.y+"&radius=" + req.params.radius,
        function(err, response, body){
            //console.log(body);
            res.writeHead('200', {'content-Type':'xml'});
            res.write(body);
            res.end();
        }
    );
});
app.use('/api/', router);