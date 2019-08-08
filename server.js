/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 08/08/19 15:17
 ******************************************************************************/
const http = require('http');
const requester = require('request');

let authtext = null;

requester("/appauth.txt", function (err, resp, body) {
    console.error('error:', err); // Print the error if one occurred
    console.log('statusCode:', resp && resp.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    authtext = body;

})


http.createServer((request, response) => {
    let data = null;
    console.log("Incoming request, type:" + request.method)
    console.log("headers: " + request.headers)

    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
    console.log(body);

    let req = new XMLHttpRequest();
    req.open("POST", "https://accounts.spotify.com/api/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let body = "grant_type=authorization_code&" +
        "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&" +
        "code=" + body + "&" +
        authtext;
    req.onload = function () {
        data = this.response;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.write(data);
        response.end();
    };
    req.send(body).then();

}).listen(8080);