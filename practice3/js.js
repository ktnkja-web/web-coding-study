"use strict";

//写真のプレビュー機能
function showPreview(thumbnail) {
  const largeImage = document.getElementById("largeImage");
  largeImage.src = thumbnail.src;
  largeImage.alt = thumbnail.alt;

  const rect = largeImage.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // 調整してスクロール（例：startより少し下 = 100pxオフセット）
  window.scrollTo({
    top: rect.top + scrollTop - 100,

    behavior: "smooth"
  });
}

//ハンバーガーメニュー開閉
$(document).ready(function () {
  $('#hamburger').on('click', function (e) {
    e.stopPropagation(); // 外側クリック検知の妨げにならないように
    $('#navlinks').stop(true, true).slideToggle().toggleClass('active');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('#navlinks, #hamburger').length) {
      if ($('#navlinks').hasClass('active')) {
        $('#navlinks').removeClass('active').stop(true, true).slideUp();
      }
    }
  });
});
