// Waitlist functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlist-signup');
    const emailInput = document.getElementById('email');
    const successMessage = document.getElementById('success-message');
    const submitBtn = form.querySelector('.submit-btn');
    const socialProofCounter = document.querySelector('.counter');
    
    let currentCount = 2847;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showError('אנא הכניסו כתובת מייל תקינה');
            return;
        }
        
        // Simulate form submission
        submitForm(email);
    });
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Form submission simulation
    function submitForm(email) {
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="9 3" />
            </svg>
            נרשם...
        `;
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.classList.add('show');
            
            // Update counter
            currentCount++;
            animateCounter(socialProofCounter, currentCount);
            
            // Store email (in real app, this would be sent to backend)
            localStorage.setItem('waitlist-email', email);
            
            // Reset form after delay
            setTimeout(() => {
                form.style.display = 'block';
                successMessage.classList.remove('show');
                emailInput.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 4000);
            
        }, 1500);
    }
    
    // Error handling
    function showError(message) {
        emailInput.style.borderColor = '#ef4444';
        emailInput.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
        
        // Create error message
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                animation: slide-in 0.3s ease;
            `;
            form.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        
        // Remove error after input change
        emailInput.addEventListener('input', function() {
            emailInput.style.borderColor = '';
            emailInput.style.boxShadow = '';
            if (errorDiv) {
                errorDiv.remove();
            }
        }, { once: true });
    }
    
    // Counter animation
    function animateCounter(element, targetCount) {
        const startCount = parseInt(element.textContent);
        const duration = 1000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentCount = Math.floor(startCount + (targetCount - startCount) * easeOutCubic(progress));
            element.textContent = currentCount;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Easing function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Add styles for modal and notifications
    const dynamicStyles = `
        .modal-content {
            background: var(--surface);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            direction: rtl;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1rem;
        }
        
        .modal-header h3 {
            color: var(--text-primary);
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-modal:hover {
            background: var(--border-color);
            color: var(--text-primary);
        }
        
        .order-summary {
            background: rgba(99, 102, 241, 0.05);
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
        }
        
        .order-summary h4 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .order-total {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid var(--primary-color);
            color: var(--primary-color);
        }
        
        .customer-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .customer-form input,
        .customer-form textarea {
            padding: 1rem;
            background: var(--surface);
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            color: var(--text-primary);
            font-family: inherit;
            transition: border-color 0.3s ease;
        }
        
        .customer-form input:focus,
        .customer-form textarea:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .modal-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
        
        .complete-order-btn {
            width: 100%;
            padding: 1rem 2rem;
            background: var(--gradient);
            border: none;
            border-radius: 0.75rem;
            color: white;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .complete-order-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }
        
        .complete-order-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slide-out {
            to { 
                opacity: 0; 
                transform: translateX(100%); 
            }
        }
        
        @keyframes slide-in {
            from { 
                opacity: 0; 
                transform: translateX(100%); 
            }
            to { 
                opacity: 1; 
                transform: translateX(0); 
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fade-in-up 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add fade-in-up animation
    const fadeInUpStyles = `
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-card {
            opacity: 0;
        }
    `;
    
    const fadeStyleSheet = document.createElement('style');
    fadeStyleSheet.textContent = fadeInUpStyles;
    document.head.appendChild(fadeStyleSheet);
    
    // Smooth scroll for any anchor links
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
    
    // Parallax effect for hero visual
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElement = document.querySelector('.candle-mockup');
        
        if (parallaxElement) {
            const rate = scrolled * -0.5;
            parallaxElement.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Performance optimization: throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Additional scroll-based animations can go here
        }, 10);
    });
    
    // Preload critical animations
    const criticalAnimations = [
        'glow-pulse',
        'float',
        'flicker',
        'glow-flicker',
        'spiral-pattern'
    ];
    
    // Initialize page
    console.log('🕯️ נרות ספירלה - אתר מכירות טעון בהצלחה!');
    
    // Check if user has items in cart
    if (cart.length > 0) {
        console.log(`🛒 יש לך ${cart.length} מוצרים בעגלת הקניות`);
    }
});
