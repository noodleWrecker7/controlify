/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 08/08/19 17:34
 ******************************************************************************/
const http = require('http');
const requester = require('request');
var express = require('express');
var app = express();
const fs = require('fs');

let authtext = null;

/*requester("/appauth.txt", function (err, resp, body) {
    console.error('error:', err); // Print the error if one occurred
    console.log('statusCode:', resp && resp.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    authtext = body;
})*/

fs.readFile("/appauth.txt", "utf8", (err, data) => {
    if (err) throw err;
    authtext = data;
    console.log("Authtext = " + authtext);
});


//http.createServer((request, response) => {
app.get("/request-token", function (request, response) {
    console.log("Request Received")
    let data = null;
    console.log("Incoming request, type:" + request.method)
    console.log("headers: " + request.headers)

    let incomingBody = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        incomingBody.push(chunk);
    }).on('end', () => {
        incomingBody = Buffer.concat(incomingBody).toString();
        console.log(incomingBody);
    })

    requester({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://accounts.spotify.com/api/token',
        body: "grant_type=authorization_code&" +
            "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&" +
            "code=" + incomingBody + "&" +
            authtext,
        method: 'POST'
    }, function (err, res, body) {
        console.log("Received access_token")
        //it works!
        //data = this.response;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
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

}).listen(process.env.PORT || 8080);
console.log("Server started")