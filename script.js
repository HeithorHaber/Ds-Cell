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

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

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
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    const cartIcon = document.createElement('div');
    cartIcon.classList.add('cart-icon');
    cartIcon.innerHTML = '🛒<span class="cart-count">0</span>';
    cartIconContainer.appendChild(cartIcon);

    const cartSection = document.querySelector('.cart');
    cartSection.style.display = 'none';

    cartIcon.addEventListener('click', () => {
        cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
        if (cartSection.style.display === 'block') {
            cartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
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
        cartItemsList.innerHTML = '';
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
        cartCountSpan.style.display = totalItems > 0 ? 'block' : 'none';
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!');
            return;
        }
        alert('Compra finalizada com sucesso! Total: ' + totalPriceSpan.textContent);
        cart = [];
        saveCartToLocalStorage();
        updateCartDisplay();
        updateCartIconCount();
        cartSection.style.display = 'none';
    });
    updateCartDisplay();
    updateCartIconCount();
});
