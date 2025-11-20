"use strict";

const allProducts = document.getElementById("all-products");
const pagination = document.getElementById("pagination");
const productsPerPage = 12;
let currentPage = 1;
let products = [];

// 商品を12枚ずつ表示
function renderProducts(page) {
    allProducts.innerHTML = "";
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = products.slice(start, end);

    pageProducts.forEach(([id,p]) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
        <a href="detail.html?id=${id}">
        <img src="${p.image}">
        </a>
        <p class="product-name">${p.name}</p>
        <p class="product-price">${p.price.toLocaleString('ja-JP',{
            style: 'currency',
            currency: 'JPY'
        })} +tax</p>
        `;
        allProducts.appendChild(card);
    });
}

// ページ切り替え
function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(products.length / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
       const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = (i === currentPage) ? "active" : "";
        btn.addEventListener("click", () => {
            currentPage = i;
            renderProducts(currentPage);
            renderPagination();
        })
        pagination.appendChild(btn);
    }
}

// 初期表示
fetch("js/products.json").then(response => response.json()).then(data => {
    products = Object.entries(data);
    renderProducts(currentPage);
    renderPagination();
})

.catch(error => {
    console.error("商品データの読み込みに失敗しました:",error);
});
