const LYRICS_URL = "http://localhost:3000/api/v1/lyrics";
let data = ""
const playareaDiv = document.querySelector(".playarea");
const lyricsDiv = document.querySelector(".lyrics")
const line1 = document.querySelector("#line1")
const line2 = document.querySelector("#line2")
const test_title = document.querySelector("#test_title")
const test_artist = document.querySelector("#test_artist")
const form = document.querySelector("#form")
let currentSong = ""
let splitSong = []

fetch('http://localhost:3000/api/v1/lyrics')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        data = myJson
        currentSong = data[1]
    })
    .then(populateLyrics)


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
    // if (e.target.artist.value.toLowerCase() === currentSong.artist.toLowerCase()) {
    //     console.log("artist correct")
    // }
    // else {
    //     console.log("artist wrong you suck")
    // }

    // if (e.target.title.value.toLowerCase() === currentSong.song_title.toLowerCase()) {
    //     console.log("song correct")
    // }
    // else {
    //     console.log("song wrong you suck")
    // }

    if (e.target.title.value.toLowerCase() === currentSong.song_title.toLowerCase() || e.target.artist.value.toLowerCase() === currentSong.artist.toLowerCase()) {
        console.log("correct")
    }
    else {
        console.log("nope")
    }
})
