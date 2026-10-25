const fs = require('fs');

// Read app.js to extract parseLegalText
const appJs = fs.readFileSync('C:\\Users\\saad7\\.gemini\\antigravity\\scratch\\iraqi_lawyer_petitions\\app.js', 'utf8');

// Evaluate the parseLegalText function
const fnMatch = appJs.match(/function parseLegalText\(text\) \{[\s\S]*?\n\}/);
if (!fnMatch) {
  console.error("Could not find parseLegalText in app.js");
  process.exit(1);
}

const parseLegalText = new Function('text', fnMatch[0] + '\nreturn parseLegalText(text);');

// Test Case 1: Standard AI response format with introductory text
const testCase1 = `
تفضل أستاذ سعد، إليك صياغة العريضة الأصولية:

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

إلى / السيد قاضي محكمة تحقيق بغداد الجديدة المحترم

المشتكي: أحمد جاسم محمد العبيدي
عنوانه: بغداد - الغدير - محلة 704 زقاق 15 دار 2 - هاتف: 07701234567

المشكو منه: سامر خليل إبراهيم الدليمي
عنوانه: بغداد - المشتل - قرب تقاطع المسبح

الموضوع: م / شكوى جزائية وفق أحكام المادة (456) ق.ع

تحية طيبة واحترام /

أعرض لعدالتكم الموقرة بأنه بتاريخ 12/10/2026 قام المشكو منه بالاحتيال علي والاستيلاء على مبلغ قدره عشرة ملايين دينار عراقي بحجة استثمارها في مشروع تجاري وهمي.
وحيث أن فعله هذا يشكل جريمة النصب والاحتيال المعاقب عليها بموجب المادة 456 من قانون العقوبات العراقي،
لذا ألتمس من عدالتكم بكل رجاء:
1- اتخاذ الإجراءات القانونية بحقه وإصدار أمر قبض بحقه.
2- تدوين أقوالي كمشتكٍ وتدوين شهادة الشهود.
3- إلزامه بإعادة المبلغ المستولى عليه.

ولعدالتكم فائق التقدير والاحترام

المشتكي / وكيله المحامي سعد فراس أميل
التاريخ: 25 / 10 / 2026 م
`;

console.log("=== Testing Test Case 1 ===");
const res1 = parseLegalText(testCase1);
console.log("Court:", res1.court);
console.log("Complainant:", res1.complainant);
console.log("Complainant Address:", res1.complainantAddress);
console.log("Defendant:", res1.defendant);
console.log("Defendant Address:", res1.defendantAddress);
console.log("Subject:", res1.subject);
console.log("Date:", res1.date);
console.log("Signature:", res1.signature);
console.log("Body length:", res1.body.length);
console.log("Body sample:\n", res1.body.substring(0, 150) + "...");

// Test Case 2: One-line party + address with slashes
const testCase2 = `
السيد قاضي محكمة بداءة الكرخ المحترم
المدعي: حسن علي كريم / الساكن: المنصور - شارع 14 رمضان
المدعى عليه: شركة الفرات للتجارة / مقرها: بغداد - الكرادة
م / دعوى مطالبة بمبلغ دين
أعرض لعدالتكم ما يلي...
لذا أطلب الحكم بإلزامه بدفع المبلغ.
وكيل المدعي المحامي سعد فراس أميل
التاريخ: 2026/11/01
`;

console.log("\n=== Testing Test Case 2 ===");
const res2 = parseLegalText(testCase2);
console.log("Court:", res2.court);
console.log("Complainant:", res2.complainant);
console.log("Complainant Address:", res2.complainantAddress);
console.log("Defendant:", res2.defendant);
console.log("Defendant Address:", res2.defendantAddress);
console.log("Subject:", res2.subject);
console.log("Date:", res2.date);
console.log("Signature:", res2.signature);
