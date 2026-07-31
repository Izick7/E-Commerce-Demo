const BASE_URL = 'https://dummyjson.com';

export async function getProducts(limit = 10, skip = 0) {
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
  return response.json();
}

export async function getProductsByCategory(category, limit = 10, skip = 0) {
  const response = await fetch(`${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error(`Failed to fetch category: ${response.status}`);
  return response.json();
}

export async function searchProducts(query, limit = 10, skip = 0) {
  const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error(`Search failed: ${response.status}`);
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch product: ${response.status}`);
  return response.json();
}

export async function addProduct(product) {
  const response = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error(`Add failed: ${response.status}`);
  return response.json();
}

export async function updateProductPUT(id, product) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error(`Update failed: ${response.status}`);
  return response.json();
}

export async function updateProductPATCH(id, changes) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });
  if (!response.ok) throw new Error(`Patch failed: ${response.status}`);
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  return response.json();
}