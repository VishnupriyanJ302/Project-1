// console.log("Let's write java script")

let currentsong = new Audio()
let songs;
let currFolder;

function formatSongTime(totalSeconds) {
    // Round down to the nearest whole number
    totalSeconds = Math.floor(totalSeconds);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format with leading zero if less than 10
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}



// Example usage:
// console.log(convertSecondsToMinSec(12));   // Output: "00:12"
// console.log(convertSecondsToMinSec(90));   // Output: "01:30"
// console.log(convertSecondsToMinSec(360));  // Output: "06:00"

// async function getSongs() {
//     let a = await fetch("http://127.0.0.1:5500/songs")
//     let response = await a.text();
//     console.log(response)
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     let songs = []
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split("http://127.0.0.1:5500/songs/"))

//         }
//     }
//     return songs
// }


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/").pop(`http://127.0.0.1:5500/${folder}/`)); // ✅ Fix: just get the file name
        }
    }



    //show all songs in playlist
    let songsul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songsul.innerHTML = ""
    for (const song of songs) {
        const decodedSong = decodeURIComponent(song);
        songsul.innerHTML = songsul.innerHTML + `
                                 <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${decodedSong}</div>
                                <div>VISHNUJ</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play2.svg" alt="">
                            </div></li>`;
        // songsul.innerHTML = songsul.innerHTML + `<li> ${song.replaceAll("%20", " ")} </li>`;
    }


    // attach an eventlistner to each songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        // as above calling class . is very important
    })


    return songs

    // // attach an eventlisterner to play, previous, next
    // let p = document.getElementById("playnow")
    // p.addEventListener("click", () => {
    //     if (currentsong.paused) {
    //         currentsong.play()
    //         playnow.src = "img/pause.svg"
    //     }
    //     else {
    //         currentsong.pause()
    //         playnow.src = "img/play.svg"
    //     }
    // })
}


const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `${currFolder}/${track}`
    if (!pause) {
        currentsong.play()
        playnow.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


// const playmusic = (track, pause = false) => {
//     currentsong.src = `${currFolder}/${track}`; // ← FIXED path

//     if (!pause) {
//         currentsong.play()
//             .then(() => console.log("Playing:", track))
//             .catch(err => console.error("Error playing audio:", err));
//         playnow.src = "img/pause.svg";
//     }

//     document.querySelector(".songinfo").innerHTML = decodeURI(track);
//     document.querySelector(".songtime").innerHTML = "00:00/00:00";
// };


// async function displayAlbum() {
//     let a = await fetch(`http://127.0.0.1:5500/songs`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a");
//     let cardcontainer = document.querySelector(".cardcontainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];
//         if (e.href.includes("/songs")) {
//             let folder = e.href.split("/").slice(-1)[0]; // Fix here
//             console.log(folder); // Log separately

//             // get metadata of folder
//             let res = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//             let info = await res.json();
//             console.log(info);
//             cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="cs" class="card">
//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
//                                 color="#000000" fill="none">
//                                 <!-- Green circular background -->
//                                 <circle cx="12" cy="12" r="12" fill="green" />
//                                 <!-- Icon content -->
//                                 <circle cx="12" cy="12" r="10" stroke="#141B34" stroke-width="1.5" />
//                                 <path
//                                     d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
//                                     fill="#141B34" />
//                             </svg>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpeg" alt="">
//                         <h2>${info.title}</h2>
//                         <p>${info.description}</p>
//                         </div>`
//         }
//     };

//     // load the playlist whenever card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach((e) => {
//         e.addEventListener("click", async item => {
//             console.log(item.target, item.currentTarget.dataset)
//             songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
//             // above use currentTarget as if you click on any part of card it will return folder, but if target used it will not let you listen if you click on card not work if you click on image or h1 
//         })
//         // above using foreach always convert to array first
//     })
// }


async function displayAlbum() {
    try {
        const a = await fetch(`http://127.0.0.1:5500/songs`);
        const response = await a.text();
        const div = document.createElement("div");
        div.innerHTML = response;

        const anchors = div.getElementsByTagName("a");
        const cardcontainer = document.querySelector(".cardcontainer");
        const array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs")) {
                const folder = e.href.split("/").slice(-1)[0];
                console.log("Folder:", folder);

                try {
                    const res = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                    const info = await res.json();

                    cardcontainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="green" />
                                <circle cx="12" cy="12" r="10" stroke="#141B34" stroke-width="1.5" />
                                <path d="M9.5 11.2v1.6c0 1.52 0 2.28.456 2.586.456.307 1.08-.032 2.327-.712l1.468-.8C15.25 13.06 16 12.65 16 12s-.75-1.06-2.25-1.88l-1.468-.8c-1.247-.68-1.87-1.02-2.327-.713C9.5 8.92 9.5 9.68 9.5 11.2Z" fill="#141B34"/>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="${info.title} Cover">
                        <h2>${info.title}</h2>
                        <p>${info.description}</p>
                    </div>`;
                } catch (err) {
                    console.error(`Failed to load metadata for folder ${folder}:`, err);
                }
            }
        }

        // Add click event to all cards
        Array.from(document.getElementsByClassName("card")).forEach((e) => {
            e.addEventListener("click", async item => {
                const folder = item.currentTarget.dataset.folder;
                console.log("Clicked folder:", folder);
                let songs = await getSongs(`songs/${folder}`);
                playmusic(songs[0])
                // Do something with the songs here (play, display etc.)
            });
        });
    } catch (error) {
        console.error("Error loading album:", error);
    }
}

// async function displayAlbum() {
//     let a = await fetch(`http://127.0.0.1:5500/songs`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     Array.from(anchors).forEach(async e => {
//         if (e.href.includes("/songs")) {
//             let folder = console.log(e.href.split("/").slice(-1)[0])
//             // get metadata of folder
//             let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//             let response = await a.json();
//             console.log(response)
//         }
//     })
// }

async function main() {

    // get the list of all the song
    await getSongs("songs/cs")
    console.log(songs)
    playmusic(songs[0], true)

    // //show all songs in playlist 
    // let songsul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     const decodedSong = decodeURIComponent(song);
    //     songsul.innerHTML = songsul.innerHTML + `
    //                              <li>
    //                         <img class="invert" src="music.svg" alt="">
    //                         <div class="info">
    //                             <div>${decodedSong}</div>
    //                             <div>VISHNUJ</div>
    //                         </div>
    //                         <div class="playnow">
    //                             <span>Play Now</span>
    //                             <img class="invert" src="play2.svg" alt="">
    //                         </div></li>`;
    //     // songsul.innerHTML = songsul.innerHTML + `<li> ${song.replaceAll("%20", " ")} </li>`;
    // }


    // // attach an eventlistner to each songs
    // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    //     })
    //     // as above calling class . is very important
    // })


    //display all the album on the page
    displayAlbum()




    // attach an eventlisterner to play, previous, next
    let p = document.getElementById("playnow")
    p.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            playnow.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            playnow.src = "img/play.svg"
        }
    })


    // to add song duration and seekbar runner 
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${formatSongTime(currentsong.currentTime)} / ${formatSongTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    // to add eventlisterner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })



    // add event listerner to hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })

    // add event listerner to close 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // add eventlisterner to previous
    let pp = document.getElementById("previousplay")
    pp.addEventListener("click", () => {
        console.log("previous was clicked")
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    // add eventlisterner to next
    let np = document.getElementById("nextplay")
    np.addEventListener("click", () => {
        currentsong.pause()
        console.log("next was clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })


    // add an event listerner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100

    })


    // add eventlisterner to mute a track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        // console.log(e.target)
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg") 
            currentsong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 40;
        }
        // always remember strings are immutable
    })


    // console.log(p)

    // // play the first song
    // var audio = new Audio(songs[3]);
    // audio.play();
    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    // });
}


main()

