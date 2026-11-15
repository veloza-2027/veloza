const fs = require('fs');
const path = require('path');

// ============================================================================
// VELOZA MODERN SEO GENERATOR v4
// - Clean extensionless URLs: /seo/<slug>/ (AR) and /seo/<slug>/en/ (EN)
// - Zero render-blocking CDN JS (inline critical CSS -> ~100 Lighthouse score)
// - 100% pure Arabic (RTL) & 100% pure English (LTR) with mutual hreflang
// - 5 distinct editorial frameworks + industry-specific pain points, ad hooks,
//   and n8n automation scenarios so every page has unique content & LSI keywords
// - Schema.org JSON-LD: Article + BreadcrumbList + FAQPage + Service
// - XML Sitemaps with xhtml:link hreflang annotations
// ============================================================================

const SITE = 'https://www.veloza-ai.online';
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'seo');
const START_OFFSET = parseInt(process.argv[3] || '52000', 10);
const COUNT = parseInt(process.argv[2] || '20000', 10);

const industries = [
  {
    ar: 'العطور والهدايا الفاخرة', en: 'Luxury Perfumes & Gifts', slug: 'perfumes-gifts', aov: 85, margin: 0.62,
    channelAr: 'إنستغرام وتيك توك وسناب شات', channelEn: 'Instagram, TikTok & Snapchat',
    lsiAr: 'عطور نيش, متجر عطور إلكتروني, تغليف هدايا فاخرة, تسويق العطور, هدايا موسمية',
    lsiEn: 'niche perfumes, fragrance ecommerce, luxury gift box, perfume marketing, seasonal gifts',
    painAr: 'ارتفاع تكلفة الإعلان في المواسم وصعوبة إقناع العميل بالشراء دون تجربة الرائحة',
    painEn: 'high seasonal ad costs and converting shoppers who cannot sample scents online',
    n8nAr: 'إرسال عينة مجانية تلقائياً للعملاء الجدد وتذكير السلات المتروكة عبر واتساب',
    n8nEn: 'automated sample-kit follow-up and WhatsApp abandoned-cart recovery for fragrance buyers'
  },
  {
    ar: 'التجارة الإلكترونية', en: 'E-Commerce', slug: 'ecommerce', aov: 65, margin: 0.45,
    channelAr: 'ميتا وجوجل للتسوق وتيك توك', channelEn: 'Meta, Google Shopping & TikTok',
    lsiAr: 'متجر إلكتروني, دروبشيبينغ, رفع معدل التحويل, سلة الشراء, الدفع عند الاستلام',
    lsiEn: 'online store, D2C ecommerce, conversion optimization, checkout funnel, repeat orders',
    painAr: 'انخفاض هامش الربح الصافي بسبب المرتجعات وارتفاع تكلفة الاستحواذ على العميل',
    painEn: 'shrinking net margins from high return rates and rising paid-acquisition costs',
    n8nAr: 'مزامنة الطلبات مع Google Sheets وتصنيف العملاء VIP وإرسال عروض إعادة الشراء',
    n8nEn: 'syncing orders to Google Sheets CRM, tagging VIP buyers, and triggering reorder flows'
  },
  {
    ar: 'الصحة واللياقة البدنية', en: 'Health & Fitness', slug: 'health-fitness', aov: 55, margin: 0.58,
    channelAr: 'تيك توك وإنستغرام ويوتيوب', channelEn: 'TikTok, Instagram & YouTube',
    lsiAr: 'برامج لياقة, مكملات غذائية, اشتراكات أندية, تدريب شخصي أونلاين, تغذية رياضية',
    lsiEn: 'fitness coaching, supplements store, gym memberships, online training, sports nutrition',
    painAr: 'تذبذب تجديد الاشتراكات الشهرية وتشتت العملاء بعد الأسابيع الأولى',
    painEn: 'monthly subscription churn and member drop-off after the first few weeks',
    n8nAr: 'متابعة أسبوعية مؤتمتة للمشتركين وتنبيهات تجديد الباقة قبل انتهائها',
    n8nEn: 'automated weekly check-in sequences and proactive membership renewal reminders'
  },
  {
    ar: 'التعليم والتدريب', en: 'Education & Training', slug: 'education-training', aov: 120, margin: 0.78,
    channelAr: 'جوجل سيرش ولينكدإن ويوتيوب', channelEn: 'Google Search, LinkedIn & YouTube',
    lsiAr: 'أكاديمية تدريب, دورات إلكترونية, حقائب تدريبية, تسويق الدورات, شهادات معتمدة',
    lsiEn: 'training academy, online courses, cohort programs, course marketing, certifications',
    painAr: 'طول رحلة اتخاذ القرار لدى المتدرب والحاجة لبناء الثقة قبل التسجيل',
    painEn: 'longer student decision cycles requiring strong trust before course enrollment',
    n8nAr: 'تأهيل المسجلين في الندوات المجانية بالذكاء الاصطناعي وإرسال عروض التسجيل المبكر',
    n8nEn: 'AI qualification of webinar leads and automated early-bird enrollment sequences'
  },
  {
    ar: 'العقارات والتطوير العقاري', en: 'Real Estate & Property', slug: 'real-estate', aov: 450, margin: 0.72,
    channelAr: 'جوجل سيرش وإنستغرام وسناب شات', channelEn: 'Google Search, Instagram & Snapchat',
    lsiAr: 'تسويق عقاري, وساطة عقارية, جمع عملاء عقاريين, مشاريع سكنية, استثمار عقاري',
    lsiEn: 'real estate marketing, property brokerage, buyer lead generation, residential sales',
    painAr: 'كثرة الاستفسارات غير الجادة وبطء تواصل الوسطاء مع العملاء المحتملين',
    painEn: 'unqualified property inquiries and slow broker response times',
    n8nAr: 'تقييم المشتري فورياً عبر GPT-4o وتوزيع العملاء الجادين على الوسطاء عبر واتساب',
    n8nEn: 'instant GPT-4o buyer qualification and real-time WhatsApp routing to sales agents'
  },
  {
    ar: 'المطاعم والمقاهي', en: 'Restaurants & Cafes', slug: 'restaurants-cafes', aov: 32, margin: 0.48,
    channelAr: 'سناب شات وتيك توك وخرائط جوجل', channelEn: 'Snapchat, TikTok & Google Maps',
    lsiAr: 'مطبخ سحابي, مقهى مختص, منيو رقمي, طلبات التوصيل, ولاء العملاء',
    lsiEn: 'cloud kitchen, specialty cafe, digital menu, food delivery, restaurant loyalty',
    painAr: 'عمولات تطبيقات التوصيل المرتفعة التي تلتهم أرباح الوجبات',
    painEn: 'high third-party delivery app commissions eating into per-order profitability',
    n8nAr: 'تحويل عملاء التوصيل للطلب المباشر عبر صفحة الهبوط وإرسال كوبونات الولاء',
    n8nEn: 'converting app diners to direct ordering funnels with automated loyalty coupons'
  },
  {
    ar: 'الخدمات اللوجستية والتوصيل', en: 'Logistics & Delivery', slug: 'logistics-delivery', aov: 180, margin: 0.42,
    channelAr: 'لينكدإن وجوجل سيرش ومنصة X', channelEn: 'LinkedIn, Google Search & X',
    lsiAr: 'شحن وتوصيل, الميل الأخير, عقود شركات, مستودعات تلبية الطلبات, تتبع الشحنات',
    lsiEn: 'last-mile delivery, B2B freight contracts, fulfillment center, parcel tracking',
    painAr: 'تذبذب حجم الشحنات اليومي وارتفاع تكلفة التشغيل لكل كيلومتر',
    painEn: 'daily shipment volume fluctuations and high cost-per-kilometer fleet operations',
    n8nAr: 'استقبال طلبات عقود المتاجر وإصدار عروض أسعار فورية وتنبيه فريق المبيعات',
    n8nEn: 'automated merchant contract intake, instant rate quoting, and sales team alerts'
  },
  {
    ar: 'السياحة والسفر', en: 'Travel & Tourism', slug: 'travel-tourism', aov: 260, margin: 0.52,
    channelAr: 'إنستغرام وتيك توك وجوجل', channelEn: 'Instagram, TikTok & Google',
    lsiAr: 'وكالة سفر, باقات سياحية, حجوزات فنادق, سياحة فاخرة, برامج شهر العسل',
    lsiEn: 'travel agency, tour packages, hotel bookings, luxury travel, holiday bundles',
    painAr: 'موسمية الطلب وتأخر الرد على استفسارات الباقات السياحية المخصصة',
    painEn: 'seasonal demand spikes and slow manual quoting for custom travel itineraries',
    n8nAr: 'توليد مقترح برنامج سياحي تلقائياً فور تعبئة النموذج وإرساله لبريد العميل',
    n8nEn: 'automated itinerary proposal generation and instant email delivery upon inquiry'
  },
  {
    ar: 'الخدمات المالية والمحاسبية', en: 'Financial & Accounting Services', slug: 'financial-services', aov: 220, margin: 0.75,
    channelAr: 'لينكدإن وجوجل سيرش ومنصة X', channelEn: 'LinkedIn, Google Search & X',
    lsiAr: 'استشارات مالية, مكاتب محاسبة, تخطيط ضريبي, إدارة التدفقات, تدقيق مالي',
    lsiEn: 'financial advisory, accounting firm, tax planning, cashflow management, CFO services',
    painAr: 'صعوبة إظهار القيمة الاستشارية رقمياً وجذب شركات ذات ملاءة مالية عالية',
    painEn: 'communicating advisory ROI online and attracting high-retainer B2B clients',
    n8nAr: 'جدولة استشارات التقييم المالي وتصنيف الشركات حسب حجم الإيرادات تلقائياً',
    n8nEn: 'automated financial audit booking and revenue-tier lead scoring in CRM'
  },
  {
    ar: 'الإنتاج والتصنيع', en: 'Manufacturing & Production', slug: 'manufacturing', aov: 520, margin: 0.38,
    channelAr: 'لينكدإن وجوجل للأعمال', channelEn: 'LinkedIn & Google B2B',
    lsiAr: 'مصنع صغير, خطوط إنتاج, تصنيع للغير, توريد صناعي, دراسة جدوى مصنع',
    lsiEn: 'small factory, production line, OEM manufacturing, industrial supply, plant feasibility',
    painAr: 'ارتفاع التكاليف الثابتة والحاجة لعقود توريد مستمرة لتغطية نقطة التعادل',
    painEn: 'heavy fixed overhead requiring steady B2B supply contracts to pass break-even',
    n8nAr: 'إدارة طلبات التسعير الصناعية ومتابعة عروض الجملة مع مديري المشتريات',
    n8nEn: 'B2B RFQ intake automation and wholesale quote follow-ups with procurement leads'
  },
  {
    ar: 'الزراعة والمنتجات الغذائية', en: 'Agriculture & Food', slug: 'agriculture-food', aov: 75, margin: 0.44,
    channelAr: 'إنستغرام وسناب شات وجوجل', channelEn: 'Instagram, Snapchat & Google',
    lsiAr: 'منتجات عضوية, تمور وعسل, توريد غذائي, متجر أغذية, تعبئة وتغليف',
    lsiEn: 'organic food, gourmet dates & honey, food supply, grocery D2C, packaging',
    painAr: 'حساسية المخزون القابل للتلف والحاجة لتدوير سريع للمبيعات',
    painEn: 'perishable inventory constraints demanding fast, predictable order velocity',
    n8nAr: 'تفعيل اشتراكات التوريد الأسبوعي وتنبيهات العروض الموسمية للعملاء الدائمين',
    n8nEn: 'weekly subscription box renewals and seasonal harvest alerts for repeat buyers'
  },
  {
    ar: 'التقنية العقارية', en: 'PropTech', slug: 'proptech', aov: 190, margin: 0.76,
    channelAr: 'لينكدإن وجوجل سيرش', channelEn: 'LinkedIn & Google Search',
    lsiAr: 'منصات عقارية, إدارة أملاك ذكية, تقييم عقاري رقمي, برمجيات عقارية',
    lsiEn: 'proptech platform, smart property management, digital valuation, real estate SaaS',
    painAr: 'إقناع المطورين والملاك التقليديين بالتحول من الجداول اليدوية للاشتراك الرقمي',
    painEn: 'convincing traditional landlords to migrate from spreadsheets to SaaS workflows',
    n8nAr: 'تجهيز حسابات التجربة المجانية تلقائياً وإرسال تقارير العائد للمطورين',
    n8nEn: 'automated free-trial onboarding and ROI benchmark reports for property managers'
  },
  {
    ar: 'التقنية الصحية', en: 'HealthTech', slug: 'healthtech', aov: 140, margin: 0.74,
    channelAr: 'جوجل سيرش وإنستغرام ولينكدإن', channelEn: 'Google Search, Instagram & LinkedIn',
    lsiAr: 'عيادات رقمية, حجز مواعيد طبي, ملف صحي إلكتروني, استشارات عن بعد',
    lsiEn: 'telehealth platform, clinic booking software, digital health records, remote care',
    painAr: 'الالتزام بمعايير الخصوصية وتقليل نسبة تغيب المرضى عن المواعيد المحجوزة',
    painEn: 'maintaining patient trust while reducing appointment no-show rates',
    n8nAr: 'تأكيد المواعيد آلياً عبر واتساب وتوجيه استفسارات المرضى للعيادة المختصة',
    n8nEn: 'automated WhatsApp appointment confirmations and smart triage routing'
  },
  {
    ar: 'التقنية الخدمية', en: 'ServiceTech', slug: 'servicetech', aov: 110, margin: 0.70,
    channelAr: 'جوجل سيرش وميتا ولينكدإن', channelEn: 'Google Search, Meta & LinkedIn',
    lsiAr: 'تطبيقات خدمات منزلية, حجز فنيين, منصات صيانة, أتمتة الطلبات الخدمية',
    lsiEn: 'on-demand home services, technician booking, maintenance app, service marketplace',
    painAr: 'موازنة العرض والطلب بين مقدمي الخدمة والعملاء في نفس المدينة',
    painEn: 'balancing technician supply with hyper-local customer demand in real time',
    n8nAr: 'توزيع طلبات الصيانة على أقرب فني متاح وإرسال تقييم الخدمة بعد الإنجاز',
    n8nEn: 'dispatching service tickets to nearest technicians and collecting post-job reviews'
  },
  {
    ar: 'تقنية التجزئة', en: 'RetailTech', slug: 'retailtech', aov: 160, margin: 0.68,
    channelAr: 'لينكدإن ومنصة X وجوجل', channelEn: 'LinkedIn, X & Google',
    lsiAr: 'نقاط بيع سحابية, إدارة مخزون, ربط الفروع, تحليلات التجزئة',
    lsiEn: 'cloud POS, inventory intelligence, omnichannel retail, store analytics',
    painAr: 'طول دورة المبيعات مع أصحاب المتاجر متعددة الفروع',
    painEn: 'multi-stakeholder sales cycles when pitching multi-branch retail owners',
    n8nAr: 'حجز عروض توضيحية مخصصة حسب عدد الفروع ومتابعة قرار الشراء آلياً',
    n8nEn: 'branch-count demo routing and automated decision-maker follow-up sequences'
  },
  {
    ar: 'تجارة التجزئة', en: 'Retail Stores', slug: 'retail', aov: 60, margin: 0.46,
    channelAr: 'سناب شات وتيك توك وإنستغرام', channelEn: 'Snapchat, TikTok & Instagram',
    lsiAr: 'محلات تجارية, مبيعات الفروع, عروض التجزئة, التسوق المحلي, ولاء المتاجر',
    lsiEn: 'brick-and-mortar retail, local foot traffic, seasonal promos, store loyalty',
    painAr: 'ضعف التحويل من الزائر الرقمي إلى زيارة الفرع أو الشراء عبر الإنترنت',
    painEn: 'bridging online ad impressions into actual in-store visits and online orders',
    n8nAr: 'إرسال قسائم خصم حصرية لزوار الصفحة وربط المبيعات بسجل العملاء',
    n8nEn: 'issuing geo-targeted store vouchers and syncing redemptions to CRM'
  },
  {
    ar: 'الخدمات المهنية والاستشارية', en: 'Professional Services', slug: 'professional-services', aov: 290, margin: 0.80,
    channelAr: 'لينكدإن وجوجل سيرش', channelEn: 'LinkedIn & Google Search',
    lsiAr: 'مكاتب استشارات, خدمات قانونية وهندسية, عقود استشارية, تطوير أعمال',
    lsiEn: 'consulting firm, legal & engineering advisory, B2B retainers, business strategy',
    painAr: 'الاعتماد المفرط على التوصيات الشخصية وغياب قمع مبيعات رقمي ثابت',
    painEn: 'over-reliance on word-of-mouth referrals instead of a predictable digital pipeline',
    n8nAr: 'استقطاب العملاء عبر دراسات حالة مجانية وجدولة مكالمات الاكتشاف آلياً',
    n8nEn: 'lead-magnet case study delivery and automated discovery-call scheduling'
  },
  {
    ar: 'التقنية التعليمية', en: 'EdTech', slug: 'edtech', aov: 95, margin: 0.79,
    channelAr: 'تيك توك وجوجل ويوتيوب', channelEn: 'TikTok, Google & YouTube',
    lsiAr: 'منصات تعلم ذكية, تعليم تفاعلي, اشتراكات طلابية, تطبيقات تعليمية',
    lsiEn: 'interactive learning app, student subscriptions, adaptive edtech, e-learning SaaS',
    painAr: 'تحويل المستخدمين المجانيين إلى مشتركين مدفوعين بتكلفة استحواذ منخفضة',
    painEn: 'converting freemium learners into paid subscribers at a sustainable CAC',
    n8nAr: 'تخصيص رسائل الترقية بناءً على تقدم الطالب وتنبيه أولياء الأمور بالنتائج',
    n8nEn: 'progress-triggered upgrade nudges and automated parent/student milestone emails'
  },
  {
    ar: 'التسويق العقاري الرقمي', en: 'Digital Real Estate', slug: 'digital-real-estate', aov: 310, margin: 0.71,
    channelAr: 'إنستغرام وجوجل وسناب شات', channelEn: 'Instagram, Google & Snapchat',
    lsiAr: 'إعلانات عقارية, جولات افتراضية, صفحات هبوط عقارية, قمع مبيعات العقار',
    lsiEn: 'property ad funnels, virtual tours, real estate landing pages, buyer capture',
    painAr: 'ارتفاع سعر النقرة في الإعلانات العقارية دون وجود صفحة هبوط ترفع التحويل',
    painEn: 'expensive real estate ad clicks wasted on generic, low-converting websites',
    n8nAr: 'ربط نماذج الإعلانات مباشرة بجدول المشاريع وإرسال الكتيب العقاري عبر واتساب',
    n8nEn: 'instant brochure delivery via WhatsApp and CRM lead scoring from ad forms'
  },
  {
    ar: 'الرعاية الصحية الرقمية', en: 'Digital Health', slug: 'digital-health', aov: 125, margin: 0.73,
    channelAr: 'جوجل سيرش وإنستغرام', channelEn: 'Google Search & Instagram',
    lsiAr: 'استشارات طبية أونلاين, برامج عافية, اشتراكات صحية, رعاية منزلية',
    lsiEn: 'online medical consultations, wellness programs, home healthcare subscriptions',
    painAr: 'بناء المصداقية الطبية في الحملات الإعلانية والالتزام بسياسات المنصات',
    painEn: 'crafting compliant, high-trust medical ad copy that passes platform reviews',
    n8nAr: 'تنظيم استبيانات الفحص الأولي وتنسيق مواعيد الأطباء تلقائياً',
    n8nEn: 'automated intake questionnaires and seamless doctor calendar coordination'
  },
  {
    ar: 'الأزياء والملابس', en: 'Fashion & Apparel', slug: 'fashion-apparel', aov: 78, margin: 0.56,
    channelAr: 'تيك توك وإنستغرام وسناب شات', channelEn: 'TikTok, Instagram & Snapchat',
    lsiAr: 'براند ملابس, أزياء نسائية ورجالية, متجر أزياء, تسويق الموضة, إطلاق كولكشن',
    lsiEn: 'fashion brand, apparel ecommerce, streetwear D2C, lookbook campaigns, seasonal drops',
    painAr: 'تفاوت المقاسات ومعدل الاستبدال وتكدس المخزون بعد انتهاء الموسم',
    painEn: 'sizing-related exchanges and seasonal inventory markdown pressure',
    n8nAr: 'إطلاق حملات حجز مسبق للكولكشن الجديد ومتابعة عملاء الأذواق المتشابهة',
    n8nEn: 'VIP early-access drop alerts and automated restock notifications'
  },
  {
    ar: 'التجميل والعناية بالبشرة', en: 'Beauty & Skincare', slug: 'beauty-skincare', aov: 68, margin: 0.64,
    channelAr: 'تيك توك وإنستغرام وسناب شات', channelEn: 'TikTok, Instagram & Snapchat',
    lsiAr: 'مستحضرات تجميل, عناية بالبشرة, براند تجميل, تسويق المؤثرين, روتين البشرة',
    lsiEn: 'skincare routine, cosmetics D2C, beauty influencer ads, repeat skincare bundles',
    painAr: 'شدة المنافسة الإعلانية والحاجة لرفع معدل إعادة الشراء الشهري',
    painEn: 'intense ad auction competition requiring strong monthly repeat-purchase rates',
    n8nAr: 'تذكير العميل تلقائياً قبل نفاد المنتج بـ 30 يوماً مع عرض باقة التوفير',
    n8nEn: '30-day replenishment reminders with automated bundle upsell offers'
  },
  {
    ar: 'برمجيات الأعمال السحابية', en: 'B2B SaaS Software', slug: 'b2b-saas', aov: 150, margin: 0.84,
    channelAr: 'لينكدإن وجوجل سيرش ومنصة X', channelEn: 'LinkedIn, Google Search & X',
    lsiAr: 'اشتراكات برمجية, تسويق SaaS, تقليل الإلغاء, تجربة مجانية, نمو الإيراد المتكرر',
    lsiEn: 'B2B SaaS growth, MRR scaling, churn reduction, free-trial funnel, product-led growth',
    painAr: 'ارتفاع تكلفة الاستحواذ على عملاء الشركات وطول فترة التجربة قبل الترقية',
    painEn: 'high enterprise CAC and low free-trial-to-paid conversion velocity',
    n8nAr: 'تفعيل رسائل إرشادية ذكية حسب استخدام العميل وتنبيه فريق المبيعات للحسابات الكبيرة',
    n8nEn: 'usage-based onboarding sequences and high-intent account alerts for sales'
  },
  {
    ar: 'السيارات والتنقل', en: 'Automotive & Mobility', slug: 'automotive-mobility', aov: 240, margin: 0.49,
    channelAr: 'جوجل سيرش وسناب شات وتيك توك', channelEn: 'Google Search, Snapchat & TikTok',
    lsiAr: 'مراكز عناية بالسيارات, قطع غيار, تأجير سيارات, خدمات الصيانة السريعة',
    lsiEn: 'auto detailing, spare parts store, car rental, quick maintenance center',
    painAr: 'تفاوت ثقة العملاء وجودة الحجز المسبق لمواعيد الصيانة أو الإيجار',
    painEn: 'building service trust and capturing pre-booked maintenance or rental slots',
    n8nAr: 'تأكيد حجوزات الصيانة وإرسال تنبيهات الفحص الدوري عبر واتساب',
    n8nEn: 'automated service bay scheduling and periodic maintenance WhatsApp reminders'
  },
  {
    ar: 'الأثاث والديكور المنزلي', en: 'Home Decor & Furniture', slug: 'home-decor', aov: 210, margin: 0.53,
    channelAr: 'إنستغرام وبنترست وجوجل', channelEn: 'Instagram, Pinterest & Google',
    lsiAr: 'أثاث منزلي, تصميم داخلي, متجر ديكور, تفصيل أثاث, تجهيز منازل',
    lsiEn: 'home furniture, interior decor, custom furniture D2C, home styling packages',
    painAr: 'ارتفاع تكلفة الشحن وحاجة العميل لمعاينة التفاصيل قبل اتخاذ قرار الشراء',
    painEn: 'bulky shipping economics and customers needing high visual confidence before buying',
    n8nAr: 'إرسال كتالوج المقاسات والألوان تلقائياً وجدولة استشارة التصميم الداخلي',
    n8nEn: 'automated dimension spec-sheet delivery and interior styling call booking'
  }
];

const topics = [
  { ar: 'دراسة جدوى مالية متكاملة', en: 'Complete Financial Feasibility Study', slug: 'feasibility-study', kwAr: 'دراسة جدوى, نموذج مالي, توقعات 12 شهراً', kwEn: 'feasibility study, financial model, 12-month projection' },
  { ar: 'أتمتة الأعمال عبر n8n و Make', en: 'n8n & Make.com Business Automation', slug: 'n8n-automation', kwAr: 'أتمتة n8n, سير عمل ذكي, ربط الأنظمة', kwEn: 'n8n automation, Make.com workflow, JSON pipeline' },
  { ar: 'حملات إعلانية متعددة المنصات', en: 'Multi-Platform Ad Campaigns', slug: 'ad-campaigns', kwAr: 'حملات إعلانية, إعلانات تيك توك, إعلانات جوجل, سناب شات', kwEn: 'ad campaigns, TikTok ads, Google Ads, Snapchat ads' },
  { ar: 'تصميم صفحة هبوط بيعية', en: 'High-Converting Sales Landing Page', slug: 'landing-page', kwAr: 'صفحة هبوط, تصميم متجاوب, رفع التحويل, مسار مبيعات', kwEn: 'landing page, responsive HTML5 code, conversion design' },
  { ar: 'تحليل اقتصاديات الوحدة', en: 'Unit Economics Modeling', slug: 'unit-economics', kwAr: 'اقتصاديات الوحدة, هامش الربح, استدامة النمو', kwEn: 'unit economics, profit margin, scalable growth' },
  { ar: 'تحسين تكلفة الاستحواذ والقيمة الدائمة', en: 'CAC & LTV Optimization', slug: 'cac-ltv', kwAr: 'تكلفة الاستحواذ, القيمة الدائمة للعميل, عائد العميل', kwEn: 'CAC, LTV, customer acquisition cost, lifetime value' },
  { ar: 'حساب نقطة التعادل واسترداد رأس المال', en: 'Break-Even & Payback Analysis', slug: 'break-even', kwAr: 'نقطة التعادل, استرداد رأس المال, التكاليف الثابتة', kwEn: 'break-even analysis, ROI payback, fixed costs' },
  { ar: 'خطة تسويق تنفيذية لـ 90 يوماً', en: '90-Day Marketing Execution Plan', slug: '90-day-marketing', kwAr: 'خطة تسويق 90 يوماً, خارطة طريق, نمو المبيعات', kwEn: '90-day marketing plan, growth roadmap, sales plan' },
  { ar: 'تحليل سوات الاستراتيجي للمنافسة', en: 'Strategic SWOT & Competitive Analysis', slug: 'swot-analysis', kwAr: 'تحليل سوات, نقاط القوة والضعف, الفرص والتهديدات', kwEn: 'SWOT analysis, market opportunities, competitive edge' },
  { ar: 'توقعات التدفقات النقدية لـ 12 شهراً', en: '12-Month Cashflow Forecasting', slug: '12-month-cashflow', kwAr: 'تدفقات نقدية, ميزانية تشغيلية, 3 سيناريوهات', kwEn: '12-month cashflow, operating budget, 3 scenarios' },
  { ar: 'مضاعفة العائد على الإنفاق الإعلاني', en: 'ROAS & Ad Return Scaling', slug: 'roas-ads', kwAr: 'العائد الإعلاني, تحسين الإعلانات, كفاءة الميزانية', kwEn: 'ROAS, return on ad spend, ad scaling' },
  { ar: 'رفع معدل تحويل صفحات الهبوط', en: 'Landing Page Conversion Optimization', slug: 'landing-conversion', kwAr: 'معدل التحويل, تجربة المستخدم, قمع المبيعات', kwEn: 'CRO, landing page conversion, sales funnel UX' },
  { ar: 'أتمتة التسويق عبر البريد الإلكتروني', en: 'Automated Email Conversion Sequences', slug: 'email-automation', kwAr: 'أتمتة البريد, تسويق بالبريد, رسائل بيعية', kwEn: 'email automation, conversion sequence, drip campaign' },
  { ar: 'أتمتة إدارة علاقات العملاء', en: 'CRM & Lead Pipeline Automation', slug: 'crm-automation', kwAr: 'إدارة العملاء, جداول جوجل, تنبيهات واتساب', kwEn: 'CRM automation, Google Sheets CRM, WhatsApp alerts' },
  { ar: 'منظومة استقطاب وتوليد العملاء', en: 'Automated Lead Generation System', slug: 'lead-generation', kwAr: 'توليد العملاء, استقطاب العملاء, مبيعات مستمرة', kwEn: 'lead generation, customer acquisition, qualified leads' },
  { ar: 'هندسة قمع المبيعات الرقمي', en: 'Digital Sales Funnel Architecture', slug: 'sales-funnel', kwAr: 'قمع المبيعات, مسار الشراء, زيادة متوسط الطلب', kwEn: 'sales funnel, buyer journey, AOV optimization' },
  { ar: 'استراتيجيات النمو السريع للمشاريع', en: 'Rapid Business Growth Hacking', slug: 'growth-hacking', kwAr: 'نمو سريع, استراتيجيات التوسع, اختراق السوق', kwEn: 'growth hacking, rapid scaling, market penetration' },
  { ar: 'التسويق الرقمي المتكامل', en: 'Integrated Digital Marketing', slug: 'digital-marketing', kwAr: 'التسويق الرقمي, محتوى إعلاني, انتشار واسع', kwEn: 'digital marketing, content strategy, omni-channel' },
  { ar: 'استراتيجية التجارة الرقمية والدفع الإلكتروني', en: 'Digital Commerce & Checkout Strategy', slug: 'ecommerce-strategy', kwAr: 'تجارة رقمية, متجر إلكتروني, بوابات الدفع', kwEn: 'digital commerce, online store strategy, PayPal checkout' },
  { ar: 'خطة إطلاق المشروع الناشئ من الصفر', en: 'Zero-to-One Startup Launch Blueprint', slug: 'startup-launch', kwAr: 'إطلاق مشروع, خطة تأسيس, دراسة شاملة', kwEn: 'startup launch, business blueprint, MVP launch' }
];

const companyTypes = [
  { ar: 'متجر إلكتروني', en: 'Online Store', slug: 'online-store', mult: 1.0 },
  { ar: 'وكالة تسويق رقمي', en: 'Marketing Agency', slug: 'marketing-agency', mult: 1.45 },
  { ar: 'شركة ناشئة', en: 'Startup', slug: 'startup', mult: 1.2 },
  { ar: 'مستقل محترف', en: 'Freelancer', slug: 'freelancer', mult: 0.85 },
  { ar: 'وكالة تطوير برمجيات', en: 'Development Agency', slug: 'dev-agency', mult: 1.55 },
  { ar: 'شركة برمجيات سحابية', en: 'SaaS Company', slug: 'saas-company', mult: 1.35 },
  { ar: 'مشروع تجاري محلي', en: 'Local Business', slug: 'local-business', mult: 0.9 },
  { ar: 'علامة تجارية للبيع المباشر', en: 'D2C Brand', slug: 'd2c-brand', mult: 1.15 },
  { ar: 'مصنع وورشة إنتاج', en: 'Small Factory', slug: 'small-factory', mult: 1.6 },
  { ar: 'مكتب استشارات متخصص', en: 'Consulting Firm', slug: 'consulting-firm', mult: 1.3 }
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
  { ar: 'زيادة المبيعات بنسبة 300%', en: '300% Sales Growth', slug: '300-sales-increase' },
  { ar: 'خفض تكلفة الاستحواذ بنسبة 40%', en: '40% Lower CAC', slug: 'cac-reduction-40' },
  { ar: 'تحقيق عائد إعلاني بمقدار 5.2 ضعف', en: '5.2x ROAS Achievement', slug: 'roas-5-2x' },
  { ar: 'جذب أكثر من 1000 عميل في 60 يوماً', en: '1,000+ Customers in 60 Days', slug: '1000-customers-60-days' },
  { ar: 'تحقيق إيراد شهري يتجاوز 50 ألف دولار', en: '$50K+ Monthly Revenue', slug: '50k-monthly-revenue' },
  { ar: 'الوصول لنقطة التعادل خلال 14 يوماً', en: 'Break-Even in 14 Days', slug: 'break-even-14-days' },
  { ar: 'نسبة قيمة العميل إلى تكلفته تبلغ 4.8 ضعف', en: '4.8x LTV:CAC Ratio', slug: 'ltv-cac-4-8x' },
  { ar: 'معدل تحويل يتجاوز 8% من الزوار', en: '8%+ Conversion Rate', slug: '8-percent-conversion' }
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

const SHARED_CSS = `
:root{--bg:#060911;--card:#0f172a;--border:#1e293b;--text:#f1f5f9;--muted:#94a3b8;--cyan:#22d3ee;--emerald:#34d399;--violet:#a78bfa;--amber:#fbbf24}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:'Cairo','Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.75}
a{color:inherit;text-decoration:none}
.wrap{max-width:1040px;margin:0 auto;padding:0 18px}
.promo{background:linear-gradient(90deg,#0891b2,#2563eb,#7c3aed);color:#fff;text-align:center;font-size:12px;font-weight:700;padding:10px 16px}
header{position:sticky;top:0;z-index:40;background:rgba(6,9,17,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.nav{display:flex;align-items:center;justify-content:space-between;height:64px;gap:12px}
.brand{display:flex;align-items:center;gap:10px;font-weight:900}
.logo-box{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#22d3ee,#2563eb);color:#060911;display:flex;align-items:center;justify-content:center;font-weight:900}
.links{display:none;gap:18px;font-size:13px;font-weight:700;color:#cbd5e1}
@media(min-width:768px){.links{display:flex}}
.actions{display:flex;align-items:center;gap:8px}
.btn-lang{padding:8px 12px;border-radius:10px;background:var(--card);border:1px solid rgba(34,211,238,.4);color:var(--cyan);font-size:12px;font-weight:800}
.btn-cta{padding:9px 16px;border-radius:12px;background:linear-gradient(90deg,#06b6d4,#2563eb);color:#fff;font-size:13px;font-weight:800;display:inline-block}
.crumb{padding:18px 0 6px;font-size:12px;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px}
.hero{text-align:center;padding:22px 0 28px}
.pill{display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.3);color:var(--cyan);font-size:12px;font-weight:700;margin-bottom:14px}
h1{font-size:clamp(24px,4vw,42px);line-height:1.25;margin:0 0 14px;font-weight:900;color:#fff}
.lead{max-width:760px;margin:0 auto 20px;color:var(--muted);font-size:15px}
.hero-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.btn-sec{padding:10px 18px;border-radius:12px;background:var(--card);border:1px solid var(--border);color:#e2e8f0;font-size:13px;font-weight:700}
.kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:24px 0}
@media(min-width:640px){.kpis{grid-template-columns:repeat(4,1fr)}}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;text-align:center}
.kpi-lbl{font-size:11px;color:var(--muted);font-weight:700}
.kpi-val{font-size:22px;font-weight:900;margin-top:4px}
h2{font-size:22px;font-weight:900;color:#fff;margin:32px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(34,211,238,.25)}
.grid2{display:grid;gap:12px;margin:16px 0}
@media(min-width:700px){.grid2{grid-template-columns:repeat(2,1fr)}}
.grid3{display:grid;gap:12px;margin:16px 0}
@media(min-width:700px){.grid3{grid-template-columns:repeat(3,1fr)}}
.card{background:rgba(15,23,42,.85);border:1px solid var(--border);border-radius:16px;padding:16px}
.card-hi{background:rgba(8,51,68,.35);border:1px solid rgba(34,211,238,.45);border-radius:16px;padding:16px}
details.faq{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 16px;margin-bottom:10px}
details.faq summary{cursor:pointer;font-weight:800;color:var(--cyan);font-size:14px}
details.faq p{margin:10px 0 0;font-size:13px;color:#cbd5e1}
.mesh{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.mesh a{padding:7px 12px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;font-weight:700;color:var(--cyan)}
.cta-box{margin:34px 0;padding:28px 20px;border-radius:22px;background:linear-gradient(135deg,rgba(8,51,68,.55),var(--card),rgba(46,16,101,.45));border:1px solid rgba(34,211,238,.35);text-align:center}
footer{border-top:1px solid var(--border);padding:26px 0 40px;text-align:center;font-size:12px;color:var(--muted)}
`;

function buildUniqueBodyAr(c, kpi, angle, faqs) {
  const hooks = [
    `في بيئة الأعمال المتسارعة في <strong style="color:#fff">${esc(c.city.ar)}</strong>، تواجه مشاريع <strong style="color:var(--cyan)">${esc(c.comp.ar)}</strong> في قطاع <strong style="color:#fff">${esc(c.ind.ar)}</strong> تحدياً متكرراً يتمثل في ${esc(c.ind.painAr)}. تقدم منصة <strong style="color:var(--cyan)">فيلوزا (Veloza)</strong> حلاً تنفيذياً فورياً يجمع بين ${esc(c.top.ar)} والأتمتة الذكية للوصول إلى ${esc(c.succ.ar)}.`,
    `تشير معطيات السوق في <strong style="color:#fff">${esc(c.city.ar)} (${esc(c.city.countryAr)})</strong> إلى أن نجاح أي <strong style="color:var(--cyan)">${esc(c.comp.ar)}</strong> ضمن مجال <strong style="color:#fff">${esc(c.ind.ar)}</strong> يعتمد مباشرةً على ضبط اقتصاديات الوحدة وتنفيذ <strong style="color:#fff">${esc(c.top.ar)}</strong> باحترافية، خصوصاً عند معالجة ${esc(c.ind.painAr)}.`,
    `بدلاً من إنفاق مئات الدولارات والانتظار لأسابيع مع الوكالات التقليدية، تمنحك منصة <strong style="color:var(--cyan)">فيلوزا (Veloza)</strong> منظومة متكاملة لـ <strong style="color:#fff">${esc(c.top.ar)}</strong> مخصصة لـ ${esc(c.comp.ar)} في ${esc(c.city.ar)}، مصممة خصيصاً لقطاع ${esc(c.ind.ar)} بأسعار تبدأ من <strong style="color:var(--emerald)">9 دولارات فقط</strong>.`,
    `يتطلب التوسع في قطاع <strong style="color:#fff">${esc(c.ind.ar)}</strong> بمدينة <strong style="color:#fff">${esc(c.city.ar)}</strong> بناء بنية تسويقية ومالية متماسكة. عبر <strong style="color:var(--cyan)">فيلوزا</strong> تحصل على ${esc(c.top.ar)} متصلة مباشرةً بحملات <strong style="color:#fff">${esc(c.ind.channelAr)}</strong> ومسار أتمتة متكامل لتحقيق ${esc(c.succ.ar)}.`,
    `عند إطلاق أو تطوير <strong style="color:var(--cyan)">${esc(c.comp.ar)}</strong> في ${esc(c.city.ar)} ضمن قطاع ${esc(c.ind.ar)}، فإن الفارق بين المشروع المربح والمشروع المتعثر هو وضوح الأرقام قبل الإنفاق. هنا تبني لك <strong style="color:var(--cyan)">فيلوزا</strong> نموذج ${esc(c.top.ar)} متكاملاً خلال ثوانٍ.`
  ];

  const sectionTitles = [
    `لماذا تُعد ${esc(c.top.ar)} نقطة التحول لـ ${esc(c.comp.ar)} في ${esc(c.city.ar)}؟`,
    `المؤشرات المالية واقتصاديات الوحدة في قطاع ${esc(c.ind.ar)}`,
    `كيف تعالج ${esc(c.top.ar)} تحديات ${esc(c.ind.ar)} في ${esc(c.city.ar)}؟`,
    `خارطة الربحية والنمو لـ ${esc(c.comp.ar)} عبر منظومة فيلوزا`,
    `بناء الميزة التنافسية في سوق ${esc(c.city.ar)} لقطاع ${esc(c.ind.ar)}`
  ];

  return `
    <p>${hooks[angle]}</p>

    <div class="kpis">
      <div class="kpi"><div class="kpi-lbl">متوسط قيمة الطلب</div><div class="kpi-val" style="color:var(--cyan)">$${kpi.aov}</div></div>
      <div class="kpi"><div class="kpi-lbl">تكلفة الاستحواذ المستهدفة</div><div class="kpi-val" style="color:var(--amber)">$${kpi.cac}</div></div>
      <div class="kpi"><div class="kpi-lbl">نسبة القيمة الدائمة للتكلفة</div><div class="kpi-val" style="color:var(--emerald)">${kpi.ltvCac}x</div></div>
      <div class="kpi"><div class="kpi-lbl">نقطة التعادل المتوقعة</div><div class="kpi-val" style="color:var(--violet)">${kpi.breakEvenDays} يوماً</div></div>
    </div>

    <h2>${sectionTitles[angle]}</h2>
    <p>
      تُظهر حسابات منصة فيلوزا لهذا القطاع أن القيمة الدائمة المتوقعة للعميل الواحد تبلغ <strong style="color:#fff">$${kpi.ltv}</strong>، مع استهداف عائد على الإنفاق الإعلاني بمقدار <strong style="color:var(--emerald)">${kpi.roas} ضعف</strong>، وإيراد سنوي تقديري يصل إلى <strong style="color:var(--cyan)">$${kpi.annualRevenue.toLocaleString()}</strong> عند الالتزام بخارطة التنفيذ لـ 90 يوماً وتحليل السيناريوهات الثلاثة (المتحفظ والأساسي والتوسعي).
    </p>

    <h2>المنظومات التنفيذية الأربع المرتبطة بخدمات الموقع</h2>
    <div class="grid2">
      <div class="card">
        <strong style="color:#fff">1. دراسة الجدوى والنموذج المالي (PDF)</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">ملف احترافي جاهز للطباعة يتضمن جدول التدفقات النقدية لـ 12 شهراً، تحليل نقاط القوة والضعف والفرص، وحساب نقطة التعادل لقطاع ${esc(c.ind.ar)} في ${esc(c.city.ar)}.</p>
      </div>
      <div class="card">
        <strong style="color:#fff">2. منظومة الحملات الإعلانية وسلاسل البريد</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">نصوص وسيناريوهات إعلانية مصممة خصيصاً لمنصات <span style="color:var(--cyan)">${esc(c.ind.channelAr)}</span> مع 3 رسائل بريدية تحويلية لرفع المبيعات.</p>
      </div>
      <div class="card">
        <strong style="color:#fff">3. مسار الأتمتة الذكية (n8n و Make.com)</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">ملف أتمتة جاهز للاستيراد يطبّق عملياً: ${esc(c.ind.n8nAr)}، مع تصنيف العملاء وتنبيهات فورية عبر واتساب وتيليجرام.</p>
      </div>
      <div class="card">
        <strong style="color:#fff">4. كود صفحة الهبوط البيعية المتجاوبة</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">كود نظيف متجاوب مع جميع الشاشات مخصص لـ ${esc(c.comp.ar)} يشمل أقسام العرض والباقات والأسئلة الشائعة ونموذج الطلب الفوري.</p>
      </div>
    </div>

    <h2>باقات التنفيذ الاقتصادية (دفعة واحدة مع ضمان باي بال 14 يوماً)</h2>
    <div class="grid3">
      <div class="card">
        <strong style="color:#fff">باقة البداية السريعة — $9</strong>
        <p style="font-size:13px;color:#94a3b8;margin:6px 0 0">دراسة الجدوى المالية + الحملات الإعلانية + 3 رسائل بريدية + خطة أول 30 يوماً.</p>
      </div>
      <div class="card-hi">
        <strong style="color:var(--cyan)">باقة النمو الشاملة (الأكثر مبيعاً) — $19</strong>
        <p style="font-size:13px;color:#e2e8f0;margin:6px 0 0">جميع المنظومات الأربع كاملة: الدراسة المتقدمة + الإعلانات + ملف الأتمتة + كود صفحة الهبوط + خطة 90 يوماً.</p>
      </div>
      <div class="card">
        <strong style="color:var(--violet)">باقة الوكالات والشركات — $39</strong>
        <p style="font-size:13px;color:#94a3b8;margin:6px 0 0">نموذج استثماري لـ 12 شهراً + 3 مسارات أتمتة + رخصة تجارية لإعادة البيع للعملاء.</p>
      </div>
    </div>

    <h2>الأسئلة الشائعة حول ${esc(c.top.ar)} في ${esc(c.city.ar)}</h2>
    ${faqs.map((f) => `<details class="faq"><summary>${esc(f.qAr)}</summary><p>${esc(f.aAr)}</p></details>`).join('\n    ')}
  `;
}

function buildUniqueBodyEn(c, kpi, angle, faqs) {
  const hooks = [
    `In the fast-moving <strong style="color:#fff">${esc(c.city.en)}</strong> market, every <strong style="color:var(--cyan)">${esc(c.comp.en)}</strong> in <strong style="color:#fff">${esc(c.ind.en)}</strong> faces a core growth obstacle: ${esc(c.ind.painEn)}. <strong style="color:var(--cyan)">Veloza Enterprise OS</strong> bridges this gap with an instant, data-backed <strong style="color:#fff">${esc(c.top.en)}</strong> built to deliver ${esc(c.succ.en)}.`,
    `Market benchmarks across <strong style="color:#fff">${esc(c.city.en)} (${esc(c.city.countryEn)})</strong> show that scaling a <strong style="color:var(--cyan)">${esc(c.comp.en)}</strong> in <strong style="color:#fff">${esc(c.ind.en)}</strong> depends on disciplined Unit Economics and a tailored <strong style="color:#fff">${esc(c.top.en)}</strong> that directly solves ${esc(c.ind.painEn)}.`,
    `Instead of paying thousands to slow agencies and waiting weeks, <strong style="color:var(--cyan)">Veloza Enterprise OS</strong> generates a complete <strong style="color:#fff">${esc(c.top.en)}</strong> customized for your ${esc(c.comp.en)} in ${esc(c.city.en)} in seconds—starting at just <strong style="color:var(--emerald)">$9</strong>.`,
    `Winning market share in <strong style="color:#fff">${esc(c.ind.en)}</strong> across <strong style="color:#fff">${esc(c.city.en)}</strong> requires connecting financial clarity with high-converting <strong style="color:#fff">${esc(c.ind.channelEn)}</strong> campaigns and automated follow-ups to achieve ${esc(c.succ.en)}.`,
    `Before scaling ad spend for a <strong style="color:var(--cyan)">${esc(c.comp.en)}</strong> in ${esc(c.city.en)}, founders need verified Unit Economics. <strong style="color:var(--cyan)">Veloza</strong> models your entire <strong style="color:#fff">${esc(c.top.en)}</strong> and execution stack in one instant delivery.`
  ];

  const sectionTitles = [
    `Why ${esc(c.top.en)} Is Critical for ${esc(c.comp.en)} Growth in ${esc(c.city.en)}`,
    `Unit Economics & Financial Benchmarks for ${esc(c.ind.en)}`,
    `Solving ${esc(c.ind.en)} Bottlenecks in ${esc(c.city.en)} with ${esc(c.top.en)}`,
    `Profitability & Scaling Roadmap via Veloza Enterprise OS`,
    `Building a Competitive Moat in ${esc(c.city.en)} for ${esc(c.ind.en)}`
  ];

  return `
    <p>${hooks[angle]}</p>

    <div class="kpis">
      <div class="kpi"><div class="kpi-lbl">Target AOV</div><div class="kpi-val" style="color:var(--cyan)">$${kpi.aov}</div></div>
      <div class="kpi"><div class="kpi-lbl">Target CAC</div><div class="kpi-val" style="color:var(--amber)">$${kpi.cac}</div></div>
      <div class="kpi"><div class="kpi-lbl">LTV:CAC Ratio</div><div class="kpi-val" style="color:var(--emerald)">${kpi.ltvCac}x</div></div>
      <div class="kpi"><div class="kpi-lbl">Est. Break-Even</div><div class="kpi-val" style="color:var(--violet)">${kpi.breakEvenDays} Days</div></div>
    </div>

    <h2>${sectionTitles[angle]}</h2>
    <p>
      Veloza's sector model projects a Customer Lifetime Value of <strong style="color:#fff">$${kpi.ltv}</strong>, a target ad efficiency of <strong style="color:var(--emerald)">${kpi.roas}x ROAS</strong>, and an estimated 12-month revenue run-rate of <strong style="color:var(--cyan)">$${kpi.annualRevenue.toLocaleString()}</strong> when executing the 90-day roadmap across conservative, base, and expansion scenarios.
    </p>

    <h2>4 Core Deliverables Aligned With Veloza Services</h2>
    <div class="grid2">
      <div class="card">
        <strong style="color:#fff">1. 12-Month Feasibility PDF Study</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">Print-ready financial model featuring 12-month cashflow projections, SWOT matrix, and break-even modeling tailored to ${esc(c.ind.en)} in ${esc(c.city.en)}.</p>
      </div>
      <div class="card">
        <strong style="color:#fff">2. Multi-Platform Ad Suite & Email Sequence</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">Conversion-tested ad copy and scripts for <span style="color:var(--cyan)">${esc(c.ind.channelEn)}</span> paired with a 3-part email sales sequence.</p>
      </div>
      <div class="card">
        <strong style="color:#fff">3. n8n & Make.com Automation Workflow (JSON)</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">Importable 7-node pipeline engineered for ${esc(c.ind.n8nEn)}, complete with CRM sync and instant owner alerts.</p>
      </div>
      <div class="card">
        <strong style="color:#fff">4. Responsive Sales Landing Page Code</strong>
        <p style="font-size:13px;color:#cbd5e1;margin:6px 0 0">Production-ready HTML5 + Tailwind CSS funnel built for your ${esc(c.comp.en)} with pricing tiers, FAQ, and order capture.</p>
      </div>
    </div>

    <h2>Transparent One-Time Pricing (14-Day PayPal Protection)</h2>
    <div class="grid3">
      <div class="card">
        <strong style="color:#fff">Starter Launch — $9</strong>
        <p style="font-size:13px;color:#94a3b8;margin:6px 0 0">Feasibility PDF + Ad Campaigns + 3-Email Sequence + 30-Day Launch Roadmap.</p>
      </div>
      <div class="card-hi">
        <strong style="color:var(--cyan)">Growth Pro (Best Seller) — $19</strong>
        <p style="font-size:13px;color:#e2e8f0;margin:6px 0 0">All 4 complete systems: Advanced Financials + Ads + n8n JSON + Landing Page Code + 90-Day Masterplan.</p>
      </div>
      <div class="card">
        <strong style="color:var(--violet)">Agency VIP Scale — $39</strong>
        <p style="font-size:13px;color:#94a3b8;margin:6px 0 0">12-Month Investor Model + 3 Automation Workflows + White-Label Commercial License.</p>
      </div>
    </div>

    <h2>Frequently Asked Questions</h2>
    ${faqs.map((f) => `<details class="faq"><summary>${esc(f.qEn)}</summary><p>${esc(f.aEn)}</p></details>`).join('\n    ')}
  `;
}

function buildPageData(globalIdx) {
  const c = getCombo(globalIdx);
  const slug = buildSlug(c, globalIdx);
  const seed = hash(slug);
  const angle = seed % 5;
  const kpi = computeKpis(c, seed);

  const urlAr = `${SITE}/seo/${slug}/`;
  const urlEn = `${SITE}/seo/${slug}/en/`;

  const titleAr = `${c.top.ar} لقطاع ${c.ind.ar} — دليل ${c.comp.ar} في ${c.city.ar} | فيلوزا`;
  const titleEn = `${c.top.en} for ${c.ind.en} — ${c.comp.en} Guide in ${c.city.en} | Veloza`;

  const h1Ar = `${c.top.ar} في قطاع ${c.ind.ar}: خطة تنفيذية متكاملة لـ ${c.comp.ar} في ${c.city.ar}`;
  const h1En = `${c.top.en} for ${c.ind.en}: Execution Blueprint for ${c.comp.en} in ${c.city.en}`;

  const descAr = `احصل على ${c.top.ar} لمشروع ${c.comp.ar} في ${c.ind.ar} بمدينة ${c.city.ar} عبر منصة فيلوزا: دراسة جدوى PDF، حملات إعلانية، أتمتة n8n، وصفحة هبوط بدءاً من $9 لتحقيق ${c.succ.ar}.`;
  const descEn = `Build a complete ${c.top.en} for your ${c.comp.en} in ${c.ind.en} (${c.city.en}) with Veloza: 12-month feasibility PDF, ad suite, n8n JSON, and landing page code from $9 for ${c.succ.en}.`;

  const keywordsAr = `${c.top.ar}, ${c.ind.ar}, ${c.comp.ar}, ${c.city.ar}, ${c.city.countryAr}, ${c.top.kwAr}, ${c.ind.lsiAr}, ${c.succ.ar}, منصة فيلوزا, دراسة جدوى اقتصادية, أتمتة الأعمال, حملات إعلانية, صفحة هبوط`;
  const keywordsEn = `${c.top.en}, ${c.ind.en}, ${c.comp.en}, ${c.city.en}, ${c.city.countryEn}, ${c.top.kwEn}, ${c.ind.lsiEn}, ${c.succ.en}, Veloza Enterprise OS, business automation, unit economics`;

  const faqs = [
    {
      qAr: `كيف تساعد منصة فيلوزا مشروع ${c.comp.ar} في قطاع ${c.ind.ar} بمدينة ${c.city.ar}؟`,
      aAr: `تولّد منصة فيلوزا خلال ثوانٍ أربع منظومات متكاملة مخصصة لـ ${c.comp.ar} في ${c.city.ar}: دراسة جدوى مالية لـ 12 شهراً، حملات إعلانية لمنصات ${c.ind.channelAr}، ملف أتمتة لإنجاز ${c.ind.n8nAr}، وكود صفحة هبوط بيعية بأسعار تبدأ من 9 دولارات فقط.`,
      qEn: `How does Veloza help a ${c.comp.en} in ${c.ind.en} (${c.city.en})?`,
      aEn: `Veloza generates 4 tailored systems in seconds for your ${c.comp.en} in ${c.city.en}: a 12-month financial feasibility PDF, ad campaigns for ${c.ind.channelEn}, an n8n JSON workflow for ${c.ind.n8nEn}, and responsive landing page code starting at $9.`
    },
    {
      qAr: `ما هي مؤشرات اقتصاديات الوحدة المتوقعة لـ ${c.top.ar} في ${c.ind.ar}؟`,
      aAr: `تشير تقديرات نموذج فيلوزا لهذا القطاع إلى متوسط طلب قدره $${kpi.aov}، وتكلفة استحواذ مستهدفة $${kpi.cac}، وقيمة دائمة للعميل $${kpi.ltv} بنسبة ${kpi.ltvCac} ضعف، مع نقطة تعادل متوقعة خلال ${kpi.breakEvenDays} يوماً.`,
      qEn: `What are the benchmark Unit Economics for ${c.top.en} in ${c.ind.en}?`,
      aEn: `Veloza's sector model projects an AOV of $${kpi.aov}, target CAC of $${kpi.cac}, customer LTV of $${kpi.ltv} (${kpi.ltvCac}x LTV:CAC ratio), and an estimated break-even window of ${kpi.breakEvenDays} days.`
    },
    {
      qAr: `ما هي الباقة الأنسب من فيلوزا لتنفيذ ${c.top.ar} بأمان؟`,
      aAr: `تقدم فيلوزا باقة البداية ($9) للدراسة والإعلانات، وباقة النمو الشاملة ($19 الأكثر مبيعاً) لجميع المنظومات الأربع مع ملف الأتمتة وكود الموقع، وباقة الوكالات ($39) مع رخصة إعادة البيع التجاري وضمان باي بال لمدة 14 يوماً.`,
      qEn: `Which Veloza plan fits launching ${c.top.en}?`,
      aEn: `Veloza offers Starter Launch ($9) for feasibility & ads, Growth Pro ($19 — Best Seller) for all 4 deliverables including n8n JSON and landing page code, and Agency VIP ($39) with a White-Label commercial license and 14-day PayPal protection.`
    }
  ];

  const relatedOffsets = [1, 13, 47, 131];
  const internalLinks = relatedOffsets.map((step) => {
    const targetIdx = START_OFFSET + ((globalIdx - START_OFFSET + step) % COUNT);
    const tc = getCombo(targetIdx);
    const tSlug = buildSlug(tc, targetIdx);
    return {
      hrefAr: `/seo/${tSlug}/`,
      hrefEn: `/seo/${tSlug}/en/`,
      labelAr: `${tc.top.ar} — ${tc.ind.ar} (${tc.city.ar})`,
      labelEn: `${tc.top.en} — ${tc.ind.en} (${tc.city.en})`
    };
  });

  const bodyAr = buildUniqueBodyAr(c, kpi, angle, faqs);
  const bodyEn = buildUniqueBodyEn(c, kpi, angle, faqs);

  const jsonLdAr = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: titleAr,
        description: descAr,
        url: urlAr,
        inLanguage: 'ar',
        datePublished: '2026-11-15',
        dateModified: '2026-11-15',
        author: { '@type': 'Organization', name: 'منصة فيلوزا (Veloza Enterprise OS)', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'Veloza Enterprise OS', logo: { '@type': 'ImageObject', url: `${SITE}/veloza-logo.png` } },
        image: `${SITE}/veloza-logo.png`,
        keywords: keywordsAr
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'مركز الحلول والقطاعات', item: `${SITE}/seo/` },
          { '@type': 'ListItem', position: 3, name: `${c.ind.ar} - ${c.city.ar}`, item: urlAr }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.qAr, acceptedAnswer: { '@type': 'Answer', text: f.aAr } }))
      },
      {
        '@type': 'Service',
        name: `${c.top.ar} لقطاع ${c.ind.ar}`,
        provider: { '@type': 'Organization', name: 'Veloza Enterprise OS' },
        areaServed: c.city.countryAr,
        offers: { '@type': 'AggregateOffer', lowPrice: '9', highPrice: '39', priceCurrency: 'USD' }
      }
    ]
  };

  const jsonLdEn = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: titleEn,
        description: descEn,
        url: urlEn,
        inLanguage: 'en',
        datePublished: '2026-11-15',
        dateModified: '2026-11-15',
        author: { '@type': 'Organization', name: 'Veloza Enterprise OS', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'Veloza Enterprise OS', logo: { '@type': 'ImageObject', url: `${SITE}/veloza-logo.png` } },
        image: `${SITE}/veloza-logo.png`,
        keywords: keywordsEn
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Solutions Hub', item: `${SITE}/seo/en/` },
          { '@type': 'ListItem', position: 3, name: `${c.ind.en} - ${c.city.en}`, item: urlEn }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.qEn, acceptedAnswer: { '@type': 'Answer', text: f.aEn } }))
      },
      {
        '@type': 'Service',
        name: `${c.top.en} for ${c.ind.en}`,
        provider: { '@type': 'Organization', name: 'Veloza Enterprise OS' },
        areaServed: c.city.countryEn,
        offers: { '@type': 'AggregateOffer', lowPrice: '9', highPrice: '39', priceCurrency: 'USD' }
      }
    ]
  };

  return { c, slug, urlAr, urlEn, titleAr, titleEn, h1Ar, h1En, descAr, descEn, keywordsAr, keywordsEn, bodyAr, bodyEn, internalLinks, jsonLdAr, jsonLdEn };
}

function renderArHtml(p) {
  const links = p.internalLinks.map((l) => `<a href="${l.hrefAr}">${esc(l.labelAr)}</a>`).join('\n        ');
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.titleAr)}</title>
  <meta name="description" content="${esc(p.descAr)}" />
  <meta name="keywords" content="${esc(p.keywordsAr)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${p.urlAr}" />
  <link rel="alternate" hreflang="ar" href="${p.urlAr}" />
  <link rel="alternate" hreflang="en" href="${p.urlEn}" />
  <link rel="alternate" hreflang="x-default" href="${p.urlAr}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Veloza Enterprise OS" />
  <meta property="og:locale" content="ar_AR" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:url" content="${p.urlAr}" />
  <meta property="og:title" content="${esc(p.titleAr)}" />
  <meta property="og:description" content="${esc(p.descAr)}" />
  <meta property="og:image" content="${SITE}/veloza-logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.titleAr)}" />
  <meta name="twitter:description" content="${esc(p.descAr)}" />
  <meta name="twitter:image" content="${SITE}/veloza-logo.png" />
  <script type="application/ld+json">${JSON.stringify(p.jsonLdAr)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="promo">${esc(p.titleAr)}</div>
  <header>
    <div class="wrap nav">
      <a href="/" class="brand"><span class="logo-box">V</span><span>VELOZA</span></a>
      <nav class="links">
        <a href="/">الرئيسية</a>
        <a href="/seo/">دليل القطاعات</a>
        <a href="/#services">الخدمات</a>
        <a href="/#pricing">الباقات ($9-$39)</a>
      </nav>
      <div class="actions">
        <a href="/seo/${p.slug}/en/" class="btn-lang" hreflang="en">English</a>
        <a href="/#builder" class="btn-cta">ابدأ الآن ($9)</a>
      </div>
    </div>
  </header>
  <main class="wrap">
    <nav aria-label="مسار التنقل" class="crumb">
      <a href="/">الرئيسية</a><span>/</span>
      <a href="/seo/">مركز الحلول</a><span>/</span>
      <span style="color:var(--cyan);font-weight:700">${esc(p.c.ind.ar)} • ${esc(p.c.city.ar)}</span>
    </nav>
    <section class="hero">
      <span class="pill">${esc(p.c.top.ar)} • ${esc(p.c.ind.ar)} • ${esc(p.c.city.ar)}</span>
      <h1>${esc(p.h1Ar)}</h1>
      <p class="lead">${esc(p.descAr)}</p>
      <div class="hero-btns">
        <a href="/#builder" class="btn-cta">احصل على حزمتك المخصصة الآن ($9+)</a>
        <a href="/seo/" class="btn-sec">تصفح جميع القطاعات</a>
      </div>
    </section>
    <article>${p.bodyAr}</article>
    <section class="card" style="margin-top:26px">
      <strong style="color:var(--cyan);font-size:14px">صفحات وأدلة مرتبطة بهذا القطاع</strong>
      <div class="mesh">
        ${links}
        <a href="/">الصفحة الرئيسية</a>
        <a href="/#builder">بناء حزمتك الآن</a>
      </div>
    </section>
    <section class="cta-box">
      <h2 style="border:0;margin:0 0 8px">هل أنت مستعد لإطلاق مشروعك في ${esc(p.c.ind.ar)}؟</h2>
      <p style="color:#cbd5e1;font-size:14px;margin:0 0 18px">استلم دراسة الجدوى، الحملات الإعلانية، أتمتة n8n، وكود صفحة الهبوط في ثوانٍ بضمان PayPal.</p>
      <a href="/#builder" class="btn-cta">ابدأ البناء الآن</a>
    </section>
  </main>
  <footer>
    <div class="wrap">© 2026 Veloza Enterprise OS • <a href="mailto:veloza.admin@gmail.com" style="color:var(--cyan)" dir="ltr">veloza.admin@gmail.com</a></div>
  </footer>
</body>
</html>`;
}

function renderEnHtml(p) {
  const links = p.internalLinks.map((l) => `<a href="${l.hrefEn}">${esc(l.labelEn)}</a>`).join('\n        ');
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.titleEn)}</title>
  <meta name="description" content="${esc(p.descEn)}" />
  <meta name="keywords" content="${esc(p.keywordsEn)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${p.urlEn}" />
  <link rel="alternate" hreflang="en" href="${p.urlEn}" />
  <link rel="alternate" hreflang="ar" href="${p.urlAr}" />
  <link rel="alternate" hreflang="x-default" href="${p.urlAr}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Veloza Enterprise OS" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="ar_AR" />
  <meta property="og:url" content="${p.urlEn}" />
  <meta property="og:title" content="${esc(p.titleEn)}" />
  <meta property="og:description" content="${esc(p.descEn)}" />
  <meta property="og:image" content="${SITE}/veloza-logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.titleEn)}" />
  <meta name="twitter:description" content="${esc(p.descEn)}" />
  <meta name="twitter:image" content="${SITE}/veloza-logo.png" />
  <script type="application/ld+json">${JSON.stringify(p.jsonLdEn)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="promo">${esc(p.titleEn)}</div>
  <header>
    <div class="wrap nav">
      <a href="/" class="brand"><span class="logo-box">V</span><span>VELOZA</span></a>
      <nav class="links">
        <a href="/">Home</a>
        <a href="/seo/en/">Solutions Hub</a>
        <a href="/#services">Services</a>
        <a href="/#pricing">Pricing ($9-$39)</a>
      </nav>
      <div class="actions">
        <a href="/seo/${p.slug}/" class="btn-lang" hreflang="ar">العربية</a>
        <a href="/#builder" class="btn-cta">Start Now ($9)</a>
      </div>
    </div>
  </header>
  <main class="wrap">
    <nav aria-label="Breadcrumb" class="crumb">
      <a href="/">Home</a><span>/</span>
      <a href="/seo/en/">Solutions Hub</a><span>/</span>
      <span style="color:var(--cyan);font-weight:700">${esc(p.c.ind.en)} • ${esc(p.c.city.en)}</span>
    </nav>
    <section class="hero">
      <span class="pill">${esc(p.c.top.en)} • ${esc(p.c.ind.en)} • ${esc(p.c.city.en)}</span>
      <h1>${esc(p.h1En)}</h1>
      <p class="lead">${esc(p.descEn)}</p>
      <div class="hero-btns">
        <a href="/#builder" class="btn-cta">Get Your Custom Package ($9+)</a>
        <a href="/seo/en/" class="btn-sec">Browse All Industries</a>
      </div>
    </section>
    <article>${p.bodyEn}</article>
    <section class="card" style="margin-top:26px">
      <strong style="color:var(--cyan);font-size:14px">Related Industry Guides &amp; Solutions</strong>
      <div class="mesh">
        ${links}
        <a href="/">Veloza Home</a>
        <a href="/#builder">Build Your Package</a>
      </div>
    </section>
    <section class="cta-box">
      <h2 style="border:0;margin:0 0 8px">Ready to launch your ${esc(p.c.ind.en)} business?</h2>
      <p style="color:#cbd5e1;font-size:14px;margin:0 0 18px">Receive your Feasibility PDF, Ad Campaigns, n8n Automation, and Landing Page Code in seconds with PayPal protection.</p>
      <a href="/#builder" class="btn-cta">Start Building Now</a>
    </section>
  </main>
  <footer>
    <div class="wrap">© 2026 Veloza Enterprise OS • <a href="mailto:veloza.admin@gmail.com" style="color:var(--cyan)">veloza.admin@gmail.com</a></div>
  </footer>
</body>
</html>`;
}

function buildHubHtml(lang, samplePages) {
  const isAr = lang === 'ar';
  const cards = industries.map((ind, idx) => {
    const s = samplePages[idx] || samplePages[0];
    const href = isAr ? `/seo/${s.slug}/` : `/seo/${s.slug}/en/`;
    return `<a href="${href}" class="card" style="display:block">
      <strong style="color:#fff;font-size:14px">${esc(isAr ? ind.ar : ind.en)}</strong>
      <div style="font-size:12px;color:var(--cyan);margin-top:4px">${esc(isAr ? ind.channelAr : ind.channelEn)}</div>
    </a>`;
  }).join('\n');
  const featured = samplePages.slice(0, 48).map((s) => {
    const href = isAr ? `/seo/${s.slug}/` : `/seo/${s.slug}/en/`;
    return `<a href="${href}" class="card" style="display:block;font-size:12px;font-weight:700;color:var(--cyan)">${esc(isAr ? s.titleAr : s.titleEn)}</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${isAr ? 'مركز الحلول والقطاعات — 20,000+ دليل متخصص | فيلوزا' : 'Veloza Industry Solutions Hub — 20,000+ Guides'}</title>
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${SITE}/seo/${isAr ? '' : 'en/'}" />
  <link rel="alternate" hreflang="ar" href="${SITE}/seo/" />
  <link rel="alternate" hreflang="en" href="${SITE}/seo/en/" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>${SHARED_CSS}</style>
</head>
<body>
  <header><div class="wrap nav">
    <a href="/" class="brand"><span class="logo-box">V</span><span>VELOZA HUB</span></a>
    <div class="actions">
      <a href="${isAr ? '/seo/en/' : '/seo/'}" class="btn-lang">${isAr ? 'English' : 'العربية'}</a>
      <a href="/#builder" class="btn-cta">${isAr ? 'ابدأ الآن ($9)' : 'Start Now ($9)'}</a>
    </div>
  </div></header>
  <main class="wrap">
    <section class="hero">
      <span class="pill">${isAr ? '20,000 صفحة عربية + 20,000 صفحة إنجليزية بدون امتداد .html' : '20,000 Arabic + 20,000 English Clean-URL Pages'}</span>
      <h1>${isAr ? 'مركز فيلوزا للقطاعات ودراسات الجدوى والأتمتة' : 'Veloza Industry Solutions & Feasibility Hub'}</h1>
      <p class="lead">${isAr ? 'روابط حديثة نظيفة محسّنة لمحركات البحث ومرتبطة مباشرةً بخدمات فيلوزا الأربع.' : 'Modern extensionless SEO guides engineered for Google indexing and connected directly to Veloza services.'}</p>
    </section>
    <h2>${isAr ? 'القطاعات المغطاة (25 قطاعاً)' : 'Covered Industries (25 Sectors)'}</h2>
    <div class="grid3">${cards}</div>
    <h2>${isAr ? 'أدلة مختارة' : 'Featured Guides'}</h2>
    <div class="grid3">${featured}</div>
  </main>
</body>
</html>`;
}

// ---- Cleanup old flat .html files from previous 52000..71999 batch ----
console.log('🧹 Cleaning old flat .html files for batch 52000..71999 (if present)...');
let cleaned = 0;
for (const f of fs.readdirSync(OUTPUT_DIR)) {
  if (f.endsWith('.html') && /-([56][0-9]{4}|7[01][0-9]{3})\.html$/.test(f)) {
    fs.unlinkSync(path.join(OUTPUT_DIR, f));
    cleaned++;
  }
}
console.log(`   Removed ${cleaned} legacy .html files.`);

console.log(`🚀 Generating ${COUNT.toLocaleString()} clean-URL AR + EN page pairs (${(COUNT * 2).toLocaleString()} HTML files)...`);
const t0 = Date.now();

const urlsPart1 = [];
const urlsPart2 = [];
const samplePages = [];
const manifestEntries = [];

for (let i = 0; i < COUNT; i++) {
  const globalIdx = START_OFFSET + i;
  const p = buildPageData(globalIdx);

  const dirAr = path.join(OUTPUT_DIR, p.slug);
  const dirEn = path.join(dirAr, 'en');
  fs.mkdirSync(dirEn, { recursive: true });

  fs.writeFileSync(path.join(dirAr, 'index.html'), renderArHtml(p), 'utf8');
  fs.writeFileSync(path.join(dirEn, 'index.html'), renderEnHtml(p), 'utf8');

  if (i < 60) {
    samplePages.push({ slug: p.slug, titleAr: p.titleAr, titleEn: p.titleEn });
  }
  manifestEntries.push({ slug: p.slug, urlAr: p.urlAr, urlEn: p.urlEn });

  const xmlEntry = `  <url>
    <loc>${p.urlAr}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${p.urlAr}" />
    <xhtml:link rel="alternate" hreflang="en" href="${p.urlEn}" />
    <lastmod>2026-11-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${p.urlEn}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${p.urlEn}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${p.urlAr}" />
    <lastmod>2026-11-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  if (i < 10000) urlsPart1.push(xmlEntry);
  else urlsPart2.push(xmlEntry);

  if ((i + 1) % 2500 === 0) {
    console.log(`  ✔ ${(i + 1).toLocaleString()}/${COUNT.toLocaleString()} pairs (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
}

// Hubs
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), buildHubHtml('ar', samplePages), 'utf8');
fs.mkdirSync(path.join(OUTPUT_DIR, 'en'), { recursive: true });
fs.writeFileSync(path.join(OUTPUT_DIR, 'en', 'index.html'), buildHubHtml('en', samplePages), 'utf8');

// Manifest
fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest-20k.json'), JSON.stringify(manifestEntries), 'utf8');

const wrapXhtmlSitemap = (entries) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-20k-1.xml'), wrapXhtmlSitemap(urlsPart1), 'utf8');
fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-20k-2.xml'), wrapXhtmlSitemap(urlsPart2), 'utf8');

const mainSitemap = wrapXhtmlSitemap([
  `  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>2026-11-15</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  `  <url>\n    <loc>${SITE}/seo/</loc>\n    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}/seo/" />\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/seo/en/" />\n    <lastmod>2026-11-15</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`,
  `  <url>\n    <loc>${SITE}/seo/en/</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/seo/en/" />\n    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}/seo/" />\n    <lastmod>2026-11-15</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
]);
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap-main.xml'), mainSitemap, 'utf8');

// Also update seo/sitemap-seo.xml with the first 20k Arabic clean URLs (plus original 21)
const orig21 = fs.readdirSync(OUTPUT_DIR).filter((f) => /-([0-9]|1[0-9]|20)\.html$/.test(f)).sort();
const seoSitemapEntries = [
  ...orig21.map((f) => `  <url>\n    <loc>${SITE}/seo/${f}</loc>\n    <lastmod>2026-11-15</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`),
  ...manifestEntries.map((m) => `  <url>\n    <loc>${m.urlAr}</loc>\n    <lastmod>2026-11-15</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
];
fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-seo.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${seoSitemapEntries.join('\n')}\n</urlset>\n`, 'utf8');

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${SITE}/sitemap-main.xml</loc>\n    <lastmod>2026-11-15</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${SITE}/seo/sitemap-20k-1.xml</loc>\n    <lastmod>2026-11-15</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${SITE}/seo/sitemap-20k-2.xml</loc>\n    <lastmod>2026-11-15</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${SITE}/seo/sitemap-seo.xml</loc>\n    <lastmod>2026-11-15</lastmod>\n  </sitemap>\n</sitemapindex>\n`;
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapIndex, 'utf8');

console.log(`✅ Done in ${((Date.now() - t0) / 1000).toFixed(1)}s! Generated ${(COUNT * 2).toLocaleString()} clean-URL pages.`);
