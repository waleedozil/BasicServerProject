var http = require('http');
var url = require('url');
var fs = require('fs');
// first hedar to send json
var headersJson = {
  'access-control-allow-origin': '*',
  'Content-Type': 'application/json'
}
//second heder to send HTML
var headersHtml = {
  'access-control-allow-origin': '*',
  'Content-Type': 'text/html'
}
// thired hedear for text
var headersText = {
  'access-control-allow-origin': '*',
  'Content-Type': 'text/plain'
}
// ip and port and code
var port = '3000'
var ip = '127.0.0.1'
var staticCode = 200;

//create server
var server = http.createServer(function(req, res) {
  // get request
  if (req.method === "GET") {
    roter1(req, res);
    // post request
  } else if (req.method === "POST") {
    roter2(req, res);
  } else {
    console.log(req.method);
  }

})

server.listen(port, ip);
console.log('listen' + ip + ' and port ' + port);



// Roter 1 to handle GET request

var roter1 = function(req, res) {
  // request ip
  if (req.url === '/') {
    var data = fs.readFile('../html2.html', 'utf8', function(err, data) {
      if (err) {
        staticCode = 404;
        var error = 'The Web under mentenance'
        response(res, headersText, error)
      } else {
        staticCode = 200;
        response(res, headersHtml, data)
      }
    })
    // request message
  } else if (req.url === '/message') {
    var data = fs.readFile('../text.txt', 'utf8', function(err, data) {
      if (err) {
        console.log('can not read message from file ')
      } else {
        staticCode = 200;
        //data = JSON.parse(data);
        var array = data.split('\n')
        array = JSON.stringify(array)
        response(res, headersJson, array)

      }

    })
  }
}
// Roter 2 to handle POST request
var roter2 = function(req, res) {
  if (req.url === '/message') {
    //write file with clear fs.writeFile(path,data,function(err){})
    // write without delete fs.appendFile('../web/archives/sites.txt',url+"\n",function(err){})
    collection(req, res, function(data) {
      fs.appendFile('../text.txt', data + "\n", function(err) {
        if (err) {
          console.log('cant write in the text file');
          response(res, headersText, 'cant access the storage server ERROR')
        } else {
          response(res, headersText, 'the message has been saved')
        }
      })
    })
  }
}



var collection = function(req, res, callback) {
  var coll = '';
  req.on('data', function(chunk) {
    coll = coll + chunk;
  })
  req.on('end', function() {
    callback(coll)
  })


}









function response(res, headersHtml, data) {
  res.writeHead(staticCode, headersHtml);
  res.write(data);
  res.end();
}
