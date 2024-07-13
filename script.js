const staticVideo = document.getElementById("staticVideo");
const deathscreen = document.getElementById("deathscreen");
const deathMusic = document.getElementById("deathMusic");
const endMusic = document.getElementById("EndMusic"); // Elemen audio baru
const guidingLight = document.getElementById("guidingLight");
const playButton = document.getElementById("playButton");
const loadingScreen = document.getElementById("loadingScreen");
const fpsSwitch = document.getElementById("fpsSwitch");
const fpsContainer = document.getElementById("fpsContainer");
const fpsCounter = document.getElementById("fpsCounter");

const dialogs = [
    "Terburu-buru... Tampaknya kamu terjebak dalam tergesa-gesa yang mematikan.",
    "Rush tidak mengenal belas kasihan. Dia akan terus mengejarmu tanpa henti.",
    "Ketika lampu berkedip, itu adalah tanda peringatan. Carilah tempat berlindung segera.",
    "Jangan biarkan kepanikan menguasai dirimu. Tetap tenang dan perhatikan sekelilingmu.",
    "Hanya ada satu tempat persembunyian yang aman dari Rush. Temukanlah sebelum terlambat.",
    "Ingatlah, kamu hanya perlu bersembunyi sekali untuk menghindari Rush.",
    "Belajarlah dari kesalahan ini, dan semoga keberuntungan berpihak padamu di lain waktu."
];

let currentDialogIndex = 0;
let fpsInterval;
let lastFrameTime = Date.now();
deathMusic.loop = false;

function showNextDialog(initialDelay = false, onComplete = null) {
    guidingLight.textContent = dialogs[currentDialogIndex];

    // Tampilkan dengan animasi fade-in
    guidingLight.style.opacity = '0'; // Atur opacity ke 0 terlebih dahulu
    guidingLight.style.display = 'block'; // Pastikan elemen ditampilkan

    // Gunakan setTimeout untuk memicu perubahan opacity
    setTimeout(() => {
        guidingLight.style.opacity = '1'; // Set opacity menjadi 1 untuk fade-in
    }, 100); // Tunda sedikit untuk memastikan perubahan terlihat

    const dialogDisplayDuration = 5000; // Durasi teks sepenuhnya terlihat

    setTimeout(() => {
        // Sembunyikan dengan animasi fade-out
        guidingLight.style.opacity = '0';
        setTimeout(() => {
            guidingLight.style.display = 'none'; // Sembunyikan elemen setelah fade-out
            currentDialogIndex++;
            if (currentDialogIndex < dialogs.length) {
                showNextDialog(false, onComplete);
            } else if (onComplete) {
                onComplete();
            }
        }, 1000); // Durasi fade-out
    }, dialogDisplayDuration);

    // Cek jika sudah mencapai akhir dialog
    if (currentDialogIndex === dialogs.length - 1) { // Saat dialog terakhir sebelum menyelesaikan semua dialog
        // Lakukan sesuatu setelah fade out terakhir
        setTimeout(() => {
            endMusic.currentTime = 0;
            endMusic.play();
            deathMusic.pause();
            deathMusic.currentTime = 0;
            
        }, dialogDisplayDuration + 1000); // Tambah 1 detik untuk memastikan fade out selesai
    }
}

// Sembunyikan loading screen saat halaman pertama kali dimuat
loadingScreen.style.display = 'none';

playButton.addEventListener('click', function() {
    // Tampilkan loading screen
    loadingScreen.style.display = 'flex';

    // Sembunyikan fps switch
    fpsContainer.style.display = 'flex';

    // Get custom dialogs from textboxes
    for (let i = 1; i <= 7; i++) {
        const textbox = document.getElementById(`textbox${i}`);
        if (textbox.value.trim()) {
            dialogs[i - 1] = textbox.value.trim();
        }
    }

    // Reset dialog index
    currentDialogIndex = 0;

    // Tunda pemutaran video dan musik selama 4 detik untuk mensimulasikan loading
    setTimeout(() => {
        // Sembunyikan loading screen
        loadingScreen.style.display = 'none';

        // Display death screen and play video and audio
      
        deathscreen.style.display = 'block';
        staticVideo.style.opacity = '1';
        staticVideo.style.display = 'block';
        staticVideo.loop = false;
        staticVideo.currentTime = 0; // Mulai dari awal setiap kali tombol play ditekan
        staticVideo.play();
        deathMusic.play();
        fpsContainer.style.opacity = '0';

        // Tambahkan delay sekali setelah 3.7 detik
        setTimeout(() => {
            showNextDialog(true, () => {
                // Callback to fade out the video after all dialogs
                staticVideo.style.opacity = '0';

                setTimeout(() => {
                    staticVideo.pause();
                    staticVideo.currentTime = 0; // Stop the video playback
                    staticVideo.style.display = 'none';
                    deathscreen.style.display = 'none';
                    fpsContainer.style.opacity = '1';

                    
                    
                }, 1000); // Duration of fade out
            });
        }, 3700); // Delay sekali setelah 3.7 detik
    }, 4000); // 4-second loading time
});

// Handle FPS switch toggle
fpsSwitch.addEventListener('change', function() {
    if (this.checked) {
        // Show FPS counter
        fpsCounter.style.display = 'block';
        startFPSCounter();
    } else {
        // Hide FPS counter
        fpsCounter.style.display = 'none';
        stopFPSCounter();
    }
});

function startFPSCounter() {
    fpsInterval = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastFrameTime) / 1000;
        const fps = Math.round(1 / delta);
        fpsCounter.textContent = `FPS: ${fps}`;
        lastFrameTime = now;
    }, 1000 / 60); // Update FPS every 1/60th of a second
}

function stopFPSCounter() {
    clearInterval(fpsInterval);
}
