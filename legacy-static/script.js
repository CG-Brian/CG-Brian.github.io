/* ------------------------------------------------------------------
   Network data
   Layers: 0 = Foundations, 1 = Projects, 2 = Research.
   `short` is used where horizontal space is tight (small screens).
   `href` should point at the matching row further down the page.
   ------------------------------------------------------------------ */
const LAYERS = ["Foundations", "Projects", "Research"];
const KINDS = ["Foundation", "Project", "Research"];

const NODES = [
  { id: "linalg", layer: 0, label: "Linear Algebra", short: "Lin. Algebra",
    text: "Vector spaces, decompositions, and the geometry underneath nearly every model and index I have built." },
  { id: "prob", layer: 0, label: "Probability",
    text: "Measure, estimation, and uncertainty. This is the language for whether a result is real or just noise." },
  { id: "numerics", layer: 0, label: "Numerical Methods", short: "Numerics",
    text: "Floating point, conditioning, and error propagation. They decide what is actually computable on real hardware." },
  { id: "algos", layer: 0, label: "Algorithms",
    text: "Data structures and complexity, plus the habit of asking what the asymptotics hide." },
  { id: "dsys", layer: 0, label: "Distributed Systems", short: "Dist. Systems",
    text: "Consistency, causality, and failure: what can be guaranteed when machines and networks misbehave." },
  { id: "compilers", layer: 0, label: "Compilers",
    text: "Parsing, intermediate representations, and incremental computation, applied well beyond programming languages." },

  { id: "tessellate", layer: 1, label: "Tessellate", meta: "2025", href: "#work-tessellate",
    text: "An embeddable vector index in Rust. Product quantization and a SIMD distance kernel keep 10M vectors in under 2 GB." },
  { id: "murmur", layer: 1, label: "Murmur", meta: "2024", href: "#work-murmur",
    text: "On-device speech-to-intent for low-power hardware, built from a distilled model and a 4-bit runtime." },
  { id: "quill", layer: 1, label: "Quill", meta: "2023", href: "#work-quill",
    text: "A small typesetting language that compiles to PDF, with incremental re-layout and Knuth–Plass line breaking." },
  { id: "ledger", layer: 1, label: "Ledger", meta: "2024", href: "#work-ledger",
    text: "A local-first sync engine on delta-state CRDTs. Offline edits merge deterministically." },
  { id: "atlas", layer: 1, label: "Atlas", meta: "2022", href: "#work-atlas",
    text: "A streaming geospatial tile server that renders vector tiles from live transit sensor feeds." },

  { id: "sparse", layer: 2, label: "Sparse Retrieval", meta: "Preprint · 2025", href: "#research-sparse",
    title: "Sparse Retrieval Heads in Small Language Models",
    text: "A handful of attention heads do most of the lookup work in sub-1B models. This paper looks at what pruning them reveals." },
  { id: "quant", layer: 2, label: "Quantization Error", short: "Quant. Error", meta: "Note · 2025", href: "#research-quant",
    title: "Error Budgets for 4-bit Inference",
    text: "A practical way to allocate quantization error across layers, worked out while building Murmur." },
  { id: "layout", layer: 2, label: "Incremental Layout", short: "Inc. Layout", meta: "Essay · 2023", href: "#research-layout",
    title: "Incremental Layout as a Dataflow Problem",
    text: "Treating document layout as a self-adjusting computation, and where that framing breaks." },
  { id: "crdt", layer: 2, label: "Causal CRDTs", meta: "Workshop · 2024", href: "#research-crdt",
    title: "Bounded Metadata for Causal CRDTs",
    text: "Keeping causal metadata from growing without bound under partial replication." },
];

const EDGES = [
  ["linalg", "tessellate"], ["algos", "tessellate"], ["numerics", "tessellate"],
  ["prob", "murmur"], ["linalg", "murmur"], ["numerics", "murmur"],
  ["compilers", "quill"], ["algos", "quill"],
  ["dsys", "ledger"], ["algos", "ledger"],
  ["dsys", "atlas"], ["numerics", "atlas"],

  ["tessellate", "sparse"], ["murmur", "sparse"], ["linalg", "sparse"],
  ["murmur", "quant"], ["numerics", "quant"], ["prob", "quant"],
  ["quill", "layout"], ["compilers", "layout"],
  ["ledger", "crdt"], ["dsys", "crdt"],
];

/* ------------------------------------------------------------------
   Graph
   ------------------------------------------------------------------ */
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const figure = document.getElementById("graph-figure");
  const svg = document.getElementById("graph");
  const panel = document.getElementById("graph-panel");
  const resetBtn = figure.querySelector(".graph-reset");
  if (!figure || !svg || !panel) return;

  const byId = new Map(NODES.map((n) => [n.id, { ...n, links: new Set() }]));
  EDGES.forEach(([a, b]) => {
    byId.get(a).links.add(b);
    byId.get(b).links.add(a);
  });

  const pos = new Map();
  let W = 0, H = 0, mode = "cols";
  let hovered = null, selected = null, moved = false;

  const el = (name, attrs = {}) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  /* ---- Build DOM once ---- */
  const headG = el("g");
  const edgeG = el("g");
  const nodeG = el("g");
  svg.append(headG, edgeG, nodeG);

  const heads = LAYERS.map((name, i) => {
    const t = el("text", { class: "layer-head" });
    const count = NODES.filter((n) => n.layer === i).length;
    t.textContent = `${name} · ${String(count).padStart(2, "0")}`;
    headG.append(t);
    return t;
  });

  const edgeEls = EDGES.map(([a, b]) => {
    const p = el("path", { class: "edge" });
    edgeG.append(p);
    return { a, b, el: p };
  });

  const nodeEls = new Map();
  NODES.forEach((n) => {
    const g = el("g", {
      class: "node",
      tabindex: "0",
      role: "button",
      "data-id": n.id,
      "data-layer": n.layer,
      "aria-label": `${KINDS[n.layer]}: ${n.title || n.label}. ${byId.get(n.id).links.size} connections.`,
    });
    g.append(el("circle", { class: "hit", r: 16 }));
    g.append(el("circle", { class: "ring", r: 9 }));
    g.append(
      n.layer === 2
        ? el("rect", { class: "dot", x: -4, y: -4, width: 8, height: 8 })
        : el("circle", { class: "dot", r: n.layer === 0 ? 3.75 : 4.5 })
    );
    const label = el("text");
    g.append(label);
    nodeG.append(g);
    nodeEls.set(n.id, { g, label });
  });

  /* ---- Layout ---- */
  const JITTER = [0, 11, -7, 13, -10, 5];

  function layout() {
    W = Math.round(figure.clientWidth);
    mode = W < 600 ? "rows" : "cols";
    H = mode === "cols" ? Math.max(420, Math.min(500, W * 0.6)) : 560;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("height", H);

    const groups = LAYERS.map((_, i) => NODES.filter((n) => n.layer === i));

    if (mode === "cols") {
      const xs = [0.24, 0.52, 0.8].map((f) => Math.round(W * f));
      const top = 72, bottom = H - 24;
      groups.forEach((list, li) => {
        const step = (bottom - top) / list.length;
        list.forEach((n, i) => {
          const j = JITTER[i % JITTER.length] * (li === 1 ? 1.4 : 0.8);
          pos.set(n.id, { x: xs[li] + j, y: top + step * (i + 0.5) });
        });
      });
      const anchors = ["end", "middle", "start"];
      heads.forEach((t, i) => {
        t.setAttribute("x", xs[i] + (i === 0 ? 4 : i === 2 ? -4 : 0));
        t.setAttribute("y", 24);
        t.setAttribute("text-anchor", anchors[i]);
      });
    } else {
      const ys = [104, 300, 496];
      const pad = 8;
      groups.forEach((list, li) => {
        const step = (W - pad * 2) / list.length;
        list.forEach((n, i) => {
          const j = JITTER[i % JITTER.length] * 0.6;
          pos.set(n.id, { x: pad + step * (i + 0.5), y: ys[li] + j });
        });
      });
      heads.forEach((t, i) => {
        t.setAttribute("x", 0);
        t.setAttribute("y", ys[i] - 62);
        t.setAttribute("text-anchor", "start");
      });
    }

    moved = false;
    resetBtn.hidden = true;
    draw();
  }

  function placeLabel(n, i) {
    const { label } = nodeEls.get(n.id);
    label.textContent = mode === "rows" && n.short ? n.short : n.label;
    if (mode === "cols") {
      const spec = [
        { x: -14, y: 4, a: "end" },
        { x: 0, y: -14, a: "middle" },
        { x: 14, y: 4, a: "start" },
      ][n.layer];
      label.setAttribute("x", spec.x);
      label.setAttribute("y", spec.y);
      label.setAttribute("text-anchor", spec.a);
    } else {
      // Alternate above/below so neighbouring labels never collide.
      label.setAttribute("x", 0);
      label.setAttribute("y", i % 2 === 0 ? 22 : -14);
      label.setAttribute("text-anchor", "middle");
    }
  }

  function edgePath(a, b) {
    const p = pos.get(a), q = pos.get(b);
    const skip = Math.abs(byId.get(a).layer - byId.get(b).layer) === 2;
    if (!skip) return `M${p.x},${p.y}L${q.x},${q.y}`;
    // Skip connections bow away from the middle layer rather than cutting through it.
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
    const bow = mode === "cols" ? { x: 0, y: (my < H / 2 ? -1 : 1) * 46 } : { x: (mx < W / 2 ? -1 : 1) * 46, y: 0 };
    return `M${p.x},${p.y}Q${mx + bow.x},${my + bow.y} ${q.x},${q.y}`;
  }

  function draw() {
    const seen = [0, 0, 0];
    NODES.forEach((n) => {
      const { x, y } = pos.get(n.id);
      nodeEls.get(n.id).g.setAttribute("transform", `translate(${x},${y})`);
      placeLabel(n, seen[n.layer]++);
    });
    edgeEls.forEach((e) => e.el.setAttribute("d", edgePath(e.a, e.b)));
  }

  /* ---- Focus state ---- */
  function refresh() {
    const id = hovered || selected;
    const node = id && byId.get(id);
    figure.classList.toggle("has-focus", !!node);

    nodeEls.forEach(({ g }, nid) => {
      g.classList.toggle("is-active", nid === id);
      g.classList.toggle("is-near", !!node && node.links.has(nid));
      g.classList.toggle("is-pinned", nid === selected);
      g.setAttribute("aria-pressed", nid === selected ? "true" : "false");
    });
    edgeEls.forEach((e) => e.el.classList.toggle("is-lit", !!node && (e.a === id || e.b === id)));

    renderPanel(node);
  }

  function setHover(id) {
    if (hovered === id) return;
    hovered = id;
    refresh();
  }

  function select(id) {
    selected = selected === id ? null : id;
    refresh();
  }

  /* ---- Panel ---- */
  function renderPanel(node) {
    if (!node) {
      const counts = LAYERS.map((_, i) => NODES.filter((n) => n.layer === i).length);
      panel.innerHTML = `
        <div class="panel-col-a">
          <p class="panel-kind">Index</p>
          <h3 class="panel-title">${NODES.length} nodes, ${EDGES.length} connections</h3>
          <p class="panel-text">Foundations on the left feed the projects in the middle, and those raise the research questions on the right. A few lines skip a layer, where theory led straight to a question.</p>
        </div>
        <ul class="panel-legend panel-col-b">
          ${LAYERS.map((name, i) => `<li><span class="glyph" data-layer="${i}"></span><span>${name}</span><span>${String(counts[i]).padStart(2, "0")}</span></li>`).join("")}
        </ul>`;
      return;
    }

    const links = [...node.links]
      .map((id) => byId.get(id))
      .sort((a, b) => a.layer - b.layer);

    panel.innerHTML = `
      <div class="panel-col-a">
        <p class="panel-kind"><span class="glyph" data-layer="${node.layer}"></span>${KINDS[node.layer]}${node.meta ? ` · ${node.meta}` : ""}</p>
        <h3 class="panel-title">${node.title || node.label}</h3>
        <p class="panel-text">${node.text}</p>
        ${node.href ? `<a class="panel-more" href="${node.href}">Read more ↓</a>` : ""}
      </div>
      <div class="panel-col-b">
        <p class="panel-sub">Connected to · ${String(links.length).padStart(2, "0")}</p>
        <ul class="panel-links">
          ${links.map((l) => `<li><button type="button" data-go="${l.id}"><span class="glyph" data-layer="${l.layer}"></span>${l.label}</button></li>`).join("")}
        </ul>
      </div>`;
  }

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    hovered = null;
    selected = btn.dataset.go;
    refresh();
    nodeEls.get(selected).g.focus({ preventScroll: true });
  });

  /* ---- Pointer: hover, click, drag ---- */
  function toSvg(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  let drag = null;

  nodeEls.forEach(({ g }, id) => {
    g.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && !drag) setHover(id); });
    g.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && !drag) setHover(null); });
    g.addEventListener("focus", () => { if (g.matches(":focus-visible")) setHover(id); });
    g.addEventListener("blur", () => setHover(null));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(id); }
    });

    g.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const p = toSvg(e), start = pos.get(id);
      drag = { id, dx: start.x - p.x, dy: start.y - p.y, sx: e.clientX, sy: e.clientY, active: false };
      g.setPointerCapture(e.pointerId);
    });

    g.addEventListener("pointermove", (e) => {
      if (!drag || drag.id !== id) return;
      if (!drag.active && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 4) return;
      if (!drag.active) {
        drag.active = true;
        g.classList.add("is-dragging");
        hovered = id;
        refresh();
      }
      const p = toSvg(e);
      pos.set(id, {
        x: Math.max(10, Math.min(W - 10, p.x + drag.dx)),
        y: Math.max(40, Math.min(H - 10, p.y + drag.dy)),
      });
      draw();
      if (!moved) { moved = true; resetBtn.hidden = false; }
    });

    const end = (e) => {
      if (!drag || drag.id !== id) return;
      const wasDrag = drag.active;
      drag = null;
      g.classList.remove("is-dragging");
      if (!wasDrag && e.type === "pointerup") select(id);
      else if (e.pointerType !== "mouse") setHover(null);
    };
    g.addEventListener("pointerup", end);
    g.addEventListener("pointercancel", end);
  });

  svg.addEventListener("click", (e) => {
    if (!e.target.closest(".node") && selected) { selected = null; refresh(); }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (selected || hovered)) {
      selected = null;
      hovered = null;
      refresh();
    }
  });

  resetBtn.addEventListener("click", layout);

  /* ---- Cross-references from the lists ---- */
  document.querySelectorAll("[data-select]").forEach((btn) => {
    btn.addEventListener("click", () => {
      hovered = null;
      selected = btn.dataset.select;
      refresh();
      document.getElementById("map").scrollIntoView({ block: "start" });
      nodeEls.get(selected).g.focus({ preventScroll: true });
    });
  });

  /* ---- Init ---- */
  let lastW = 0;
  new ResizeObserver(() => {
    const w = Math.round(figure.clientWidth);
    if (w !== lastW) { lastW = w; layout(); }
  }).observe(figure);

  layout();
  refresh();
})();
