// Gallery figures (viz/?c=<name>) post {moeviz: name, w, h} whenever their size changes: fit each iframe to it,
// never cut and no empty space below, wider than the column and centred when the figure needs it.
addEventListener("message", (e) => {
  const d = e.data;
  if (!d || !d.moeviz) return;
  for (const f of document.querySelectorAll('iframe[src^="viz/"]')) if (f.contentWindow === e.source) {
    f.style.height = d.h + 2 + "px";
    const col = f.parentElement.clientWidth;
    f.style.width = Math.max(col, d.w + 2) + "px";
    f.style.marginLeft = d.w + 2 > col ? `calc((100% - ${d.w + 2}px) / 2)` : "0";
  }
});
