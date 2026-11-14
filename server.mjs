import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");
const LEDGER_FILE = path.join(DATA_DIR, "real-ledger.json");

// التأكد من وجود ملف السجل المالي الحقيقي فارغاً ($0.00) عند الإقلاع الأول
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LEDGER_FILE)) {
  fs.writeFileSync(LEDGER_FILE, "[]", "utf8");
}

function readRealLedger() {
  try {
    return JSON.parse(fs.readFileSync(LEDGER_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeRealLedger(list) {
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(list, null, 2), "utf8");
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  // نسخة Base64 من الملفات الثنائية (تُستخدم لنقل الشعار والختم إلى محرر GitHub)
  if (url.pathname.startsWith("/b64/")) {
    const file = path.join(__dirname, decodeURIComponent(url.pathname.slice(5)));
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { ...cors, "Content-Type": "text/plain; charset=utf-8" });
      res.end(fs.readFileSync(file).toString("base64"));
      return;
    }
  }

  // ملفات الشعار والختم (تُستخدم في رسائل البريد)
  if (url.pathname === "/veloza-logo.png" || url.pathname === "/veloza-stamp.png") {
    const file = path.join(__dirname, url.pathname.slice(1));
    if (fs.existsSync(file)) {
      res.writeHead(200, { ...cors, "Content-Type": "image/png" });
      res.end(fs.readFileSync(file));
      return;
    }
  }

  // 1. API قراءة السجل المالي الحقيقي لمالك المنصة (يبدأ من $0.00 بدون أي وهمي)
  if (url.pathname === "/api/ledger" && req.method === "GET") {
    const list = readRealLedger();
    const totalRevenue = list.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: true,
        merchantEmail: "pipohost@gmail.com",
        totalVerifiedRevenueUsd: totalRevenue,
        transactionsCount: list.length,
        transactions: list,
      })
    );
    return;
  }

  // 2. API تصفير السجل المالي (في حال أراد المالك مسح أي تجربة قبل الرفع على الاستضافة)
  if (url.pathname === "/api/ledger/reset" && req.method === "POST") {
    writeRealLedger([]);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: true, totalVerifiedRevenueUsd: 0, transactionsCount: 0 }));
    return;
  }

  // 3. API تسجيل طلب حقيقي وحفظ الحزمة المولدة في قاعدة البيانات
  if (url.pathname === "/api/orders" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const list = readRealLedger();
        list.unshift(payload);
        writeRealLedger(list);
        const totalRevenue = list.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(
          JSON.stringify({
            success: true,
            totalVerifiedRevenueUsd: totalRevenue,
            transactionsCount: list.length,
            transactions: list,
          })
        );
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: String(e) }));
      }
    });
    return;
  }

  // خدمة الملفات الثابتة (SEO pages, SEO Hub index.html, sitemap.xml, robots.txt, favicon, etc.)
  let staticPath = path.join(__dirname, decodeURIComponent(url.pathname));
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isDirectory()) {
    staticPath = path.join(staticPath, "index.html");
  }
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    const ext = path.extname(staticPath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.xml': 'application/xml; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.ico': 'image/x-icon',
      '.svg': 'image/svg+xml'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { ...cors, 'Content-Type': contentType });
    res.end(fs.readFileSync(staticPath));
    return;
  }

  // الصفحة الرئيسية الكاملة للمنصة (fallback)
  const htmlPath = path.join(__dirname, "preview.html");
  const content = fs.readFileSync(htmlPath, "utf8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(content);
});

server.listen(PORT, () => {
  console.log(`Veloza Real Production Server running at http://localhost:${PORT}`);
});
