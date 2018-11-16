// add the http module to create the server
var http = require('http');
// add the url model to deal with url
var url = require('url');
// add the fs model to deal with file
var fs = require('fs');
// add the data base file
var dbConnection = require('./db');




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
// setup the listen
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
    var report = '';
    var data = fs.readFile('../text.txt', 'utf8', function(err, data) {
      if (err) {
        report = report + '***cant recived the data from the text***'
        console.log('can not read message from the text ')
        // to get the data from database
        var query = `select * from messages9`
        dbConnection.db.query(query, function(err, result) {
          if (err) {
            staticCode = 404;
            console.log('can not get the data from database')
            report = report + '***can not get the data from database***'
            // send the report to the client in error case 404
            response(res, headersText, report)
            // if you get the data from the database
          } else if (result) {
            var data = readDb(result);
            console.log(data);
            data = JSON.stringify(data)
            console.log(data);
            response(res, headersJson, data)
          }


        })
      } else {
        report = report + '***the data has been recived from the text***'
        staticCode = 200;
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
      var report = ''
      fs.appendFile('../text.txt', data + "\n", function(err) {
        if (err) {
          console.log('cant write in the text file');
          report = report + '***cant access the storage text server ERROR ***'
          //response(res, headersText, 'cant access the storage text server ERROR')
        } else {
          console.log('the message has been saved in the text');
          report = report + '***the message has been saved in the text***'
          //response(res, headersText, 'the message has been saved')
        }
      })
      // to add the data to database
      //create the query
      data = JSON.parse(data);
      var query = `insert into messages values(null,\"${data}\")`
      //excute the query
      dbConnection.db.query(query, function(err, result) {
        if (err) {
          console.log('cant insert into DataBase ERROE');
          report = report + '***cant insert into DataBase ERROE***'
        } else if (result) {
          console.log('the message has been inserted to DataBase');
          report = report + '***the message has been inserted to DataBase***'
          // send the report to the client
          response(res, headersText, report);
          console.log(report);
        }
      })


    })
  }
}


// to collect the data
var collection = function(req, res, callback) {
  var coll = '';
  req.on('data', function(chunk) {
    coll = coll + chunk;
  })
  req.on('end', function() {
    callback(coll)
  })

}

// to send the data
function response(res, headersHtml, data) {
  res.writeHead(staticCode, headersHtml);
  res.write(data);
  res.end();
}

// to reade the database result
function readDb(data) {
  data.sort(function(a, b) {
    return a.id - b.id
  })
  console.log('DATABASE : ', data);
  var result = [];
  data.forEach(function(value, index) {
    result.push('\"' + value.data + '\"')
  })
  console.log('DATABASE after  : ', result);
  return result
}
