/* codecard demo - a real codecard report on the sample whole-setup project
   (Python app + Dockerfile + npm lockfile + Kubernetes manifest), rendered client-side.
   codecard is a CLI you run on your own code; this is a saved run, curated for length. */
const REPORT = {"target":"sample/  (Python app + Dockerfile + npm lockfile + k8s manifest)","grade":"F","points":502,"count":68,"sections":[{"title":"Dependencies (exploit-prioritized)","shown":[{"severity":"critical","title":"nodejs-lodash: prototype pollution in defaultsDeep function leading to modifying propertie","file":"npm:lodash@4.17.11","detail":"EPSS 15%","fix":"upgrade to 4.17.12","cwe":"CVE-2019-10744"},{"severity":"critical","title":"PyYAML: incomplete fix for CVE-2020-1747","file":"pip:pyyaml@5.1","detail":"EPSS 14%","fix":"upgrade to 5.4","cwe":"CVE-2020-14343"},{"severity":"critical","title":"PyYAML: arbitrary command execution through python/object/new when FullLoader is used","file":"pip:pyyaml@5.1","detail":"EPSS 2%","fix":"upgrade to 5.3.1","cwe":"CVE-2020-1747"},{"severity":"critical","title":"minimist: prototype pollution","file":"npm:minimist@1.2.0","detail":"EPSS 1%","fix":"upgrade to 1.2.6, 0.2.4","cwe":"CVE-2021-44906"},{"severity":"critical","title":"PyYAML: command execution through python/object/apply constructor in FullLoader","file":"pip:pyyaml@5.1","detail":"EPSS 0%","fix":"upgrade to 5.2","cwe":"CVE-2019-20477"},{"severity":"high","title":"nodejs-lodash: prototype pollution in zipObjectDeep function","file":"npm:lodash@4.17.11","detail":"EPSS 3%","fix":"upgrade to 4.17.19","cwe":"CVE-2020-8203"}],"total":29},{"title":"Source","shown":[{"severity":"high","title":"The last user in the container is 'root'. This is a security hazard because if an attacker","file":"Dockerfile","detail":"semgrep: last-user-is-root","fix":"https://github.com/hadolint/hadolint/wiki/DL3002","cwe":"CWE-269"},{"severity":"high","title":"Found 'subprocess' function 'call' with 'shell=True'. This is dangerous because this call ","file":"app.py","detail":"semgrep: subprocess-shell-true","fix":"https://stackoverflow.com/questions/3172470/actual-meaning-of-shell-true-in-subprocess","cwe":"CWE-78"},{"severity":"high","title":"Avoiding SQL string concatenation: untrusted input concatenated with raw SQL query can res","file":"app.py","detail":"semgrep: sqlalchemy-execute-raw-query","fix":"https://docs.sqlalchemy.org/en/14/core/tutorial.html#using-textual-sql","cwe":"CWE-89"},{"severity":"high","title":"Certificate verification has been explicitly disabled. This permits insecure connections t","file":"app.py","detail":"semgrep: disabled-cert-validation","fix":"https://stackoverflow.com/questions/41740361/is-it-safe-to-disable-ssl-certificate-verification-in-pythonss-requests-lib","cwe":"CWE-295"},{"severity":"medium","title":"Detected possible formatted SQL query. Use parameterized queries instead.","file":"app.py","detail":"semgrep: formatted-sql-query","fix":"https://stackoverflow.com/questions/775296/mysql-parameterized-queries","cwe":"CWE-89"},{"severity":"medium","title":"Avoid using `pickle`, which is known to lead to code execution vulnerabilities. When unpic","file":"app.py","detail":"semgrep: avoid-pickle","fix":"https://docs.python.org/3/library/pickle.html","cwe":"CWE-502"},{"severity":"medium","title":"Detected the use of eval(). eval() can be dangerous if used to evaluate dynamic content. I","file":"app.py","detail":"semgrep: eval-detected","fix":"https://owasp.org/Top10/A03_2021-Injection","cwe":"CWE-95"},{"severity":"medium","title":"Container or pod is running in privileged mode. This grants the container the equivalent o","file":"k8s/deployment.yaml","detail":"semgrep: privileged-container","fix":"https://kubernetes.io/docs/concepts/policy/pod-security-policy/#privileged","cwe":"CWE-250"}],"total":10},{"title":"Config / IaC","shown":[{"severity":"high","title":"Image user should not be 'root'","file":"Dockerfile","detail":"trivy: Last USER command in Dockerfile should not be 'root'","fix":"Add 'USER <non root user name>' line to the Dockerfile","cwe":"DS002"},{"severity":"high","title":"'apt-get' missing '--no-install-recommends'","file":"Dockerfile","detail":"trivy: '--no-install-recommends' flag is missed: 'apt-get update && apt-get install -y curl'","fix":"Add '--no-install-recommends' flag to 'apt-get'","cwe":"DS029"},{"severity":"high","title":"Privileged","file":"k8s/deployment.yaml","detail":"trivy: Container 'web' of Deployment 'web' should set 'securityContext.privileged' to false","fix":"Change 'containers[].securityContext.privileged' to 'false'.","cwe":"KSV017"},{"severity":"high","title":"Prevent binding to privileged ports","file":"k8s/deployment.yaml","detail":"trivy: deployment web in default namespace should not set spec.template.spec.containers.ports.containerPort to less than 1024","fix":"Do not map the container ports to privileged host ports when starting a container.","cwe":"KSV117"},{"severity":"medium","title":"':latest' tag used","file":"Dockerfile","detail":"trivy: Specify a tag in the 'FROM' statement for image 'ubuntu'","fix":"Add a tag to the image in the 'FROM' statement","cwe":"DS001"},{"severity":"medium","title":"Can elevate its own privileges","file":"k8s/deployment.yaml","detail":"trivy: Container 'web' of Deployment 'web' should set 'securityContext.allowPrivilegeEscalation' to false","fix":"Set 'set containers[].securityContext.allowPrivilegeEscalation' to 'false'.","cwe":"KSV001"}],"total":27},{"title":"Secrets","shown":[{"severity":"critical","title":"Stripe Secret Key","file":"app.py","detail":"(redacted match) trivy: stripe-secret-token","fix":"remove the secret, rotate it, and load from env/secret manager","cwe":"CWE-798"},{"severity":"high","title":"AWS access key id","file":"app.py","detail":"(redacted match)","fix":"remove the secret, rotate it, and load from env/secret manager","cwe":"CWE-798"}],"total":2}]};

const SEVCLS = { critical: "mk-tag--danger", high: "mk-tag--danger", medium: "mk-tag--warn", low: "" };

function sevBadge(sev) {
  const s = document.createElement("span");
  s.className = "mk-tag " + (SEVCLS[sev] || "");
  s.textContent = sev;
  return s;
}

function render() {
  const out = document.getElementById("codecard-out");
  if (!out) return;
  out.innerHTML = "";

  const g = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = "grade " + REPORT.grade + "  (" + REPORT.count + " findings, " + REPORT.points + " risk points)";
  g.appendChild(strong);
  const t = document.createElement("div");
  t.className = "mk-faint";
  t.textContent = REPORT.target;
  g.appendChild(t);
  out.appendChild(g);

  for (const sec of REPORT.sections) {
    const h = document.createElement("h3");
    h.style.marginTop = "var(--mk-space-4)";
    h.textContent = sec.title;
    out.appendChild(h);
    for (const f of sec.shown) {
      const row = document.createElement("div");
      row.style.padding = "6px 0";
      row.style.borderBottom = "1px solid var(--mk-border)";
      row.appendChild(sevBadge(f.severity));
      const nm = document.createElement("strong");
      nm.textContent = " " + f.title + " ";
      row.appendChild(nm);
      if (f.file) {
        const loc = document.createElement("span");
        loc.className = "mk-faint";
        loc.textContent = f.file;
        row.appendChild(loc);
      }
      if (f.detail) {
        const dt = document.createElement("div");
        dt.textContent = f.detail;
        row.appendChild(dt);
      }
      if (f.fix) {
        const fx = document.createElement("div");
        fx.className = "mk-faint";
        fx.textContent = "fix: " + f.fix;
        row.appendChild(fx);
      }
      out.appendChild(row);
    }
    if (sec.total > sec.shown.length) {
      const more = document.createElement("div");
      more.className = "mk-faint";
      more.style.padding = "6px 0";
      more.textContent = "... and " + (sec.total - sec.shown.length) + " more in this section";
      out.appendChild(more);
    }
  }
}
document.addEventListener("DOMContentLoaded", render);
