/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 08/08/19 14:09
 ******************************************************************************/

const http = require('http');

http.createServer((request, response) => {
    console.log("Incoming request, type:" + request.method)
    console.log("headers: " + request.headers)



    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write("this is the json bit")
    response.end();
}).listen(8080);