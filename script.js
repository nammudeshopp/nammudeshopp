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
let navbarUpdateQueued = false;
let navbarIsScrolled = false;

const updateNavbar = () => {
    const isScrolled = window.scrollY > 50;
    navbarUpdateQueued = false;

    if (isScrolled === navbarIsScrolled) return;

    navbarIsScrolled = isScrolled;
    if (isScrolled) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        navbar.style.background = 'rgba(255, 248, 240, 0.98)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255, 248, 240, 0.9)';
    }
};

window.addEventListener('scroll', () => {
    if (!navbarUpdateQueued) {
        navbarUpdateQueued = true;
        requestAnimationFrame(updateNavbar);
    }
}, { passive: true });

// Product Image Color Swapper Logic
const colorDots = document.querySelectorAll('.color-dot');
const mainImg = document.querySelector('.main-product-img');
// Assuming we only have the green physical image since the prompt only provided one image 
// for the 3-in-1 dispenser, we will just simulate a subtle effect for the user selection.
colorDots.forEach(dot => {
    dot.addEventListener('click', function() {
        // Remove active class from all
        colorDots.forEach(d => d.classList.remove('active'));
        // Add active to clicked
        this.classList.add('active');
        
        // Simple scale effect to show interaction
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
      `7/an/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images = new Map();
    const imageSequence = {
      frame: 0
    };
    const preloadAhead = 24;
    const preloadBehind = 6;
    const maxCachedFrames = 48;

    const loadFrame = index => {
        if (index < 0 || index >= frameCount || images.has(index)) {
            return images.get(index);
        }

        const image = new Image();
        image.decoding = 'async';
        image.src = currentFrame(index);
        image.addEventListener('error', () => {
            if (images.get(index) === image) images.delete(index);
        }, { once: true });
        images.set(index, image);
        return image;
    };

    const trimFrameCache = currentFrameIndex => {
        if (images.size <= maxCachedFrames) return;

        [...images.keys()]
            .sort((a, b) => Math.abs(b - currentFrameIndex) - Math.abs(a - currentFrameIndex))
            .slice(0, images.size - maxCachedFrames)
            .forEach(index => images.delete(index));
    };

    const preloadNearbyFrames = currentFrameIndex => {
        const start = Math.max(0, currentFrameIndex - preloadBehind);
        const end = Math.min(frameCount - 1, currentFrameIndex + preloadAhead);

        for (let index = start; index <= end; index += 1) {
            loadFrame(index);
        }

        trimFrameCache(currentFrameIndex);
    };

    const render = () => {
        const frameIndex = Math.round(imageSequence.frame);
        const image = loadFrame(frameIndex);

        if (image && image.complete && image.naturalWidth) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
        }

        preloadNearbyFrames(frameIndex);
    }

    // Load only the first visible frame immediately. Remaining frames are
    // requested around the viewer's scroll position instead of all at once.
    const initialImage = loadFrame(0);
    initialImage.addEventListener('load', () => {
        canvas.width = initialImage.naturalWidth;
        canvas.height = initialImage.naturalHeight;
        render();
    }, { once: true });

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
