const btn = document.getElementById('revealBtn');
const revealSection = document.getElementById('revealSection');
const song = document.getElementById('loveSong');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressSlider = document.getElementById('progressSlider');
const volumeSlider = document.getElementById('volumeSlider');
const songTitle = document.getElementById('songTitle');
const mainText = document.getElementById('mainText');
const carouselInner = document.getElementById('carouselInner');


const particles = ['🌸', '🌹', '💖', '✨', '🌷', '🤍'];

// Carousel variables
const carouselImage = document.getElementById('carouselImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');


const images = [
    'My_princess/princess.png', 'My_princess/princess2.jpeg', 'My_princess/princess3.jpeg',
    'My_princess/princess4.jpeg', 'My_princess/princess5.jpeg',
    'My_princess/princess7.jpeg', 'My_princess/princess8.jpeg', 'My_princess/princess9.jpeg',
    'My_princess/princess10.jpeg', 'My_princess/princess11.jpeg', 'My_princess/princess12.jpeg',
    'My_princess/princess13.jpeg', 'My_princess/princess14.jpeg', 'My_princess/princess15.jpeg',
    'My_princess/princess16.jpeg', 'My_princess/princess17.jpeg', 'My_princess/princess18.jpeg',
     'My_princess/princess20.jpeg', 
    'My_princess/princess22.jpeg', 'My_princess/princess23.jpeg', 'My_princess/princess24.jpeg',
    'My_princess/princess25.jpeg', 'My_princess/princess26.jpeg', 'My_princess/princess27.jpeg',
    'My_princess/princess28.jpeg', 'My_princess/princess29.jpeg', 'My_princess/princess30.jpeg',
    'My_princess/princess31.jpeg', 'My_princess/princess32.jpeg', 'My_princess/princess33.jpeg',
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


// Event listeners for carousel
prevBtn.addEventListener('click', previousImage);
nextBtn.addEventListener('click', nextImage);

document.addEventListener('keydown', (e) => {
    if (revealSection.classList.contains('show')) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') previousImage();
    }
});
createDots();

function togglePlay() {
    if (song.paused) {
        song.play();
        playPauseBtn.innerText = "||";
    } else {
        song.pause();
        playPauseBtn.innerText = "▶";
    }
}

function restartMusic() {
    song.currentTime = 0;
    song.play();
    playPauseBtn.innerText = "||";
}

function stopMusic() {
    song.pause();
    song.currentTime = 0;
    playPauseBtn.innerText = "▶";
}

song.addEventListener('timeupdate', () => {
    const percentage = (song.currentTime / song.duration) * 100;
    progressSlider.value = percentage;
});

progressSlider.addEventListener('input', () => {
    const time = (progressSlider.value / 100) * song.duration;
    song.currentTime = time;
});

volumeSlider.addEventListener('input', (e) => {
    song.volume = e.target.value;
});

function createParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.innerText = particles[Math.floor(Math.random() * particles.length)];
    document.body.appendChild(p);

    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.transform = 'translate(-50%, -50%)'; 

    const destX = (Math.random() - 0.5) * 600;
    const destY = (Math.random() - 0.5) * 600;

    p.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.5) rotate(720deg)`, opacity: 0 }
    ], { 
        duration: 3000, 
        easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)' 
    }).onfinish = () => p.remove();
}

btn.addEventListener('click', () => {
    revealSection.classList.add('show');
    mainText.innerText = "The Most Perfect Woman in the World";
    btn.classList.add('hidden');
    
    songTitle.innerText = "Now Playing: American Wedding";
    song.play();
    playPauseBtn.innerText = "||";

    const imgContainer = document.querySelector('.image-container');
    const rect = imgContainer.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    for(let i = 0; i < 100; i++) {
        setTimeout(() => createParticle(centerX, centerY), i * 5);
    }
});

// Function to turn seconds into MM:SS format
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = "0" + sec;
    return min + ":" + sec;
}

const currentTimeText = document.getElementById('currentTime');
const durationTimeText = document.getElementById('durationTime');

song.addEventListener('loadedmetadata', () => {
    durationTimeText.innerText = formatTime(song.duration);
});

song.addEventListener('timeupdate', () => {
    const percentage = (song.currentTime / song.duration) * 100;
    progressSlider.value = percentage;
    
    currentTimeText.innerText = formatTime(song.currentTime);
});
