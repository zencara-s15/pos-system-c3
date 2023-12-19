// element
const addProductForm = document.querySelector(".addProductForm")

// main function
function hide(element) {
  element.style.display = "none";
}

function show(element) {
  element.style.display = "block";
}

// Data----------------------------

let products = [];
let categories = [];

// Local Storage

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts() {
  let productStorage = JSON.parse(localStorage.getItem("products"));
  if (productStorage !== null) {
    products = productStorage;
  }
}


// categoryView 
function displayCategory(element) {

  const storedCategories = localStorage.getItem('categories');

  if (storedCategories !== null) {
    categories = JSON.parse(storedCategories);

    for (let i = 0; i < categories.length; i++) {
      let newOption = document.createElement('option');
      newOption.value = categories[i].name;
      newOption.textContent = categories[i].name;
      element.appendChild(newOption)
    }
  }
}

function categoryView() {
  displayCategory(document.querySelector("#product-categories"))
  displayCategory(document.querySelector("#product-categories2"))
}

// clearForm after input 

function clearForm() {
  productName.value = ""
  productNetPrice.value = ""
  productPrice.value = ""
  productCatergory.value = "Select Catergory"
  productQty.value = ""
  productDescription.value = ""
}

// Add 
function addProduct(event) {

  event.preventDefault();

  let existingProductIndex = products.findIndex((product) => product.name === productName.value);

  let newProduct = {
    name: productName.value,
    price: productPrice.value,
    category: productCatergory.value,
    qty: productQty.value,
  };

  if (existingProductIndex !== -1) {
    let existingProduct = products[existingProductIndex];
    existingProduct.qty = Number(existingProduct.qty) + Number(newProduct.qty);
  } else {
    products.push(newProduct);
  }
  location.reload()
  saveProducts();
  clearForm();
}

// remove products
function removeRow(e) {

  let isRemove = window.confirm("Are you sure about that?");
  if (isRemove) {
    e.target.closest('tr').remove();
    products.splice(e.target.id, 1)
  }

  let btnRemove = document.querySelectorAll('.deleteAction');

  for (let btn of btnRemove) {
    btn.addEventListener('click', removeRow);

  }
  saveProducts()
  loadProducts()
}

// show product to table 
let tbody = document.querySelector("tbody");

function renderProducts() {

  let productsStorage = JSON.parse(localStorage.getItem("products"));
  if (productsStorage !== null) {
    products = productsStorage;
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      let tableRow = document.createElement('tr');

      let tdID = document.createElement('td');
      tdID.textContent = i + 1;

      let tdName = document.createElement('td');
      tdName.textContent = product.name;

      let tdCategory = document.createElement('td');
      tdCategory.textContent = product.category;

      let tdPrice = document.createElement('td');
      tdPrice.textContent = product.price;

      let tdAmount = document.createElement('td');
      tdAmount.textContent = product.qty;

      let tdManage = document.createElement('td');

      let deleteBtn = document.createElement('span');
      deleteBtn.className = "delete material-symbols-outlined";
      deleteBtn.textContent = "delete";
      deleteBtn.addEventListener('click', removeRow);
      tdManage.appendChild(deleteBtn);

      let editAction = document.createElement("span");
      editAction.className = "edit material-symbols-outlined";
      editAction.textContent = "edit_document";
      // editAction.addEventListener("click");
      tdManage.appendChild(editAction);

      let cartAction = document.createElement("span");
      cartAction.className = "edit material-symbols-outlined";
      cartAction.textContent = "add_shopping_cart";
      cartAction.addEventListener("click", order_product);
      tdManage.appendChild(cartAction);

      tableRow.appendChild(tdID);
      tableRow.appendChild(tdName);
      tableRow.appendChild(tdCategory);
      tableRow.appendChild(tdPrice);
      tableRow.appendChild(tdAmount);
      tableRow.appendChild(tdManage);

      tbody.appendChild(tableRow);
    }
  }

}
//search products

function searchProduct(event) {
  let searchText = event.target.value.toLowerCase();
  let tbody = document.getElementsByTagName("tbody")[0];
  let tdElements = tbody.querySelectorAll("tr");

  tdElements.forEach(function (tdElement) {
    let productName = tdElement.firstElementChild.nextElementSibling.textContent.toLowerCase();
    if (productName.includes(searchText)) {
      tdElement.style.display = "";
    } else {
      tdElement.style.display = "none";
    }
  });
}

let searchProductInput = document
  .getElementById("search-product")
  .querySelector("input");
searchProductInput.addEventListener("keyup", searchProduct);

// show add product form 
function add_product_form() {
  hide(orderForm)
  show(productForm)
}

const order_body = document.querySelector(".order-body");
let totalPrice = 0;
let quantity = 1;

function order_product(event) {
  hide(productForm);
  show(orderForm);

  const tableRow = event.target.closest("tr");
  const productName = tableRow.querySelector("td:nth-child(2)").textContent;
  const productPrice = tableRow.querySelector("td:nth-child(4)").textContent;

  // Check if the product is already in the order
  const existingOrderCard = Array.from(order_body.getElementsByClassName('PO-title')).find(element => element.textContent === productName)?.closest(".order-card");

  if (existingOrderCard) {

    const orderQtySpan = existingOrderCard.querySelector("#order-qty");
    const currentQuantity = parseInt(orderQtySpan.textContent);
    const newQuantity = currentQuantity + 1;
    orderQtySpan.textContent = newQuantity;

    // Calculate the updated total price
    totalPrice += parseInt(productPrice);
    document.querySelector(".order-total").textContent =
      "Total: " + totalPrice + "$";

  } else {
    // Create a new order card

    const orderCardDiv = document.createElement("div");
    orderCardDiv.classList.add("order-card");

    const productOrderNameDiv = document.createElement("div");
    productOrderNameDiv.classList.add("product-order-name");

    const productNameSpan = document.createElement("span");
    productNameSpan.classList.add("PO-title");
    productNameSpan.textContent = productName;

    const productPriceSpan = document.createElement("span");
    productPriceSpan.classList.add("PO-price");
    productPriceSpan.textContent = productPrice + "$";

    productOrderNameDiv.appendChild(productNameSpan);
    productOrderNameDiv.appendChild(productPriceSpan);

    const poQtyDiv = document.createElement("div");
    poQtyDiv.classList.add("PO-qty");

    const orderQtySpan = document.createElement("span");
    orderQtySpan.id = "order-qty";
    orderQtySpan.textContent = quantity;

    const minusButton = document.createElement("button");
    minusButton.classList.add("minus-order");
    minusButton.textContent = "-";
    minusButton.addEventListener("click", function () {
      decreaseQuantity(orderQtySpan);
    });

    const plusButton = document.createElement("button");
    plusButton.classList.add("plus-order");
    plusButton.textContent = "+";
    plusButton.addEventListener("click", function () {
      increaseQuantity(orderQtySpan);
    });

    poQtyDiv.appendChild(minusButton);
    poQtyDiv.appendChild(orderQtySpan);
    poQtyDiv.appendChild(plusButton);

    orderCardDiv.appendChild(productOrderNameDiv);
    orderCardDiv.appendChild(poQtyDiv);

    order_body.appendChild(orderCardDiv);

    totalPrice += parseInt(productPrice);
    document.querySelector(".order-total").textContent =
      "Total: " + totalPrice + "$";
  }

}
// if click minus button -price 

function decreaseQuantity(element) {
  let quantity = parseInt(element.textContent);
  if (quantity > 1) {
    quantity--;
    element.textContent = quantity;
    updateTotalPrice();
  }
}

// if click plus button +price 

function increaseQuantity(element) {
  let quantity = parseInt(element.textContent);
  quantity++;
  element.textContent = quantity;
  updateTotalPrice();
}

function updateTotalPrice() {
  let orderCards = document.querySelectorAll(".order-card");
  let totalPrice = 0;

  orderCards.forEach(function (orderCard) {
    let priceSpan = orderCard.querySelector(".PO-price");
    let qtySpan = orderCard.querySelector("#order-qty");

    let price = parseInt(priceSpan.textContent);
    let quantity = parseInt(qtySpan.textContent);

    totalPrice += price * quantity;
  });

  document.querySelector(".order-total").textContent = "Total: " + totalPrice + "$";
}

let productName = document.querySelector('#product-name');
let productNetPrice = document.querySelector("#net-price");
let productPrice = document.querySelector("#product-price");
let productCatergory = document.querySelector("#product-categories");
let productQty = document.querySelector("#product-qty");
let productDescription = document.querySelector("#product-description");

// form to add product 
let productForm = document.querySelector(".addProductForm");
let orderForm = document.querySelector(".order-form");

// btn  and addEventlistener
let addBtn = document.querySelector("#form-submit-btn");
addBtn.addEventListener("click", addProduct);

let showAddProductForm = document.querySelector("#display-add-form");
showAddProductForm.addEventListener("click", add_product_form);

categoryView();
renderProducts();
loadProducts();
