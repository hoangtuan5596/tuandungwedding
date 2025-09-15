document.addEventListener('DOMContentLoaded', () => {
    /**
     * Configuration constants.
     * It's better to keep configurable values in one place.
     */
    const CONFIG = {
        // The API key is intentionally left blank to use the fallback.
        // To use the Gemini API, provide a valid key here.
        GEMINI_API_KEY: "",
        // Google Apps Script URL for the RSVP form.
        RSVP_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw3jUsdkgYJ3DQ2dz5Tq3Q5sUjyXX2BEHnvnkA7c65Wur1eC0smzhBoNiOrXCTA4qbx/exec',
        SCROLL_ANIMATION_THRESHOLD: 0.1,
        SCROLL_ANIMATION_ROOT_MARGIN: '0px 0px -50px 0px',
        SCROLL_TO_TOP_VISIBILITY_Y: 400,
        BUBBLE_INTERVAL: 700,
    };

    /**
     * Initializes the mobile navigation menu.
     */
    const initMobileMenu = () => {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!menuButton || !mobileMenu) return;

        const mobileLinks = mobileMenu.querySelectorAll('a');

        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    };

    /**
     * Initializes the album modal popup.
     */
    const initAlbumModal = () => {
        const albumModal = document.getElementById('album-modal');
        if (!albumModal) return;

        const openTriggers = document.querySelectorAll('.open-album-link, #open-album-btn');
        const closeBtn = document.getElementById('close-album-btn');

        const openModal = (e) => {
            e.preventDefault();
            albumModal.classList.remove('hidden');
            document.body.classList.add('no-scroll');
        };

        const closeModal = () => {
            albumModal.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        };

        openTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        albumModal.addEventListener('click', (e) => {
            if (e.target === albumModal) {
                closeModal();
            }
        });
    };

    /**
     * Initializes scroll-triggered animations for sections.
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: CONFIG.SCROLL_ANIMATION_THRESHOLD,
            rootMargin: CONFIG.SCROLL_ANIMATION_ROOT_MARGIN,
        });

        animatedElements.forEach(el => observer.observe(el));
    };

    /**
     * Initializes the RSVP form functionality, including AI wish generation and submission.
     */
    const initRsvpForm = () => {
        const rsvpForm = document.getElementById('rsvpForm');
        if (!rsvpForm) return;

        const nameInput = document.getElementById('name');
        const messageTextarea = document.getElementById('message');
        const generateWishBtn = document.getElementById('generateWishBtn');
        const wishSpinner = document.getElementById('wishSpinner');
        const formMessage = document.getElementById('form-message');
        const submitButton = rsvpForm.querySelector('button[type="submit"]');

        // --- AI Wish Generation ---
        const callGeminiAPI = async (prompt) => {
            // Fallback logic if API key is not provided
            if (!CONFIG.GEMINI_API_KEY) {
                await new Promise(res => setTimeout(res, 800)); // Simulate network delay
                const guestName = nameInput.value.trim() || "Một người bạn";
                const sampleWishes = [
                    "Chúc hai bạn Hoàng Tuấn và Hoàng Dung trăm năm tình viên mãn, bạc đầu nghĩa phu thê! Mãi hạnh phúc nhé.",
                    "Thật vui khi được chứng kiến ngày hạnh phúc của Hoàng Tuấn và Hoàng Dung. Chúc hai bạn một hành trình mới đầy ắp tiếng cười và yêu thương.",
                    "Chúc mừng hạnh phúc của Hoàng Tuấn và Hoàng Dung! Mong rằng tình yêu của hai bạn sẽ luôn nồng nàn như ngày đầu.",
                    "Gửi đến cặp đôi tuyệt vời nhất hôm nay! Chúc Hoàng Tuấn và Hoàng Dung có một cuộc sống hôn nhân viên mãn.",
                    "Chúc mừng ngày trọng đại! Chúc Hoàng Tuấn và Hoàng Dung mãi mãi hạnh phúc, tình yêu luôn đong đầy và sớm có tin vui nhé!",
                ];
                const randomWish = sampleWishes[Math.floor(Math.random() * sampleWishes.length)];
                return `${randomWish} Thân gửi từ ${guestName}.`;
            }
            // Actual API call logic
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể nhận được gợi ý lúc này.";
            } catch (error) {
                console.error("Lỗi khi gọi Gemini API:", error);
                return "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
            }
        };

        if (generateWishBtn) {
            generateWishBtn.addEventListener('click', async () => {
                const guestName = nameInput.value.trim();
                if (!guestName) {
                    alert("Vui lòng nhập tên của bạn trước khi tạo lời chúc nhé!");
                    return;
                }
                generateWishBtn.disabled = true;
                wishSpinner.classList.remove('hidden');
                messageTextarea.value = "Đang sáng tác lời chúc...";
                const prompt = `Viết một lời chúc mừng đám cưới ngắn gọn (khoảng 2-3 câu), chân thành và độc đáo cho cặp đôi Hoàng Tuấn và Hoàng Dung. Lời chúc được gửi từ ${guestName}.`;
                messageTextarea.value = await callGeminiAPI(prompt);
                generateWishBtn.disabled = false;
                wishSpinner.classList.add('hidden');
            });
        }

        // --- Form Submission ---
        const triggerConfetti = () => {
            // This function is well-contained and can stay as is.
            const confettiCount = 100,
                colors = ['#f43f5e', '#ec4899', '#d946ef', '#fde047', '#ffffff'];
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                Object.assign(confetti.style, {
                    position: 'fixed', left: '50%', top: '50%',
                    width: `${Math.random() * 10 + 5}px`, height: `${Math.random() * 6 + 4}px`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    opacity: '0', pointerEvents: 'none', zIndex: '9999'
                });
                document.body.appendChild(confetti);
                const angle = Math.random() * 2 * Math.PI, velocity = Math.random() * 300 + 200,
                    gravity = 1.2, rotation = Math.random() * 720 - 360;
                const animation = confetti.animate([
                    { transform: `translate(-50%, -50%) rotate(0deg)`, opacity: 1 },
                    { transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity + 400 * gravity}px)) rotate(${rotation}deg)`, opacity: 0 }
                ], { duration: 1500 + Math.random() * 1000, easing: 'cubic-bezier(0.1, 0.9, 0.9, 1)' });
                animation.onfinish = () => confetti.remove();
            }
        };

        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="flex items-center justify-center"><svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Đang gửi...</span>`;

            fetch(CONFIG.RSVP_SCRIPT_URL, { method: 'POST', body: new FormData(rsvpForm) })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        formMessage.textContent = 'Cảm ơn bạn đã gửi phản hồi!';
                        formMessage.className = 'mt-4 text-center text-green-700 font-semibold';
                        rsvpForm.reset();
                        triggerConfetti();
                    } else {
                        throw new Error('Lỗi từ máy chủ Google Script.');
                    }
                })
                .catch(error => {
                    console.error('Lỗi gửi form!', error);
                    formMessage.textContent = 'Gửi phản hồi thất bại. Vui lòng thử lại sau.';
                    formMessage.className = 'mt-4 text-center text-red-700 font-semibold';
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    setTimeout(() => { formMessage.textContent = ''; }, 6000);
                });
        });
    };

    /**
     * Initializes the image preview modal for all galleries.
     */
    const initImagePreview = () => {
        const previewModal = document.getElementById('image-preview-modal');
        if (!previewModal) return;

        const previewImage = document.getElementById('preview-image');
        const closeBtn = document.getElementById('close-preview-btn');
        const prevBtn = document.getElementById('preview-prev-btn');
        const nextBtn = document.getElementById('preview-next-btn');

        let currentImageSet = [];
        let currentPreviewIndex = 0;

        const showImage = (index) => {
            if (index < 0 || index >= currentImageSet.length) return;
            currentPreviewIndex = index;
            previewImage.src = currentImageSet[currentPreviewIndex].src;
        };

        const openPreview = (clickedImage, imageContainer) => {
            currentImageSet = Array.from(imageContainer.querySelectorAll('img'));
            const clickedIndex = currentImageSet.indexOf(clickedImage);
            if (clickedIndex !== -1) {
                showImage(clickedIndex);
                previewModal.classList.remove('hidden');
                document.body.classList.add('no-scroll');
            }
        };

        const closePreview = () => {
            previewModal.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            previewImage.src = ""; // Stop image loading
        };

        const setupGallery = (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    openPreview(e.target, container);
                }
            });
        };

        // Event Listeners
        closeBtn.addEventListener('click', closePreview);
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) closePreview();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage((currentPreviewIndex - 1 + currentImageSet.length) % currentImageSet.length);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage((currentPreviewIndex + 1) % currentImageSet.length);
        });
        document.addEventListener('keydown', (e) => {
            if (previewModal.classList.contains('hidden')) return;
            if (e.key === 'Escape') closePreview();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });

        // Initialize for all galleries on the page
        ['photo-grid', 'album-preview-grid'].forEach(setupGallery);
    };

    /**
     * Initializes the "scroll to top" button.
     */
    const initScrollToTop = () => {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (!scrollToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.SCROLL_TO_TOP_VISIBILITY_Y) {
                scrollToTopBtn.classList.remove('hidden');
            } else {
                scrollToTopBtn.classList.add('hidden');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    /**
     * Initializes the welcome overlay and background music player.
     */
    const initMusicPlayer = () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        const enterBtn = document.getElementById('enter-website-btn');
        const musicToggleBtn = document.getElementById('music-toggle-btn');
        const musicIcon = document.getElementById('music-icon');
        const audioPlayer = document.getElementById('background-music');

        if (!audioPlayer || !loadingOverlay || !enterBtn || !musicToggleBtn) return;

        let isMuted = true;
        let hasInteracted = false;

        const updateVolumeIcon = () => {
            musicIcon.classList.toggle('fa-volume-high', !isMuted);
            musicIcon.classList.toggle('fa-volume-xmark', isMuted);
        };

        const startMusic = () => {
            if (hasInteracted) return;
            hasInteracted = true;

            audioPlayer.play().then(() => {
                isMuted = false;
                audioPlayer.volume = 0.8;
                updateVolumeIcon();
                musicToggleBtn.classList.remove('pulse-animation');
                musicToggleBtn.title = "Bật/Tắt nhạc";
                sessionStorage.setItem('musicShouldPlay', 'true');
            }).catch(error => {
                console.error("Lỗi tự động phát nhạc:", error);
                hasInteracted = false; // Allow user to try again
            });
        };

        // Handle welcome overlay
        document.body.classList.add('no-scroll');
        enterBtn.addEventListener('click', () => {
            startMusic();
            loadingOverlay.classList.add('opacity-0');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 500);
        });

        // Handle music state persistence across pages
        window.addEventListener('beforeunload', () => {
            if (hasInteracted) {
                sessionStorage.setItem('musicTime', audioPlayer.currentTime);
                sessionStorage.setItem('musicMuted', isMuted);
            }
        });

        if (sessionStorage.getItem('musicShouldPlay') === 'true') {
            hasInteracted = true;
            const musicTime = parseFloat(sessionStorage.getItem('musicTime')) || 0;
            const musicMuted = sessionStorage.getItem('musicMuted') === 'true';

            isMuted = musicMuted;
            audioPlayer.volume = isMuted ? 0 : 0.8;

            if (!isMuted) {
                audioPlayer.currentTime = musicTime;
                audioPlayer.play().catch(e => console.error("Không thể tự động tiếp tục nhạc.", e));
            }
            musicToggleBtn.classList.remove('pulse-animation');
            musicToggleBtn.title = "Bật/Tắt nhạc";
        }
        updateVolumeIcon();

        // Handle music toggle button
        musicToggleBtn.addEventListener('click', () => {
            if (!hasInteracted) {
                startMusic();
                return;
            }
            isMuted = !isMuted;
            audioPlayer.volume = isMuted ? 0 : 0.8;
            updateVolumeIcon();
            sessionStorage.setItem('musicShouldPlay', !isMuted ? 'true' : 'false');
        });
    };

    /**
     * Initializes the floating heart bubble effect.
     */
    const initBubbleEffect = () => {
        const bubblesOverlay = document.getElementById('bubbles-overlay');
        if (!bubblesOverlay) return;

        const createBubble = () => {
            const bubble = document.createElement('div');
            const size = Math.random() * 40 + 10;
            const animationDuration = Math.random() * 15 + 10;
            const randomRotation = Math.random() * 90 - 45;

            Object.assign(bubble.style, {
                position: 'absolute',
                bottom: '-100px',
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}vw`,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.898z' fill='rgba(251, 113, 133, 0.6)'/%3E%3C/svg%3E")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none', // Crucial to prevent blocking clicks
            });

            const floatAnimation = bubble.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: Math.random() * 0.6 + 0.3 },
                { transform: `translateY(-120vh) rotate(${randomRotation}deg)`, opacity: 0 }
            ], {
                duration: animationDuration * 1000,
                easing: 'linear',
            });

            bubblesOverlay.appendChild(bubble);
            floatAnimation.onfinish = () => bubble.remove();
        };

        setInterval(createBubble, CONFIG.BUBBLE_INTERVAL);
    };

    // --- Initialize all modules ---
    initMobileMenu();
    initAlbumModal();
    initScrollAnimations();
    initRsvpForm();
    initImagePreview();
    initScrollToTop();
    initMusicPlayer();
    initBubbleEffect();
});