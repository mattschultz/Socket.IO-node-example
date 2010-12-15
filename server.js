var http = require('http'), 
    sys = require('sys'),
    io = require('socket.io'),
    url = require('url'),
    fs = require('fs'),
    path = require('path');

server = http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);
  path.exists(filename, function(exists) {  
    if(exists) {
      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          send500(res, err);
        } else {
          send200(res, file);
        }
        res.end();
      });
    } else {
      send404(res);
      res.end();
    }
  });
});

server.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');

send200 = function(res, file) {
  res.writeHead(200);
  res.write(file, "binary");
};

send404 = function(res) {
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.write("404 Not Found\n");
};

send500 = function(res, err) {
  res.writeHead(500, {"Content-Type": "text/plain"});
  res.write(err + "\n");
};

// socket.io
var socket = io.listen(server);

socket.on('connection', function(client){
  // new client
  var message = new Buffer("You have connected")
  client.send(message);
  client.on('message', function(data){ 
    sys.puts(data);
  })
  client.on('disconnect', function(){ })
});