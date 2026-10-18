/* 牌桌重绘块（手机方案）：窄屏下牌桌有最小宽度（见 mj.css 的 --mj-table-min），外层 .mj-table-scroll 横向滑动。
   1. 首次显示时把滚动位置放到正中（桌心的局名/余牌/点数/牌河在中间）；
   2. 滚动位置变化时在外层 <a class="mj-table-open"> 上维护 data-more="l|r|lr"，CSS 据此在还能继续滑的一侧画一条渐变暗边（提示可横滑，不含文字）。
   没有 JS 时也能用（从左端开始，手动滑动，没有暗边提示）。点按任意处仍由 glightbox 打开原截图；滑动不会触发点击。 */
(function () {
  function hint(sc) {
    var a = sc.parentNode;
    var max = sc.scrollWidth - sc.clientWidth;
    if (max <= 1) { a.removeAttribute("data-more"); return; }
    var s = (sc.scrollLeft > 1 ? "l" : "") + (sc.scrollLeft < max - 1 ? "r" : "");
    if (s) a.setAttribute("data-more", s); else a.removeAttribute("data-more");
  }
  function center(force) {
    document.querySelectorAll(".mj-table-scroll").forEach(function (el) {
      if (!el.dataset.mjBound) {
        el.dataset.mjBound = "1";
        el.addEventListener("scroll", function () { hint(el); }, { passive: true });
      }
      if (force) delete el.dataset.mjCentered;
      if (!el.dataset.mjCentered && el.scrollWidth > el.clientWidth + 1) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        el.dataset.mjCentered = "1";
      }
      hint(el);
    });
  }
  if (window.document$) window.document$.subscribe(function () { center(false); });
  else document.addEventListener("DOMContentLoaded", function () { center(false); });
  window.addEventListener("resize", function () { center(true); });
})();
