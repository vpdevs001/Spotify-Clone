import songList from "./songs.js";

document.addEventListener("DOMContentLoaded", () => {
  //Variables
  let currentSong = new Audio();

  const play = document.getElementById("play");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");

  //Getting Index
  function getIndex() {
    const file = decodeURIComponent(currentSong.src.split("/").pop());
    return songList.findIndex((song) => song.url.endsWith(file));
  }

  //Converting seconds to minutes
  function minuteSeconds(second) {
    if (isNaN(second)) return "00:00";
    const minutes = Math.floor(second / 60);
    const seconds = Math.floor(second % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  //Play a song
  function playMusic(index) {
    currentSong.src = songList[index].url;
    currentSong.play();
    document.querySelector(".songInfo").innerHTML = songList[index].name;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
  }

  //Setting up songs
  function main() {
    let songUL = document
      .querySelector(".songList")
      .getElementsByTagName("ul")[0];
    let cardContainer = document.querySelector(".cardContainer");

    // Create ALL list items first
    songList.forEach((song, index) => {
      let li = document.createElement("li");
      li.innerHTML = `
        <img class="invert" src="./assets/music.svg" alt="">
        <div class="info">
          <div>${song.name}</div>
          <div>${song.artist}</div>
        </div>
        <div class="play-now">
          <span>Play Now</span>
          <img width="25" class="invert" src="./assets/play-song.svg" alt="">
        </div>
      `;
      songUL.appendChild(li);

      // Single event listener
      li.addEventListener("click", () => {
        playMusic(index);
        play.src = "./assets/pause.svg";
      });

      // Create card
      let card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="play"><img src="./assets/play.svg" alt="play" /></div>
        <img class="play-icon" src="${song.image}" alt="image" />
        <h2>${song.name}</h2>
        <p>${song.artist}</p>
      `;
      cardContainer.appendChild(card);

      // Single card listener
      card.querySelector(".play-icon").addEventListener("click", () => {
        playMusic(index);
        play.src = "./assets/pause.svg";
      });
    });
  }

  //Play & Pause
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./assets/play-song.svg";
    }
  });

  //Update Time
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `
    ${minuteSeconds(currentSong.currentTime)} / 
    ${minuteSeconds(currentSong.duration)}
    `;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    if (isNaN(currentSong.duration)) return;
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currentSong.currentTime = (percent / 100) * currentSong.duration;
    document.querySelector(".circle").style.left = percent + "%";
  });

  //Hamburger Functionality
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Hamburger Close Functionality
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Previous
  previous.addEventListener("click", () => {
    let index = getIndex();
    console.log(index);
    if (index > 0) playMusic(index - 1);
  });

  //Next
  next.addEventListener("click", () => {
    let index = getIndex();
    if (index < songList.length - 1) playMusic(index + 1);
  });

  //Volume Bar
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      let value = parseInt(e.target.value) / 100;
      currentSong.volume = value;
      if (value === 0) {
        document.querySelector(".volume-img").src = "./assets/mute.svg";
      } else {
        document.querySelector(".volume-img").src = "./assets/volume.svg";
      }
    });

  //Forward
  const forward = document.querySelector("#forward");
  forward.addEventListener("click", () => {
    currentSong.currentTime += 10;
  });

  //Rewind
  const rewind = document.querySelector("#rewind");
  rewind.addEventListener("click", () => {
    currentSong.currentTime -= 10;
  });

  //Autoplay
  currentSong.addEventListener("ended", () => {
    let index = getIndex();
    if (index < songList.length - 1) playMusic(index + 1);
  });

  main();
});
