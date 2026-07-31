import { getProducts, addProduct, updateProductPUT, updateProductPATCH, deleteProduct } from './api.js';
import {
  getShadowProducts, saveShadowProducts, addToShadow,
  updateInShadow, removeFromShadow, getActivityLog, logActivity
} from './shadowState.js';

const adminProductsEl = document.getElementById('adminProducts');
const addForm = document.getElementById('addForm');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const cancelEdit = document.getElementById('cancelEdit');
const activityLogEl = document.getElementById('activityLog');

function renderAdminProducts() {
  const products = getShadowProducts();
  adminProductsEl.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'border rounded-lg p-3 shadow-sm bg-gray-50';

    const title = document.createElement('h3');
    title.textContent = product.title;
    title.className = 'font-semibold';

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;
    price.className = 'text-green-600 font-bold text-sm';

    const category = document.createElement('p');
    category.textContent = product.category;
    category.className = 'text-xs text-gray-400 mb-2';

    const btnRow = document.createElement('div');
    btnRow.className = 'flex gap-2 mt-2';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'text-xs bg-blue-500 text-white px-2 py-1 rounded';
    editBtn.addEventListener('click', () => openEditModal(product));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'text-xs bg-red-500 text-white px-2 py-1 rounded';
    delBtn.addEventListener('click', () => handleDelete(product));

    btnRow.append(editBtn, delBtn);
    card.append(title, price, category, btnRow);
    adminProductsEl.appendChild(card);
  });
}

function renderActivityLog() {
  const log = getActivityLog();
  activityLogEl.innerHTML = '';
  log.forEach(entry => {
    const li = document.createElement('li');
    const status = entry.success ? '✅' : '❌';
    li.textContent = `${status} [${entry.timestamp}] ${entry.action} — "${entry.productName}"`;
    activityLogEl.appendChild(li);
  });
}

// ---- ADD (POST) ----
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const newProduct = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    thumbnail: formData.get('thumbnail') || 'https://via.placeholder.com/150',
    description: formData.get('description') || ''
  };

  // Optimistic UI: add a temporary local id and render immediately
  const tempProduct = { ...newProduct, id: Date.now() };
  addToShadow(tempProduct);
  renderAdminProducts();

  try {
    const result = await addProduct(newProduct); // DummyJSON returns a fake new id
    // Replace temp product with "server" version
    updateInShadow(tempProduct.id, { id: result.id });
    logActivity('Added product', newProduct.title, true);
  } catch (err) {
    // Rollback
    removeFromShadow(tempProduct.id);
    logActivity('Added product', newProduct.title, false);
  }

  renderAdminProducts();
  renderActivityLog();
  addForm.reset();
});

// ---- EDIT (PUT / PATCH) ----
function openEditModal(product) {
  editForm.elements['id'].value = product.id;
  editForm.elements['title'].value = product.title;
  editForm.elements['price'].value = product.price;
  editForm.elements['category'].value = product.category;
  editModal.classList.remove('hidden');
  editModal.classList.add('flex');
}

cancelEdit.addEventListener('click', () => {
  editModal.classList.add('hidden');
  editModal.classList.remove('flex');
});

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const method = e.submitter.dataset.method; // PUT or PATCH
  const id = Number(editForm.elements['id'].value);
  const previous = getShadowProducts().find(p => p.id === id);

  const changes = {
    title: editForm.elements['title'].value,
    price: Number(editForm.elements['price'].value),
    category: editForm.elements['category'].value
  };

  // Optimistic update
  updateInShadow(id, changes);
  renderAdminProducts();

  try {
    if (method === 'PUT') {
      await updateProductPUT(id, changes);
    } else {
      await updateProductPATCH(id, changes);
    }
    logActivity(`Updated product (${method})`, changes.title, true);
  } catch (err) {
    // Rollback to previous values
    updateInShadow(id, previous);
    logActivity(`Updated product (${method})`, changes.title, false);
  }

  renderAdminProducts();
  renderActivityLog();
  editModal.classList.add('hidden');
  editModal.classList.remove('flex');
});

// ---- DELETE ----
async function handleDelete(product) {
  const products = getShadowProducts();
  removeFromShadow(product.id); // optimistic removal
  renderAdminProducts();

  try {
    await deleteProduct(product.id);
    logActivity('Deleted product', product.title, true);
  } catch (err) {
    saveShadowProducts(products); // rollback: restore full previous list
    logActivity('Deleted product', product.title, false);
  }

  renderAdminProducts();
  renderActivityLog();
}

// ---- INIT: seed shadow state from real API on first load ----
async function init() {
  if (getShadowProducts().length === 0) {
    const data = await getProducts(20, 0);
    saveShadowProducts(data.products);
  }
  renderAdminProducts();
  renderActivityLog();
}

init();