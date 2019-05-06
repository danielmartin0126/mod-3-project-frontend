const LYRICS_URL = "http://localhost:3000/api/v1/lyrics";
const USERS_URL = "http://localhost:3000/api/v1/users";
const USERS_LYRICS_URL = "http://localhost:3000/api/v1/users";


let data = ""
const startDiv = document.querySelector(".start")
const playareaDiv = document.querySelector(".playarea");
const gameoverDiv = document.querySelector(".gameover");
const lyricsDiv = document.querySelector(".lyrics")
const line1 = document.querySelector("#line1")
const line2 = document.querySelector("#line2")
const test_title = document.querySelector("#test_title")
const test_artist = document.querySelector("#test_artist")
const form = document.querySelector("#form")
let currentSong = ""
let splitSong = []
let currentUser = {current_score:0 , lives: 3}


fetch('http://localhost:3000/api/v1/lyrics')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        data = myJson
        getNewSong()
    })
    .then(populateLyrics)

startDiv.addEventListener("submit", function(e) {
    e.preventDefault()
    currentUser.name = e.target.name.value
    fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(
            currentUser
        )
    })
    .then(response => response.json())
    .then(response => currentUser ={...currentUser, ...response})
    .then(startGame)
}

)    

function startGame() {
    currentUser.lives = 3
    resetLives()
    startDiv.style = "display:none"
    playareaDiv.style = ""

}    


function populateLyrics() {
    test_title.innerText = currentSong["song_title"]
    test_artist.innerText = currentSong.artist
    splitSong = currentSong.content.split("\n")
    line1.innerText = `${splitSong[0]}`
    line2.innerText = `${splitSong[1]}`
}

form.addEventListener("submit", function(e) {
    e.preventDefault()
    // debugger
    if (e.target.artist.value.toLowerCase() === currentSong.artist.toLowerCase()) {
        console.log("artist correct")
        currentUser.current_score += 50
    }
    else {
        console.log("artist wrong you suck")
    }

    if (e.target.title.value.toLowerCase() === currentSong.song_title.toLowerCase()) {
        console.log("song correct")
        currentUser.current_score += 50
    }
    else {
        console.log("song wrong you suck")
    }

    if (e.target.title.value.toLowerCase() === currentSong.song_title.toLowerCase() || e.target.artist.value.toLowerCase() === currentSong.artist.toLowerCase()) {
        console.log("correct")
        getNewSong()
    }
    else {
        console.log("nope")
        removeLife()
    }
})

function removeLife() {
    let currentHeart = document.querySelector(`#heart${currentUser.lives}`)
    currentHeart.src = "assets/heart-empty.png"
    currentUser.lives -= 1
    if (currentUser.lives === 0) {
        endGame()
    } 
    getNewSong()
}

function resetLives() {
    document.querySelector(".incorrect").innerHTML = ""
    document.querySelector(".incorrect").innerHTML = 
        `<img class="hearts" id="heart1" src="assets/heart-full.png"></img>
        <img class="hearts" id="heart2" src="assets/heart-full.png"></img>
        <img class="hearts" id="heart3" src="assets/heart-full.png"></img>`    
}

function getNewSong() {
    form.reset()
    currentSong = data[Math.floor(Math.random() * data.length)];
    fetch(USERS_LYRICS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(
            {user_id: currentUser.id,
            lyric_id : currentSong.id
            }
        )
    })
    populateLyrics()
}

function endGame() {
    if (currentUser.current_score > currentUser.score) {
        currentUser.score = currentUser.current_score
        fetch(USERS_URL+`/${currentUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(
                currentUser
            )
        })
    }
    playareaDiv.style = "display :none"
    let gameOver = document.createElement("img")
    gameOver.src = "assets/GAMEOVER_copy_1024x1024.jpg"
    gameoverDiv.appendChild(gameOver)
    // gameoverDiv.style = ""
    let homeButton = document.createElement("button")
    homeButton.innerText = "Return to start"
    gameoverDiv.appendChild(homeButton)
    homeButton.addEventListener("click", () => {
        startDiv.style = "display:block"
        gameoverDiv.style = "display :none"})
    console.log("ya ded")
    
}
