/*****************************************************************************
* All of our variables and data.
****************************************************************************/

// Declaring GLOBAL CONSTANTS
const LYRICS_URL = "http://localhost:3000/api/v1/lyrics";
const USERS_URL = "http://localhost:3000/api/v1/users";
const USERS_LYRICS_URL = "http://localhost:3000/api/v1/users";
let data = ""
let currentSong = ""
let splitSong = []
let currentUser = {current_score:0 , lives: 3}
let users = []
let topTen = []


// Grabbing DOM Elements
const startDiv = document.querySelector(".start")
const playareaDiv = document.querySelector(".playarea");
const gameoverDiv = document.querySelector(".gameover");
const lyricsDiv = document.querySelector(".lyrics")
const line1 = document.querySelector("#line1")
const line2 = document.querySelector("#line2")
const test_title = document.querySelector("#test_title")
const test_artist = document.querySelector("#test_artist")
const form = document.querySelector("#form")
let warning = document.createElement("h2")
let scoreElement = document.querySelector("#current_score")
let hiScoreDiv = document.querySelector(".hiscores")
let leaderDiv = document.querySelector("#leaders")
const gameHelp = document.querySelector("#game-help");
const helpButton = document.querySelector("#help-button")
let scoreInputDiv = document.querySelector(".score-input")
let bufferColumn = document.querySelector("#buffer-column")



/*****************************************************************************
* On load fetch actions
****************************************************************************/
// Initial Fetch that gets the starting song
// fetch('http://localhost:3000/api/v1/lyrics')
//   .then(response => response.json())
//   .then(function (myJson) {
//       data = myJson
//       getNewSong()
//   })
//   .then(populateLyrics) //end of GET all Songs FETCH
function fetchHiScores() {
  fetch('http://localhost:3000/api/v1/users')
    .then(response => response.json())
    .then(function (myJson) {
      users = myJson
      users.sort(compare)
      renderHiScores()
    })
}

function compare(a, b) {
  const scoreA = a.score;
  const scoreB = b.score

  let comparison = 0;
  if (scoreA < scoreB) {
    comparison = 1;
  } else if (scoreA > scoreB) {
    comparison = -1;
  }
  return comparison;
}

function renderHiScores() {
  topTen = users.slice(0, 10)
  leaderDiv.innerHTML = ""
  topTen.forEach((u, i) => {
    leaderDiv.innerHTML += `
    <div class="ui card mint-cream"
    <div class="content gunmetal-text">

    <div class="description mint-cream">
    <div class="ui grid" id="rank${i+1}">
      <span class="column">${i+1}</span>
      <span class="six wide column">${u.name}</span>
      <span class="column">${u.score}</span>
    </div>
    </div>
  </div>
  </div>`
    // <div id="rank${i+1}">
    //   <p>${u.name}</p>
    //   <p>#${i+1}</p>
    //   <p>${u.score}</p>
    // </div>
    // `
  })
}

fetchHiScores()

/*****************************************************************************
* Event Listeners
****************************************************************************/
startDiv.addEventListener("submit", function(e) {
  e.preventDefault()
  currentUser.name = e.target.name.value
  fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentUser)
  })
  .then(response => response.json())
  .then(response => currentUser ={...currentUser, ...response})
  .then(startGame) //end of POST new User FETCH
}) //end submit username input event listener

form.addEventListener("submit", function(e) {
  e.preventDefault()
  let points = document.createElement("h5")
  points.innerText = "+50"
  // debugger
  if (e.target.artist.value.toLowerCase() === currentSong.artist.toLowerCase()) {
    console.log("artist correct")
    currentUser.current_score += 50
  } else {
    console.log("artist wrong you suck");
  }

  if (e.target.title.value.toLowerCase() === currentSong.song_title.toLowerCase()) {
    console.log("song correct")
    currentUser.current_score += 50
  } else {
    console.log("song wrong you suck")
  }
  scoreElement.innerText = `Score: ${currentUser.current_score}`

  if (e.target.title.value.toLowerCase() === currentSong.song_title.toLowerCase() || e.target.artist.value.toLowerCase() === currentSong.artist.toLowerCase()) {
    console.log("correct")
    getNewSong()
  } else {
    console.log("nope")
    removeLife()
    if (currentUser.lives === 0) {
      endGame()
    } else{
      getNewSong()
    }
  }
}) //end submit player answer event listener

helpButton.addEventListener("click", function(e) {
  e.preventDefault();
  gameHelp.style.display === "none" ? gameHelp.style.display = "block" : gameHelp.style.display = "none";
}) //end display insturcitons event listener

/*******************************************************************************
* Helper functions
******************************************************************************/

function removeLife() {
  let currentHeart = document.querySelector(`#heart${currentUser.lives}`)
  currentHeart.src = "assets/heart-empty.png"
  currentUser.lives -= 1
}

function resetLives() {
  document.querySelector(".incorrect").innerHTML = ""
  document.querySelector(".incorrect").innerHTML = `
  <img class="hearts" id="heart1" src="assets/heart-full.png"></img>
  <img class="hearts" id="heart2" src="assets/heart-full.png"></img>
  <img class="hearts" id="heart3" src="assets/heart-full.png"></img>`
}

function startGame() {
  currentUser.lives = 3
  currentUser.current_score = 0;
  scoreElement.innerText = `Score: 0`;
  resetLives()
  startDiv.style = "display:none"
  getNewSong()
  playareaDiv.style = ""

}

function populateLyrics() {
  //    test_title.innerText = currentSong["song_title"]
  //    test_artist.innerText = currentSong.artist
  splitSong = currentSong.content.split("\n")
  line1.innerText = `♪ ${splitSong[0]} ♪`
  line2.innerText = `♫ ${splitSong[1]} ♫`
}

function getNewSong() {
  form.reset()
  //   currentSong = data[Math.floor(Math.random() * data.length)];
  fetch(LYRICS_URL+`/${currentUser.id}/new_song`)
  .then(response => response.json())
  .then(song => {
    console.log(song)
    if (song.error) {
      line1.innerText = ""
      line2.innerText = ""
      warning.class = "warning"
      warning.innerText = "No more songs available"
      lyricsDiv.appendChild(warning)
      setTimeout(endGame,4000)

    }
    else {
      currentSong = song
      populateLyrics()
    }
  })
  //   populateLyrics()
}

function endGame() {
  warning.remove()
  if (currentUser.current_score > currentUser.score) {
    currentUser.score = currentUser.current_score;
    fetch(USERS_URL+`/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser)
    })
    .then(resp => {
      fetchHiScores()
      renderHiScores()
    })
  }
  playareaDiv.style.display = "none";
  gameoverDiv.style.display = "block";
  bufferColumn.className = "one wide column right floated pastel-red"
  let gameOver = document.createElement("img");
  gameOver.src = "assets/GAMEOVER_copy_1024x1024.jpg";
  gameoverDiv.appendChild(gameOver);

  gameoverDiv.innerHTML += `
  <div id="gameover-scores" class="ui grid">
    <h2 class="">Score: ${currentUser.current_score}</h2>
    <h2>High Score: ${currentUser.score}</h2>
  </div>
  `

  let homeButton = document.createElement("button");
  homeButton.innerText = "Return to start";
  homeButton.className = "ui button large gunmetal-text fluid";
  homeButton.id = "home-button";



  gameoverDiv.appendChild(homeButton);
  homeButton.addEventListener("click", () => {
    startDiv.style = "display:block"
    gameoverDiv.style = "display :none"
    gameoverDiv.innerHTML = ""
    bufferColumn.className = "one wide column right floated turquoise"

  })
  console.log("ya ded")
}
