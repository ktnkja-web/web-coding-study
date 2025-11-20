"use strict";


const topProducts = document.getElementById("top-products");

fetch("js/products.json").then(response => response.json()).then(data => {
    const entries = Object.entries(data);
    entries.slice(0, 8).forEach(([id, p]) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
    <a href="detail.html?id=${id}">
    <img src="${p.image}" alt=${p.name}>
    </a>
    <p class="product-name">${p.name}</p>
    <p class="product-price">${p.price.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        })} +tax</p>
    `;
        topProducts.appendChild(card);
    });
})
    .catch(error => {
        console.error("商品データの読み込みに失敗しました:", error);
    });

