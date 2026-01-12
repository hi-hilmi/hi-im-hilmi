// Theme Management
class ThemeManager {
    constructor() {
        this.themeSwitch = document.getElementById('theme-switch');
        this.body = document.body;
        this.init();
    }

    init() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener for theme toggle
        this.themeSwitch.addEventListener('change', () => {
            const newTheme = this.themeSwitch.checked ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        if (theme === 'dark') {
            this.body.setAttribute('data-theme', 'dark');
            this.themeSwitch.checked = true;
        } else {
            this.body.removeAttribute('data-theme');
            this.themeSwitch.checked = false;
        }
        
        localStorage.setItem('theme', theme);
        
        // Add smooth transition class
        this.body.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add click event listeners to dock items
        const dockItems = document.querySelectorAll('.dock-item[href^="#"]');
        dockItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.project-card, .contact-item, .hero-content');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });
    }
}

// Dock Hover Effects
class DockEffects {
    constructor() {
        this.init();
    }

    init() {
        const dock = document.querySelector('.dock');
        const dockItems = document.querySelectorAll('.dock-item');

        dockItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Scale up the hovered item and adjacent items
                dockItems.forEach((otherItem, otherIndex) => {
                    const distance = Math.abs(index - otherIndex);
                    let scale = 1;
                    
                    if (distance === 0) scale = 1.2;
                    else if (distance === 1) scale = 1.1;
                    else if (distance === 2) scale = 1.05;
                    
                    otherItem.style.transform = `translateY(-4px) scale(${scale})`;
                });
            });

            item.addEventListener('mouseleave', () => {
                // Reset all items
                dockItems.forEach(otherItem => {
                    otherItem.style.transform = 'translateY(0) scale(1)';
                });
            });
        });

        // Reset on dock leave
        dock.addEventListener('mouseleave', () => {
            dockItems.forEach(item => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Parallax Effect for Hero Section
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (this.hero) {
                this.hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Project Card Interactions
class ProjectInteractions {
    constructor() {
        this.init();
    }

    init() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add subtle rotation and glow effect
                card.style.transform = 'translateY(-8px) rotateX(5deg)';
                card.style.boxShadow = '0 20px 60px var(--shadow), 0 0 0 1px rgba(255, 255, 255, 0.1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0deg)';
                card.style.boxShadow = '0 8px 32px var(--shadow)';
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: none;
                    z-index: 1;
                `;

                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Typing Animation for Hero Title
class TypingAnimation {
    constructor() {
        this.heroTitle = document.querySelector('.hero-title');
        this.originalText = this.heroTitle.textContent;
        this.init();
    }

    init() {
        this.heroTitle.textContent = '';
        this.typeText(this.originalText, 0);
    }

    typeText(text, index) {
        if (index < text.length) {
            this.heroTitle.textContent += text.charAt(index);
            setTimeout(() => this.typeText(text, index + 1), 100);
        }
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SmoothScroll();
    new AnimationObserver();
    new DockEffects();
    new ParallaxEffect();
    new ProjectInteractions();
    
    // Add slight delay for typing animation
    setTimeout(() => {
        new TypingAnimation();
    }, 500);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle resize events for responsive behavior
window.addEventListener('resize', () => {
    // Recalculate dock position if needed
    const dock = document.querySelector('.dock');
    if (dock) {
        dock.style.transform = 'translateX(-50%)';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll-based animations
const throttledScroll = throttle(() => {
    // Any scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);