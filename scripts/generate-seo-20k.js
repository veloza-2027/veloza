const fs = require('fs');
const path = require('path');

// ============================================================================
// VELOZA SEO PAGE GENERATOR v3 — 20,000 Bilingual (AR/EN) Semantic SEO Pages
// - Full AR + EN content, instant RTL/LTR toggle + ?lang=en URL detection
// - Rich semantic LSI keywords, Article + BreadcrumbList + FAQPage JSON-LD
// - Deterministic Unit Economics KPIs per industry/company/city
// - Connected to Veloza's 4 Core Deliverables & 3 Pricing Tiers ($9/$19/$39)
// - Valid internal links, SEO Hub (seo/index.html), & Sitemap Index
// ============================================================================

const SITE = 'https://www.veloza-ai.online';
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'seo');
const START_OFFSET = parseInt(process.argv[3] || '52000', 10);
const COUNT = parseInt(process.argv[2] || '20000', 10);

const industries = [
  { ar: 'العطور والهدايا الفاخرة', en: 'Luxury Perfumes & Gifts', slug: 'perfumes-gifts', aov: 85, margin: 0.62, channelAr: 'إنستغرام وتيك توك وسناب شات', channelEn: 'Instagram, TikTok & Snapchat' },
  { ar: 'التجارة الإلكترونية', en: 'E-Commerce', slug: 'ecommerce', aov: 65, margin: 0.45, channelAr: 'ميتا وجوجل للتسوق وتيك توك', channelEn: 'Meta, Google Shopping & TikTok' },
  { ar: 'الصحة واللياقة', en: 'Health & Fitness', slug: 'health-fitness', aov: 55, margin: 0.58, channelAr: 'تيك توك وإنستغرام ويوتيوب', channelEn: 'TikTok, Instagram & YouTube' },
  { ar: 'التعليم والتدريب', en: 'Education & Training', slug: 'education-training', aov: 120, margin: 0.78, channelAr: 'جوجل سيرش ولينكدإن ويوتيوب', channelEn: 'Google Search, LinkedIn & YouTube' },
  { ar: 'العقارات', en: 'Real Estate', slug: 'real-estate', aov: 450, margin: 0.72, channelAr: 'جوجل سيرش وإنستغرام وسناب شات', channelEn: 'Google Search, Instagram & Snapchat' },
  { ar: 'المطاعم والمقاهي', en: 'Restaurants & Cafes', slug: 'restaurants-cafes', aov: 32, margin: 0.48, channelAr: 'سناب شات وتيك توك وخرائط جوجل', channelEn: 'Snapchat, TikTok & Google Maps' },
  { ar: 'الخدمات اللوجستية والتوصيل', en: 'Logistics & Delivery', slug: 'logistics-delivery', aov: 180, margin: 0.42, channelAr: 'لينكدإن وجوجل سيرش و X', channelEn: 'LinkedIn, Google Search & X' },
  { ar: 'السياحة والسفر', en: 'Travel & Tourism', slug: 'travel-tourism', aov: 260, margin: 0.52, channelAr: 'إنستغرام وتيك توك وجوجل', channelEn: 'Instagram, TikTok & Google' },
  { ar: 'الخدمات المالية', en: 'Financial Services', slug: 'financial-services', aov: 220, margin: 0.75, channelAr: 'لينكدإن وجوجل سيرش و X', channelEn: 'LinkedIn, Google Search & X' },
  { ar: 'الإنتاج والتصنيع', en: 'Manufacturing', slug: 'manufacturing', aov: 520, margin: 0.38, channelAr: 'لينكدإن وجوجل B2B', channelEn: 'LinkedIn & Google B2B' },
  { ar: 'الزراعة والأغذية', en: 'Agriculture & Food', slug: 'agriculture-food', aov: 75, margin: 0.44, channelAr: 'إنستغرام وسناب شات وجوجل', channelEn: 'Instagram, Snapchat & Google' },
  { ar: 'التقنية العقارية', en: 'PropTech', slug: 'proptech', aov: 190, margin: 0.76, channelAr: 'لينكدإن وجوجل سيرش', channelEn: 'LinkedIn & Google Search' },
  { ar: 'التقنية الصحية', en: 'HealthTech', slug: 'healthtech', aov: 140, margin: 0.74, channelAr: 'جوجل سيرش وإنستغرام ولينكدإن', channelEn: 'Google Search, Instagram & LinkedIn' },
  { ar: 'التقنية الخدمية', en: 'ServiceTech', slug: 'servicetech', aov: 110, margin: 0.70, channelAr: 'جوجل سيرش وميتا ولينكدإن', channelEn: 'Google Search, Meta & LinkedIn' },
  { ar: 'تقنية التجزئة', en: 'RetailTech', slug: 'retailtech', aov: 160, margin: 0.68, channelAr: 'لينكدإن و X وجوجل', channelEn: 'LinkedIn, X & Google' },
  { ar: 'تجارة التجزئة', en: 'Retail', slug: 'retail', aov: 60, margin: 0.46, channelAr: 'سناب شات وتيك توك وإنستغرام', channelEn: 'Snapchat, TikTok & Instagram' },
  { ar: 'الخدمات المهنية والاستشارية', en: 'Professional Services', slug: 'professional-services', aov: 290, margin: 0.80, channelAr: 'لينكدإن وجوجل سيرش', channelEn: 'LinkedIn & Google Search' },
  { ar: 'التقنية التعليمية', en: 'EdTech', slug: 'edtech', aov: 95, margin: 0.79, channelAr: 'تيك توك وجوجل ويوتيوب', channelEn: 'TikTok, Google & YouTube' },
  { ar: 'التسويق العقاري الرقمي', en: 'Digital Real Estate', slug: 'digital-real-estate', aov: 310, margin: 0.71, channelAr: 'إنستغرام وجوجل وسناب شات', channelEn: 'Instagram, Google & Snapchat' },
  { ar: 'الرعاية الصحية الرقمية', en: 'Digital Health', slug: 'digital-health', aov: 125, margin: 0.73, channelAr: 'جوجل سيرش وإنستغرام', channelEn: 'Google Search & Instagram' },
  { ar: 'الأزياء والملابس', en: 'Fashion & Apparel', slug: 'fashion-apparel', aov: 78, margin: 0.56, channelAr: 'تيك توك وإنستغرام وسناب شات', channelEn: 'TikTok, Instagram & Snapchat' },
  { ar: 'التجميل والعناية بالبشرة', en: 'Beauty & Skincare', slug: 'beauty-skincare', aov: 68, margin: 0.64, channelAr: 'تيك توك وإنستغرام وسناب شات', channelEn: 'TikTok, Instagram & Snapchat' },
  { ar: 'برمجيات الأعمال السحابية', en: 'B2B SaaS Software', slug: 'b2b-saas', aov: 150, margin: 0.84, channelAr: 'لينكدإن وجوجل سيرش و X', channelEn: 'LinkedIn, Google Search & X' },
  { ar: 'السيارات والتنقل', en: 'Automotive & Mobility', slug: 'automotive-mobility', aov: 240, margin: 0.49, channelAr: 'جوجل سيرش وسناب شات وتيك توك', channelEn: 'Google Search, Snapchat & TikTok' },
  { ar: 'الأثاث والديكور المنزلي', en: 'Home Decor & Furniture', slug: 'home-decor', aov: 210, margin: 0.53, channelAr: 'إنستغرام وبنترست وجوجل', channelEn: 'Instagram, Pinterest & Google' }
];

const topics = [
  { ar: 'دراسة جدوى مالية', en: 'Financial Feasibility Study', slug: 'feasibility-study', kwAr: 'دراسة جدوى, نموذج مالي, توقعات 12 شهر', kwEn: 'feasibility study, financial model, 12-month projection' },
  { ar: 'أتمتة n8n و Make', en: 'n8n & Make Automation', slug: 'n8n-automation', kwAr: 'أتمتة n8n, Make.com, سير عمل ذكي, JSON', kwEn: 'n8n automation, Make.com workflow, JSON automation' },
  { ar: 'حملات إعلانية متعددة المنصات', en: 'Multi-Platform Ad Campaigns', slug: 'ad-campaigns', kwAr: 'حملات إعلانية, إعلانات تيك توك, إعلانات جوجل, سناب شات', kwEn: 'ad campaigns, TikTok ads, Google Ads, Snapchat ads' },
  { ar: 'صفحة هبوط بيعية', en: 'High-Converting Landing Page', slug: 'landing-page', kwAr: 'صفحة هبوط, HTML5 Tailwind, تصميم متجاوب, رفع التحويل', kwEn: 'landing page, HTML5 Tailwind code, conversion design' },
  { ar: 'اقتصاديات الوحدة', en: 'Unit Economics', slug: 'unit-economics', kwAr: 'اقتصاديات الوحدة, هامش الربح, استدامة النمو', kwEn: 'unit economics, profit margin, scalable growth' },
  { ar: 'تحليل CAC و LTV', en: 'CAC & LTV Optimization', slug: 'cac-ltv', kwAr: 'تكلفة الاستحواذ CAC, القيمة الدائمة LTV, عائد العميل', kwEn: 'CAC, LTV, customer acquisition cost, lifetime value' },
  { ar: 'تحليل نقطة التعادل', en: 'Break-Even Analysis', slug: 'break-even', kwAr: 'نقطة التعادل, استرداد رأس المال, التكاليف الثابتة', kwEn: 'break-even analysis, ROI payback, fixed costs' },
  { ar: 'خطة تسويق 90 يوماً', en: '90-Day Marketing Plan', slug: '90-day-marketing', kwAr: 'خطة تسويق 90 يوم, خارطة طريق, نمو المبيعات', kwEn: '90-day marketing plan, growth roadmap, sales plan' },
  { ar: 'تحليل SWOT الاستراتيجي', en: 'Strategic SWOT Analysis', slug: 'swot-analysis', kwAr: 'تحليل SWOT, نقاط القوة والضعف, الفرص والتهديدات', kwEn: 'SWOT analysis, market opportunities, competitive edge' },
  { ar: 'تدفقات نقدية 12 شهراً', en: '12-Month Cashflow Forecast', slug: '12-month-cashflow', kwAr: 'تدفقات نقدية, ميزانية تشغيلية, 3 سيناريوهات', kwEn: '12-month cashflow, operating budget, 3 scenarios' },
  { ar: 'تحسين ROAS والعائد الإعلاني', en: 'ROAS & Ad Return Scaling', slug: 'roas-ads', kwAr: 'ROAS, العائد على الإنفاق الإعلاني, تحسين الإعلانات', kwEn: 'ROAS, return on ad spend, ad scaling' },
  { ar: 'رفع تحويل صفحات الهبوط', en: 'Landing Page Conversion Rate', slug: 'landing-conversion', kwAr: 'معدل التحويل CRO, تجربة المستخدم, قمع المبيعات', kwEn: 'CRO, landing page conversion, sales funnel UX' },
  { ar: 'أتمتة البريد الإلكتروني', en: 'Email Sequence Automation', slug: 'email-automation', kwAr: 'أتمتة البريد, تسويق بالبريد, رسائل بيعية', kwEn: 'email automation, conversion sequence, drip campaign' },
  { ar: 'أتمتة إدارة العملاء CRM', en: 'CRM & Lead Automation', slug: 'crm-automation', kwAr: 'أتمتة CRM, Google Sheets, تنبيهات واتساب', kwEn: 'CRM automation, Google Sheets CRM, WhatsApp alerts' },
  { ar: 'توليد العملاء المحتملين', en: 'B2B & B2C Lead Generation', slug: 'lead-generation', kwAr: 'توليد العملاء, استقطاب العملاء, مبيعات مستمرة', kwEn: 'lead generation, customer acquisition, qualified leads' },
  { ar: 'بناء قمع المبيعات', en: 'Sales Funnel Architecture', slug: 'sales-funnel', kwAr: 'قمع المبيعات, مسار الشراء, زيادة متوسط الطلب', kwEn: 'sales funnel, buyer journey, AOV optimization' },
  { ar: 'نمو المشاريع السريع', en: 'Rapid Growth Hacking', slug: 'growth-hacking', kwAr: 'نمو سريع, استراتيجيات التوسع, اختراق السوق', kwEn: 'growth hacking, rapid scaling, market penetration' },
  { ar: 'التسويق الرقمي المتكامل', en: 'Integrated Digital Marketing', slug: 'digital-marketing', kwAr: 'التسويق الرقمي, محتوى إعلاني, انتشار واسع', kwEn: 'digital marketing, content strategy, omni-channel' },
  { ar: 'استراتيجية التجارة الرقمية', en: 'Digital Commerce Strategy', slug: 'ecommerce-strategy', kwAr: 'تجارة رقمية, متجر إلكتروني, بوابات الدفع', kwEn: 'digital commerce, online store strategy, PayPal checkout' },
  { ar: 'إطلاق مشروع ناشئ', en: 'Startup Launch Blueprint', slug: 'startup-launch', kwAr: 'إطلاق مشروع, خطة تأسيس, دراسة شاملة', kwEn: 'startup launch, business blueprint, MVP launch' }
];

const companyTypes = [
  { ar: 'متجر إلكتروني', en: 'Online Store', slug: 'online-store', mult: 1.0 },
  { ar: 'وكالة تسويق', en: 'Marketing Agency', slug: 'marketing-agency', mult: 1.45 },
  { ar: 'شركة ناشئة', en: 'Startup', slug: 'startup', mult: 1.2 },
  { ar: 'مستقل محترف', en: 'Freelancer', slug: 'freelancer', mult: 0.85 },
  { ar: 'وكالة تطوير برمجيات', en: 'Development Agency', slug: 'dev-agency', mult: 1.55 },
  { ar: 'شركة SaaS', en: 'SaaS Company', slug: 'saas-company', mult: 1.35 },
  { ar: 'مشروع محلي', en: 'Local Business', slug: 'local-business', mult: 0.9 },
  { ar: 'علامة تجارية للبيع المباشر', en: 'D2C Brand', slug: 'd2c-brand', mult: 1.15 },
  { ar: 'مصنع صغير', en: 'Small Factory', slug: 'small-factory', mult: 1.6 },
  { ar: 'مكتب استشارات', en: 'Consulting Firm', slug: 'consulting-firm', mult: 1.3 }
];

const cityRegions = [
  { ar: 'الرياض', en: 'Riyadh', slug: 'riyadh', countryAr: 'السعودية', countryEn: 'Saudi Arabia' },
  { ar: 'جدة', en: 'Jeddah', slug: 'jeddah', countryAr: 'السعودية', countryEn: 'Saudi Arabia' },
  { ar: 'الدمام', en: 'Dammam', slug: 'dammam', countryAr: 'السعودية', countryEn: 'Saudi Arabia' },
  { ar: 'دبي', en: 'Dubai', slug: 'dubai', countryAr: 'الإمارات', countryEn: 'UAE' },
  { ar: 'أبوظبي', en: 'Abu Dhabi', slug: 'abu-dhabi', countryAr: 'الإمارات', countryEn: 'UAE' },
  { ar: 'الكويت', en: 'Kuwait City', slug: 'kuwait', countryAr: 'الكويت', countryEn: 'Kuwait' },
  { ar: 'الدوحة', en: 'Doha', slug: 'doha', countryAr: 'قطر', countryEn: 'Qatar' },
  { ar: 'المنامة', en: 'Manama', slug: 'manama', countryAr: 'البحرين', countryEn: 'Bahrain' },
  { ar: 'مسقط', en: 'Muscat', slug: 'muscat', countryAr: 'عمان', countryEn: 'Oman' },
  { ar: 'القاهرة', en: 'Cairo', slug: 'cairo', countryAr: 'مصر', countryEn: 'Egypt' }
];

const successStories = [
  { ar: 'زيادة المبيعات 300%', en: '300% Sales Growth', slug: '300-sales-increase' },
  { ar: 'خفض تكلفة الاستحواذ 40%', en: '40% Lower CAC', slug: 'cac-reduction-40' },
  { ar: 'تحقيق عائد إعلاني 5.2x', en: '5.2x ROAS Achievement', slug: 'roas-5-2x' },
  { ar: 'جذب 1000+ عميل في 60 يوماً', en: '1,000+ Customers in 60 Days', slug: '1000-customers-60-days' },
  { ar: 'إيراد شهري يتجاوز $50K', en: '$50K+ Monthly Revenue', slug: '50k-monthly-revenue' },
  { ar: 'الوصول لنقطة التعادل في 14 يوماً', en: 'Break-Even in 14 Days', slug: 'break-even-14-days' },
  { ar: 'نسبة LTV:CAC تبلغ 4.8x', en: '4.8x LTV:CAC Ratio', slug: 'ltv-cac-4-8x' },
  { ar: 'معدل تحويل يتجاوز 8%', en: '8%+ Conversion Rate', slug: '8-percent-conversion' }
];

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Compute unique combination for any globalIdx using mixed-radix + prime permutation for successStories
function getCombo(globalIdx) {
  const i1 = globalIdx % industries.length;
  const r1 = Math.floor(globalIdx / industries.length);
  const i2 = r1 % topics.length;
  const r2 = Math.floor(r1 / topics.length);
  const i3 = r2 % companyTypes.length;
  const r3 = Math.floor(r2 / companyTypes.length);
  const i4 = r3 % cityRegions.length;
  const r4 = Math.floor(r3 / cityRegions.length);
  const i5 = (r4 + i1 * 3 + i2 * 5 + i3 * 7) % successStories.length;
  return {
    ind: industries[i1],
    top: topics[i2],
    comp: companyTypes[i3],
    city: cityRegions[i4],
    succ: successStories[i5]
  };
}

function buildSlug(c, globalIdx) {
  return `${c.ind.slug}-${c.top.slug}-${c.comp.slug}-${c.city.slug}-${c.succ.slug}-${globalIdx}`;
}

function computeKpis(c, seed) {
  const aov = Math.round(c.ind.aov * c.comp.mult * (0.9 + (seed % 21) / 100));
  const cac = Math.max(6, Math.round(aov * (0.18 + (seed % 11) / 100)));
  const repeat = (2.1 + (seed % 15) / 10).toFixed(1);
  const ltv = Math.round(aov * parseFloat(repeat) * c.ind.margin);
  const ltvCac = (ltv / cac).toFixed(1);
  const breakEvenDays = 10 + (seed % 24);
  const roas = (3.4 + (seed % 25) / 10).toFixed(1);
  const annualRevenue = Math.round(aov * (18 + (seed % 30)) * 12);
  return { aov, cac, ltv, ltvCac, breakEvenDays, roas, annualRevenue };
}

function buildPageData(globalIdx) {
  const c = getCombo(globalIdx);
  const slug = buildSlug(c, globalIdx);
  const seed = hash(slug);
  const kpi = computeKpis(c, seed);
  const url = `${SITE}/seo/${slug}.html`;

  const titleAr = `${c.top.ar} لقطاع ${c.ind.ar} — دليل ${c.comp.ar} في ${c.city.ar} | Veloza`;
  const titleEn = `${c.top.en} for ${c.ind.en} — ${c.comp.en} Guide in ${c.city.en} | Veloza`;

  const h1Ar = `${c.top.ar} في قطاع ${c.ind.ar}: خطة تنفيذية متكاملة لـ ${c.comp.ar} في ${c.city.ar}`;
  const h1En = `${c.top.en} for ${c.ind.en}: Complete Execution Blueprint for ${c.comp.en} in ${c.city.en}`;

  const descAr = `احصل على ${c.top.ar} احترافية لمشروع ${c.comp.ar} في ${c.ind.ar} بمدينة ${c.city.ar} عبر منصة Veloza. تشمل دراسة جدوى PDF، حملات إعلانية، أتمتة n8n، وصفحة هبوط بدءاً من $9 لتحقيق ${c.succ.ar}.`;
  const descEn = `Build a complete ${c.top.en} for your ${c.comp.en} in ${c.ind.en} (${c.city.en}) with Veloza Enterprise OS. Includes 12-month feasibility PDF, multi-platform ads, n8n workflow, and landing page code from $9 for ${c.succ.en}.`;

  const keywordsAr = `${c.top.ar}, ${c.ind.ar}, ${c.comp.ar}, ${c.city.ar}, ${c.city.countryAr}, ${c.top.kwAr}, ${c.succ.ar}, Veloza, منصة فيلوزا, دراسة جدوى اقتصادية, اقتصاديات الوحدة, أتمتة الأعمال, التسويق الرقمي, PayPal`;
  const keywordsEn = `${c.top.en}, ${c.ind.en}, ${c.comp.en}, ${c.city.en}, ${c.city.countryEn}, ${c.top.kwEn}, ${c.succ.en}, Veloza Enterprise OS, business automation, unit economics, PayPal checkout`;

  const faqs = [
    {
      qAr: `كيف تساعد منصة Veloza مشروع ${c.comp.ar} في قطاع ${c.ind.ar} بمدينة ${c.city.ar}؟`,
      aAr: `تولّد منصة Veloza في ثوانٍ 4 منظومات متكاملة مخصصة لـ ${c.comp.ar} في ${c.city.ar}: دراسة جدوى مالية لـ 12 شهراً، حملات إعلانية جاهزة لـ ${c.ind.channelAr}، ملف أتمتة n8n و Make.com، وكود صفحة هبوط بيعية متجاوبة بأسعار تبدأ من $9 فقط.`,
      qEn: `How does Veloza help a ${c.comp.en} in ${c.ind.en} (${c.city.en})?`,
      aEn: `Veloza generates 4 tailored execution systems in seconds for your ${c.comp.en} in ${c.city.en}: a 12-month financial feasibility PDF, ad campaigns for ${c.ind.channelEn}, an importable n8n/Make automation JSON, and responsive HTML5 landing page code starting at $9.`
    },
    {
      qAr: `ما هي مؤشرات اقتصاديات الوحدة المتوقعة لـ ${c.top.ar} في ${c.ind.ar}؟`,
      aAr: `وفقاً لنموذج Veloza التقديري لهذا القطاع، يبلغ متوسط قيمة الطلب $${kpi.aov}، وتكلفة الاستحواذ المستهدفة $${kpi.cac}، والقيمة الدائمة للعميل $${kpi.ltv} بنسبة LTV:CAC تبلغ ${kpi.ltvCac}x مع نقطة تعادل متوقعة خلال ${kpi.breakEvenDays} يوماً.`,
      qEn: `What are the benchmark Unit Economics for ${c.top.en} in ${c.ind.en}?`,
      aEn: `Based on Veloza's sector model, typical benchmarks show an AOV of $${kpi.aov}, target CAC of $${kpi.cac}, customer LTV of $${kpi.ltv} (${kpi.ltvCac}x LTV:CAC ratio), and an estimated break-even window of ${kpi.breakEvenDays} days.`
    },
    {
      qAr: `ما هي الباقة الأنسب من Veloza لتنفيذ ${c.top.ar} بسرعة وأمان؟`,
      aAr: `توفر Veloza باقة البداية ($9) للدراسة والإعلانات، وباقة النمو الشاملة ($19 الأكثر مبيعاً) لجميع المنظومات الأربع مع ملف أتمتة n8n وكود الموقع، وباقة الوكالات ($39) مع رخصة إعادة البيع التجاري White-Label وضمان PayPal لمدة 14 يوماً.`,
      qEn: `Which Veloza plan is best for launching ${c.top.en}?`,
      aEn: `Veloza offers Starter Launch ($9) for feasibility & ads, Growth Pro ($19 — Best Seller) for all 4 deliverables including n8n JSON and landing page code, and Agency VIP ($39) with a White-Label commercial license and 14-day PayPal buyer protection.`
    }
  ];

  // Valid internal links within the 20k batch [START_OFFSET, START_OFFSET + COUNT - 1]
  const relatedOffsets = [1, 7, 29, 97];
  const internalLinks = relatedOffsets.map((step) => {
    const targetIdx = START_OFFSET + ((globalIdx - START_OFFSET + step) % COUNT);
    const tc = getCombo(targetIdx);
    const tSlug = buildSlug(tc, targetIdx);
    return {
      href: `/seo/${tSlug}.html`,
      labelAr: `${tc.top.ar} — ${tc.ind.ar} (${tc.city.ar})`,
      labelEn: `${tc.top.en} — ${tc.ind.en} (${tc.city.en})`
    };
  });

  const arBodyHtml = `
    <p class="text-base text-slate-300 leading-relaxed">
      في سوق <strong class="text-white">${esc(c.city.ar)}</strong> المتسارع، يواجه أي <strong class="text-cyan-300">${esc(c.comp.ar)}</strong> يعمل في قطاع <strong class="text-white">${esc(c.ind.ar)}</strong> تحدياً حاسماً: كيف يطلق <strong class="text-white">${esc(c.top.ar)}</strong> مبنية على أرقام دقيقة دون إنفاق آلاف الدولارات على الوكالات التقليدية؟ تمنحك منصة <strong class="text-cyan-300">Veloza Enterprise OS</strong> حزمة تنفيذية متكاملة مخصصة لمشروعك في ثوانٍ بأسعار تبدأ من <strong class="text-emerald-400">$9 فقط</strong> مع حماية PayPal وتسليم فوري.
    </p>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">متوسط الطلب (AOV)</div>
        <div class="text-xl font-black text-cyan-300 mt-1">$${kpi.aov}</div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">تكلفة الاستحواذ (CAC)</div>
        <div class="text-xl font-black text-amber-300 mt-1">$${kpi.cac}</div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">نسبة LTV:CAC</div>
        <div class="text-xl font-black text-emerald-400 mt-1">${kpi.ltvCac}x</div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">نقطة التعادل</div>
        <div class="text-xl font-black text-violet-300 mt-1">${kpi.breakEvenDays} يوماً</div>
      </div>
    </div>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      لماذا تُعد ${esc(c.top.ar)} ركيزة أساسية لقطاع ${esc(c.ind.ar)} في ${esc(c.city.ar)}؟
    </h2>
    <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
      تحقيق <strong class="text-emerald-300">${esc(c.succ.ar)}</strong> لا يحدث بالصدفة، بل يعتمد على ربط <strong class="text-white">${esc(c.top.ar)}</strong> بمؤشرات أداء حقيقية. تحسب لك Veloza القيمة الدائمة للعميل (<strong class="text-white">$${kpi.ltv}</strong>)، والعائد الإعلاني المستهدف (<strong class="text-white">${kpi.roas}x ROAS</strong>)، وتوقعات الإيراد السنوي المقدرة بنحو <strong class="text-cyan-300">$${kpi.annualRevenue.toLocaleString()}</strong> مع تحليل حساسية لثلاثة سيناريوهات (متحفظ، أساسي، وتوسع).
    </p>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      المنظومات التنفيذية الأربع من Veloza (تسليم فوري)
    </h2>
    <ul class="space-y-3 text-sm text-slate-300 leading-relaxed">
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">1. دراسة الجدوى والنموذج المالي (PDF):</strong> حساب CAC و LTV ونقطة التعادل، جدول تدفقات نقدية لـ 12 شهراً، تحليل SWOT، وخارطة طريق 30/60/90 يوماً مختومة رسمياً من Veloza.</li>
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">2. حزمة الحملات الإعلانية وسلاسل البريد:</strong> نصوص إعلانية جاهزة لـ <span class="text-cyan-300 font-bold">${esc(c.ind.channelAr)}</span> بالإضافة إلى 3 رسائل بريدية تحويلية لرفع المبيعات.</li>
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">3. ملف أتمتة n8n و Make.com (JSON):</strong> مسار ذكي من 7 عُقد يربط نموذج العملاء بـ OpenAI GPT-4o، وتصنيف VIP، وإرسال البريد، وتسجيل Google Sheets CRM، وتنبيهات واتساب وتيليجرام.</li>
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">4. كود صفحة هبوط بيعية (HTML5 + Tailwind CSS):</strong> تصميم متجاوب بالكامل مخصص لـ ${esc(c.comp.ar)} مع باقات الأسعار، الأسئلة الشائعة، ونموذج الطلب الفوري.</li>
    </ul>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      الباقات الاقتصادية المتاحة (دفعة واحدة فقط)
    </h2>
    <div class="grid sm:grid-cols-3 gap-4 my-4 text-sm">
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div class="font-black text-white">باقة البداية ($9)</div>
        <p class="text-xs text-slate-400 mt-1">دراسة جدوى PDF + حملات إعلانية + 3 رسائل بريدية + خطة 30 يوماً.</p>
      </div>
      <div class="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
        <div class="font-black text-cyan-300">باقة النمو الشاملة ($19)</div>
        <p class="text-xs text-slate-300 mt-1">الأكثر مبيعاً: جميع الخدمات الأربع + ملف أتمتة n8n + كود صفحة الهبوط + خطة 90 يوماً.</p>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div class="font-black text-violet-300">باقة الوكالات VIP ($39)</div>
        <p class="text-xs text-slate-400 mt-1">تشمل 3 مسارات أتمتة + نموذج استثماري 12 شهراً + رخصة تجارية White-Label.</p>
      </div>
    </div>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      الأسئلة الشائعة حول ${esc(c.top.ar)} في ${esc(c.city.ar)}
    </h2>
    <div class="space-y-3">
      ${faqs.map(f => `
        <div class="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 class="text-sm font-black text-cyan-300">${esc(f.qAr)}</h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">${esc(f.aAr)}</p>
        </div>
      `).join('')}
    </div>
  `;

  const enBodyHtml = `
    <p class="text-base text-slate-300 leading-relaxed">
      In the competitive <strong class="text-white">${esc(c.city.en)}</strong> market, every <strong class="text-cyan-300">${esc(c.comp.en)}</strong> operating in <strong class="text-white">${esc(c.ind.en)}</strong> needs a data-backed <strong class="text-white">${esc(c.top.en)}</strong> without spending thousands on slow agencies. <strong class="text-cyan-300">Veloza Enterprise OS</strong> delivers a complete, tailored execution package in seconds starting from just <strong class="text-emerald-400">$9</strong> with PayPal protection and instant delivery.
    </p>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">Target AOV</div>
        <div class="text-xl font-black text-cyan-300 mt-1">$${kpi.aov}</div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">Estimated CAC</div>
        <div class="text-xl font-black text-amber-300 mt-1">$${kpi.cac}</div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">LTV:CAC Ratio</div>
        <div class="text-xl font-black text-emerald-400 mt-1">${kpi.ltvCac}x</div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div class="text-[11px] text-slate-400 font-bold">Break-Even</div>
        <div class="text-xl font-black text-violet-300 mt-1">${kpi.breakEvenDays} Days</div>
      </div>
    </div>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      Why ${esc(c.top.en)} Matters for ${esc(c.ind.en)} in ${esc(c.city.en)}
    </h2>
    <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
      Achieving <strong class="text-emerald-300">${esc(c.succ.en)}</strong> requires connecting <strong class="text-white">${esc(c.top.en)}</strong> directly to real Unit Economics. Veloza calculates your Customer Lifetime Value (<strong class="text-white">$${kpi.ltv}</strong>), target ad efficiency (<strong class="text-white">${kpi.roas}x ROAS</strong>), and projected 12-month revenue (<strong class="text-cyan-300">$${kpi.annualRevenue.toLocaleString()}</strong>) across 3 sensitivity scenarios.
    </p>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      4 Instant Execution Systems Delivered by Veloza
    </h2>
    <ul class="space-y-3 text-sm text-slate-300 leading-relaxed">
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">1. 12-Month Feasibility PDF Study:</strong> Real CAC, LTV, Break-Even analysis, 12-month cashflow table, SWOT matrix, and 30/60/90-day roadmap with the official Veloza seal.</li>
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">2. Multi-Platform Ad Suite & Email Sequence:</strong> Ready-to-launch ad copy for <span class="text-cyan-300 font-bold">${esc(c.ind.channelEn)}</span> plus a 3-part conversion email sequence.</li>
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">3. Importable n8n & Make.com Workflow (JSON):</strong> 7-node automation pipeline: Webhook → Normalize → OpenAI GPT-4o → VIP Router → Email Send → Google Sheets CRM → WhatsApp/Telegram Alert.</li>
      <li class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800"><strong class="text-white">4. Sales Funnel Landing Page (HTML5 + Tailwind CSS):</strong> Fully responsive template tailored for your ${esc(c.comp.en)} with pricing tiers, FAQ, and order form.</li>
    </ul>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      Transparent One-Time Pricing Tiers
    </h2>
    <div class="grid sm:grid-cols-3 gap-4 my-4 text-sm">
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div class="font-black text-white">Starter Launch ($9)</div>
        <p class="text-xs text-slate-400 mt-1">Feasibility PDF + Ad Campaigns + 3-Email Sequence + 30-Day Roadmap.</p>
      </div>
      <div class="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
        <div class="font-black text-cyan-300">Growth Pro ($19)</div>
        <p class="text-xs text-slate-300 mt-1">Best Seller: All 4 Complete Systems + n8n JSON + Landing Page Code + 90-Day Masterplan.</p>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div class="font-black text-violet-300">Agency VIP ($39)</div>
        <p class="text-xs text-slate-400 mt-1">3 Automation Workflows + 12-Month Investor Model + White-Label Commercial License.</p>
      </div>
    </div>

    <h2 class="text-xl sm:text-2xl font-black text-white mt-8 mb-3 border-b border-cyan-500/30 pb-2">
      Frequently Asked Questions
    </h2>
    <div class="space-y-3">
      ${faqs.map(f => `
        <div class="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 class="text-sm font-black text-cyan-300">${esc(f.qEn)}</h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">${esc(f.aEn)}</p>
        </div>
      `).join('')}
    </div>
  `;

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: titleAr,
        alternativeHeadline: titleEn,
        description: descAr,
        url,
        inLanguage: ['ar', 'en'],
        datePublished: '2026-11-14',
        dateModified: '2026-11-14',
        author: { '@type': 'Organization', name: 'Veloza Enterprise OS', url: `${SITE}/` },
        publisher: {
          '@type': 'Organization',
          name: 'Veloza Enterprise OS',
          logo: { '@type': 'ImageObject', url: `${SITE}/veloza-logo.png` }
        },
        image: `${SITE}/veloza-logo.png`,
        keywords: `${keywordsAr}, ${keywordsEn}`
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Veloza Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'SEO Solutions Hub', item: `${SITE}/seo/` },
          { '@type': 'ListItem', position: 3, name: `${c.ind.ar} (${c.ind.en})`, item: url }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.qAr,
          acceptedAnswer: { '@type': 'Answer', text: f.aAr }
        }))
      }
    ]
  };

  return {
    c,
    slug,
    url,
    titleAr,
    titleEn,
    h1Ar,
    h1En,
    descAr,
    descEn,
    keywordsAr,
    keywordsEn,
    arBodyHtml,
    enBodyHtml,
    internalLinks,
    jsonLdGraph
  };
}

function renderHtml(p) {
  const internalLinksHtml = p.internalLinks
    .map(l => `<a href="${l.href}" class="inline-block px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-bold hover:border-cyan-500/40 transition" data-ar="${esc(l.labelAr)}" data-en="${esc(l.labelEn)}">${esc(l.labelAr)}</a>`)
    .join('\n        ');

  return `<!DOCTYPE html>
<html id="html-root" lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.titleAr)} | Veloza Enterprise OS</title>
  <meta name="description" content="${esc(p.descAr)}" />
  <meta name="keywords" content="${esc(p.keywordsAr)}, ${esc(p.keywordsEn)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${p.url}" />
  <link rel="alternate" hreflang="ar" href="${p.url}" />
  <link rel="alternate" hreflang="en" href="${p.url}?lang=en" />
  <link rel="alternate" hreflang="x-default" href="${p.url}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Veloza Enterprise OS" />
  <meta property="og:locale" content="ar_AR" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:url" content="${p.url}" />
  <meta property="og:title" content="${esc(p.titleAr)}" />
  <meta property="og:description" content="${esc(p.descAr)}" />
  <meta property="og:image" content="${SITE}/veloza-logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.titleAr)}" />
  <meta name="twitter:description" content="${esc(p.descAr)}" />
  <meta name="twitter:image" content="${SITE}/veloza-logo.png" />
  <script type="application/ld+json">${JSON.stringify(p.jsonLdGraph)}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Cairo', 'Inter', sans-serif; background-color: #060911; color: #f1f5f9; scroll-behavior: smooth; }
  </style>
</head>
<body class="min-h-screen bg-[#060911] text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden pb-20">
  <div class="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white text-xs font-bold py-2.5 px-4 text-center" data-ar="🔥 ${esc(p.titleAr)}" data-en="🔥 ${esc(p.titleEn)}">
    🔥 ${esc(p.titleAr)}
  </div>

  <header class="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-base">V</div>
        <div>
          <div class="text-base font-black text-white">VELOZA</div>
          <div class="text-[9px] uppercase tracking-[0.28em] text-cyan-400/80 font-semibold -mt-0.5">Enterprise OS</div>
        </div>
      </a>
      <nav class="hidden md:flex items-center gap-5 text-xs font-bold text-slate-300">
        <a href="/" class="hover:text-cyan-400" data-ar="الرئيسية" data-en="Home">الرئيسية</a>
        <a href="/seo/" class="hover:text-cyan-400" data-ar="دليل القطاعات" data-en="Solutions Hub">دليل القطاعات</a>
        <a href="/#services" class="hover:text-cyan-400" data-ar="الخدمات" data-en="Services">الخدمات</a>
        <a href="/#pricing" class="hover:text-cyan-400" data-ar="الباقات ($9-$39)" data-en="Pricing ($9-$39)">الباقات ($9-$39)</a>
      </nav>
      <div class="flex items-center gap-2">
        <button id="lang-toggle-btn" onclick="toggleSeoLang()" class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-black text-xs shadow transition">
          🇬🇧 English
        </button>
        <a href="/#builder" class="hidden sm:inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-lg">
          <span data-ar="ابدأ الآن ($9)" data-en="Start Now ($9)">ابدأ الآن ($9)</span>
        </a>
      </div>
    </div>
  </header>

  <nav aria-label="Breadcrumb" class="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-xs text-slate-400 flex flex-wrap items-center gap-2">
    <a href="/" class="hover:text-cyan-300" data-ar="الرئيسية" data-en="Home">الرئيسية</a>
    <span>/</span>
    <a href="/seo/" class="hover:text-cyan-300" data-ar="مركز المعرفة" data-en="Solutions Hub">مركز المعرفة</a>
    <span>/</span>
    <span class="text-cyan-300 font-bold" data-ar="${esc(p.c.ind.ar)} • ${esc(p.c.city.ar)}" data-en="${esc(p.c.ind.en)} • ${esc(p.c.city.en)}">${esc(p.c.ind.ar)} • ${esc(p.c.city.ar)}</span>
  </nav>

  <section class="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center space-y-5">
    <span class="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold" data-ar="${esc(p.c.top.ar)} • ${esc(p.c.ind.ar)} • ${esc(p.c.city.ar)}" data-en="${esc(p.c.top.en)} • ${esc(p.c.ind.en)} • ${esc(p.c.city.en)}">
      ${esc(p.c.top.ar)} • ${esc(p.c.ind.ar)} • ${esc(p.c.city.ar)}
    </span>
    <h1 id="page-h1" class="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
      ${esc(p.h1Ar)}
    </h1>
    <p id="page-desc" class="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
      ${esc(p.descAr)}
    </p>
    <div class="flex flex-wrap justify-center gap-3 pt-2">
      <a href="/#builder" class="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-xl">
        <span data-ar="⚡ احصل على حزمتك المخصصة الآن ($9+)" data-en="⚡ Get Your Custom Package Now ($9+)">⚡ احصل على حزمتك المخصصة الآن ($9+)</span>
      </a>
      <a href="/seo/" class="px-7 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm">
        <span data-ar="تصفح جميع القطاعات" data-en="Browse All Industries">تصفح جميع القطاعات</span>
      </a>
    </div>
  </section>

  <article id="article-body" class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    ${p.arBodyHtml}
  </article>

  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6">
    <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
      <h3 class="text-sm font-black text-cyan-300" data-ar="صفحات وأدلة مرتبطة بهذا القطاع" data-en="Related Industry Guides & Solutions">صفحات وأدلة مرتبطة بهذا القطاع</h3>
      <div class="flex flex-wrap gap-2">
        ${internalLinksHtml}
        <a href="/" class="inline-block px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-xs font-bold hover:border-emerald-500/40 transition" data-ar="الصفحة الرئيسية" data-en="Veloza Home">الصفحة الرئيسية</a>
        <a href="/#builder" class="inline-block px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-violet-300 text-xs font-bold hover:border-violet-500/40 transition" data-ar="بناء حزمتك الآن" data-en="Build Your Package">بناء حزمتك الآن</a>
      </div>
    </div>
  </section>

  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6">
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-violet-950/40 border border-cyan-500/30 space-y-4 text-center shadow-2xl">
      <h2 class="text-xl sm:text-2xl font-black text-white" data-ar="هل أنت مستعد لإطلاق مشروعك في ${esc(p.c.ind.ar)}؟" data-en="Ready to launch your ${esc(p.c.ind.en)} business?">هل أنت مستعد لإطلاق مشروعك في ${esc(p.c.ind.ar)}؟</h2>
      <p class="text-xs sm:text-sm text-slate-300" data-ar="استلم دراسة الجدوى، الحملات الإعلانية، أتمتة n8n، وكود صفحة الهبوط في ثوانٍ بضمان PayPal." data-en="Receive your Feasibility PDF, Ad Campaigns, n8n Automation, and Landing Page Code in seconds with PayPal protection.">استلم دراسة الجدوى، الحملات الإعلانية، أتمتة n8n، وكود صفحة الهبوط في ثوانٍ بضمان PayPal.</p>
      <a href="/#builder" class="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-xl">
        <span data-ar="⚡ ابدأ البناء الآن" data-en="⚡ Start Building Now">⚡ ابدأ البناء الآن</span>
      </a>
    </div>
  </section>

  <footer class="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
    <div>© 2026 Veloza Enterprise OS • <a href="mailto:veloza.admin@gmail.com" class="text-cyan-400 hover:underline" dir="ltr">veloza.admin@gmail.com</a></div>
    <div class="mt-2 flex justify-center gap-4 text-[11px]">
      <a href="/" class="hover:text-white" data-ar="الرئيسية" data-en="Home">الرئيسية</a>
      <a href="/seo/" class="hover:text-white" data-ar="دليل القطاعات" data-en="Solutions Hub">دليل القطاعات</a>
      <a href="/#pricing" class="hover:text-white" data-ar="الباقات" data-en="Pricing">الباقات</a>
      <a href="/#builder" class="hover:text-white" data-ar="استلم حزمتك" data-en="Get Package">استلم حزمتك</a>
    </div>
  </footer>

  <script>
    (function() {
      const arBody = ${JSON.stringify(p.arBodyHtml)};
      const enBody = ${JSON.stringify(p.enBodyHtml)};
      const arTitle = ${JSON.stringify(p.titleAr)};
      const enTitle = ${JSON.stringify(p.titleEn)};
      const arDesc = ${JSON.stringify(p.descAr)};
      const enDesc = ${JSON.stringify(p.descEn)};
      const arH1 = ${JSON.stringify(p.h1Ar)};
      const enH1 = ${JSON.stringify(p.h1En)};
      let currentLang = 'ar';
      function setLang(lang) {
        currentLang = lang;
        const html = document.getElementById('html-root');
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
        document.title = (lang === 'en' ? enTitle : arTitle) + ' | Veloza Enterprise OS';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', lang === 'en' ? enDesc : arDesc);
        const h1 = document.getElementById('page-h1');
        if (h1) h1.textContent = lang === 'en' ? enH1 : arH1;
        const desc = document.getElementById('page-desc');
        if (desc) desc.textContent = lang === 'en' ? enDesc : arDesc;
        const article = document.getElementById('article-body');
        if (article) article.innerHTML = lang === 'en' ? enBody : arBody;
        document.querySelectorAll('[data-ar][data-en]').forEach(el => {
          el.textContent = lang === 'en' ? (el.getAttribute('data-en') || el.textContent) : (el.getAttribute('data-ar') || el.textContent);
        });
        const btn = document.getElementById('lang-toggle-btn');
        if (btn) btn.textContent = lang === 'en' ? '🇸🇦 العربية' : '🇬🇧 English';
      }
      window.toggleSeoLang = function() {
        setLang(currentLang === 'ar' ? 'en' : 'ar');
      };
      const params = new URLSearchParams(window.location.search);
      if (params.get('lang') === 'en') setLang('en');
    })();
  </script>
</body>
</html>`;
}

function buildHubPage(samplePages) {
  const industryCards = industries.map((ind, idx) => {
    const sample = samplePages[idx] || samplePages[0];
    return `<a href="/seo/${sample.slug}.html" class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition block">
      <div class="text-sm font-black text-white" data-ar="${esc(ind.ar)}" data-en="${esc(ind.en)}">${esc(ind.ar)}</div>
      <div class="text-xs text-cyan-300 mt-1" data-ar="قنوات: ${esc(ind.channelAr)}" data-en="Channels: ${esc(ind.channelEn)}">قنوات: ${esc(ind.channelAr)}</div>
      <div class="text-[11px] text-slate-400 mt-1">AOV ~$${ind.aov} • Margin ${Math.round(ind.margin * 100)}%</div>
    </a>`;
  }).join('\n');

  const featuredLinks = samplePages.slice(0, 60).map(p =>
    `<a href="/seo/${p.slug}.html" class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 text-xs transition block">
      <div class="font-bold text-cyan-300" data-ar="${esc(p.titleAr)}" data-en="${esc(p.titleEn)}">${esc(p.titleAr)}</div>
    </a>`
  ).join('\n');

  return `<!DOCTYPE html>
<html id="html-root" lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مركز المعرفة والقطاعات — 20,000+ دليل ثنائي اللغة | Veloza Enterprise OS</title>
  <meta name="description" content="تصفح أكثر من 20,000 صفحة متخصصة ثنائية اللغة (عربي/إنجليزي) لدراسات الجدوى، اقتصاديات الوحدة، أتمتة n8n، والحملات الإعلانية من Veloza." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${SITE}/seo/" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>body { font-family: 'Cairo', 'Inter', sans-serif; background: #060911; color: #f1f5f9; }</style>
</head>
<body class="min-h-screen bg-[#060911] text-slate-100 pb-20">
  <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black">V</div>
        <span class="font-black text-white">VELOZA SEO HUB</span>
      </a>
      <div class="flex items-center gap-2">
        <button id="hub-lang-btn" onclick="toggleHubLang()" class="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-black text-xs">🇬🇧 English</button>
        <a href="/#builder" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs" data-ar="ابدأ الآن ($9)" data-en="Start Now ($9)">ابدأ الآن ($9)</a>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 pt-10 space-y-12">
    <section class="text-center space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold" data-ar="20,000+ صفحة محتوى فريد ثنائية اللغة" data-en="20,000+ Unique Bilingual SEO Pages">20,000+ صفحة محتوى فريد ثنائية اللغة</span>
      <h1 class="text-3xl sm:text-5xl font-black text-white" data-ar="دليل Veloza للقطاعات والأتمتة ودراسات الجدوى" data-en="Veloza Industry Solutions & Feasibility Hub">دليل Veloza للقطاعات والأتمتة ودراسات الجدوى</h1>
      <p class="text-sm text-slate-400 max-w-2xl mx-auto" data-ar="اختر قطاعك لتصفح الأدلة التخصصية باللغتين العربية والإنجليزية المرتبطة بخدمات Veloza الأربع." data-en="Choose your industry to explore specialized bilingual guides connected to Veloza's 4 core deliverables.">اختر قطاعك لتصفح الأدلة التخصصية باللغتين العربية والإنجليزية المرتبطة بخدمات Veloza الأربع.</p>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-black text-white" data-ar="القطاعات المغطاة (25 قطاعاً)" data-en="Covered Industries (25 Sectors)">القطاعات المغطاة (25 قطاعاً)</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        ${industryCards}
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-black text-white" data-ar="أدلة مختارة من الدفعة الجديدة" data-en="Featured Guides from New Batch">أدلة مختارة من الدفعة الجديدة</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${featuredLinks}
      </div>
    </section>
  </main>

  <script>
    let hubLang = 'ar';
    window.toggleHubLang = function() {
      hubLang = hubLang === 'ar' ? 'en' : 'ar';
      const html = document.getElementById('html-root');
      html.setAttribute('lang', hubLang);
      html.setAttribute('dir', hubLang === 'en' ? 'ltr' : 'rtl');
      document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.textContent = hubLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
      });
      document.getElementById('hub-lang-btn').textContent = hubLang === 'en' ? '🇸🇦 العربية' : '🇬🇧 English';
    };
  </script>
</body>
</html>`;
}

// ---- Main Execution ----
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log(`🚀 Generating ${COUNT.toLocaleString()} bilingual SEO pages (offset ${START_OFFSET}) into ${OUTPUT_DIR}...`);
const startTime = Date.now();

const urlsPart1 = [];
const urlsPart2 = [];
const samplePages = [];
const manifestEntries = [];

for (let i = 0; i < COUNT; i++) {
  const globalIdx = START_OFFSET + i;
  const pageData = buildPageData(globalIdx);
  const html = renderHtml(pageData);
  const filePath = path.join(OUTPUT_DIR, `${pageData.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');

  if (i < 60) {
    samplePages.push({ slug: pageData.slug, titleAr: pageData.titleAr, titleEn: pageData.titleEn });
  }
  manifestEntries.push({
    slug: pageData.slug,
    url: pageData.url,
    titleAr: pageData.titleAr,
    titleEn: pageData.titleEn
  });

  const urlEntry = `  <url>\n    <loc>${pageData.url}</loc>\n    <lastmod>2026-11-14</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
  if (i < 10000) urlsPart1.push(urlEntry);
  else urlsPart2.push(urlEntry);

  if ((i + 1) % 2000 === 0) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  ✔ Generated ${(i + 1).toLocaleString()}/${COUNT.toLocaleString()} pages (${elapsed}s)`);
  }
}

// Write Hub Page
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), buildHubPage(samplePages), 'utf8');

// Write Manifest for the 20k batch
fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest-20k.json'), JSON.stringify(manifestEntries), 'utf8');

// Write Chunked Sitemaps for the 20k batch
const wrapSitemap = (entries) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-20k-1.xml'), wrapSitemap(urlsPart1), 'utf8');
if (urlsPart2.length > 0) {
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-20k-2.xml'), wrapSitemap(urlsPart2), 'utf8');
}

// Write Main Sitemap
const mainSitemap = wrapSitemap([
  `  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>2026-11-14</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  `  <url>\n    <loc>${SITE}/index.html</loc>\n    <lastmod>2026-11-14</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  `  <url>\n    <loc>${SITE}/seo/</loc>\n    <lastmod>2026-11-14</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
]);
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap-main.xml'), mainSitemap, 'utf8');

// Write Root Sitemap Index
const sitemapRefs = [
  `${SITE}/sitemap-main.xml`,
  `${SITE}/seo/sitemap-20k-1.xml`,
  ...(urlsPart2.length > 0 ? [`${SITE}/seo/sitemap-20k-2.xml`] : []),
  `${SITE}/seo/sitemap-seo.xml`
];
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRefs
  .map(loc => `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>2026-11-14</lastmod>\n  </sitemap>`)
  .join('\n')}\n</sitemapindex>\n`;
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapIndex, 'utf8');

const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✅ Done in ${totalSec}s!`);
console.log(`   - ${COUNT.toLocaleString()} bilingual SEO pages written to ${OUTPUT_DIR}`);
console.log(`   - SEO Hub written to ${OUTPUT_DIR}/index.html`);
console.log(`   - Sitemaps: sitemap.xml (index) -> sitemap-main.xml, seo/sitemap-20k-1.xml, seo/sitemap-20k-2.xml`);
