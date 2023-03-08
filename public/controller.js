/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 18/08/2019, 23:42
 ******************************************************************************/

const LOCAL_ACCESS_TOKEN_KEY = "controlify-spotify-access-token";
const LOCAL_ACCESS_TOKEN_EXPIRY_KEY = "controlify-spotify-access-expiry-time";
let expiryTimer;
const controls = {
  shuffle: { id: "shuffle-icon", action: buttonPressShuffle },
  backward: { id: "backward-icon", action: buttonPressBackward },
  play: { id: "play-icon", action: buttonPressPlay },
  forward: { id: "forward-icon", action: buttonPressForward },
  redo: { id: "redo-icon", action: buttonPressRedo },
};

const player = {
  is_playing: false,
  controlsViewed: false,
  track: { length: 1, progress: 1, album_image: "", title: "", artist: "" },
  shuffle: false,
  redo: false,
};

function buttonPressShuffle() {
  makeCall(
    "PUT",
    "https://api.spotify.com/v1/me/player/shuffle",
    "state=" + !player.shuffle
  ).then((response) => {
    console.log(response);
  });
  player.shuffle = !player.shuffle;
  if (player.shuffle) {
    document.getElementById("shuffle-icon").style.color = "#00d06f";
  } else {
    document.getElementById("shuffle-icon").style.color = "white";
  }
}

function buttonPressBackward() {
  makeCall("POST", "https://api.spotify.com/v1/me/player/previous").then(
    (response) => {
      console.log(response);
      getPlayerInfo();
    }
  );
}

function buttonPressPlay() {
  if (player.is_playing) {
    makeCall("PUT", "https://api.spotify.com/v1/me/player/pause").then(
      (response) => {
        console.log(response);
      }
    );
  } else {
    makeCall("PUT", "https://api.spotify.com/v1/me/player/play").then(
      (response) => {
        console.log(response);
      }
    );
  }
  player.is_playing = !player.is_playing;
  if (player.is_playing) {
    document.getElementById("play-icon").classList.remove("fa-play");
    document.getElementById("play-icon").classList.add("fa-pause");
  } else {
    document.getElementById("play-icon").classList.remove("fa-pause");
    document.getElementById("play-icon").classList.add("fa-play");
  }
  getPlayerInfo();
}

function buttonPressForward() {
  makeCall("POST", "https://api.spotify.com/v1/me/player/next").then(
    (response) => {
      console.log(response);
      getPlayerInfo();
    }
  );
}

function buttonPressRedo() {}

document.addEventListener("DOMContentLoaded", () => {
  window.resizeTo(400, 448);
  window.focus();
  document.getElementById("login").addEventListener("click", function (e) {
    e.preventDefault();
    directToLogin();
  });
  if (window.location.hash) {
    const hash = parseHash(window.location.hash);
    if (hash["access_token"] && hash["expires_in"]) {
      if (
        hash["access_token"] == localStorage.getItem(LOCAL_ACCESS_TOKEN_KEY)
      ) {
        if (localStorage.getItem(LOCAL_ACCESS_TOKEN_EXPIRY_KEY) > Date.now()) {
          directToLogin();
        }
      } else {
        localStorage.setItem(LOCAL_ACCESS_TOKEN_KEY, hash["access_token"]);
        localStorage.setItem(
          LOCAL_ACCESS_TOKEN_EXPIRY_KEY,
          Date.now() + 990 * parseInt(hash["expires_in"])
        );
      }
      displayControlsPanel();
      let secondsSinceCall = 0;
      getPlayerInfo();
      let updatePerSecond = 2;
      setInterval(function () {
        secondsSinceCall++;
        if (secondsSinceCall > 15 * updatePerSecond) {
          secondsSinceCall = 0;
          getPlayerInfo();
        }
        if (player.is_playing) {
          player.track.progress += 1000 / updatePerSecond;
        }
        if (player.controlsViewed) {
          updateProgressBar();
        }
      }, 1000 / updatePerSecond);
      removeControlBar();
      expiryTimer = setTimeout(function () {
        directToLogin();
      }, 990 * parseInt(hash["expires_in"]));
    }
  }
});

async function makeCall(method, url, body) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(method, url);
    req.setRequestHeader(
      "Authorization",
      "Bearer " + localStorage.getItem(LOCAL_ACCESS_TOKEN_KEY)
    );
    req.onload = () => resolve(req.responseText);
    req.onerror = () => reject(req.statusText);
    req.send(body);
  });
}

async function getPlayerInfo() {
  makeCall("GET", "https://api.spotify.com/v1/me/player").then((value) => {
    console.log(value);
    let data = JSON.parse(value);
    console.log(data);

    player.shuffle = data.shuffle_state;
    if (player.shuffle) {
      document.getElementById("shuffle-icon").style.color = "#00d06f";
    } else {
      document.getElementById("shuffle-icon").style.color = "white";
    }

    player.track.length = data.item.duration_ms;
    document.getElementById("track-length").innerText = msToTime(
      player.track.length
    );

    player.track.progress = data.progress_ms;
    document.getElementById("current-progress").innerText = msToTime(
      player.track.progress
    );

    player.track.title = data.item.name;
    document.getElementById("track-title").innerText = player.track.title;

    let artists = data.item.artists;

    let string = "";
    for (let i = 0; i < artists.length; i++) {
      string += artists[i].name + ", ";
    }
    string = string.substring(0, string.length - 2);
    player.track.artist = string;
    document.getElementById("track-artists").innerText = player.track.artist;

    player.redo = true;
    if (data.repeat_state == "off") {
      player.redo = false;
      document.getElementById("redo-icon").style.color = "white";
    } else {
      document.getElementById("redo-icon").style.color = "#00d06f";
    }

    player.track.album_image = data.item.album.images[0].url;

    player.is_playing = data.is_playing;
    if (player.is_playing) {
      document.getElementById("play-icon").classList.remove("fa-play");
      document.getElementById("play-icon").classList.add("fa-pause");
    } else {
      document.getElementById("play-icon").classList.remove("fa-pause");
      document.getElementById("play-icon").classList.add("fa-play");
    }
    updateProgressBar();

    document.getElementById("progress").max = player.track.length;
    document.getElementById("progress").value = player.track.progress;
    document
      .getElementById("album-image")
      .setAttribute("src", player.track.album_image);
  });
}

/*makeCall("GET", "https://api.spotify.com/v1/me/player").then(value => {
    console.log(value)
})*/

function displayControlBar() {
  player.controlsViewed = true;
  updateProgressBar();
  document.getElementById("dimming-panel").style.opacity = "1";

  document.getElementById("progress-bar-container").style.opacity = 1;
  document
    .getElementById("progress")
    .addEventListener("mousemove", updateProgressBar);
  document
    .getElementById("progress")
    .addEventListener("click", updateProgressBar);

  for (let item in controls) {
    document.getElementById(controls[item].id).style.opacity = "1";
    document
      .getElementById(controls[item].id)
      .addEventListener("click", controls[item].action);
  }
}

function removeControlBar() {
  player.controlsViewed = false;
  document.getElementById("dimming-panel").style.opacity = "0";

  document.getElementById("progress-bar-container").style.opacity = 0;
  document
    .getElementById("progress")
    .removeEventListener("mousemove", updateProgressBar);
  document
    .getElementById("progress")
    .removeEventListener("click", updateProgressBar);

  for (let item in controls) {
    document.getElementById(controls[item].id).style.opacity = "0";
    document
      .getElementById(controls[item].id)
      .removeEventListener("click", controls[item].action);
  }
}

function displayControlsPanel() {
  document.getElementById("login").style.display = "none";
  document.getElementById("controller-container").style.display = "block";

  document.addEventListener("click", function () {
    if (player.controlsViewed) {
      removeControlBar();
    } else {
      displayControlBar();
    }
  });
}

function updateProgressBar() {
  document.getElementById("progress").value = player.track.progress;
  document.getElementById("current-progress").innerText = msToTime(
    player.track.progress
  );
  let element = document.getElementById("progress");

  var val = (element.value - element.min) / (element.max - element.min);
  var percent = val * 100;
  //console.log(this)
  document.getElementById("progress").style.cssText =
    "background-image: -webkit-gradient(linear, left top, right top, " +
    "color-stop(" +
    percent +
    "%, #00d06f), " +
    "color-stop(" +
    percent +
    "%, #737373)" +
    ");" +
    "background-image: -moz-linear-gradient(left center, #00d06f 0%, #00d06f " +
    percent +
    "%, #737373 " +
    percent +
    "%, #737373 100%)";
  if (!player.controlsViewed) {
    document.getElementById("progress-bar-container").style.opacity = 0;
  }
}

function directToLogin() {
  fetch("/spotifyRedirectURI")
    .then((e) => e.json())
    .then((data) => {
      window.location = data.redirectUri;
    })
    .catch((error) => {
      alert("Failed to begin authentication with Spotify");
      console.log(error);
    });
}

function parseHash(hash) {
  return hash
    .substring(1)
    .split("&")
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
}

function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ("00" + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s;
  var hrs = (s - mins) / 60;

  return pad(mins) + ":" + pad(secs);
}
