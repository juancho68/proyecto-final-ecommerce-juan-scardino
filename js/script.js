// --- Logica del carrito --- 

let products = [];
let cart = [];

// Hace un Fetch a los productos en el json y los renderiza
async function fetchProducts() {
  const response = await fetch("./wines.json");
  products = await response.json();
  renderProducts();
}

// Renderiza productos
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const productElement = document.createElement("div");

    productElement.className = product.stock === 0 ? "product disabled" : "product";
    productElement.innerHTML = `

      <img src="./img/${product.image}" alt="${product.name}">

      <h2>${product.name}</h2>
      <p>Precio: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <div class="cart-section">
           
      <div class="cart-icon">
        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-cart.png" alt="Carrito">
        <span class="cart-quantity">${quantity}</span>
      </div>


        <!--<button class="cart-icon" onclick="addToCart(${product.id})">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="Carrito">
        </button>

        <span class="cart-quantity">Seleccionados: ${quantity}</span>
        -->
        <div class="quantity-buttons">
          <button onclick="incrementQuantity(${product.id})"><i class="fa fa-plus" aria-hidden="true"></i></button>
          <button onclick="decrementQuantity(${product.id})"><i class="fa fa-minus" aria-hidden="true"></i></button>
        </div>
      </div>
      <button class="details-btn" onclick="openProductDetail(${product.id})"><i class="fas fa-info-circle"></i> Mas info</button>
    `;
    productList.appendChild(productElement);
  });
}

// Agrega al carrito
function addToCart(productId) {
  incrementQuantity(productId);
}

// Actualiza cuenta en el carrito
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

// Abre modal detalle producto
function openProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const productDetailContent = document.getElementById("product-detail-content");
  productDetailContent.innerHTML = `
    <img src="./img/${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price}</p>
    <p>Descripción: ${product.description}</p>
    <p>Stock: ${product.stock}</p>
  `;
  document.getElementById("product-detail-modal").style.display = "block";
}

// Cierra modal detalle producto
function closeProductDetail() {
  document.getElementById("product-detail-modal").style.display = "none";
}

// Abre modal carrito
function openCart() {
  document.getElementById("cart-modal").style.display = "block";
  renderCart();
}

// Cierra modal carrito
function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}


  // Renderiza carrito con tabla estilizada
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
  
    cartItems.innerHTML = `
      <table id="cart-items-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${cart
            .map((item) => {
              const subtotal = item.quantity * item.price;
              return `
                <tr>
                  <td>${item.name}</td>
                  <td>$${item.price}</td>
                  <td>
                    <button onclick="incrementQuantity(${item.id})"><i class="fa fa-plus" aria-hidden="true"></i></button>  
                    ${item.quantity}
                    <button onclick="decrementQuantity(${item.id})"><i class="fa fa-minus" aria-hidden="true"></i></button>
                  </td>
                  <td>$${subtotal}</td>
                  <td>
                    <button onclick="removeFromCart(${item.id})"><i class="fa fa-trash" aria-hidden="true"></i>
 Eliminar</button>
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  
    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    cartTotal.textContent = `Total: $${total}`;
  }
  
  // Incrementa cantidad
  function incrementQuantity(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) {
      alert("El producto no tiene stock disponible.");
      return;
    }
  
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      if (cartItem.quantity < product.stock) {
        cartItem.quantity++;
      } else {
        alert("No hay más stock disponible para este producto.");
        return;
      }
    } else {
      cart.push({ id: productId, name: product.name, price: product.price, quantity: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
    renderProducts();
  }
  
  // Decrementa cantidad
  function decrementQuantity(productId) {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity--;
      if (cartItem.quantity <= 0) {
        cart = cart.filter((item) => item.id !== productId);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCart();
      renderProducts();
    }
  }
  
  // Borra item
  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
    renderProducts();
  }
  
  // Actualiza cuuenta en el carrito
  function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;
  }
  
  // Inicializa carrito
  document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      cart = storedCart;
      updateCartCount();
    }
  });
  // Procesar compra
function processPurchase() {
    if (cart.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de procesar la compra.");
      return;
    }
  
    let stockAvailable = true;
  
    // Verificar stock
    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product || product.stock < cartItem.quantity) {
        alert(`No hay suficiente stock para el producto: ${cartItem.name}`);
        stockAvailable = false;
      }
    });
  
    if (!stockAvailable) {
      return;
    }
  
    // Reducir stock de los productos (dentro del scope de la variable products, no en el json)
    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (product) {
        product.stock -= cartItem.quantity;
      }
    });
  
    // Limpiar carrito
    cart = [];
    localStorage.removeItem("cart");
  
    // Actualizar vista
    alert("Compra procesada con éxito. Gracias por tu compra.");
    updateCartCount();
    renderCart();
    renderProducts();
  }
  
  // --- Validar datos formulario --- 

  // Selección del formulario
const form = document.querySelector('form');

// Agregar evento de escucha para el envío del formulario
form.addEventListener('submit', (event) => {
  // Obtener los campos del formulario
  const nombre = document.getElementById('txtNombre').value.trim();
  const apellido = document.getElementById('txtApellido').value.trim();
  const email = document.getElementById('txtEmail').value.trim();
  const telefono = document.getElementById('txtTelefono').value.trim();
  const mensaje = document.querySelector('[name="message"]').value.trim();

  // Validación de cada campo
  if (nombre === '') {
    alert('El nombre es obligatorio.');
    event.preventDefault(); // Detener el envío del formulario
    return;
  }

  if (apellido === '') {
    alert('El apellido es obligatorio.');
    event.preventDefault();
    return;
  }

  if (!validateEmail(email)) {
    alert('Por favor, ingrese un correo electrónico válido.');
    event.preventDefault();
    return;
  }

  if (!validatePhone(telefono)) {
    alert('Por favor, ingrese un número de teléfono válido (solo dígitos).');
    event.preventDefault();
    return;
  }

  if (mensaje === '') {
    alert('El mensaje no puede estar vacío.');
    event.preventDefault();
    return;
  }

  // Si pasa todas las validaciones, se envía el formulario
  alert('Formulario enviado correctamente.');
});

// Función para validar el correo electrónico
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar el teléfono (solo números)
function validatePhone(phone) {
  const phoneRegex = /^\d{7,15}$/; // Acepta números de entre 7 y 15 dígitos
  return phoneRegex.test(phone);
}