// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .about-text, .contact-card, .contact-form');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual endpoint)
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                // Success
                showNotification('Сообщение отправлено успешно!', 'success');
                contactForm.reset();
            })
            .catch(error => {
                // Error
                showNotification('Ошибка при отправке сообщения. Попробуйте позже.', 'error');
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Tech icons hover effects
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.1)';
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Skill cards hover effects
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon i');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.2)';
                icon.style.color = '#8b5cf6';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon i');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
                icon.style.color = '#00d4ff';
            }
        });
    });

    // Project cards hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.project-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.2) rotate(10deg)';
                placeholder.style.color = '#8b5cf6';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.project-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1) rotate(0deg)';
                placeholder.style.color = '#00d4ff';
            }
        });
    });

    // Parallax effect for background orbs
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const orbs = document.querySelectorAll('.gradient-orb');
        
        orbs.forEach((orb, index) => {
            const speed = 0.5 + (index * 0.1);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Typing animation for hero section
    const codeTexts = [
        'whoami',
        'cat skills.txt',
        'ls projects/',
        'python --version',
        'node --version'
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    const codeTextElement = document.querySelector('.code-text');
    const codePromptElement = document.querySelector('.code-prompt');
    
    if (codeTextElement && codePromptElement) {
        function typeCode() {
            const currentText = codeTexts[currentTextIndex];
            
            if (isDeleting) {
                codeTextElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                codeTextElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && currentCharIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % codeTexts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeCode, typeSpeed);
        }
        
        // Start typing animation after a delay
        setTimeout(typeCode, 2000);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(20, 184, 166, 0.9)' : 'rgba(236, 72, 153, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Add CSS for notification content
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-content i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(notificationStyle);

    // Cursor trail effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    // Hide cursor trail on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add CSS for loading state
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body:not(.loaded) {
            overflow: hidden;
        }
        body:not(.loaded)::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        body:not(.loaded)::after {
            content: 'Loading...';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00d4ff;
            font-size: 1.5rem;
            font-weight: 600;
            z-index: 10001;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(loadingStyle);
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Throttle scroll events
const throttledScrollHandler = debounce(function() {
    // Scroll-based animations can be added here
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// Add smooth reveal animation for elements
function revealElements() {
    const reveals = document.querySelectorAll('.fade-in');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealElements);

    // Initialize reveal on load
    revealElements();

    // Skills Radar Interactions
    const radarDots = document.querySelectorAll('.radar-dot');
    const statCards = document.querySelectorAll('.stat-card');
    
    radarDots.forEach(dot => {
        dot.addEventListener('mouseenter', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingCard = document.querySelector(`[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingCard) {
                correspondingCard.style.transform = 'translateY(-10px) scale(1.02)';
                correspondingCard.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.5)';
                correspondingCard.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            }
        });
        
        dot.addEventListener('mouseleave', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingCard = document.querySelector(`[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingCard) {
                correspondingCard.style.transform = 'translateY(0) scale(1)';
                correspondingCard.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                correspondingCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        dot.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingCard = document.querySelector(`[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingCard) {
                correspondingCard.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Highlight effect
                correspondingCard.style.animation = 'none';
                setTimeout(() => {
                    correspondingCard.style.animation = 'pulse 0.6s ease-in-out';
                }, 10);
            }
        });
    });

    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.skill-fill, .progress-bar');
    
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }
        });
    };
    
    window.addEventListener('scroll', animateProgressBars);
    animateProgressBars(); // Initial check

    // Radar center pulse effect
    const radarCenter = document.querySelector('.radar-center');
    if (radarCenter) {
        radarCenter.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 2s infinite';
            }, 10);
            
            // Animate all dots
            radarDots.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        dot.style.transform = '';
                    }, 200);
                }, index * 100);
            });
        });
    }

    // Skills section intersection observer
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate radar lines
                    const radarLines = document.querySelectorAll('.radar-line');
                    radarLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.style.opacity = '1';
                            line.style.transform = line.style.transform || 'scale(1)';
                        }, index * 200);
                    });
                    
                    // Animate dots
                    radarDots.forEach((dot, index) => {
                        setTimeout(() => {
                            dot.style.opacity = '1';
                            dot.style.transform = dot.style.transform || 'scale(1)';
                        }, 500 + index * 200);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        skillsObserver.observe(skillsSection);
    }

    // Terminal typing animation for about section
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const terminalLines = document.querySelectorAll('.about .terminal-output, .about .terminal-line');
                    terminalLines.forEach((line, index) => {
                        line.style.opacity = '0';
                        line.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            line.style.transition = 'all 0.5s ease-out';
                            line.style.opacity = '1';
                            line.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        aboutObserver.observe(aboutSection);
    }

    // New Radar Chart Interactions
    const skillPoints = document.querySelectorAll('.skill-point');
    const skillLabels = document.querySelectorAll('.skill-label');
    const skillCategories = document.querySelectorAll('.skill-category');
    
    // Animate radar on scroll
    const radarSection = document.querySelector('.skills');
    if (radarSection) {
        const radarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate polygon drawing
                    const polygon = document.querySelector('.skills-polygon');
                    if (polygon) {
                        polygon.style.strokeDashoffset = '0';
                    }
                    
                    // Animate skill points
                    skillPoints.forEach((point, index) => {
                        setTimeout(() => {
                            point.style.opacity = '1';
                            point.style.transform = 'scale(1)';
                        }, 1000 + index * 200);
                    });
                    
                    // Animate skill labels
                    skillLabels.forEach((label, index) => {
                        setTimeout(() => {
                            label.style.opacity = '1';
                            label.style.transform = 'scale(1)';
                        }, 1500 + index * 200);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        radarObserver.observe(radarSection);
    }
    
    // Skill point hover effects
    skillPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingLabel = document.querySelector(`.skill-label[data-skill="${skill}"]`);
            const correspondingCategory = document.querySelector(`.skill-category[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingLabel) {
                correspondingLabel.style.transform = 'scale(1.1)';
                correspondingLabel.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
            }
            
            if (correspondingCategory) {
                correspondingCategory.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                correspondingCategory.style.background = 'rgba(0, 212, 255, 0.1)';
            }
        });
        
        point.addEventListener('mouseleave', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingLabel = document.querySelector(`.skill-label[data-skill="${skill}"]`);
            const correspondingCategory = document.querySelector(`.skill-category[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingLabel) {
                correspondingLabel.style.transform = 'scale(1)';
                correspondingLabel.style.boxShadow = 'none';
            }
            
            if (correspondingCategory) {
                correspondingCategory.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                correspondingCategory.style.background = 'rgba(255, 255, 255, 0.02)';
            }
        });
        
        point.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingCategory = document.querySelector(`.skill-category[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingCategory) {
                correspondingCategory.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Highlight effect
                correspondingCategory.style.animation = 'none';
                setTimeout(() => {
                    correspondingCategory.style.animation = 'pulse 0.6s ease-in-out';
                }, 10);
            }
        });
    });
    
    // Skill label interactions
    skillLabels.forEach(label => {
        label.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            const correspondingPoint = document.querySelector(`.skill-point[data-skill="${skill}"]`);
            const correspondingCategory = document.querySelector(`.skill-category[data-category="${skill.toLowerCase()}"]`);
            
            if (correspondingPoint) {
                // Pulse effect on point
                correspondingPoint.style.animation = 'none';
                setTimeout(() => {
                    correspondingPoint.style.animation = 'pulse 0.6s ease-in-out';
                }, 10);
            }
            
            if (correspondingCategory) {
                correspondingCategory.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        });
    });
    
    // Skill category hover effects
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            const categoryName = this.getAttribute('data-category');
            const correspondingPoint = document.querySelector(`.skill-point[data-skill="${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}"]`);
            const correspondingLabel = document.querySelector(`.skill-label[data-skill="${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}"]`);
            
            if (correspondingPoint) {
                correspondingPoint.style.r = '8';
                correspondingPoint.style.filter = 'drop-shadow(0 0 10px currentColor)';
            }
            
            if (correspondingLabel) {
                correspondingLabel.style.transform = 'scale(1.05)';
                correspondingLabel.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
            }
        });
        
        category.addEventListener('mouseleave', function() {
            const categoryName = this.getAttribute('data-category');
            const correspondingPoint = document.querySelector(`.skill-point[data-skill="${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}"]`);
            const correspondingLabel = document.querySelector(`.skill-label[data-skill="${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}"]`);
            
            if (correspondingPoint) {
                correspondingPoint.style.r = '6';
                correspondingPoint.style.filter = 'none';
            }
            
            if (correspondingLabel) {
                correspondingLabel.style.transform = 'scale(1)';
                correspondingLabel.style.boxShadow = 'none';
            }
        });
    });
    
    // Skill tag hover effects
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.3)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add pulse animation for radar elements
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .skill-point {
            transition: all 0.3s ease;
        }
        
        .skill-label {
            transition: all 0.3s ease;
        }
        
        .skill-category {
            transition: all 0.3s ease;
        }
        
        .skill-tag {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(pulseStyle);