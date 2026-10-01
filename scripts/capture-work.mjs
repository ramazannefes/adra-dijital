/**
 * Selected Work kare yakalayıcı (v2 — temiz viewport kareleri).
 * Kullanım: node scripts/capture-work.mjs
 * Çıktı: public/work/<id>-hero.jpg, <id>-secN.jpg, <id>-mobile.jpg
 * Not: Sistem Edge ile çalışır (Playwright CDN indirmesi gerekmez).
 * v2 farkı: element screenshot yerine viewport screenshot — sticky navbar
 * dikiş artefaktı olmaz; her kare tek karede alınır.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, rmSync } from "node:fs";

const OUT = "public/work";
const RAW = "public/work/raw";
mkdirSync(OUT, { recursive: true });

const SITES = [
  { id: "cag-doner", url: "https://6-parmak-cag-doner-szi3.vercel.app/" },
  { id: "giritli-balik", url: "https://giritli-balik.vercel.app/" },
  { id: "kirmizi-pide", url: "https://kirmizi-pide.vercel.app/" },
];

async function launch() {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel });
    } catch {
      /* sıradaki */
    }
  }
  return chromium.launch();
}

const browser = await launch();

async function capture(site) {
  const page = await browser.newPage();

  // Desktop hero
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(site.url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/${site.id}-hero.jpg`, quality: 82, type: "jpeg" });
  console.log(`✓ ${site.id}-hero`);

  // Bölüm adayları: viewport karesi olarak çek (element değil)
  const sections = page.locator("section");
  const count = await sections.count();
  let captured = 0;
  for (let i = 0; i < count && captured < 5; i++) {
    const box = await sections.nth(i).boundingBox();
    if (!box || box.height < 420 || box.height > 1600) continue;
    await sections.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // reveal animasyonları otursun
    await page.screenshot({
      path: `${OUT}/${site.id}-sec${captured + 1}.jpg`,
      quality: 80,
      type: "jpeg",
    });
    captured++;
  }
  console.log(`✓ ${site.id}: ${captured} bölüm karesi`);

  // Mobil hero
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(site.url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/${site.id}-mobile.jpg`, quality: 80, type: "jpeg" });
  console.log(`✓ ${site.id}-mobile`);

  await page.close();
}

for (const site of SITES) {
  try {
    await capture(site);
  } catch (err) {
    console.error(`✗ ${site.id}:`, err.message);
  }
}

await browser.close();
rmSync(RAW, { recursive: true, force: true }); // eski ham kareleri temizle
console.log("Bitti — public/work altında.");
