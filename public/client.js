/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 08/08/19 15:16
 ******************************************************************************/
const LOCAL_AUTH_CODE_KEY = "controlify-sotify-auth-code";
const LOCAL_ACCESS_TOKEN_KEY = "controlify-spotify-access-token";
const LOCAL_ACCESS_TOKEN_EXPIRY_KEY = "controlify-spotify-access-expiry-time";
const LOCAL_REFRESH_TOKEN_KEY = "controlify-spotify-refresh-token";

document.addEventListener('DOMContentLoaded', function () {
    let url = new URL(window.location.href);
    let code = url.searchParams.get("code");
    console.log(code);
    if (code) { // if something in the hash

        if (code) // if it has received the auth code from spotify
        {
            localStorage.setItem(LOCAL_AUTH_CODE_KEY, code);
            //window.location.href = "/controller.html";
        }
    }
    if (localStorage.getItem(LOCAL_AUTH_CODE_KEY)) {  // if there is an auth code
        //window.location.href = "/controller.html" // go to main page
        // get access_token and refresh_token
        let req = new XMLHttpRequest(); // this goes to an app engine server which then goes to spotify
        req.open("GET", "https://controlify-backend.appspot.com");
        //req.setRequestHeader("auth_code", localStorage.getItem(LOCAL_AUTH_CODE_KEY));
        req.onload = function () {
            let data = this.response;
            console.log(data);
        };

        req.send(localStorage.getItem(LOCAL_AUTH_CODE_KEY));


    }
    document.getElementById("login").addEventListener('click', function (e) {
        e.preventDefault();
        fetch('/spotifyRedirectURI')
            .then(e => e.json())
            .then(data => {
                window.location = data.redirectUri;
            }).catch(error => {
            alert("Failed to begin authentication with Spotify");
            console.log(error);
        })
    })

});

function parseHash(hash) {
    return hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
            if (item) {
                var parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
}
