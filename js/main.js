const apiKey = "";

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

const generateWishBtn = document.getElementById('generateWishBtn');
const wishSpinner = document.getElementById('wishSpinner');
const nameInput = document.getElementById('name');
const messageTextarea = document.getElementById('message');
const rsvpForm = document.getElementById('rsvpForm');
const formMessage = document.getElementById('form-message');

async function callGeminiAPI(prompt, retries = 3, delay = 1000) {
    if (!apiKey) {
        /* Trick thôi chứ hông là lộ API key ó */
        await new Promise(res => setTimeout(res, 800));
        const guestName = nameInput.value.trim() || "Một người bạn";
        const sampleWishes = [
            "Chúc hai bạn Hoàng Tuấn và Hoàng Dung trăm năm tình viên mãn, bạc đầu nghĩa phu thê! Mãi hạnh phúc nhé.",
            "Thật vui khi được chứng kiến ngày hạnh phúc của Hoàng Tuấn và Hoàng Dung. Chúc hai bạn một hành trình mới đầy ắp tiếng cười và yêu thương.",
            "Chúc mừng hạnh phúc của Hoàng Tuấn và Hoàng Dung! Mong rằng tình yêu của hai bạn sẽ luôn nồng nàn như ngày đầu và cùng nhau xây dựng một tương lai tuyệt vời.",
            "Gửi đến cặp đôi tuyệt vời nhất hôm nay! Chúc Hoàng Tuấn và Hoàng Dung có một cuộc sống hôn nhân viên mãn, luôn thấu hiểu và là điểm tựa vững chắc cho nhau.",
            "Chúc mừng ngày trọng đại! Chúc Hoàng Tuấn và Hoàng Dung mãi mãi hạnh phúc, tình yêu luôn đong đầy và sớm có tin vui nhé!",
            "Chúc mừng hạnh phúc Hoàng Tuấn & Hoàng Dung! Cánh cửa mới đã mở ra, chúc hai bạn cùng nhau viết nên một câu chuyện tình yêu thật đẹp.",
            "Ngày hôm nay thật tuyệt vời! Chúc cho tình yêu của Hoàng Tuấn và Hoàng Dung sẽ luôn là ngọn lửa ấm áp, sưởi ấm cho nhau suốt cuộc đời.",
            "Từ hôm nay, thế giới có thêm một gia đình nhỏ. Chúc Hoàng Tuấn và Hoàng Dung luôn yêu thương, nhường nhịn và cùng nhau vun đắp hạnh phúc.",
            "Chúc mừng ngày chung đôi! Mong rằng mỗi ngày của hai bạn đều ngọt ngào như viên kẹo, và rực rỡ như một đóa hoa.",
            "Gửi ngàn lời chúc tốt đẹp nhất đến Hoàng Tuấn và Hoàng Dung. Chúc hai bạn có một cuộc sống hôn nhân tràn ngập niềm vui và tiếng cười.",
            "Hạnh phúc là một hành trình, không phải đích đến. Chúc Hoàng Tuấn và Hoàng Dung luôn nắm chặt tay nhau trên mọi nẻo đường.",
            "Chúc mừng đám cưới vàng! Chúc Hoàng Tuấn và Hoàng Dung sớm có quý tử, gia đình luôn rộn rã tiếng cười trẻ thơ.",
            "Thật ngưỡng mộ tình yêu của hai bạn. Chúc Hoàng Tuấn và Hoàng Dung mãi giữ được sự lãng mạn và ngọt ngào như thuở ban đầu.",
            "Chúc cho ngôi nhà chung của Hoàng Tuấn và Hoàng Dung luôn là nơi bình yên, là chốn về sau mỗi ngày làm việc mệt mỏi.",
            "Hôm nay hai bạn thật rạng rỡ! Chúc Hoàng Tuấn và Hoàng Dung một khởi đầu mới hoàn hảo và một tương lai viên mãn.",
            "Tình yêu của hai bạn đã đơm hoa kết trái. Chúc Hoàng Tuấn và Hoàng Dung mãi hạnh phúc, thuận vợ thuận chồng, tát biển Đông cũng cạn.",
            "Chúc mừng hạnh phúc lứa đôi! Chúc Hoàng Tuấn và Hoàng Dung luôn là mảnh ghép hoàn hảo nhất của đời nhau.",
            "Một chương mới của cuộc đời đã bắt đầu. Chúc Hoàng Tuấn và Hoàng Dung sẽ có những trang sách đầy ắp kỷ niệm đẹp và yêu thương.",
            "Gửi lời chúc mừng đến cô dâu xinh đẹp và chú rể tài năng! Chúc Hoàng Tuấn và Hoàng Dung có một cuộc sống hôn nhân như ý.",
            "Chúc hai bạn 'sống tới già, răng rụng hết vẫn là của nhau'. Mừng hạnh phúc Hoàng Tuấn & Hoàng Dung!",
            "Cung hỷ, cung hỷ! Chúc Hoàng Tuấn và Hoàng Dung luôn đồng lòng, đồng sức xây dựng tổ ấm hạnh phúc của riêng mình.",
            "Chúc cho tình yêu của Hoàng Tuấn và Hoàng Dung sẽ vượt qua mọi sóng gió, và ngày càng trở nên bền chặt, sâu đậm hơn.",
            "Thật tuyệt khi được ở đây chung vui cùng hai bạn. Chúc Hoàng Tuấn và Hoàng Dung mãi là tình nhân, là tri kỷ của nhau.",
            "Chúc mừng ngày vui của Hoàng Tuấn và Hoàng Dung. Mong hai bạn sẽ có một cuộc sống hôn nhân thật nhiều màu sắc và thú vị.",
            "Cuối cùng thì thuyền cũng đã cập bến. Chúc thuyền trưởng Hoàng Tuấn và thuyền viên Hoàng Dung có một hải trình hạnh phúc bất tận!"
        ];

        const randomIndex = Math.floor(Math.random() * sampleWishes.length);
        const randomWish = sampleWishes[randomIndex];

        return `${randomWish} Thân gửi từ ${guestName}.`;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể nhận được gợi ý lúc này. Vui lòng thử lại sau.";
    } catch (error) {
        if (retries > 0) {
            await new Promise(res => setTimeout(res, delay));
            return callGeminiAPI(prompt, retries - 1, delay * 2);
        }
        console.error("Lỗi khi gọi Gemini API:", error);
        return "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
    }
}

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
        const result = await callGeminiAPI(prompt);
        messageTextarea.value = result;
        generateWishBtn.disabled = false;
        wishSpinner.classList.add('hidden');
    });
}

if (rsvpForm) {
    const submitButton = rsvpForm.querySelector('button[type="submit"]');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3jUsdkgYJ3DQ2dz5Tq3Q5sUjyXX2BEHnvnkA7c65Wur1eC0smzhBoNiOrXCTA4qbx/exec';
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!SCRIPT_URL) {
            formMessage.textContent = 'Chức năng gửi đang được cấu hình. Vui lòng quay lại sau.';
            formMessage.className = 'mt-4 text-center text-orange-700 font-semibold';
            return;
        }
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="flex items-center justify-center"><svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Đang gửi...</span>`;
        fetch(SCRIPT_URL, { method: 'POST', body: new FormData(rsvpForm) })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                formMessage.textContent = 'Cảm ơn bạn đã gửi phản hồi!';
                formMessage.className = 'mt-4 text-center text-green-700 font-semibold';
                rsvpForm.reset();
                triggerConfetti();
            } else { throw new Error('Lỗi từ máy chủ.'); }
        })
        .catch(error => {
            console.error('Lỗi!', error);
            formMessage.textContent = 'Gửi phản hồi thất bại. Vui lòng thử lại sau.';
            formMessage.className = 'mt-4 text-center text-red-700 font-semibold';
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            setTimeout(() => { formMessage.textContent = ''; }, 6000);
        });
    });
}

function triggerConfetti() {
    const confettiCount = 100;
    const confettiContainer = document.body;
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#fde047', '#ffffff'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 6 + 4}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confettiContainer.appendChild(confetti);

        const angle = Math.random() * 2 * Math.PI;
        const velocity = Math.random() * 300 + 200;
        const gravity = 1.2;
        const rotation = Math.random() * 720 - 360;

        const animation = confetti.animate([
            { transform: `translate(-50%, -50%) rotate(0deg)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity + 400 * gravity}px)) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 1000,
            easing: 'cubic-bezier(0.1, 0.9, 0.9, 1)',
        });

        animation.onfinish = () => confetti.remove();
    }
}

const sliderTrack = document.getElementById('slider-track');
if (sliderTrack) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slides = Array.from(sliderTrack.children);
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoPlayInterval;

    function goToSlide(index) {
        currentIndex = (index + slideCount) % slideCount;
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }
    prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); resetAutoPlay(); });
    goToSlide(0);
    resetAutoPlay();
}

const imagePreviewModal = document.getElementById('image-preview-modal');
if (imagePreviewModal && sliderTrack) {
    const previewImage = document.getElementById('preview-image');
    const closePreviewBtn = document.getElementById('close-preview-btn');
    const previewPrevBtn = document.getElementById('preview-prev-btn');
    const previewNextBtn = document.getElementById('preview-next-btn');
    const allSliderImages = Array.from(sliderTrack.children);
    let currentPreviewIndex = 0;

    const showImageInPreview = (index) => {
        if (index < 0 || index >= allSliderImages.length) return;
        currentPreviewIndex = index;
        previewImage.src = allSliderImages[currentPreviewIndex].src;
    };

    sliderTrack.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            const clickedIndex = allSliderImages.indexOf(e.target);
            if (clickedIndex !== -1) {
                showImageInPreview(clickedIndex);
                imagePreviewModal.classList.remove('hidden');
                document.body.classList.add('no-scroll');
            }
        }
    });

    const closePreview = () => {
        imagePreviewModal.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        previewImage.src = "";
    };

    closePreviewBtn.addEventListener('click', closePreview);
    imagePreviewModal.addEventListener('click', (e) => {
        if (e.target === imagePreviewModal) closePreview();
    });

    previewPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImageInPreview((currentPreviewIndex - 1 + allSliderImages.length) % allSliderImages.length); });
    previewNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImageInPreview((currentPreviewIndex + 1) % allSliderImages.length); });

    document.addEventListener('keydown', (e) => {
        if (!imagePreviewModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closePreview();
            else if (e.key === 'ArrowLeft') previewPrevBtn.click();
            else if (e.key === 'ArrowRight') previewNextBtn.click();
        }
    });
}

const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.add('hidden');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const musicToggleButton = document.getElementById('music-toggle-btn');
const musicIcon = document.getElementById('music-icon');
const audioPlayer = document.getElementById('background-music');
let isMuted = true;
let hasInteracted = false;

if (audioPlayer && musicToggleButton) {
    function updateVolumeIcon() {
        musicIcon.classList.toggle('fa-volume-high', !isMuted);
        musicIcon.classList.toggle('fa-volume-xmark', isMuted);
    }

    const startMusicOnInteraction = () => {
        if (hasInteracted) return;
        hasInteracted = true;

        audioPlayer.play().then(() => {
            isMuted = false;
            audioPlayer.volume = 0.8; // Đặt âm lượng ở mức 80% (giá trị từ 0.0 đến 1.0)
            updateVolumeIcon();
            musicToggleButton.classList.remove('pulse-animation');
            musicToggleButton.title = "Bật/Tắt nhạc";
        }).catch(error => {
            console.error("Lỗi tự động phát nhạc:", error);
            hasInteracted = false;
            musicToggleButton.title = "Nhấp để bật nhạc";
        });
    };

    updateVolumeIcon();
    musicToggleButton.classList.add('pulse-animation');
    musicToggleButton.title = "Nhấp hoặc cuộn trang để bật nhạc";

    const interactionOptions = { once: true, passive: true };
    document.body.addEventListener('scroll', startMusicOnInteraction, interactionOptions);
    document.body.addEventListener('click', (e) => {
        if (!e.target.closest('#music-toggle-btn')) {
            startMusicOnInteraction();
        }
    }, interactionOptions);

    musicToggleButton.addEventListener('click', () => {
        if (!hasInteracted) {
            startMusicOnInteraction();
        } else {
            isMuted = !isMuted;
            audioPlayer.volume = isMuted ? 0 : 0.8;
            updateVolumeIcon();
        }
    });
}

const bubblesOverlay = document.getElementById('bubbles-overlay');
if (bubblesOverlay) {
    const createBubble = () => {
        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.bottom = '-100px';
        bubble.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.898z' fill='rgba(251, 113, 133, 0.6)'/%3E%3C/svg%3E")`;
        bubble.style.backgroundSize = 'contain';
        bubble.style.backgroundRepeat = 'no-repeat';
        bubble.style.pointerEvents = 'auto';
        bubble.style.cursor = 'pointer';

        const size = Math.random() * 40 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}vw`;
        
        const animationDuration = Math.random() * 15 + 10;
        const randomRotation = Math.random() * 90 - 45;
        
        const floatAnimation = bubble.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: Math.random() * 0.6 + 0.3 },
            { transform: `translateY(-120vh) rotate(${randomRotation}deg)`, opacity: 0 }
        ], {
            duration: animationDuration * 1000,
            easing: 'linear',
        });

        bubblesOverlay.appendChild(bubble);

        floatAnimation.onfinish = () => bubble.remove();

        bubble.addEventListener('mouseover', () => {
            floatAnimation.cancel();
            const rect = bubble.getBoundingClientRect();
            bubble.style.display = 'none';

            const particleCount = 5 + Math.floor(Math.random() * 5);
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.898z' fill='rgba(251, 113, 133, 0.7)'/%3E%3C/svg%3E")`;
                particle.style.backgroundSize = 'contain';
                particle.style.backgroundRepeat = 'no-repeat';
                const particleSize = rect.width * (Math.random() * 0.4 + 0.2);
                particle.style.width = `${particleSize}px`;
                particle.style.height = `${particleSize}px`;

                particle.style.left = `${rect.left + (rect.width / 2) - (particleSize / 2)}px`;
                particle.style.top = `${rect.top + (rect.height / 2) - (particleSize / 2)}px`;
                particle.style.pointerEvents = 'none';
                bubblesOverlay.appendChild(particle);

                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 50 + 20;
                const translateX = Math.cos(angle) * distance;
                const translateY = Math.sin(angle) * distance;
                const rotation = Math.random() * 360 - 180;

                const particleAnimation = particle.animate({
                    transform: [
                        'scale(1) rotate(0deg)',
                        `translate(${translateX}px, ${translateY}px) scale(0) rotate(${rotation}deg)`
                    ],
                    opacity: [1, 0]
                }, {
                    duration: 600 + Math.random() * 400,
                    easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)',
                });

                particleAnimation.onfinish = () => particle.remove();
            }
            bubble.remove();
        }, { once: true });
    };

    setInterval(createBubble, 700);
}
