// Smooth scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        navbar.style.background = 'rgba(255, 248, 240, 0.98)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255, 248, 240, 0.9)';
    }
});

// Product Image Color Swapper Logic
const colorDots = document.querySelectorAll('.color-dot');
// Assuming we only have the green physical image since the prompt only provided one image 
// for the 3-in-1 dispenser, we will just simulate a subtle effect for the user selection.
colorDots.forEach(dot => {
    dot.addEventListener('click', function() {
        // Remove active class from all
        colorDots.forEach(d => d.classList.remove('active'));
        // Add active to clicked
        this.classList.add('active');
        
        // Simple scale effect to show interaction
        const mainImg = document.querySelector('.main-product-img');
        mainImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            mainImg.style.transform = 'scale(1)';
        }, 200);
    });
});

// Scroll Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            entry.target.style.opacity = 1;
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.pricing-card, .glass-panel, .section-header').forEach((el) => {
    el.style.opacity = 0;
    observer.observe(el);
});

// ==========================================
// GSAP Apple-like Framer Motion Animations
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// IMAGE SEQUENCE ANIMATION
// ==========================================
const canvas = document.getElementById("sequence-canvas");
if (canvas) {
    const context = canvas.getContext("2d");

    const frameCount = 240;
    const currentFrame = index => (
      `7/an/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`
    );

    const images = [];
    const imageSequence = {
      frame: 0
    };

    // Preload first image and set dimensions
    const initialImage = new Image();
    initialImage.src = currentFrame(0);
    initialImage.onload = () => {
        canvas.width = initialImage.width;
        canvas.height = initialImage.height;
        context.drawImage(initialImage, 0, 0);
    };

    // Preload all images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    const render = () => {
        if(images[imageSequence.frame] && images[imageSequence.frame].complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[imageSequence.frame], 0, 0);
        }
    }

    // Scroll animation for sequence frames
    gsap.to(imageSequence, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#features-sequence",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
      },
      onUpdate: render
    });

}

// Parallax and fade effect for Hero text
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom center',
        scrub: 1 // smooth scrubbing like framer motion
    },
    y: 150,
    opacity: 0,
    scale: 0.95,
    ease: "none"
});

// Animate the hero background for depth effect
gsap.to('.hero', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    backgroundPosition: "50% 100%", // creates a subtle parallax pan
    ease: "none"
});

// ==========================================
// REVIEWS TOGGLE & RENDER
// ==========================================
const reviewsData = [
    {
        name: "Rahul K.",
        rating: 5,
        review: "സാധനം ഏതായാലും കൊള്ളാം പൈസക്ക് മൊതലാവും ഒറപ്പ് 💯"
    },
    {
        name: "Anita S.",
        rating: 4,
        review: "item കൊള്ളാം, simple ആയിട്ട് പാത്രം ഒക്കെ കഴുകാൻ പറ്റും പിന്നെ free delivery ആയോണ്ട് കൊടുത്ത പൈസക്ക് ലാഭണ്"
    },
    {
        name: "Faisal M.",
        rating: 4,
        review: "sanam വിചാരചിക്കനേക്കാളും adipoliyan"
    },
    {
        name: "divya",
        rating: 4,
        review: "offer കൊള്ളാം, പത്തു steel wool kitumm🤍"
    },
    {
        name: "megha",
        rating: 3,
        review: "oil dispenser nn korach neelam korvahn enna kozhappam matram ollu combo offer istayi🫶"
    },
    {
        name: "vaishnav vinod",
        rating: 3,
        review: "quality💯"
    }
];

const toggleReviewsBtn = document.getElementById('toggleReviewsBtn');
const reviewsList = document.getElementById('reviewsList');
const reviewTriggers = document.querySelectorAll('[data-review-trigger]');

if (toggleReviewsBtn && reviewsList) {
    const renderStars = (rating) => {
        const filled = '★'.repeat(Math.max(0, Math.min(5, rating)));
        const empty = '☆'.repeat(5 - Math.max(0, Math.min(5, rating)));
        return `${filled}${empty}`;
    };

    const renderReviews = () => {
        reviewsList.innerHTML = reviewsData.map((item) => `
            <article class="review-card">
                <div class="review-meta">
                    <span class="review-name">${item.name}</span>
                    <span class="rating-badge">${item.rating}/5</span>
                </div>
                <div class="stars" aria-label="${item.rating} out of 5 stars">${renderStars(item.rating)}</div>
                <p class="review-text">${item.review}</p>
            </article>
        `).join('');
        reviewsList.dataset.rendered = 'true';
    };

    const openReviews = () => {
        if (!reviewsList.dataset.rendered) {
            renderReviews();
        }
        if (!reviewsList.classList.contains('open')) {
            reviewsList.classList.add('open');
            toggleReviewsBtn.textContent = 'Hide Reviews';
            toggleReviewsBtn.setAttribute('aria-expanded', 'true');
            reviewsList.setAttribute('aria-hidden', 'false');
        }
        reviewsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    toggleReviewsBtn.addEventListener('click', () => {
        if (!reviewsList.dataset.rendered) {
            renderReviews();
        }

        const isOpen = reviewsList.classList.toggle('open');
        toggleReviewsBtn.textContent = isOpen ? 'Hide Reviews' : 'Show Reviews';
        toggleReviewsBtn.setAttribute('aria-expanded', isOpen.toString());
        reviewsList.setAttribute('aria-hidden', (!isOpen).toString());
    });

    reviewTriggers.forEach(btn => btn.addEventListener('click', openReviews));
}
