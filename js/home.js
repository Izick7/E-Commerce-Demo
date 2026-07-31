import { getProducts, getCategories, getProductsByCategory, searchProducts, getProductById } from './api.js';

const LIMIT = 10;
let state = {
  page: 1,
  category: '',
  search: '',
  total: 0
};

const productsEl = document.getElementById('products');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const detailModal = document.getElementById('detailModal');
const detailContent = document.getElementById('detailContent');
const closeModal = document.getElementById('closeModal');

function renderProducts(products) {
  productsEl.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white';
    card.addEventListener('click', () => showDetail(product.id));

    const image = document.createElement('img');
    image.src = product.thumbnail;
    image.alt = product.title;
    image.className = 'w-full h-40 object-cover rounded mb-2';

    const title = document.createElement('h3');
    title.textContent = product.title;
    title.className = 'font-semibold text-lg truncate';

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;
    price.className = 'text-green-600 font-bold';

    const rating = document.createElement('p');
    rating.textContent = `⭐ ${product.rating}`;
    rating.className = 'text-sm text-gray-500';

    const category = document.createElement('p');
    category.textContent = product.category;
    category.className = 'text-xs uppercase text-gray-400';

    card.append(image, title, price, rating, category);
    productsEl.appendChild(card);
  });
}

function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(state.total / LIMIT));
  pageIndicator.textContent = `Page ${state.page} of ${totalPages}`;
  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= totalPages;
}

async function loadProducts() {
  const skip = (state.page - 1) * LIMIT;
  let data;

  if (state.search) {
    data = await searchProducts(state.search, LIMIT, skip);
  } else if (state.category) {
    data = await getProductsByCategory(state.category, LIMIT, skip);
  } else {
    data = await getProducts(LIMIT, skip);
  }

  state.total = data.total;
  renderProducts(data.products);
  renderPagination();
}

async function loadCategories() {
  const categories = await getCategories();
  categories.forEach(cat => {
    const option = document.createElement('option');
    // DummyJSON categories are objects: { slug, name, url }
    option.value = cat.slug || cat;
    option.textContent = cat.name || cat;
    categoryFilter.appendChild(option);
  });
}

async function showDetail(id) {
  const product = await getProductById(id);
  detailContent.innerHTML = '';

  const img = document.createElement('img');
  img.src = product.thumbnail;
  img.className = 'w-full h-48 object-cover rounded mb-3';

  const title = document.createElement('h2');
  title.textContent = product.title;
  title.className = 'text-xl font-bold mb-1';

  const desc = document.createElement('p');
  desc.textContent = product.description;
  desc.className = 'text-sm text-gray-600 mb-2';

  const price = document.createElement('p');
  price.textContent = `Price: $${product.price}`;
  price.className = 'font-semibold';

  const rating = document.createElement('p');
  rating.textContent = `Rating: ⭐ ${product.rating}`;

  const stock = document.createElement('p');
  stock.textContent = `Stock: ${product.stock}`;

  const brand = document.createElement('p');
  brand.textContent = `Brand: ${product.brand || 'N/A'}`;

  detailContent.append(img, title, desc, price, rating, stock, brand);
  detailModal.classList.remove('hidden');
  detailModal.classList.add('flex');
}

closeModal.addEventListener('click', () => {
  detailModal.classList.add('hidden');
  detailModal.classList.remove('flex');
});

prevBtn.addEventListener('click', () => {
  if (state.page > 1) {
    state.page--;
    loadProducts();
  }
});

nextBtn.addEventListener('click', () => {
  state.page++;
  loadProducts();
});

let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    state.search = e.target.value.trim();
    state.category = '';
    categoryFilter.value = '';
    state.page = 1;
    loadProducts();
  }, 400);
});

categoryFilter.addEventListener('change', (e) => {
  state.category = e.target.value;
  state.search = '';
  searchInput.value = '';
  state.page = 1;
  loadProducts();
});

async function init() {
  await loadCategories();
  await loadProducts();
}

init();