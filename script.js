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

// Mobile burger menu toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
    const closeMenu = () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}

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
