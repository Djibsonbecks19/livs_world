const song          = document.getElementById('loveSong');
const playPauseBtn  = document.getElementById('playPauseBtn');
const progressSlider= document.getElementById('progressSlider');
const volumeSlider  = document.getElementById('volumeSlider');
const songTitle     = document.getElementById('songTitle');
const mainText      = document.getElementById('mainText');
const imgContainer  = document.getElementById('imgContainer');
const musicCard     = document.getElementById('musicCard');
const currentTime   = document.getElementById('currentTime');
const durationTime  = document.getElementById('durationTime');
const bouquetBtn    = document.getElementById('bouquetBtn');
const backBtn       = document.getElementById('backBtn');
const particles     = ['🌸','🌹','💖','✨','🌷','🤍'];


const carouselImage = document.getElementById('carouselImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');


const images = [
    'Olivia/bunny1.jpeg',
    'Olivia/bunny2.jpeg',
    'Olivia/bunny3.jpeg',
    'Olivia/bunny4.jpeg',
    'Olivia/bunny5.jpeg',
    'Olivia/bunny6.jpeg',
    'Olivia/bunny7.jpeg',
    'Olivia/bunny8.jpeg',
    'Olivia/bunny9.jpeg',
    'Olivia/bunny10.jpeg',
    'Olivia/bunny11.jpeg',
    'Olivia/bunny12.jpeg'
];

let currentImageIndex = 0;

function createDots() {
    dotsContainer.innerHTML = '';
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToImage(index));
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageIndex);
    });
}

function goToImage(index) {
    currentImageIndex = index;
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
}
// Next image
function nextImage() {
    const nextIndex = (currentImageIndex + 1) % images.length;
    goToImage(nextIndex);
}

// Previous image
function previousImage() {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    goToImage(prevIndex);
}


prevBtn.addEventListener('click', previousImage);
nextBtn.addEventListener('click', nextImage);

document.addEventListener('keydown', (e) => {
    if (revealSection.classList.contains('show')) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') previousImage();
    }
});
createDots();

// Save state before navigating away
function saveState() {
    sessionStorage.setItem('mp_time',    song.currentTime);
    sessionStorage.setItem('mp_playing', !song.paused);
    sessionStorage.setItem('mp_volume',  song.volume);
}

bouquetBtn.addEventListener('click', () => { saveState(); window.location.href = 'bouquet.html'; });
backBtn.addEventListener('click', (e) => { e.preventDefault(); saveState(); window.location.href = 'index.html'; });
window.addEventListener('beforeunload', saveState);
window.addEventListener('pagehide', saveState);

function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return m + ':' + (sec<10?'0':'') + sec;
}

function togglePlay() {
    if (song.paused) { song.play(); playPauseBtn.textContent='||'; }
    else             { song.pause(); playPauseBtn.textContent='▶'; }
}
function restartMusic() { song.currentTime=0; song.play(); playPauseBtn.textContent='||'; }
function stopMusic()    { song.pause(); song.currentTime=0; playPauseBtn.textContent='▶'; }

song.addEventListener('timeupdate', () => {
    const pct = (song.currentTime / song.duration) * 100;
    progressSlider.value = pct;
    currentTime.textContent = fmt(song.currentTime);
});
song.addEventListener('loadedmetadata', () => { durationTime.textContent = fmt(song.duration); });
progressSlider.addEventListener('input', () => { song.currentTime = (progressSlider.value/100) * song.duration; });
volumeSlider.addEventListener('input', e => { song.volume = e.target.value; });

function createParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = particles[Math.floor(Math.random() * particles.length)];
    document.body.appendChild(p);
    p.style.left = x+'px'; p.style.top = y+'px';
    p.style.transform = 'translate(-50%,-50%)';
    const dx = (Math.random()-.5)*700, dy = (Math.random()-.5)*700;
    p.animate([
        {transform:'translate(-50%,-50%) scale(0)',opacity:1},
        {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1.5) rotate(720deg)`,opacity:0}
    ],{duration:3000,easing:'cubic-bezier(0.1,0.9,0.2,1)'}).onfinish = () => p.remove();
}

// Restore or start fresh
window.addEventListener('load', () => {
    const savedTime    = parseFloat(sessionStorage.getItem('mp_time')    || '0');
    const wasPlaying   = sessionStorage.getItem('mp_playing') === 'true';
    const savedVol     = parseFloat(sessionStorage.getItem('mp_volume')  || '1');

    imgContainer.classList.add('show');
    musicCard.classList.add('show');
    mainText.textContent = "Liv's World";
    songTitle.textContent = "Now Playing: I Was All Over Her";

    song.volume = savedVol;
    volumeSlider.value = savedVol;

    // Always play on reveal page load — it's the reveal moment
    song.addEventListener('canplay', function onCanPlay() {
        song.removeEventListener('canplay', onCanPlay);
        if (savedTime > 0) song.currentTime = savedTime;
        song.play().catch(()=>{});
        playPauseBtn.textContent = '||';
    }, {once:true});

    // Particle burst
    setTimeout(() => {
        const rect = imgContainer.getBoundingClientRect();
        const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
        for (let i=0;i<80;i++) setTimeout(()=>createParticle(cx,cy), i*6);
    }, 600);
});