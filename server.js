/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 08/08/19 14:41
 ******************************************************************************/

const http = require('http');

http.createServer((request, response) => {
    let data= null;
    console.log("Incoming request, type:" + request.method)
    console.log("headers: " + request.headers)

    let authtext = fetch("appauth.txt");

    let req = new XMLHttpRequest();
    req.open("POST", "https://accounts.spotify.com/api/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let body = "grant_type=authorization_code&"+
        "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&"+
        "code=" + request.auth_code + "&" +
        authtext;
    req.onload = function (){
        data = this.response;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.write(data)
        response.end();
    };
    req.send(body).then();

}).listen(8080);