/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 13/08/2019, 00:09
 ******************************************************************************/

const LOCAL_ACCESS_TOKEN_KEY = "controlify-spotify-access-token";
const LOCAL_ACCESS_TOKEN_EXPIRY_KEY = "controlify-spotify-access-expiry-time";

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const hash = parseHash(window.location.hash);
        if (hash['access_token'] && hash['expires_in']) {
            localStorage.setItem(LOCAL_ACCESS_TOKEN_KEY, hash['access_token']);
            localStorage.setItem(LOCAL_ACCESS_TOKEN_EXPIRY_KEY, Date.now() + 990 * parseInt(hash['expires_in']));
        }
    }
})

function openWindow() {
    let popupWindow = window.open("controller.html", 'popUpWindow', 'height=300,width=400,left=10,top=10,resizable=yes,scrollbars=no,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
}

function directToLogin() {
    fetch('/spotifyRedirectURI')
        .then(e => e.json())
        .then(data => {
            window.location = data.redirectUri;
        }).catch(error => {
        alert("Failed to begin authentication with Spotify");
        console.log(error);
    });
}

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