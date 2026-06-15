/* seccard demo - real reports for a few pre-scanned domains, rendered client-side.
   No live arbitrary-domain scanning (that would be an SSRF/abuse backend). */
const REPORTS = {"mstampfli.com":{"domain":"mstampfli.com","grade":"B","score":84,"sections":{"TLS":[{"name":"TLS chain & hostname","status":"ok","detail":"valid, negotiated TLSv1.3","fix":""},{"name":"Cert expiry","status":"ok","detail":"87 days remaining","fix":""},{"name":"Subject Alt Names","status":"ok","detail":"1 name(s)","fix":""},{"name":"Cipher","status":"ok","detail":"TLS_AES_128_GCM_SHA256 (128-bit)","fix":""},{"name":"TLS 1.3","status":"ok","detail":"supported","fix":""},{"name":"Legacy TLS","status":"ok","detail":"TLS 1.0/1.1 refused","fix":""},{"name":"Cert key","status":"ok","detail":"256-bit EC","fix":""},{"name":"Cert signature","status":"ok","detail":"ecdsa-with-SHA384","fix":""},{"name":"OCSP stapling","status":"warn","detail":"not stapled","fix":"enable OCSP stapling"}],"HTTP headers":[{"name":"Strict-Transport-Security","status":"ok","detail":"max-age=63072000; includeSubDomains; preload","fix":""},{"name":"Content-Security-Policy","status":"ok","detail":"default-src 'self'; script-src 'self' 'sha256-L129hvjb","fix":""},{"name":"X-Content-Type-Options","status":"ok","detail":"nosniff","fix":""},{"name":"Referrer-Policy","status":"ok","detail":"strict-origin-when-cross-origin","fix":""},{"name":"Permissions-Policy","status":"ok","detail":"geolocation=(), microphone=(), camera=(), browsing-top","fix":""},{"name":"Cross-Origin-Opener-Policy","status":"warn","detail":"missing","fix":"add `Cross-Origin-Opener-Policy: same-origin`"},{"name":"Cross-Origin-Resource-Policy","status":"warn","detail":"missing","fix":"add `Cross-Origin-Resource-Policy: same-origin`"},{"name":"CSP quality","status":"ok","detail":"no obvious weaknesses","fix":""},{"name":"Clickjacking","status":"ok","detail":"protected","fix":""},{"name":"HTTP->HTTPS","status":"ok","detail":"redirects to HTTPS","fix":""}],"Web hygiene":[{"name":"security.txt","status":"warn","detail":"missing","fix":"publish /.well-known/security.txt (RFC 9116)"},{"name":"TRACE method","status":"ok","detail":"disabled","fix":""}],"DNS & email auth":[{"name":"SPF","status":"ok","detail":"v=spf1 include:_spf.porkbun.com ~all","fix":""},{"name":"SPF lookups","status":"ok","detail":"~1 DNS-lookup mechanisms","fix":""},{"name":"DMARC policy","status":"warn","detail":"p=none","fix":"tighten to p=quarantine then p=reject"},{"name":"DMARC reporting","status":"ok","detail":"rua set","fix":""},{"name":"MX","status":"ok","detail":"2 record(s)","fix":""},{"name":"DKIM","status":"warn","detail":"no common selector found","fix":"publish a DKIM key (couldn't find a common selector)"},{"name":"MTA-STS","status":"warn","detail":"missing","fix":"publish MTA-STS to enforce TLS for inbound mail"},{"name":"TLS-RPT","status":"warn","detail":"missing","fix":"publish TLS-RPT for mail TLS failure reports"},{"name":"CAA","status":"warn","detail":"no CAA record","fix":"add CAA to restrict which CAs may issue"},{"name":"DNSSEC","status":"warn","detail":"unsigned","fix":"enable DNSSEC"}]}},"example.com":{"domain":"example.com","grade":"C","score":73,"sections":{"TLS":[{"name":"TLS chain & hostname","status":"ok","detail":"valid, negotiated TLSv1.3","fix":""},{"name":"Cert expiry","status":"ok","detail":"75 days remaining","fix":""},{"name":"Subject Alt Names","status":"ok","detail":"2 name(s)","fix":""},{"name":"Cipher","status":"ok","detail":"TLS_AES_256_GCM_SHA384 (256-bit)","fix":""},{"name":"TLS 1.3","status":"ok","detail":"supported","fix":""},{"name":"Legacy TLS","status":"ok","detail":"TLS 1.0/1.1 refused","fix":""},{"name":"Cert key","status":"ok","detail":"256-bit EC","fix":""},{"name":"Cert signature","status":"ok","detail":"ecdsa-with-SHA256","fix":""},{"name":"OCSP stapling","status":"ok","detail":"stapled","fix":""}],"HTTP headers":[{"name":"Strict-Transport-Security","status":"bad","detail":"missing","fix":"add `Strict-Transport-Security: max-age=63072000; includeSubDomains`"},{"name":"Content-Security-Policy","status":"warn","detail":"missing","fix":"add a CSP; start report-only, then enforce"},{"name":"X-Content-Type-Options","status":"warn","detail":"missing","fix":"add `X-Content-Type-Options: nosniff`"},{"name":"Referrer-Policy","status":"warn","detail":"missing","fix":"add `Referrer-Policy: strict-origin-when-cross-origin`"},{"name":"Permissions-Policy","status":"warn","detail":"missing","fix":"add a `Permissions-Policy`"},{"name":"Cross-Origin-Opener-Policy","status":"warn","detail":"missing","fix":"add `Cross-Origin-Opener-Policy: same-origin`"},{"name":"Cross-Origin-Resource-Policy","status":"warn","detail":"missing","fix":"add `Cross-Origin-Resource-Policy: same-origin`"},{"name":"Clickjacking","status":"warn","detail":"no X-Frame-Options / frame-ancestors","fix":"add `X-Frame-Options: DENY`"},{"name":"HTTP->HTTPS","status":"bad","detail":"served over plain HTTP","fix":"redirect all HTTP to HTTPS"}],"Web hygiene":[{"name":"security.txt","status":"warn","detail":"missing","fix":"publish /.well-known/security.txt (RFC 9116)"},{"name":"TRACE method","status":"ok","detail":"disabled","fix":""}],"DNS & email auth":[{"name":"SPF","status":"ok","detail":"v=spf1 -all","fix":""},{"name":"SPF lookups","status":"ok","detail":"~0 DNS-lookup mechanisms","fix":""},{"name":"DMARC policy","status":"ok","detail":"p=reject","fix":""},{"name":"DMARC reporting","status":"warn","detail":"no rua (no aggregate reports)","fix":"add `rua=mailto:...` to receive reports"},{"name":"MX","status":"ok","detail":"1 record(s)","fix":""},{"name":"DKIM","status":"ok","detail":"selector 'google' found","fix":""},{"name":"MTA-STS","status":"warn","detail":"missing","fix":"publish MTA-STS to enforce TLS for inbound mail"},{"name":"TLS-RPT","status":"warn","detail":"missing","fix":"publish TLS-RPT for mail TLS failure reports"},{"name":"CAA","status":"warn","detail":"no CAA record","fix":"add CAA to restrict which CAs may issue"},{"name":"DNSSEC","status":"ok","detail":"signed (DS present)","fix":""}]}},"github.com":{"domain":"github.com","grade":"B","score":89,"sections":{"TLS":[{"name":"TLS chain & hostname","status":"ok","detail":"valid, negotiated TLSv1.3","fix":""},{"name":"Cert expiry","status":"ok","detail":"48 days remaining","fix":""},{"name":"Subject Alt Names","status":"ok","detail":"2 name(s)","fix":""},{"name":"Cipher","status":"ok","detail":"TLS_AES_128_GCM_SHA256 (128-bit)","fix":""},{"name":"TLS 1.3","status":"ok","detail":"supported","fix":""},{"name":"Legacy TLS","status":"ok","detail":"TLS 1.0/1.1 refused","fix":""},{"name":"Cert key","status":"ok","detail":"256-bit EC","fix":""},{"name":"Cert signature","status":"ok","detail":"ecdsa-with-SHA256","fix":""},{"name":"OCSP stapling","status":"warn","detail":"not stapled","fix":"enable OCSP stapling"}],"HTTP headers":[{"name":"Strict-Transport-Security","status":"ok","detail":"max-age=31536000; includeSubdomains; preload","fix":""},{"name":"Content-Security-Policy","status":"ok","detail":"default-src 'none'; base-uri 'self'; child-src github.","fix":""},{"name":"X-Content-Type-Options","status":"ok","detail":"nosniff","fix":""},{"name":"Referrer-Policy","status":"ok","detail":"origin-when-cross-origin, strict-origin-when-cross-ori","fix":""},{"name":"Permissions-Policy","status":"warn","detail":"missing","fix":"add a `Permissions-Policy`"},{"name":"Cross-Origin-Opener-Policy","status":"warn","detail":"missing","fix":"add `Cross-Origin-Opener-Policy: same-origin`"},{"name":"Cross-Origin-Resource-Policy","status":"warn","detail":"missing","fix":"add `Cross-Origin-Resource-Policy: same-origin`"},{"name":"CSP quality","status":"ok","detail":"no obvious weaknesses","fix":""},{"name":"Clickjacking","status":"ok","detail":"protected","fix":""},{"name":"Cookie flags","status":"ok","detail":"Secure/HttpOnly/SameSite set","fix":""},{"name":"HTTP->HTTPS","status":"ok","detail":"redirects to HTTPS","fix":""}],"Web hygiene":[{"name":"security.txt","status":"ok","detail":"present","fix":""},{"name":"TRACE method","status":"ok","detail":"disabled","fix":""}],"DNS & email auth":[{"name":"SPF","status":"ok","detail":"v=spf1 ip4:192.30.252.0/22 include:spf.protection.outl","fix":""},{"name":"SPF lookups","status":"ok","detail":"~8 DNS-lookup mechanisms","fix":""},{"name":"DMARC policy","status":"ok","detail":"p=quarantine","fix":""},{"name":"DMARC reporting","status":"ok","detail":"rua set","fix":""},{"name":"MX","status":"ok","detail":"1 record(s)","fix":""},{"name":"DKIM","status":"ok","detail":"selector 'google' found","fix":""},{"name":"MTA-STS","status":"warn","detail":"missing","fix":"publish MTA-STS to enforce TLS for inbound mail"},{"name":"TLS-RPT","status":"warn","detail":"missing","fix":"publish TLS-RPT for mail TLS failure reports"},{"name":"CAA","status":"ok","detail":"7 record(s)","fix":""},{"name":"DNSSEC","status":"warn","detail":"unsigned","fix":"enable DNSSEC"}]}}};

function badge(status) {
  const mark = { ok: "ok", warn: "warn", bad: "FAIL", na: "n/a" };
  const cls = { ok: "mk-tag--success", warn: "mk-tag--warn", bad: "mk-tag--danger", na: "" };
  const s = document.createElement("span");
  s.className = "mk-tag " + (cls[status] || "");
  s.textContent = mark[status] || status;
  return s;
}
function render(domain) {
  const r = REPORTS[domain];
  const out = document.getElementById("seccard-out");
  out.innerHTML = "";
  const g = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = domain + " : grade " + r.grade + " (" + r.score + "/100)";
  g.appendChild(strong);
  out.appendChild(g);
  for (const [title, findings] of Object.entries(r.sections)) {
    const h = document.createElement("h3");
    h.style.marginTop = "var(--mk-space-4)";
    h.textContent = title;
    out.appendChild(h);
    for (const f of findings) {
      const row = document.createElement("div");
      row.style.padding = "6px 0";
      row.style.borderBottom = "1px solid var(--mk-border)";
      row.appendChild(badge(f.status));
      const nm = document.createElement("strong");
      nm.textContent = " " + f.name + ": ";
      row.appendChild(nm);
      row.appendChild(document.createTextNode(f.detail));
      if (f.fix && (f.status === "warn" || f.status === "bad")) {
        const fx = document.createElement("div");
        fx.className = "mk-faint";
        fx.textContent = "fix: " + f.fix;
        row.appendChild(fx);
      }
      out.appendChild(row);
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const btns = Array.from(document.querySelectorAll("[data-domain]"));
  const select = (b) => {
    render(b.dataset.domain);
    btns.forEach((x) => {
      x.classList.toggle("mk-btn--primary", x === b);
      x.classList.toggle("mk-btn--ghost", x !== b);
    });
  };
  btns.forEach((b) => b.addEventListener("click", () => select(b)));
  if (btns.length) select(btns[0]);
});
