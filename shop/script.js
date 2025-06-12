document.addEventListener('DOMContentLoaded', function() {
    // Sample product data (in a real app, this would come from an API)
    const products = [
        {
            id: 1,
            name: "Home Assistant Robot",
            category: "home",
            price: 12000,
            description: "AI-powered home assistant with voice control and smart home integration",
            image: "../assets/images/product-1.jpg",
            badge: "BESTSELLER",
            stock: 15
        },
        {
            id: 2,
            name: "Educational Robotics Kit",
            category: "education",
            price: 10000,
            description: "Complete STEM learning kit for students and hobbyists",
            image: "../assets/images/product-2.jpg",
            stock: 32
        },
        {
            id: 3,
            name: "Industrial Robotic Arm",
            category: "industrial",
            price: 25000,
            description: "Precision industrial arm for manufacturing and assembly",
            image: "../assets/images/product-3.jpg",
            stock: 5
        },
        {
            id: 4,
            name: "Robot Development Board",
            category: "parts",
            price: 7500,
            description: "Advanced control board for custom robot projects",
            image: "../assets/images/product-4.jpg",
            badge: "NEW",
            stock: 42
        },
        {
            id: 5,
            name: "Autonomous Vacuum Robot",
            category: "home",
            price: 35000,
            description: "Smart cleaning robot with room mapping and scheduling",
            image: "../assets/images/product-5.jpg",
            stock: 18
        },
        {
            id: 6,
            name: "Robot Sensor Kit",
            category: "parts",
            price: 4500,
            description: "Collection of essential sensors for robotics projects",
            image: "../assets/images/product-6.jpg",
            stock: 27
        },
        {
            id: 7,
            name: "Programmable Rover",
            category: "education",
            price: 18000,
            description: "Learn coding with this versatile educational rover",
            image: "../assets/images/product-7.jpg",
            stock: 12
        },
        {
            id: 8,
            name: "Warehouse Logistics Robot",
            category: "industrial",
            price: 125000,
            description: "Automated inventory management and transportation",
            image: "../assets/images/product-8.jpg",
            stock: 3
        }
    ];

    // DOM Elements
    const productsContainer = document.getElementById('productsContainer');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const productSearch = document.getElementById('productSearch');
    const searchProductsBtn = document.getElementById('searchProductsBtn');
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.querySelector('.cart-count');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize the shop
    function initShop() {
        renderProducts(products);
        updateCartCount();
        setupEventListeners();
    }

    // Render products to the page
    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
            return;
        }
        
        productsToRender.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-content">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price">
                            Rs${product.price.toFixed(2)}
                            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productElement);
        });
    }

    // Filter and sort products
    function filterAndSortProducts() {
        let filteredProducts = [...products];
        const searchTerm = productSearch.value.toLowerCase();
        const category = categoryFilter.value;
        const sortValue = sortBy.value;
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by category
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // Sort products
        switch (sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sorting (original order)
                break;
        }
        
        renderProducts(filteredProducts);
    }

    // Helper function to get category display name
    function getCategoryName(category) {
        const names = {
            'home': 'Home Robots',
            'education': 'Education',
            'industrial': 'Industrial',
            'parts': 'Parts & Kits'
        };
        return names[category] || category;
    }

    // Cart functions
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                alert(`Only ${product.stock} units available in stock`);
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    function updateQuantity(productId, newQuantity) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        
        if (!cartItem || !product) return;
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity > product.stock) {
            alert(`Only ${product.stock} units available in stock`);
            cartItem.quantity = product.stock;
        } else {
            cartItem.quantity = newQuantity;
        }
        
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = 'Rs0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">Rs${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="decrement" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="increment" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });
        
        cartTotal.textContent = `Rs${total.toFixed(2)}`;
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        renderCartItems();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Filter and sort events
        categoryFilter.addEventListener('change', filterAndSortProducts);
        sortBy.addEventListener('change', filterAndSortProducts);
        searchProductsBtn.addEventListener('click', filterAndSortProducts);
        productSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filterAndSortProducts();
        });
        
        // Add to cart buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = parseInt(button.dataset.id);
                addToCart(productId);
                
                // Add animation to button
                button.innerHTML = '<i class="fas fa-check"></i> Added';
                button.style.backgroundColor = 'var(--success)';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-cart-plus"></i> Add';
                    button.style.backgroundColor = 'var(--primary)';
                }, 1000);
            }
        });
        
        // Cart events
        cartIcon.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', toggleCart);
        
        // Cart item events (delegated)
        cartItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('decrement') || e.target.closest('.decrement')) {
                const button = e.target.classList.contains('decrement') ? e.target : e.target.closest('.decrement');
                const productId = parseInt(button.dataset.id);
                const item = cart.find(item => item.id === productId);
                if (item) updateQuantity(productId, item.quantity - 1);
            }
            
            if (e.target.classList.contains('increment') || e.target.closest('.increment')) {
                const button = e.target.classList.contains('increment') ? e.target : e.target.closest('.increment');
                const productId = parseInt(button.dataset.id);
                const item = cart.find(item => item.id === productId);
                if (item) updateQuantity(productId, item.quantity + 1);
            }
            
            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const productId = parseInt(button.dataset.id);
                removeFromCart(productId);
            }
        });
        
        // Quantity input changes
        cartItems.addEventListener('change', function(e) {
            if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
                const productId = parseInt(e.target.dataset.id);
                const newQuantity = parseInt(e.target.value) || 1;
                updateQuantity(productId, newQuantity);
            }
        });
        
        // Checkout button
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            alert('Proceeding to checkout - this would redirect to payment in a real implementation');
            // In a real app: window.location.href = '/checkout';
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('shopNewsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value;
                console.log('Shop subscriber:', email);
                alert('Thank you for subscribing to our shop newsletter!');
                this.reset();
            });
        }
    }

    // Initialize the shop
    initShop();
});