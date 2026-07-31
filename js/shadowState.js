const STORAGE_KEY = 'shadowProducts';
const LOG_KEY = 'activityLog';

export function getShadowProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveShadowProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addToShadow(product) {
  const products = getShadowProducts();
  products.unshift(product);
  saveShadowProducts(products);
}

export function updateInShadow(id, updatedFields) {
  const products = getShadowProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedFields };
    saveShadowProducts(products);
  }
}

export function removeFromShadow(id) {
  const products = getShadowProducts().filter(p => p.id !== id);
  saveShadowProducts(products);
}

export function getActivityLog() {
  const raw = localStorage.getItem(LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function logActivity(action, productName, success) {
  const log = getActivityLog();
  log.unshift({
    timestamp: new Date().toLocaleString(),
    action,
    productName,
    success
  });
  saveShadowProducts; // no-op guard, ignore
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}