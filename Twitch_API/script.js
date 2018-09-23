const q = (selecror) => document.querySelector(selecror);
const qAll = (selecror) => document.querySelectorAll(selecror);

// Global variables

const myClientID = 'jdsl3lgf1c8gcxi44u29sm30m015n3';
let gameID;
let userID;

getTop5GamesFromAPI(function (gameResp) {

  // Show game names on buttons, record game IDs
  for (let i = 0; i < 5; i++) {
    qAll('[class^="game--"]')[i].setAttribute("id", gameResp.data[i].id);
    qAll('[class^="game--"]')[i].innerText = gameResp.data[i].name;
  }
  // Default: display 1st game's streams
  gameID = q('.game--1').id;
  q('.main--title').innerText = q('.game--1').innerText;

  getStreamsFromAPI(function(streamResp) {
    for (let i = 0; i < streamResp.data.length; i++) {
      let streambox = makeStreambox(i, streamResp);
      q('.streams').appendChild(streambox);
    }
  })
})

for (let i = 0; i < 5; i++) {
  qAll('[class^="game--"]')[i].addEventListener('click', e => {
    gameID = e.target.id;
    q('.main--title').innerText = e.target.innerText;
    q('.streams').innerHTML = '';
    getStreamsFromAPI(function(streamResp) {
      for (let i = 0; i < streamResp.data.length; i++) {
        let streambox = makeStreambox(i, streamResp);
        q('.streams').appendChild(streambox);
      }
    })
  })
}

// Functions

function getTop5GamesFromAPI(callback) {

  const xhr =  new XMLHttpRequest();
  const url = 'https://api.twitch.tv/helix/games/top?first=5';

  xhr.open('GET', url);
  xhr.setRequestHeader('Client-ID', myClientID);
  xhr.responseType = 'json';
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let gameResp = xhr.response;
      callback(gameResp);
    }
  }
  xhr.send();
}

function getStreamsFromAPI(callback) {

  const xhr =  new XMLHttpRequest();
  const url = `https://api.twitch.tv/helix/streams?game_id=${gameID}&first=8`;

  xhr.open('GET', url);
  xhr.setRequestHeader('Client-ID', myClientID);
  xhr.responseType = 'json';
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let streamResp = xhr.response;
      callback(streamResp);
    }
  }
  xhr.send();
}

function getUserFromAPI(callback) {
  const xhr =  new XMLHttpRequest();
  const url = `https://api.twitch.tv/helix/users?id=${userID}`;

  xhr.open('GET', url);
  xhr.setRequestHeader('Client-ID', myClientID);
  xhr.responseType = 'json';
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let userResp = xhr.response;
      callback(userResp);
    }
  }
  xhr.send();
}

function makeStreambox(i, streamResp) {
  let streambox = document.createElement("a");
  streambox.classList.add('streambox', 'col-12', 'col-md-6', 'col-lg-3', 'p-1');

  // Adjust thumbnail url
  let thumbnail_url_raw = streamResp.data[i].thumbnail_url;
  let thumbnailURL = thumbnail_url_raw.replace('{width}x{height}', '720x400');
  
  // Get user info
  userID = streamResp.data[i].user_id;
  getUserFromAPI(function(userResp) {

    streambox.innerHTML = `
      <img class="stream--thumbnail img-fluid" src=${thumbnailURL} alt="Stream thumbnail" />
      <div class="streambox--info row m-0">
        <div class="col-3 p-2"><img class="stream--userimg rounded-circle img-fluid" src=${userResp.data[0].profile_image_url} alt="User profile image" /></div>
        <div class="col-9 p-1 flex-column">
          <div class="h-50 d-flex"><div class="stream--title align-self-center text-truncate">${streamResp.data[i].title}</div></div>
          <div class="h-50 d-flex"><div class="stream--username align-self-center text-truncate"><small>${userResp.data[0].display_name}</small></div></div>
        </div>
      </div>
    `
    streambox.setAttribute('href', `https://www.twitch.tv/${userResp.data[0].login}`);
  })
  return streambox;
}

// Bootstrap jQuery

$(".navbar .nav-item").on("click", function () {
  $(".navbar").find(".active").removeClass("active");
  $(this).addClass("active");
})
