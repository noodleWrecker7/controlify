/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 08/08/19 20:44
 ******************************************************************************/
const http = require('http');
const requester = require('request');
var express = require('express');
var app = express();
const fs = require('fs');

let authtext = null;

function routes(router)  {
    /** save a Black Panther character */
    router
        .route('/request-token')
        .post(getAccessToken)
}

routes(express.Router())

/*requester("/appauth.txt", function (err, resp, body) {
    console.error('error:', err); // Print the error if one occurred
    console.log('statusCode:', resp && resp.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    authtext = body;
})*/

fs.readFile("appauth.txt", "utf8", (err, data) => {
    if (err) throw err;
    authtext = data;
    console.log("Authtext = " + authtext);
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Listening on ${port}")
})

function getAccessToken(req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
    });
    console.log("Received body: " + req.body);

    let data = null;
    console.log("Incoming request, type:" + req.method)
    console.log("headers: " + req.headers)

    let body = "grant_type=authorization_code&" +
        "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&" +
        "code=" + req.body + "&" +
        authtext;
    console.log("Body to spotify: " + body)
    let clientID = authtext.split("&")[0].split("=")[1]
    let clientSecret = authtext.split("&")[1].split("=")[1]
    requester({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://accounts.spotify.com/api/token',
        //body: body,
        data: {
            grant_type: 'authorization_code',
            redirect_uri: 'https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&',
            code: incomingBody,
            client_id: clientID,
            client_secret: clientSecret
        },
        method: 'POST'
    }, function (err, resp, body) {
        console.log("Received access_token")
        //it works!
        //data = this.response;
        //response.statusCode = 200;
        //response.setHeader('Content-Type', 'application/json');
        //response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*"
        });
        res.write(body);
        res.end();
        console.log("complete");
    });


    next();
}


/*
http.createServer((request, response) => {
//app.get("/request-token", function (request, response) {
    console.log("Request Received")
    let data = null;
    console.log("Incoming request, type:" + request.method)
    console.log("headers: " + request.headers)
    console.log(request.body);
    let incomingBody = [];
    request.on('error', (err) => {
        console.error(err);
    })
    request.on('data', (chunk) => {
        incomingBody.push(chunk);
        console.log("data chunk: " + chunk)
    })
    request.on('end', () => {
        incomingBody = Buffer.concat(incomingBody).toString();
        console.log("code should be: " + incomingBody);
    })

    let body = "grant_type=authorization_code&" +
        "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&" +
        "code=" + incomingBody + "&" +
        authtext;
    console.log("Body to spotify: " + body)
    let clientID = authtext.split("&")[0].split("=")[1]
    let clientSecret = authtext.split("&")[1].split("=")[1]
    requester({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://accounts.spotify.com/api/token',
        //body: body,
        data: {
            grant_type: 'authorization_code',
            redirect_uri: 'https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&',
            code: incomingBody,
            client_id: clientID,
            client_secret: clientSecret
        },
        method: 'POST'
    }, function (err, res, body) {
        console.log("Received access_token")
        //it works!
        //data = this.response;
        //response.statusCode = 200;
        //response.setHeader('Content-Type', 'application/json');
        //response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
        response.writeHead(200, {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*"
        });
        response.write(body);
        response.end();
        console.log("complete");
    });

    /*let req = new XMLHttpRequest();
    req.open("POST", "https://accounts.spotify.com/api/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let outBody = "grant_type=authorization_code&" +
        "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&" +
        "code=" + incomingBody + "&" +
        authtext;
    req.onload = function () {
        data = this.response;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.write(data);
        response.end();
    };
    req.send(outBody).then();*/

//}).listen(process.env.PORT || 8080);
console.log("Server started")