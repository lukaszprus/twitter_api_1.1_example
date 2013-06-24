var http = require("http");
var https = require("https");

var options = {
    host: 'api.twitter.com',
    path: '/oauth2/token',
    method: 'POST',
    headers: {
        "Authorization": "Basic " + new Buffer(":").toString("base64")
    }
};

var options2 = {
    host: 'api.twitter.com',
    path: '/1.1/statuses/user_timeline.json?count=1&screen_name=twitterapi',
    method: 'GET'
};

http.createServer(function (request, response) {
    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        var responseData = "";
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            responseData += chunk;
        });

        res.on('end', function () {
            var access_token = JSON.parse(responseData).access_token;
            console.log("\n\nAccess token: " + access_token);

            options2.headers = {
                "Authorization": "Bearer " + access_token.toString("base64")
            };

            var responseData2 = "";
            var req2 = https.request(options2, function (res) {
                res.on('data', function (chunk) {
                    responseData2 += chunk;
                });

                res.on('end', function () {
                    console.log(responseData2);
                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    response.end(responseData2);
                });
            });

            req2.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });

            req2.end();
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('grant_type=client_credentials');
    req.end();
}).listen(8080);