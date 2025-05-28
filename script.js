document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const cartIconContainer = document.createElement('div');
    cartIconContainer.classList.add('cart-icon-container');
    document.body.appendChild(cartIconContainer);

    // Create a simple cart object to store items
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // --- Search Functionality ---
    searchButton.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'block'; // Show the product
            } else {
                card.style.display = 'none'; // Hide the product
            }
        });
    }

    // --- Cart Icon & Toggle Cart Visibility ---
    const cartIcon = document.createElement('div');
    cartIcon.classList.add('cart-icon');
    cartIcon.innerHTML = '🛒<span class="cart-count">0</span>'; // Shopping cart emoji
    cartIconContainer.appendChild(cartIcon);

    const cartSection = document.querySelector('.cart');
    cartSection.style.display = 'none'; // Hide cart by default

    cartIcon.addEventListener('click', () => {
        cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
        // Scroll to the cart if it becomes visible (optional)
        if (cartSection.style.display === 'block') {
            cartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // --- Add to Cart Functionality ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            // Parse price as a float, replacing comma with a dot for correct calculation
            const productPrice = parseFloat(event.target.dataset.productPrice.replace(',', '.'));

            addItemToCart(productId, productName, productPrice);
            updateCartDisplay();
            updateCartIconCount();
        });
    });

    function addItemToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        saveCartToLocalStorage();
    }

    function removeItemFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCartToLocalStorage();
    }

    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; // Clear current cart display
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            listItem.innerHTML = `
                ${item.name} (x${item.quantity}) - R$ ${(itemTotal).toFixed(2).replace('.', ',')}
                <button class="remove-item" data-product-id="${item.id}">Remover</button>
            `;
            cartItemsList.appendChild(listItem);
        });

        totalPriceSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

        // Add event listeners to new remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                removeItemFromCart(productId);
                updateCartDisplay();
                updateCartIconCount();
            });
        });
    }

    function updateCartIconCount() {
        const cartCountSpan = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        cartCountSpan.style.display = totalItems > 0 ? 'block' : 'none'; // Hide if 0 items
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // --- Checkout Button ---
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!');
            return;
        }
        alert('Compra finalizada com sucesso! Total: ' + totalPriceSpan.textContent);
        cart = []; // Clear the cart
        saveCartToLocalStorage();
        updateCartDisplay();
        updateCartIconCount();
        cartSection.style.display = 'none'; // Hide cart after checkout
    });

    // Initial load: update cart display and icon count from local storage
    updateCartDisplay();
    updateCartIconCount();
});
