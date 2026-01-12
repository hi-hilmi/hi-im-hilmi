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
        // Create ripple effect for theme transition
        this.createThemeRipple();
        
        // Delay the actual theme change to sync with animation
        setTimeout(() => {
            if (theme === 'dark') {
                this.body.setAttribute('data-theme', 'dark');
                this.themeSwitch.checked = true;
            } else {
                this.body.removeAttribute('data-theme');
                this.themeSwitch.checked = false;
            }
            
            localStorage.setItem('theme', theme);
        }, 200);
    }

    createThemeRipple() {
        // Remove existing ripple if any
        const existingRipple = document.querySelector('.theme-ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple';
        
        // Get toggle button position
        const toggle = document.querySelector('.theme-toggle');
        const rect = toggle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate maximum distance to cover entire screen with extra margin
        const maxDistance = Math.sqrt(
            Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
            Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
        ) * 1.5;
        
        // Set ripple properties
        ripple.style.cssText = `
            position: fixed;
            top: ${centerY}px;
            left: ${centerX}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${this.themeSwitch.checked ? '#FFFFFF' : '#000000'};
            transform: translate(-50%, -50%);
            z-index: 9999;
            pointer-events: none;
            animation: themeRipple 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            opacity: 0.9;
        `;
        
        // Add CSS animation with smoother easing
        if (!document.querySelector('#theme-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'theme-ripple-style';
            style.textContent = `
                @keyframes themeRipple {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.9;
                        transform: translate(-50%, -50%) scale(0);
                    }
                    20% {
                        opacity: 0.7;
                        transform: translate(-50%, -50%) scale(0.2);
                    }
                    60% {
                        opacity: 0.4;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    100% {
                        width: ${maxDistance * 2}px;
                        height: ${maxDistance * 2}px;
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add ripple to body
        document.body.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1400);
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
// Project Modal Management
const projectData = {
    web: {
        title: "Web Projects",
        projects: [
            {
                title: "Portfolio Website",
                description: "Personal portfolio website with modern design and dark mode support",
                tech: ["HTML", "CSS", "JavaScript"],
                demo: "https://hi-hilmi.github.io/hi-im-hilmi/",
                code: "https://github.com/hi-hilmi/hi-im-hilmi"
            },
            {
                title: "E-Commerce Landing Page",
                description: "Responsive landing page for online store with product showcase",
                tech: ["HTML", "CSS", "Bootstrap"],
                demo: "#",
                code: "#"
            },
            {
                title: "Weather App",
                description: "Real-time weather application with location-based forecasts",
                tech: ["JavaScript", "API", "CSS"],
                demo: "#",
                code: "#"
            },
            {
                title: "Todo List App",
                description: "Interactive task management application with local storage",
                tech: ["React", "JavaScript", "CSS"],
                demo: "#",
                code: "#"
            },
            {
                title: "Restaurant Website",
                description: "Modern restaurant website with menu and reservation system",
                tech: ["HTML", "CSS", "JavaScript"],
                demo: "#",
                code: "#"
            }
        ]
    },
    mobile: {
        title: "Mobile Applications",
        projects: [
            {
                title: "Expense Tracker",
                description: "Personal finance management app with charts and analytics",
                tech: ["React Native", "SQLite"],
                demo: "#",
                code: "#"
            },
            {
                title: "News Reader App",
                description: "News aggregation app with offline reading capability",
                tech: ["Flutter", "Dart", "API"],
                demo: "#",
                code: "#"
            },
            {
                title: "Fitness Tracker",
                description: "Health and fitness tracking app with workout plans",
                tech: ["React Native", "Firebase"],
                demo: "#",
                code: "#"
            }
        ]
    },
    backend: {
        title: "Backend & APIs",
        projects: [
            {
                title: "REST API Server",
                description: "RESTful API with authentication and database integration",
                tech: ["Node.js", "Express", "MongoDB"],
                demo: "#",
                code: "#"
            },
            {
                title: "User Management System",
                description: "Complete user authentication and authorization system",
                tech: ["Python", "FastAPI", "PostgreSQL"],
                demo: "#",
                code: "#"
            },
            {
                title: "File Upload Service",
                description: "Secure file upload and management service with cloud storage",
                tech: ["Node.js", "AWS S3", "Multer"],
                demo: "#",
                code: "#"
            },
            {
                title: "Chat API",
                description: "Real-time messaging API with WebSocket support",
                tech: ["Python", "WebSocket", "Redis"],
                demo: "#",
                code: "#"
            }
        ]
    },
    devops: {
        title: "DevOps & Infrastructure",
        projects: [
            {
                title: "Docker Containerization",
                description: "Containerized web applications with Docker for consistent deployment across environments",
                tech: ["Docker", "Docker Compose", "Nginx"],
                demo: "#",
                code: "#"
            },
            {
                title: "CI/CD Pipeline with GitHub Actions",
                description: "Automated testing, building, and deployment pipeline using GitHub Actions",
                tech: ["GitHub Actions", "CI/CD", "Automation"],
                demo: "#",
                code: "#"
            },
            {
                title: "Server Setup & Configuration",
                description: "Complete server setup with Nginx reverse proxy and SSL configuration",
                tech: ["Nginx", "Linux", "SSL", "Server Management"],
                demo: "#",
                code: "#"
            },
            {
                title: "Monitoring & Logging System",
                description: "Application monitoring and centralized logging system for production environments",
                tech: ["Monitoring", "Logging", "Performance"],
                demo: "#",
                code: "#"
            }
        ]
    },
    testing: {
        title: "Quality Assurance & Testing",
        projects: [
            {
                title: "Automated Testing Suite",
                description: "Comprehensive automated testing framework with unit, integration, and E2E tests",
                tech: ["Jest", "Cypress", "Testing Library", "Automation"],
                demo: "#",
                code: "#"
            },
            {
                title: "API Testing Framework",
                description: "Complete API testing suite with automated validation and performance testing",
                tech: ["Jest", "Supertest", "API Testing", "Postman"],
                demo: "#",
                code: "#"
            },
            {
                title: "End-to-End Testing with Cypress",
                description: "Full E2E testing implementation for web applications with CI/CD integration",
                tech: ["Cypress", "E2E Testing", "CI/CD", "Playwright"],
                demo: "#",
                code: "#"
            },
            {
                title: "Test-Driven Development (TDD) Project",
                description: "Complete project built using TDD methodology with comprehensive test coverage",
                tech: ["TDD", "Unit Testing", "Jest", "Code Coverage"],
                demo: "#",
                code: "#"
            }
        ]
    },
    other: {
        title: "Other Projects",
        projects: [
            {
                title: "Network Monitor",
                description: "Network monitoring tool for system administrators",
                tech: ["Python", "Networking", "GUI"],
                demo: "#",
                code: "#"
            },
            {
                title: "File Organizer",
                description: "Automated file organization script for better productivity",
                tech: ["Python", "Automation"],
                demo: "#",
                code: "#"
            },
            {
                title: "System Backup Tool",
                description: "Automated backup solution for important system files",
                tech: ["Python", "Scheduling"],
                demo: "#",
                code: "#"
            },
            {
                title: "Log Analyzer",
                description: "Server log analysis tool with reporting features",
                tech: ["Python", "Data Analysis"],
                demo: "#",
                code: "#"
            },
            {
                title: "Password Generator",
                description: "Secure password generator with customizable options",
                tech: ["Python", "Security"],
                demo: "#",
                code: "#"
            },
            {
                title: "System Monitor",
                description: "Real-time system performance monitoring dashboard",
                tech: ["Python", "GUI", "System"],
                demo: "#",
                code: "#"
            }
        ]
    },
    academic: {
        title: "Academic Projects",
        projects: [
            {
                title: "Semester 5 Projects",
                description: "Advanced coursework including web development and software engineering",
                tech: ["React", "Node.js", "Database", "Software Engineering"],
                demo: "#",
                code: "#",
                semester: "5",
                courses: [
                    "Advanced Web Development - E-Commerce Platform",
                    "Database Management System - University Portal",
                    "Software Engineering - Team Project Management App"
                ],
                detailedProjects: [
                    {
                        title: "E-Commerce Platform",
                        description: "Full-stack web application with user authentication, product catalog, shopping cart, and payment integration",
                        tech: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
                        demo: "#",
                        code: "#",
                        course: "Advanced Web Development"
                    },
                    {
                        title: "University Portal System",
                        description: "Database-driven portal for student management, course enrollment, and grade tracking",
                        tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
                        demo: "#",
                        code: "#",
                        course: "Database Management System"
                    },
                    {
                        title: "Team Project Management App",
                        description: "Collaborative project management tool with task assignment, progress tracking, and team communication",
                        tech: ["React", "Node.js", "Socket.io", "PostgreSQL"],
                        demo: "#",
                        code: "#",
                        course: "Software Engineering"
                    }
                ]
            },
            {
                title: "Semester 4 Projects", 
                description: "Data structures, algorithms, and network programming implementations",
                tech: ["Java", "Python", "Data Structures", "Algorithms"],
                demo: "#",
                code: "#",
                semester: "4",
                courses: [
                    "Data Structures - Binary Tree Implementation",
                    "Algorithm Analysis - Sorting & Searching Optimization",
                    "Network Programming - Client-Server Chat Application"
                ],
                detailedProjects: [
                    {
                        title: "Binary Tree Implementation",
                        description: "Complete binary search tree implementation with insertion, deletion, traversal, and balancing algorithms",
                        tech: ["Java", "Data Structures", "Algorithms"],
                        demo: "#",
                        code: "#",
                        course: "Data Structures"
                    },
                    {
                        title: "Sorting Algorithm Optimization",
                        description: "Performance comparison and optimization of various sorting algorithms including quicksort, mergesort, and heapsort",
                        tech: ["Python", "Algorithm Analysis", "Performance Testing"],
                        demo: "#",
                        code: "#",
                        course: "Algorithm Analysis"
                    },
                    {
                        title: "Client-Server Chat Application",
                        description: "Multi-threaded chat application with TCP/IP socket programming supporting multiple concurrent users",
                        tech: ["Java", "Socket Programming", "Multithreading"],
                        demo: "#",
                        code: "#",
                        course: "Network Programming"
                    }
                ]
            },
            {
                title: "Semester 3 Projects",
                description: "Object-oriented programming and database design fundamentals",
                tech: ["Java", "MySQL", "OOP", "Database Design"],
                demo: "#",
                code: "#",
                semester: "3",
                courses: [
                    "Object-Oriented Programming - Library Management System",
                    "Database Design - Student Information System"
                ],
                detailedProjects: [
                    {
                        title: "Library Management System",
                        description: "Object-oriented application for managing library books, members, and borrowing transactions",
                        tech: ["Java", "OOP", "Swing GUI", "File I/O"],
                        demo: "#",
                        code: "#",
                        course: "Object-Oriented Programming"
                    },
                    {
                        title: "Student Information System",
                        description: "Database design and implementation for student records, courses, and academic performance tracking",
                        tech: ["MySQL", "Database Design", "SQL", "ER Modeling"],
                        demo: "#",
                        code: "#",
                        course: "Database Design"
                    }
                ]
            },
            {
                title: "Semester 2 Projects",
                description: "Programming fundamentals and basic algorithm implementation",
                tech: ["Python", "Java", "Algorithms", "Problem Solving"],
                demo: "#",
                code: "#",
                semester: "2",
                courses: [
                    "Programming Fundamentals - Calculator Application",
                    "Basic Algorithm Implementation - Sorting Algorithms"
                ],
                detailedProjects: [
                    {
                        title: "Scientific Calculator",
                        description: "Console-based calculator with support for basic arithmetic, trigonometric, and logarithmic functions",
                        tech: ["Python", "Math Library", "User Interface"],
                        demo: "#",
                        code: "#",
                        course: "Programming Fundamentals"
                    },
                    {
                        title: "Sorting Algorithms Collection",
                        description: "Implementation and comparison of basic sorting algorithms including bubble sort, selection sort, and insertion sort",
                        tech: ["Java", "Algorithms", "Performance Analysis"],
                        demo: "#",
                        code: "#",
                        course: "Basic Algorithm Implementation"
                    }
                ]
            },
            {
                title: "Semester 1 Projects",
                description: "Introduction to programming and computational thinking",
                tech: ["Python", "Logic", "Problem Solving"],
                demo: "#",
                code: "#",
                semester: "1",
                courses: [
                    "Introduction to Programming - Basic Console Applications",
                    "Logic & Computational Thinking - Mathematical Problem Solver"
                ],
                detailedProjects: [
                    {
                        title: "Number Guessing Game",
                        description: "Interactive console game where computer generates random number and user tries to guess it",
                        tech: ["Python", "Random Module", "Loops", "Conditionals"],
                        demo: "#",
                        code: "#",
                        course: "Introduction to Programming"
                    },
                    {
                        title: "Mathematical Problem Solver",
                        description: "Console application that solves basic mathematical problems including factorial, fibonacci, and prime number generation",
                        tech: ["Python", "Mathematical Logic", "Functions"],
                        demo: "#",
                        code: "#",
                        course: "Logic & Computational Thinking"
                    }
                ]
            }
        ]
    }
};

function openProjectModal(category) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalProjects = document.getElementById('modalProjects');
    
    const data = projectData[category];
    modalTitle.textContent = data.title;
    
    // Clear previous content
    modalProjects.innerHTML = '';
    
    // Special handling for academic projects
    if (category === 'academic') {
        modalProjects.className = 'academic-projects-grid';
        
        data.projects.forEach(project => {
            const semesterCard = document.createElement('div');
            semesterCard.className = 'academic-semester-card';
            
            const coursesHtml = project.courses.map(course => 
                `<li class="course-item">${course}</li>`
            ).join('');
            
            semesterCard.innerHTML = `
                <div class="semester-header">
                    <div class="semester-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                    </div>
                    <div class="semester-info">
                        <h3 class="semester-title">Semester ${project.semester}</h3>
                        <span class="semester-status">${project.semester === '5' ? '(Current)' : ''}</span>
                    </div>
                    <div class="semester-count">${project.courses.length} Projects</div>
                </div>
                <div class="semester-description">
                    <p>${project.description}</p>
                </div>
                <div class="courses-list">
                    <ul>${coursesHtml}</ul>
                </div>
                <div class="semester-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            `;
            
            // Add click event to open semester details
            semesterCard.addEventListener('click', () => {
                openSemesterModal(project.semester, project);
            });
            
            modalProjects.appendChild(semesterCard);
        });
    } else {
        // Regular project modal layout
        modalProjects.className = 'modal-projects-grid';
        
        data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'modal-project-card';
            
            projectCard.innerHTML = `
                <h3 class="modal-project-title">${project.title}</h3>
                <p class="modal-project-description">${project.description}</p>
                <div class="modal-project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="modal-project-links">
                    ${project.demo !== '#' ? `<a href="${project.demo}" class="project-link demo" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15,3 21,3 21,9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Live Demo
                    </a>` : ''}
                    ${project.code !== '#' ? `<a href="${project.code}" class="project-link code" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                        View Code
                    </a>` : ''}
                </div>
            `;
            
            modalProjects.appendChild(projectCard);
        });
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});
// Semester Modal Management
function openSemesterModal(semesterNumber, semesterData) {
    const modal = document.getElementById('semesterModal');
    const modalTitle = document.getElementById('semesterModalTitle');
    const semesterProjects = document.getElementById('semesterProjects');
    
    modalTitle.textContent = `Semester ${semesterNumber} Projects`;
    
    // Clear previous content
    semesterProjects.innerHTML = '';
    
    // Add detailed projects for this semester
    semesterData.detailedProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'modal-project-card';
        
        projectCard.innerHTML = `
            <div class="project-course-label">${project.course}</div>
            <h3 class="modal-project-title">${project.title}</h3>
            <p class="modal-project-description">${project.description}</p>
            <div class="modal-project-tech">
                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="modal-project-links">
                ${project.demo !== '#' ? `<a href="${project.demo}" class="project-link demo" target="_blank">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Live Demo
                </a>` : ''}
                ${project.code !== '#' ? `<a href="${project.code}" class="project-link code" target="_blank">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    View Code
                </a>` : ''}
            </div>
        `;
        
        semesterProjects.appendChild(projectCard);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSemesterModal() {
    const modal = document.getElementById('semesterModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close semester modal when clicking outside
window.addEventListener('click', (event) => {
    const semesterModal = document.getElementById('semesterModal');
    if (event.target === semesterModal) {
        closeSemesterModal();
    }
});

// Close semester modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const semesterModal = document.getElementById('semesterModal');
        if (semesterModal.style.display === 'block') {
            closeSemesterModal();
        }
    }
});