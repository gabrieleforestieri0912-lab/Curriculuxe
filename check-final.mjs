import { spawn } from "node:child_process";

const CDP = "http://127.0.0.1:9226";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--remote-debugging-port=9226",
    "--window-size=1280,900",
    "about:blank",
  ], { stdio: "ignore" });

  await sleep(2500);

  const ws = await (async () => {
    for (let i = 0; i < 20; i++) {
      try {
        const r = await fetch(`${CDP}/json`);
        const targets = await r.json();
        const page = targets.find((t) => t.type === "page");
        if (page) return page.webSocketDebuggerUrl;
      } catch {}
      await sleep(500);
    }
    throw new Error("no CDP target");
  })();

  const wsConn = new WebSocket(ws);
  await new Promise((res, rej) => { wsConn.onopen = res; wsConn.onerror = rej; });

  let id = 0;
  const pending = new Map();
  wsConn.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      wsConn.send(JSON.stringify({ id: i, method, params }));
    });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");

  const results = {};

  // 1. Middleware: /dashboard senza cookie → redirect a /login
  const nav1 = await send("Page.navigate", { url: "http://localhost:3000/dashboard" });
  await sleep(4000);
  const res1 = await send("Runtime.evaluate", { returnByValue: true, expression: "window.location.pathname" });
  results.middlewareRedirect = res1.result.result.value;
  const cookies1 = await send("Network.getCookies", { urls: ["http://localhost:3000"] });
  results.cookiesBeforeLogin = cookies1.result.cookies.map((c) => c.name);

  // 2. Login con utente di test (deve impostare cookie httpOnly user)
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@curriculuxe.it", password: "password123" }),
    redirect: "manual",
  });
  results.loginStatus = loginRes.status;
  const setCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [];
  results.loginSetCookie = setCookies.map((c) => c.split(";")[0].split("=")[0]);

  // 3. Registrazione (deve impostare cookie httpOnly user)
  const regRes = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: `nuovo-${Date.now()}@curriculuxe.it`, password: "password123", name: "Nuovo Utente" }),
    redirect: "manual",
  });
  results.registerStatus = regRes.status;
  const regCookies = regRes.headers.getSetCookie ? regRes.headers.getSetCookie() : [];
  results.registerSetCookie = regCookies.map((c) => c.split(";")[0].split("=")[0]);

  // 4. API CV senza cookie → 401
  const cvRes = await fetch("http://localhost:3000/api/cv", { redirect: "manual" });
  results.cvNoAuthStatus = cvRes.status;

  // 5. Landing integra (video, sezioni, pricing in riga)
  await send("Page.navigate", { url: "http://localhost:3000/" });
  await sleep(5000);
  const res5 = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const cards = [...document.querySelectorAll('#pricing .glass-card')];
      const tops = cards.map((c) => Math.round(c.getBoundingClientRect().top));
      const sameRow = tops.length > 0 && tops.every((t) => Math.abs(t - tops[0]) < 5 || Math.abs(t - tops[0]) < 12);
      const video = document.querySelector('video');
      return {
        sections: ['#pricing','#how-it-works'].every((s) => document.querySelector(s) !== null),
        cards: cards.length,
        sameRow,
        video: video ? { readyState: video.readyState, paused: video.paused, error: video.error ? video.error.code : null } : null,
      };
    })()`,
  });
  results.landing = res5.result.result.value;

  console.log(JSON.stringify(results, null, 2));

  wsConn.close();
  chrome.kill();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
