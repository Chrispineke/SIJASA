let player, lyricInterval, animationId;

// --- DATA ---
const musicData = [
    { rank: 1, title: "COURT CIRCUIT", artist: "FERRE GOLA", vidId: "K6KByL6T3S4", 
      lyrics: [{t: 5, text: "SYNCING_RHYTHM..."}, {t: 15, text: "COURT_CIRCUIT_ACTIVE"}] },
    { rank: 2, title: "NEURAL_SYNAPSE", artist: "CHRISCASSY", vidId: "5qap5aO4i9A", lyrics: [] }
];

// --- CORE SYSTEM ---
function switchState(s) {
    document.querySelectorAll('.screen-state').forEach(div => div.classList.add('hidden'));
    document.getElementById(s).classList.remove('hidden');
}

function initializeSystem() {
    const id = document.getElementById('op-id').value.toUpperCase();
    if(!id) return alert("ID_REQUIRED");
    document.getElementById('boot-log').innerText = "LINKING...";
    setTimeout(() => {
        switchState('dashboard');
        renderCharts();
        startDashboard();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Welcome, Operator ${id}`));
    }, 1000);
}

// --- MUSIC & VISUALIZER ---
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', { height: '0', width: '0', videoId: 'K6KByL6T3S4' });
}

function renderCharts() {
    const container = document.getElementById('chart-container');
    musicData.forEach(song => {
        const div = document.createElement('div');
        div.className = "chart-entry";
        div.onclick = () => playTrack(song);
        div.innerHTML = `<span>0${song.rank}</span> ${song.title}`;
        container.appendChild(div);
    });
}

function playTrack(song) {
    document.getElementById('current-track').innerText = "LIVE: " + song.title;
    player.loadVideoById(song.vidId);
    initVisualizer();
    startLyricStream(song);
}

function initVisualizer() {
    const cvs = document.getElementById('visualizer');
    const ctx = cvs.getContext('2d');
    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
    function draw() {
        ctx.clearRect(0,0,cvs.width,cvs.height);
        ctx.fillStyle = "#00f2ff";
        for(let i=0; i<30; i++) ctx.fillRect(i*6, cvs.height, 4, -Math.random()*cvs.height);
        requestAnimationFrame(draw);
    }
    draw();
}

function startLyricStream(track) {
    const logs = document.getElementById('term-logs');
    clearInterval(lyricInterval);
    lyricInterval = setInterval(() => {
        const time = Math.floor(player.getCurrentTime());
        const lyric = track.lyrics.find(l => l.t === time);
        if(lyric) {
            logs.innerHTML = `<div style="color:#ffcc00">&lt;lyric&gt;${lyric.text}&lt;/lyric&gt;</div>` + logs.innerHTML;
        }
    }, 1000);
}

// --- DASHBOARD ---
function startDashboard() {
    const cvs = document.getElementById('neural-canvas');
    const ctx = cvs.getContext('2d');
    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
    function loop() {
        ctx.fillStyle = 'rgba(0,5,16,0.1)';
        ctx.fillRect(0,0,cvs.width,cvs.height);
        ctx.fillStyle = '#00f2ff';
        ctx.fillRect(Math.random()*cvs.width, Math.random()*cvs.height, 2, 2);
        requestAnimationFrame(loop);
    }
    loop();
}

function handleCommand(e) {
    if(e.key === 'Enter') {
        const cmd = e.target.value.toUpperCase();
        if(cmd === "VALENTINE") switchState('valentine-screen');
        if(cmd === "OVERRIDE") document.documentElement.style.setProperty('--primary', '#ff0033');
        e.target.value = "";
    }
}