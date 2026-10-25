function stripDiacritics(str) {
  return str.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
}

function parseLegalText(text) {
  const result = {
    court: null,
    complainant: null,
    complainantAddress: null,
    defendant: null,
    defendantAddress: null,
    subject: null,
    body: null,
    signature: null,
    date: null
  };

  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const bodyCandidates = [];

  const addressRegex = /(الساكن|الساكنة|عنوانه|عنوانها|محل سكنه|محل سكنها|محل عمله|مقرها|مقر عمله|محل إقامته|العنوان|الهاتف|رقم الهاتف)/;

  for (let i = 0; i < rawLines.length; i++) {
    const originalLine = rawLines[i];
    const cleanLine = stripDiacritics(originalLine);

    // 0. Skip AI preambles
    if (/^(تفضل|إليك|اليك|نموذج|صياغة|هذه عريضة|أدناه نص|فيما يلي)/i.test(cleanLine)) {
      continue;
    }

    // Skip Basmala
    if (/^بسم\s*الله/i.test(cleanLine)) {
      continue;
    }

    // 1. Court Recipient Header
    if (!result.court && /(السيد قاضي|السيد رئيس|إلى\s*[\/:]?\s*السيد|محكمة تحقيق|محكمة بداءة|محكمة الأحوال|محكمة جنح|محكمة الجنايات|محكمة استئناف)/i.test(cleanLine)) {
      result.court = originalLine.replace(/^(إلى\s*[\/:]?\s*|الى\s*[\/:]?\s*)/, '').trim();
      continue;
    }

    // 2. Complainant Name
    if (!result.complainant && /^(المشتكي|المشتكية|المدعي|المدعية|طالب التنفيذ|المستأنف)[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      const match = originalLine.match(/^(المشتكي|المشتكية|المدعي|المدعية|طالب التنفيذ|المستأنف)[\s:\/ـ-]+(.+)$/i);
      result.complainant = match[2].trim();
      
      // Inline address after / or -
      if (addressRegex.test(result.complainant)) {
        const parts = result.complainant.split(/[\/ـ-]\s*(?=(?:الساكن|الساكنة|عنوانه|عنوانها|محل|مقر|العنوان|الهاتف))/i);
        if (parts.length > 1) {
          result.complainant = parts[0].trim();
          result.complainantAddress = parts.slice(1).join(' - ').replace(/^[\s:\/ـ-]+/, '').replace(addressRegex, '').replace(/^[\s:\/ـ-]+/, '').trim();
        }
      }
      continue;
    }

    // Complainant Address if on immediate next line
    if (result.complainant && !result.complainantAddress && !result.defendant && addressRegex.test(cleanLine) && !/^(المشكو|المدعى)/.test(cleanLine)) {
      result.complainantAddress = originalLine.replace(/^.*?(الساكن|الساكنة|عنوانه|عنوانها|محل سكنه|محل سكنها|محل عمله|مقرها|العنوان|الهاتف)[\s:\/ـ-]*/i, '').trim();
      continue;
    }

    // 3. Defendant Name
    if (!result.defendant && /^(المشكو منه|المشكو منها|المدعى عليه|المدعى عليها|المنفذ ضده|المستأنف عليه)[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      const match = originalLine.match(/^(المشكو منه|المشكو منها|المدعى عليه|المدعى عليها|المنفذ ضده|المستأنف عليه)[\s:\/ـ-]+(.+)$/i);
      result.defendant = match[2].trim();

      // Inline address after / or -
      if (addressRegex.test(result.defendant)) {
        const parts = result.defendant.split(/[\/ـ-]\s*(?=(?:الساكن|الساكنة|عنوانه|عنوانها|محل|مقر|العنوان|الهاتف))/i);
        if (parts.length > 1) {
          result.defendant = parts[0].trim();
          result.defendantAddress = parts.slice(1).join(' - ').replace(/^[\s:\/ـ-]+/, '').replace(addressRegex, '').replace(/^[\s:\/ـ-]+/, '').trim();
        }
      }
      continue;
    }

    // Defendant Address if on immediate next line
    if (result.defendant && !result.defendantAddress && addressRegex.test(cleanLine) && !/^(الموضوع|م\s*[\/:]|تحية|أعرض)/.test(cleanLine)) {
      result.defendantAddress = originalLine.replace(/^.*?(الساكن|الساكنة|عنوانه|عنوانها|محل سكنه|محل سكنها|محل عمله|مقرها|العنوان|الهاتف)[\s:\/ـ-]*/i, '').trim();
      continue;
    }

    // 4. Subject line
    if (!result.subject && /^(الموضوع|م\s*[\/:]|م\/|جهة الشكوى|جهة الدعوى)[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      result.subject = originalLine.replace(/^(الموضوع|م\s*[\/:]|م\/|جهة الشكوى|جهة الدعوى)[\s:\/ـ-]+/i, '').trim();
      continue;
    }

    // 5. Strict Date (only if line explicitly designates a formal date)
    if (!result.date && /^التاريخ[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      result.date = originalLine.replace(/^التاريخ[\s:\/ـ-]+/i, '').trim();
      continue;
    }
    // Or if in the very last 3 lines and has date pattern
    if (!result.date && i >= rawLines.length - 3 && /(التاريخ|تحريراً في)[\s:\/ـ-]+(\d{1,4}.+)$/i.test(cleanLine)) {
      const dateM = originalLine.match(/(التاريخ|تحريراً في)[\s:\/ـ-]+(\d{1,4}.+)$/i);
      result.date = dateM[2].trim();
      continue;
    }

    // 6. Signature block (in the last 4 lines)
    if (i >= rawLines.length - 4 && /(المشتكي|المشتكية|المدعي|المدعية|وكيله|وكيل|المحامي|مقدم الطلب|التوقيع)/i.test(cleanLine)) {
      result.signature = originalLine;
      continue;
    }

    // 7. Salutations / Closings removal
    if (/^(تحية طيبة|تحية واحترام|السلام عليكم ورحمة|سيدي القاضي المحترم)/i.test(cleanLine)) {
      continue;
    }
    if (/^(ولعدالتكم فائق|مع فائق التقدير|وتقبلوا فائق|ولكم وافر الاحترام|مع وافر الاحترام)/i.test(cleanLine)) {
      continue;
    }

    // Everything else is body!
    bodyCandidates.push(originalLine);
  }

  result.body = bodyCandidates.join('\n\n');
  return result;
}

// RUN TESTS
const test1 = `
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

console.log("=== Test 1 ===");
console.log(parseLegalText(test1));

const test2 = `
السيد قاضي محكمة بداءة الكرخ المحترم
المدعي: حسن علي كريم / الساكن: المنصور - شارع 14 رمضان
المدعى عليه: شركة الفرات للتجارة / مقرها: بغداد - الكرادة
م / دعوى مطالبة بمبلغ دين
أعرض لعدالتكم ما يلي...
لذا أطلب الحكم بإلزامه بدفع المبلغ.
وكيل المدعي المحامي سعد فراس أميل
التاريخ: 2026/11/01
`;

console.log("\n=== Test 2 ===");
console.log(parseLegalText(test2));
