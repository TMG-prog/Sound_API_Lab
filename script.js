
const audioElement = new Audio();

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const track = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();

track.connect(gainNode).connect(audioContext.destination);


const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileName = document.getElementById("fileName");
const title = document.getElementById("title");
const playBtnIcon = document.querySelector("#playBtn i");


uploadBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    audioElement.src = url;
    audioElement.load();

    
    fileName.textContent = "Selected: " + file.name;

    // reset UI
    playBtnIcon.classList.replace("fa-pause", "fa-play");
});

//play/pause
function togglePlay() {
    audioContext.resume();

    if (audioElement.paused) {
        audioElement.play();
        playBtnIcon.classList.replace("fa-play", "fa-pause");
        title.classList.add("bouncing");
    } else {
        audioElement.pause();
        playBtnIcon.classList.replace("fa-pause", "fa-play");
        title.classList.remove("bouncing");
    }
}

//volume
document.getElementById("volume").addEventListener("input", function () {
    gainNode.gain.value = this.value;
});

//mute/unmute button
let isMuted = false;

function toggleMute() {
    const icon = document.querySelector("#muteBtn i");

    if (!isMuted) {
        gainNode.gain.value = 0;
        icon.classList.replace("fa-volume-up", "fa-volume-mute");
    } else {
        gainNode.gain.value = document.getElementById("volume").value;
        icon.classList.replace("fa-volume-mute", "fa-volume-up");
    }

    isMuted = !isMuted;
}

//seekbar
const seekBar = document.getElementById("seekBar");

audioElement.addEventListener("loadedmetadata", () => {
    seekBar.max = audioElement.duration;
});

audioElement.addEventListener("timeupdate", () => {
    seekBar.value = audioElement.currentTime;

    const fmt = t =>
        `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;

    document.getElementById("currentTime").textContent =
        `${fmt(audioElement.currentTime)} / ${fmt(audioElement.duration || 0)}`;
});

seekBar.addEventListener("input", function () {
    audioElement.currentTime = this.value;
});

