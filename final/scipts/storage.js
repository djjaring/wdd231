const KEY = "ps_cart_v1";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product) {
  const cart = readCart();

  // minimal stored object (good practice)
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    qty: 1,
  });

  writeCart(cart);
  return cart.length;
}

export function getCartCount() {
  return readCart().length;
}

export function clearCart() {
  writeCart([]);
}
