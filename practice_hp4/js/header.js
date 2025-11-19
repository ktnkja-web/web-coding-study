"use strict";

fetch('header.html').then(res => res.text()).then(data => {
    document.getElementById('header').innerHTML=data;

const mask = document.getElementById("mask");
const humburger = document.getElementById("humburger");
const nav = document.querySelector("nav");

humburger.addEventListener('click', () => {
    mask.classList.toggle('active');
    humburger.classList.toggle('active');
    nav.classList.toggle('active');
});

mask.addEventListener('click', (e)=>{
    if (e.target.id === "mask") {
        mask.classList.add('active');
        humburger.classList.remove('active');
        nav.classList.remove('active');
    }
});
});