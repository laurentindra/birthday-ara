/* 
   Script JS - Website Ulang Tahun Dara Azzahra (Ara) ke-18
   Interactive, dynamic and romantic scripts.
*/

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 0. INISIALISASI & CONFIG
    // -----------------------------------------------------------------

    // Target Waktu: 23 Mei 2026 pukul 00:00:00 WIB
    const targetDate = new Date("2026-05-23T00:00:00+07:00").getTime();

    // Suara Efek & BGM
    const bgm = document.getElementById('bgm-player');

    // -----------------------------------------------------------------
    // 1. DYNAMIC CURSOR TRAIL (Kursor Hati Berkilau)
    // -----------------------------------------------------------------
    const cursor = document.getElementById('custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Spawn partikel hati kecil berkilau secara acak saat mouse bergerak
        if (Math.random() < 0.15) {
            createHeartParticle(e.clientX, e.clientY);
        }
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    function createHeartParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.innerHTML = ['💖', '❤️', '✨', '🌸', '⭐'][Math.floor(Math.random() * 5)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.position = 'fixed';
        particle.style.pointerEvents = 'none';
        particle.style.fontSize = Math.random() * 12 + 10 + 'px';
        particle.style.zIndex = '9998';

        const velocityX = (Math.random() - 0.5) * 3;
        const velocityY = (Math.random() - 0.5) * 3 - 2;
        let opacity = 1;

        document.body.appendChild(particle);

        const animate = () => {
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            x += velocityX;
            y += velocityY;
            opacity -= 0.02;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${opacity})`;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // -----------------------------------------------------------------
    // 2. LOGIKA HITUNG MUNDUR (COUNTDOWN) & TRANSISI
    // -----------------------------------------------------------------
    const countdownScreen = document.getElementById('countdown-screen');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Interval Update Hitung Mundur
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Jalankan sekali di awal

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Cek jika waktu sudah lewat/tercapai
        if (difference <= 0) {
            clearInterval(countdownInterval);
            transitionToEnvelope();
            return;
        }

        // Kalkulasi waktu
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        // Update DOM dengan format dua digit
        daysEl.innerText = String(d).padStart(2, '0');
        hoursEl.innerText = String(h).padStart(2, '0');
        minutesEl.innerText = String(m).padStart(2, '0');
        secondsEl.innerText = String(s).padStart(2, '0');
    }

    // EASTER EGG BYPASS UNTUK TESTING DEVELOPER
    // Jika mengeklik judul countdown 5 kali berturut-turut, countdown akan terlewati!
    let bypassClicks = 0;
    const countdownTitle = document.querySelector('.countdown-card h2');
    if (countdownTitle) {
        countdownTitle.addEventListener('click', () => {
            bypassClicks++;
            if (bypassClicks >= 5) {
                clearInterval(countdownInterval);
                transitionToEnvelope();
                // Munculkan toast kecil
                showFloatingMsg(window.innerWidth / 2, window.innerHeight / 2, "Bypass Aktif! 😉💖");
            }
        });
    }

    function transitionToEnvelope() {
        countdownScreen.classList.add('fade-out');
        setTimeout(() => {
            countdownScreen.classList.remove('active');
            envelopeScreen.classList.add('active');
        }, 1000);
    }

    // -----------------------------------------------------------------
    // 3. LOGIKA GERBANG AMPLOP (ENVELOPE DECOR & ACTIVATION)
    // -----------------------------------------------------------------
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    let isEnvelopeOpened = false;

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            if (isEnvelopeOpened) return;
            isEnvelopeOpened = true;

            // Tambahkan kelas open pada amplop
            envelopeWrapper.classList.add('open');

            // Putar musik (Autoplay aktif karena user berinteraksi mengeklik amplop)
            playBGM();

            // Luncurkan kembang api confetti
            triggerConfettiExplosion(3);

            // Transisi ke konten utama website setelah amplop terbuka
            setTimeout(() => {
                envelopeScreen.classList.add('fade-out');
                setTimeout(() => {
                    envelopeScreen.classList.remove('active');
                    // Tampilkan Konten Utama
                    mainContent.style.display = 'block';
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                        // Mulai ketik typewriter teks sambutan hero
                        startHeroTypewriter();
                        // Mulai balon mengambang
                        startFloatingBalloons();
                        // Buat hujan hati di hero
                        startFloatingHearts();
                    }, 50);
                }, 1000);
            }, 2500);
        });
    }

    function playBGM() {
        if (bgm) {
            bgm.currentTime = 0;
            bgm.volume = 0.7;
            bgm.play().then(() => {
                console.log("BGM started successfully.");
            }).catch(err => {
                console.log("Playback blocked. Waiting for another interaction.", err);
                // Fallback: coba putar lagi saat klik berikutnya
                document.addEventListener('click', function retryPlay() {
                    bgm.play();
                    document.removeEventListener('click', retryPlay);
                }, { once: true });
            });
        }
    }

    // -----------------------------------------------------------------
    // 4. MUSIC CONTROLLER WIDGET
    // -----------------------------------------------------------------
    const toggleMusicBtn = document.getElementById('toggle-music');
    const cassetteDisc = document.querySelector('.cassette-disc i');
    let isPlaying = true;

    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgm.pause();
                toggleMusicBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                cassetteDisc.classList.remove('fa-spin');
                isPlaying = false;
            } else {
                bgm.play();
                toggleMusicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                cassetteDisc.classList.add('fa-spin');
                isPlaying = true;
            }
        });
    }

    // -----------------------------------------------------------------
    // 5. HERO TYPEWRITER EFFECT
    // -----------------------------------------------------------------
    const heroText = "Selamat datang di hari mulai dewasa eak, Dara Azzahra sayangku!  Hari ini bener-bener hari khusus milik kamu yang resmi berusia 18 tahun. Scrolll ke bawah dan nikmatin semua kejutan manis yang udah aku siapin spesial cuma buat kamu! Aku sayang banget sama kamu... ";
    const typewriterEl = document.getElementById('hero-typewriter');

    function startHeroTypewriter() {
        let index = 0;
        typewriterEl.innerHTML = "";

        function type() {
            if (index < heroText.length) {
                typewriterEl.innerHTML += heroText.charAt(index);
                index++;
                setTimeout(type, 45); // Kecepatan mengetik (ms per karakter)
            }
        }
        type();
    }

    // Hujan Hati di Hero Background
    const heartsBg = document.getElementById('floating-hearts-bg');
    function startFloatingHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['❤️', '💖', '💕', '✨', '🌸'][Math.floor(Math.random() * 5)];
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '110%';
            heart.style.fontSize = Math.random() * 20 + 15 + 'px';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heart.style.pointerEvents = 'none';
            heart.style.animation = `float-up ${Math.random() * 5 + 6}s linear forwards`;

            heartsBg.appendChild(heart);
            setTimeout(() => heart.remove(), 11000);
        }, 600);
    }

    // -----------------------------------------------------------------
    // 6. TIUP LILIN KUE INTERAKTIF (CAKE BLOW MECHANICS)
    // -----------------------------------------------------------------
    const candles = document.querySelectorAll('.candle');
    const blowBtn = document.getElementById('blow-btn');
    const wishesBox = document.getElementById('wishes-box');
    let blownCount = 0;

    // Klik lilin secara manual untuk mematikannya satu per satu
    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (candle.classList.contains('blown')) return;

            candle.classList.remove('active');
            candle.classList.add('blown');
            blownCount++;

            // Efek pop letusan kecil
            showFloatingMsg(candle.getBoundingClientRect().left + 10, candle.getBoundingClientRect().top - 20, "Fuuuh~ 💨");

            // Cek jika seluruh lilin mati
            checkAllCandlesBlown();
        });
    });

    // Tombol tiup semua lilin
    if (blowBtn) {
        blowBtn.addEventListener('click', () => {
            let unblownCandles = document.querySelectorAll('.candle:not(.blown)');
            if (unblownCandles.length === 0) return;

            unblownCandles.forEach(candle => {
                candle.classList.remove('active');
                candle.classList.add('blown');
                blownCount++;
            });

            checkAllCandlesBlown();
        });
    }

    function checkAllCandlesBlown() {
        if (blownCount >= 3) {
            // Sembunyikan tombol tiup
            blowBtn.style.display = 'none';

            // Ledakan Confetti super meriah
            triggerConfettiExplosion(8);

            // Tampilkan kotak doa manis
            setTimeout(() => {
                wishesBox.classList.add('active');
                wishesBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        }
    }

    // -----------------------------------------------------------------
    // 7. PECACAHAN BALON CINTA (BALLOON POPPER)
    // -----------------------------------------------------------------
    const balloonCanvas = document.getElementById('balloon-canvas');
    const balloonMessages = [
        "Ara itu tercantik se-alam semesta! 😍",
        "Makasih yaa udah lahir ke dunia ini Ara sayangku 🌸",
        "Aku selalu salting tiap lihat senyum manis kamu 🥰",
        "Jangan pernah bosen sama aku yaa sayangku ❤️",
        "Ara tuh kado terindah yang pernah aku milikin! 💖",
        "Sabar yaa sayangku kalau aku kadang ngeselin... 🥺👉👈",
        "Aku mau temenin kamu terus sampai nenek kakek! 👩‍❤️‍👨",
        "Happy 18th Birthday kesayangan aku! 🎂",
        "Semoga semua cita-cita Ara tercapai yaa! 🌟",
        "Ara adalah prioritas utamaku selamanya! 👑",
        "Tiap detik bareng kamu tuh happy banget lho 💕",
        "Kamu tuh tetep tercantik pas lagi ngambek sekalipun! 😠❤️",
        "Aku sayang kamu to the moon and back! 🌙✨",
        "Semoga hari-hari kamu dipenuhi tawa ceria terus yaa! 😊"
    ];

    const balloonColors = [
        'rgba(255, 183, 178, 0.85)', // Pink Pastel
        'rgba(232, 174, 255, 0.85)', // Lavender Pastel
        'rgba(255, 218, 193, 0.85)', // Peach Pastel
        'rgba(255, 245, 186, 0.85)', // Kuning Pastel
        'rgba(186, 255, 201, 0.85)', // Hijau Pastel
        'rgba(186, 225, 255, 0.85)'  // Biru Pastel
    ];

    let balloonTimer;
    function startFloatingBalloons() {
        // Hasilkan balon setiap 1.5 detik
        balloonTimer = setInterval(createBalloon, 1500);
    }

    function createBalloon() {
        if (!balloonCanvas) return;

        const balloon = document.createElement('div');
        balloon.className = 'balloon-item';

        // Random warna, posisi kiri, ukuran, dan kecepatan melayang
        const randomColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const randomLeft = Math.random() * 85 + 5; // 5% s/d 90%
        const randomScale = Math.random() * 0.3 + 0.85; // 0.85 s/d 1.15
        const randomDuration = Math.random() * 4 + 7; // 7s s/d 11s

        balloon.style.backgroundColor = randomColor;
        balloon.style.left = randomLeft + '%';
        balloon.style.transform = `scale(${randomScale})`;
        balloon.style.animationDuration = randomDuration + 's';

        // Tambahkan interaksi pecah
        balloon.addEventListener('click', (e) => {
            popBalloon(balloon, e.clientX, e.clientY);
        });

        balloonCanvas.appendChild(balloon);

        // Hapus balon secara otomatis jika melayang keluar canvas
        setTimeout(() => {
            if (balloon.parentNode) {
                balloon.remove();
            }
        }, randomDuration * 1000);
    }

    function popBalloon(balloonEl, clickX, clickY) {
        // Hapus balon
        balloonEl.remove();

        // Buat efek suara letusan balon secara buatan (jika audio terhambat)
        // Kita tampilkan pesan cinta melayang ke atas
        const randomMsg = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];

        // Ambil koordinat relatif terhadap kanvas balon
        const rect = balloonCanvas.getBoundingClientRect();
        const relativeX = clickX - rect.left;
        const relativeY = clickY - rect.top;

        const msgBubble = document.createElement('div');
        msgBubble.className = 'pop-message';
        msgBubble.innerText = randomMsg;
        msgBubble.style.left = (relativeX - 60) + 'px';
        msgBubble.style.top = (relativeY - 20) + 'px';

        balloonCanvas.appendChild(msgBubble);

        // Trigger ledakan kecil confetti di titik letusan
        triggerSmallConfetti(clickX, clickY);

        // Hapus pesan melayang setelah animasi selesai (1.5 detik)
        setTimeout(() => {
            msgBubble.remove();
        }, 1500);
    }

    function showFloatingMsg(x, y, text) {
        const msg = document.createElement('div');
        msg.className = 'pop-message';
        msg.innerText = text;
        msg.style.left = x + 'px';
        msg.style.top = y + 'px';
        msg.style.position = 'fixed';
        msg.style.pointerEvents = 'none';
        msg.style.zIndex = '9999';

        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    }

    // -----------------------------------------------------------------
    // 8. MESIN VENDING KUPON MANJA (GASHAPON LOVE MACHINE)
    // -----------------------------------------------------------------
    const couponList = [
        {
            icon: "🍦",
            title: "Kupon Jajan Sepuasnya",
            sub: "BERLAKU SELAMANYA",
            desc: "Ara berhak minta traktir jajan apa aja yang Ara mau, kapan aja tanpa batas! Tinggal tunjukin kupon ini ke sayangmu yaa! 🍔🧋🍰"
        },
        {
            icon: "🤗",
            title: "Kupon Pelukan Erat 30 Menit",
            sub: "TANPA BATAS WAKTU",
            desc: "Ara bisa minta dipeluk erat-erat selama 30 menit nonstop kapan pun Ara butuh. Dijamin hangat dan bikin semua masalah hilang! 🫂💖"
        },
        {
            icon: "🎬",
            title: "Kupon Nonton Film Bareng",
            sub: "VALID KAPAN AJA",
            desc: "Ara bisa pilih film apa aja buat ditonton bareng, mau di bioskop atau rebahan di rumah, sayangg wajib nemenin tanpa protes! 🎬🍿"
        },
        {
            icon: "😠",
            title: "Kupon Bebas Ngambek 1 Hari",
            sub: "PAKAI SAAT DARURAT",
            desc: "Ara bisa ngambek seharian penuh tanpa perlu alasan yang jelas dan sayangg wajib ngerayu sampai Ara senyum lagi! Wkwk 🥺👉👈"
        },
        {
            icon: "💌",
            title: "Kupon Surat Cinta Dadakan",
            sub: "REQUEST KAPAN AJA",
            desc: "Ara bisa minta sayangmu nulis surat cinta dadakan yang panjang dan romantis kapan pun Ara mau. Wajib dari hati yang paling dalam! 📝💕"
        },
        {
            icon: "🛍️",
            title: "Kupon Temenin Belanja",
            sub: "TANPA NGELUH",
            desc: "Sayangg wajib nemenin Ara belanja ke mana aja yang Ara mau, bawain semua belanjaannya, dan gak boleh ngeluh capek! 🛒👑"
        },
        {
            icon: "🌙",
            title: "Kupon Telepon Sampai Tidur",
            sub: "BERLAKU MALAM INI",
            desc: "Ara bisa minta sayangmu teleponan sampai ketiduran. Gak boleh ngeluh ngantuk duluan, harus nemenin Ara sampai pules! 🌙😴💖"
        }
    ];

    // Shuffle coupon list
    const shuffledCoupons = [...couponList].sort(() => Math.random() - 0.5);
    let couponIndex = 0;

    const loveCoin = document.getElementById('love-coin');
    const crankEl = document.getElementById('crank-handle');
    const dispenserDoor = document.getElementById('dispenser-door');
    const dispenserArea = document.getElementById('dispenser-area');
    const couponCounterEl = document.getElementById('coupon-counter');

    let coinInserted = false;
    let isVendingBusy = false;

    // Step 1: Klik koin cinta untuk memasukkannya
    if (loveCoin) {
        loveCoin.addEventListener('click', () => {
            if (coinInserted || isVendingBusy || couponIndex >= shuffledCoupons.length) return;

            coinInserted = true;
            loveCoin.classList.add('inserted');
            showFloatingMsg(loveCoin.getBoundingClientRect().left, loveCoin.getBoundingClientRect().top - 30, "Koin masuk! 🪙✨");

            // Aktifkan tuas
            setTimeout(() => {
                crankEl.classList.remove('disabled');
                showFloatingMsg(crankEl.getBoundingClientRect().left, crankEl.getBoundingClientRect().top - 30, "Putar tuasnya! 🔄");
            }, 900);
        });
    }

    // Step 2: Putar tuas
    if (crankEl) {
        crankEl.addEventListener('click', () => {
            if (crankEl.classList.contains('disabled') || isVendingBusy) return;

            isVendingBusy = true;
            crankEl.classList.add('rotating');

            // Step 3: Setelah tuas berputar, buka pintu dispenser
            setTimeout(() => {
                dispenserDoor.classList.add('open');

                // Step 4: Jatuhkan kapsul setelah pintu terbuka
                setTimeout(() => {
                    const capsule = document.createElement('div');
                    capsule.className = 'dispensed-capsule';
                    capsule.innerHTML = shuffledCoupons[couponIndex].icon;
                    dispenserArea.appendChild(capsule);

                    triggerSmallConfetti(
                        dispenserArea.getBoundingClientRect().left + 60,
                        dispenserArea.getBoundingClientRect().top
                    );

                    // Step 5: Klik kapsul untuk buka kupon
                    capsule.addEventListener('click', () => {
                        openCoupon(shuffledCoupons[couponIndex]);
                        capsule.remove();

                        // Reset state mesin
                        couponIndex++;
                        coinInserted = false;
                        isVendingBusy = false;

                        // Update counter
                        const remaining = shuffledCoupons.length - couponIndex;
                        couponCounterEl.innerText = remaining;

                        // Reset visual mesin
                        loveCoin.classList.remove('inserted');
                        crankEl.classList.remove('rotating');
                        crankEl.classList.add('disabled');
                        dispenserDoor.classList.remove('open');

                        // Cek jika semua kupon sudah habis
                        if (couponIndex >= shuffledCoupons.length) {
                            loveCoin.style.opacity = '0.3';
                            loveCoin.style.pointerEvents = 'none';
                            showFloatingMsg(window.innerWidth / 2 - 60, window.innerHeight / 2, "Kupon habis! Simpan baik-baik ya sayangku! 💖");
                            triggerConfettiExplosion(5);
                        }
                    });
                }, 500);
            }, 1000);
        });
    }

    function openCoupon(coupon) {
        // Buat overlay pop-up kupon
        const overlay = document.createElement('div');
        overlay.className = 'coupon-display-container';
        overlay.innerHTML = `
            <div class="coupon-card">
                <div class="coupon-glow"></div>
                <div class="coupon-icon">${coupon.icon}</div>
                <h3>${coupon.title}</h3>
                <p class="coupon-sub">${coupon.sub}</p>
                <div class="coupon-divider"></div>
                <p class="coupon-desc">${coupon.desc}</p>
                <button class="cute-btn" id="close-coupon-btn"><i class="fa-solid fa-heart"></i> Simpan Kupon! 💕</button>
            </div>
        `;

        document.body.appendChild(overlay);
        triggerConfettiExplosion(3);

        // Tombol tutup kupon
        overlay.querySelector('#close-coupon-btn').addEventListener('click', () => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.4s';
            setTimeout(() => overlay.remove(), 400);
        });
    }

    // -----------------------------------------------------------------
    // 9. LIBRARY CONFETTI SEDERHANA (CONFETTI GENERATOR)
    // -----------------------------------------------------------------
    function triggerConfettiExplosion(intensityCount) {
        // Luncurkan ledakan kembang api confetti berkali-kali
        for (let i = 0; i < intensityCount; i++) {
            setTimeout(() => {
                const randomX = Math.random() * window.innerWidth;
                const randomY = Math.random() * (window.innerHeight * 0.7);
                createConfettiShower(randomX, randomY);
            }, i * 350);
        }
    }

    function triggerSmallConfetti(x, y) {
        createConfettiShower(x, y, 15);
    }

    function createConfettiShower(originX, originY, countCount = 45) {
        const colors = ['#FFB7B2', '#E8AEFF', '#FFDAC1', '#FFD1DC', '#FFD700', '#FF6584'];

        for (let i = 0; i < countCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 8 + 6 + 'px';
            confetti.style.height = Math.random() * 8 + 6 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = originX + 'px';
            confetti.style.top = originY + 'px';
            confetti.style.zIndex = '9997';
            confetti.style.pointerEvents = 'none';

            // Angle & Kecepatan ledakan
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 6 + 4;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity - 2; // Bias ke atas sedikit
            let gravity = 0.18;
            let opacity = 1;
            let currentX = originX;
            let currentY = originY;

            document.body.appendChild(confetti);

            const animate = () => {
                if (opacity <= 0 || currentY > window.innerHeight) {
                    confetti.remove();
                    return;
                }

                vy += gravity;
                currentX += vx;
                currentY += vy;
                opacity -= 0.015;

                confetti.style.left = currentX + 'px';
                confetti.style.top = currentY + 'px';
                confetti.style.opacity = opacity;
                confetti.style.transform = `rotate(${currentY * 2}deg) scale(${opacity})`;

                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }
});
