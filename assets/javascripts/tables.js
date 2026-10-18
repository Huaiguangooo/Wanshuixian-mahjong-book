/* 牌桌重绘块（手机方案）：窄屏下整桌按 16:9 缩小装进正文宽度，不横滑。
   窄屏点按牌桌 -> 全屏放大重绘图（竖屏时整桌转 90° 铺满屏幕，横过手机看；手机横屏时不转）；点右下角小图标 -> glightbox 打开原截图。
   全屏层：点任意处、Esc、手机返回键都可关闭。宽屏不拦截，点击牌桌照旧打开原截图。 */
(function () {
  var NARROW = window.matchMedia("(max-width: 44.9375em)");
  var ov = null, box = null;

  function fit() {
    if (!box) return;
    var vw = window.innerWidth, vh = window.innerHeight, rot = vh > vw;
    var W = rot ? vh : vw, H = rot ? vw : vh;
    box.style.width = Math.floor(Math.min(W, H * 16 / 9) * 0.97) + "px";
    box.classList.toggle("rot", rot);
  }
  function remove() {
    if (!ov) return;
    ov.remove(); ov = box = null;
    document.documentElement.classList.remove("mj-full-open");
    window.removeEventListener("resize", fit);
  }
  function close() {
    if (!ov) return;
    if (history.state && history.state.mjFull) history.back(); else remove();
  }
  function open(a) {
    var tbl = a.querySelector(".mj-table");
    if (!tbl || ov) return;
    ov = document.createElement("div");
    ov.className = "mj-full";
    box = document.createElement("div");
    box.className = "mj-full-box";
    box.appendChild(tbl.cloneNode(true));
    ov.appendChild(box);
    var x = document.createElement("span");
    x.className = "mj-full-x";
    x.setAttribute("aria-hidden", "true");
    ov.appendChild(x);
    ov.addEventListener("click", close);
    document.body.appendChild(ov);
    document.documentElement.classList.add("mj-full-open");
    window.addEventListener("resize", fit);
    fit();
    history.pushState({ mjFull: 1 }, "");
  }

  document.addEventListener("click", function (e) {
    if (!NARROW.matches) return;
    var a = e.target.closest && e.target.closest("a.mj-table-open");
    if (!a || e.target.closest(".mj-orig") || !a.querySelector(".mj-table")) return;
    e.preventDefault();
    e.stopPropagation();                   // 捕获阶段拦下，glightbox 收不到这次点击
    open(a);
  }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  window.addEventListener("popstate", remove);
})();
