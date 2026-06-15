/* cve2detect live demo - runs entirely in the browser against OSV (public CORS API).
   Mirrors the core of the CLI: fetch the advisory, follow the GHSA alias for package
   data, and generate a Sigma skeleton + per-ecosystem version checks. */

const VERCHECK = {
  PyPI: (p) => `pip show ${p}`,
  npm: (p) => `npm ls ${p}`,
  "crates.io": (p) => `cargo tree -i ${p}`,
  Go: () => `govulncheck ./...`,
  Maven: (p) => `mvn dependency:tree | grep ${p.split(":").pop()}`,
  RubyGems: (p) => `bundle list | grep ${p}`,
  Packagist: (p) => `composer show ${p}`,
};

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

async function fetchCVE(cve) {
  const osv = await getJSON(`https://api.osv.dev/v1/vulns/${cve}`);
  const rec = { id: cve, summary: osv.summary || "", references: (osv.references || []).map((r) => r.url), affected: [] };
  const records = [osv];
  for (const al of osv.aliases || []) {
    if (/^(GHSA|PYSEC|RUSTSEC|GO-|GSD)/.test(al)) {
      try { records.push(await getJSON(`https://api.osv.dev/v1/vulns/${al}`)); } catch (e) { /* ignore */ }
    }
  }
  const seen = new Set();
  for (const r of records) {
    if (!rec.summary && r.summary) rec.summary = r.summary;
    if (!rec.summary && r.details) rec.summary = r.details.slice(0, 200);
    for (const a of r.affected || []) {
      const pkg = a.package;
      if (!pkg) continue;
      const key = `${pkg.ecosystem}:${pkg.name}`;
      if (seen.has(key)) continue;
      let introduced = null, fixed = null;
      for (const rng of a.ranges || []) {
        if (rng.type !== "ECOSYSTEM" && rng.type !== "SEMVER") continue;
        for (const ev of rng.events || []) {
          if (ev.introduced) introduced = ev.introduced;
          if (ev.fixed) fixed = ev.fixed;
        }
      }
      seen.add(key);
      rec.affected.push({ ecosystem: pkg.ecosystem, name: pkg.name, introduced, fixed });
    }
  }
  try {
    const e = await getJSON(`https://api.first.org/data/v1/epss?cve=${cve}`);
    if (e && e.data && e.data[0]) rec.epss = { score: parseFloat(e.data[0].epss), pct: parseFloat(e.data[0].percentile) };
  } catch (err) { /* epss optional */ }
  return rec;
}

function sigma(rec) {
  const refs = rec.references.slice(0, 5).map((u) => `        - ${u}`).join("\n") || "        - <add reference>";
  return `title: ${rec.id} - ${(rec.summary || "detection").slice(0, 70)}
id: ${rec.id.toLowerCase()}-detect
status: experimental
description: |
    Detection skeleton for ${rec.id}.
    TODO: replace the selection with concrete indicators for your data source.
references:
${refs}
tags:
    - ${rec.id.toLowerCase()}
logsource:
    category: TODO      # process_creation | webserver | dns | network_connection
    product: TODO
detection:
    selection:
        TODO_field|contains:
            - 'TODO_indicator'
    condition: selection
level: medium`;
}

function versionChecks(rec) {
  if (!rec.affected.length) return "# no package-level data; likely an OS/appliance CVE (see references)";
  return rec.affected
    .map((a) => {
      const fn = VERCHECK[a.ecosystem];
      const head = `# ${a.ecosystem}: ${a.name} (fixed ${a.fixed || "see advisory"})`;
      return fn ? `${head}\n${fn(a.name)}` : head;
    })
    .join("\n\n");
}

function codeBlock(label, text) {
  const wrap = document.createElement("div");
  wrap.className = "mk-code";
  const bar = document.createElement("div");
  bar.className = "mk-code__bar";
  const dot = document.createElement("span");
  dot.className = "mk-code__dot";
  bar.appendChild(dot);
  bar.appendChild(document.createTextNode(label));
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.textContent = text; // textContent: safe, no injection from advisory data
  pre.appendChild(code);
  wrap.appendChild(bar);
  wrap.appendChild(pre);
  return wrap;
}

function heading(t) {
  const h = document.createElement("h3");
  h.style.marginTop = "var(--mk-space-5)";
  h.textContent = t;
  return h;
}

async function run() {
  const out = document.getElementById("demo-out");
  const raw = document.getElementById("cve-input").value.trim().toUpperCase();
  out.innerHTML = "";
  if (!/^CVE-\d{4}-\d+$/.test(raw)) {
    out.appendChild(document.createTextNode("Enter a CVE id like CVE-2021-44228."));
    return;
  }
  out.appendChild(document.createTextNode("fetching " + raw + " from OSV ..."));
  try {
    const rec = await fetchCVE(raw);
    out.innerHTML = "";

    if (rec.epss) {
      const t = document.createElement("p");
      const b = document.createElement("strong");
      b.textContent = `EPSS: ${(rec.epss.score * 100).toFixed(1)}% exploitation probability (${(rec.epss.pct * 100).toFixed(0)}th percentile)`;
      t.appendChild(b);
      out.appendChild(t);
    }

    const sum = document.createElement("p");
    sum.textContent = rec.summary || "(no summary in OSV)";
    out.appendChild(sum);

    out.appendChild(heading("affected packages"));
    if (rec.affected.length) {
      const ul = document.createElement("ul");
      ul.className = "proj-feats";
      for (const a of rec.affected) {
        const li = document.createElement("li");
        li.textContent = `${a.ecosystem}:${a.name} - fixed in ${a.fixed || "see advisory"}`;
        ul.appendChild(li);
      }
      out.appendChild(ul);
    } else {
      const p = document.createElement("p");
      p.className = "mk-faint";
      p.textContent = "no package-level data (likely an OS/appliance CVE).";
      out.appendChild(p);
    }

    out.appendChild(heading("sigma.yml"));
    out.appendChild(codeBlock("generated detection skeleton", sigma(rec)));
    out.appendChild(heading("version checks"));
    out.appendChild(codeBlock("per-ecosystem", versionChecks(rec)));

    const note = document.createElement("p");
    note.className = "mk-faint";
    note.style.marginTop = "var(--mk-space-4)";
    note.textContent = "This runs in your browser against OSV. The full CLI also pulls CVSS/CWE from NVD, writes a Nuclei template, and scaffolds a pinned repro.";
    out.appendChild(note);
  } catch (e) {
    out.innerHTML = "";
    const p = document.createElement("p");
    p.style.color = "var(--mk-danger)";
    p.textContent = "Could not load " + raw + " from OSV (" + e.message + "). Try a CVE with package-level data, e.g. CVE-2021-23337.";
    out.appendChild(p);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cve-run").addEventListener("click", run);
  document.getElementById("cve-input").addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
});
