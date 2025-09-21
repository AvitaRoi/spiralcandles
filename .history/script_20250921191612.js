// E-commerce functionality
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    const productBtns = document.querySelectorAll('.product-btn');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentCustomers = 127;
    
    // Initialize cart count
    updateCartCount();
    
    // Quantity controls
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
    
    // Buy now functionality
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            showPurchaseModal('נר ספירלה בודד', 89, quantity, true);
        });
    }
    
    // Add to cart functionality
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            addToCart('נר ספירלה בודד', 89, quantity);
            showNotification('המוצר נוסף לעגלה בהצלחה! 🛒');
        });
    }
    
    // Product cards add to cart
    productBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseInt(priceText.replace('₪', ''));
            
            addToCart(productName, price, 1);
            showNotification('המוצר נוסף לעגלה בהצלחה! 🛒');
        });
    });
    
    // Add to cart function
    function addToCart(name, price, quantity) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 1000;
            animation: slide-in 0.3s ease;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slide-out 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Show purchase modal
    function showPurchaseModal(productName, price, quantity, isBuyNow = false) {
        const total = price * quantity;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isBuyNow ? 'קנייה מהירה' : 'פרטי הזמנה'}</h3>
                    <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="order-summary">
                        <h4>סיכום הזמנה</h4>
                        <div class="order-item">
                            <span>${productName}</span>
                            <span>כמות: ${quantity}</span>
                            <span>₪${total}</span>
                        </div>
                        <div class="order-total">
                            <strong>סה"כ לתשלום: ₪${total}</strong>
                        </div>
                    </div>
                    <div class="customer-form">
                        <input type="text" placeholder="שם מלא" required>
                        <input type="tel" placeholder="מספר טלפון" required>
                        <input type="email" placeholder="אימייל" required>
                        <textarea placeholder="כתובת למשלוח" rows="3" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="complete-order-btn" onclick="completeOrder()">
                        השלם הזמנה
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fade-in 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        if (!isBuyNow) {
            addToCart(productName, price, quantity);
        }
    }
    
    // Counter animation
    function animateCounter(targetCount) {
        const counter = socialProofCounter;
        const startCount = parseInt(counter.textContent.replace(',', ''));
        const duration = 1000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentCount = Math.floor(startCount + (targetCount - startCount) * easeOutCubic(progress));
            counter.textContent = currentCount.toLocaleString();
            
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
    
    // Loading spinner styles
    const spinnerStyles = `
        .loading-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = spinnerStyles;
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
    console.log('🕯️ Spiral Candles waitlist page loaded successfully!');
    
    // Check if user is returning
    const storedEmail = localStorage.getItem('waitlist-email');
    if (storedEmail) {
        console.log('👋 Welcome back! You\'re already on our waitlist.');
    }
});
