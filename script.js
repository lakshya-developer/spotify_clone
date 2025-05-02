let currentSong = new Audio();
var play = document.querySelector("#play");
let songs;
let currfolder;
let key;

function secondsToMinutes(seconds) {
  // Remove any decimal part
  seconds = Math.floor(seconds);

  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // Add leading zeros if necessary
  var minutesStr = String(minutes).padStart(2, "0");
  var secondsStr = String(remainingSeconds).padStart(2, "0");

  return minutesStr + ":" + secondsStr;
}

async function getSongs(folder) {
  currfolder = folder;
  // Get the list of all the songs
  let a = await fetch(`/${folder}/`);
  console.log(a);
  
  // Show all the songs in the playlist
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(folder)[1]);
    }
  }  
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    // let songs = song.replaceAll("%20", " ")
    songUL.innerHTML =
      songUL.innerHTML +
      `<li class="pointer">
      <img class="invert" src="img/music.svg" alt="">
      <div class="info">
        <div class="songname">${song.replaceAll("%20", " ").replace("/", "")}</div>
        <div class="songartist">${"Spotify"}</div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
      </div>
      </li>`;
  }

  // Atach an event listner to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(
        e.querySelector(".info").firstElementChild.innerHTML.replaceAll("%20", "")
      );
    });
  });

  return songs
}

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  console.log(anchors)
   let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      
    
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-1)[0]
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer = document.querySelector(".card-container")
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
      <button><i class="fa-solid fa-play" style="color: #000000;"></i></button>
      <img src="/songs/${folder}/cover.jpg" alt="">
      <h3>${response.title}</h3>
      <p style="font-size: 0.8rem;">${response.description}</p>
    </div>`
    }
  }
  // Load the play list whenever card id clicked.
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async  item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      // console.log(item,item.currentTarget.dataset.folder)
      playMusic(songs[0])
    })
  });
}
displayAlbums()
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/project/project5_Spotifyclone/songs/" + track)
  currentSong.src = `${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track.replace("/",""));
  document.querySelector(".songtime").innerHTML = "00:00";
};

async function main() {``
  //Get the list of all songs
  await getSongs("songs/bhajans");
  playMusic(songs[0], true);

  

  // Attach an event listener to play, next and previous

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )}/${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add and event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add a event listner for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
    document.querySelector(".left").style.width = 96 + "%";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -100 + "%";
    document.querySelector(".left").style.width = 25 + "vw";
  });

  // Add an event listener to previous and next
  let previous = document.querySelector("#previous");
  previous.addEventListener("click", () => {
    let indexx = songs.indexOf("/"+currentSong.src.split("/").slice(-1)[0]);
    if (indexx > 0) {
      playMusic(songs[indexx - 1]);
    }
  });
  let next = document.querySelector("#next");
  next.addEventListener("click", () => {
    let index = songs.indexOf("/"+currentSong.src.split("/").slice(-1)[0]);
    console.log(index)
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event listener to volume
  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume > 0){
        document.querySelector(".volume").src = "img/volume.svg"
      }
    });

  document.body.addEventListener("keypress", (e) => {
    console.log(e.key)
    if(e.key == " "){
      if (currentSong.paused) {
        currentSong.play();
        play.src = "img/pause.svg";
      } 
      else {
        currentSong.pause();
        play.src = "img/play.svg";
      }
    }
  })

  
  // Add event listener to mute when we click volume button.
  

  document.querySelector("#volume-img").addEventListener("click", e =>{
    console.log(e.target.src.includes("volume.svg"))
    if(e.target.src.includes("volume.svg")){
      currentSong.volume = 0;
      e.target.src = e.target.src.replace("volume","mute")
      document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
    }
    else{
      currentSong.volume = 0.10;
      e.target.src = e.target.src.replace("mute","volume")
      document.querySelector(".volume").getElementsByTagName("input")[0].value = 50;
    }
    console.log(e.target.src)
  })

}

main();
