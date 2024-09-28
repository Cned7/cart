// Creating an OBJECT to represent each product

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// Creating an object to represent each item added to the cart

class ShoppingCartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  // Calculating the total price of each product based on the selected quantity

  getTotalPrice() {
    return this.quantity * this.product.price;
  }

  //Increasing product quantity
  increaseQuantity() {
    this.quantity += 1;
  }

  // Reducing quantity
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }
}

// Creating ShoppingCart Object to represent the entire cart

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // Calculating the total price of all items in the cart

  getTotal() {
    return this.items
      .reduce((total, item) => total + item.getTotalPrice(), 0)
      .toFixed(2);
  }

  // Adding items to the cart

  addItem(product) {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.increaseQuantity();
    } else {
      this.items.push(new ShoppingCartItem(product));
    }
    this.updateCartDisplay();
  }

  // To decrease item quantity
  
  decreaseItem(product) {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem && existingItem.quantity > 1) {
      existingItem.decreaseQuantity();
    } else {

      // Prevent item quantity from getting to 0

      this.removeItem(product.id);
    }
    this.updateCartDisplay();
  }

  // Delete an item from the cart
  
  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.updateCartDisplay();
  }

  // Update the total price display

  updateCartDisplay() {
    const totalElement = document.getElementById("total--price");
    totalElement.textContent = this.getTotal();
  }
}

// Creating the shopping cart

const cart = new ShoppingCart();

// Function to bind events to the DOM elements

function initializeProducts() {
  const productCards = Array.from(
    document.getElementsByClassName("product--card")
  );

  productCards.forEach((card, index) => {
    const productId = index + 1;
    const productName = card.querySelector("h2").textContent;
    const productPrice = parseFloat(
      card.querySelector(".item--price").textContent
    );

    const product = new Product(productId, productName, productPrice);

    // Add default items to cart and display the initial price
    cart.addItem(product); 

    // Bind actions (plus, minus, delete) for each product card
    setupCardActions(card, product);
  });

  // Update cart initial total amount
  cart.updateCartDisplay();
}

// Function to bind event listeners to each product card
function setupCardActions(card, product) {
  const quantityInput = card.querySelector(".input--field");
  const plusBtn = card.querySelector(".plus--btn");
  const minusBtn = card.querySelector(".minus--btn");
  const deleteBtn = card.querySelector(".delete--btn");

  // Set default quantity value to 1 if empty
  quantityInput.value = 1;

  // Increase quantity item when clicking the plus button
  plusBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (!isNaN(quantity)) {
      quantityInput.value = quantity + 1;
      cart.addItem(product);
    }
  });

  // Decrease item quantity when clicking the minus button
  minusBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (!isNaN(quantity) && quantity > 1) {
      quantityInput.value = quantity - 1;
      cart.decreaseItem(product);
    }
  });

  // Delete item from cart and remove it from DOM when clicking the delete button
  deleteBtn.addEventListener("click", () => {
    cart.removeItem(product.id);
    // Remove the card from the DOM
    card.remove();
  });
}

// Initialize products and bind actions
initializeProducts();

console.log(cart);
