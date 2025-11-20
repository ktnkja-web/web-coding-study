"use strict";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(!id){
    document.body.innerHTML="<p>商品IDが指定されていません。</p>";
}else{
    fetch("js/products.json").then(res => res.json()).then(data => {
        const product = data[id];
        if(!product){
            ducument.body.innerHTML="<p>商品が見つかりませんでした。</p>";
            return;
        }

        document.getElementById("product-name").textContent=product.name;
        document.getElementById("product-img").src=product.image;
        document.getElementById("product-description1").textContent=product.description1;
        document.getElementById("product-description2").textContent=product.description2;
        document.getElementById("price").textContent=product.price.toLocaleString('ja-JP',{
            style: 'currency',
            currency: 'JPY'
        });
        document.getElementById("size").textContent=product.size;
        document.getElementById("color").textContent=product.color;
        document.getElementById("material").textContent=product.material;
        
    });
}

