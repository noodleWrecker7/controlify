/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 13/08/2019, 00:04
 ******************************************************************************/

const LOCAL_ACCESS_TOKEN_KEY = "controlify-spotify-access-token";
const LOCAL_ACCESS_TOKEN_EXPIRY_KEY = "controlify-spotify-access-expiry-time";

const clientId = localStorage.getItem(LOCAL_API_CLIENT_ID_KEY),
    clientSecret = localStorage.getItem(LOCAL_API_CLIENT_SECRET_KEY);

function getNewToken() {
    let req = new XMLHttpRequest();
    req.open("POST", "https://accounts.spotify.com/api/token")
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let code = localStorage.getItem(LOCAL_REFRESH_TOKEN_KEY);
    if (!code) code = localStorage.getItem(LOCAL_AUTH_CODE_KEY);

    let body = "grant_type=authorization_code&" +
        "redirect_uri=https%3A%2F%2Fcontrolify.noodlewrecker.xyz%2F&" +
        "code=" + code + "&" +
        "client_id=" + clientId + "&client_secret=" + clientSecret;

    req.onload = function(){
        console.log(this.response)
    }
    console.log(body)
    req.send(body)
}