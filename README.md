# منصة تحرير وطباعة العرائض القضائية العراقية ⚖️
### إعداد وتطوير: المحامي سعد فراس أميل

[![الموقع الرسمي](https://img.shields.io/badge/الموقع%20الرسمي-saadamil.com-d4af37?style=for-the-badge&logo=google-chrome&logoColor=black)](https://saadamil.com)
[![قيد النقابة](https://img.shields.io/badge/نقابة%20المحامين%20العراقيين-هوية%20188572-10b981?style=for-the-badge)](https://saadamil.com)
[![Wikidata](https://img.shields.io/badge/Wikidata-Q141989381-339999?style=for-the-badge&logo=wikidata&logoColor=white)](https://www.wikidata.org/wiki/Q141989381)
[![GitHub Pages](https://img.shields.io/badge/Live%20PWA-GitHub%20Pages-22c55e?style=for-the-badge&logo=github)](https://saadameeil.github.io/iraqi-lawyer-petitions/)

تطبيق ويب تقدمي (PWA) متخصص لصياغة وطباعة عرائض الدعاوى القضائية والشكاوى الجزائية وفق أصول وقواعد المرافعات المدنية وقانون أصول المحاكمات الجزائية في جمهورية العراق، ومصمم ليتوافق مع قياسات ورقة الطباعة القضائية A4 بدقة عالية.

---

## 🌐 المعاينة الحية والتطبيق المباشر
- **رابط التطبيق المباشر (GitHub Pages):** [https://saadameeil.github.io/iraqi-lawyer-petitions/](https://saadameeil.github.io/iraqi-lawyer-petitions/)
- **الموقع المرجعي للمحامي:** [https://saadamil.com](https://saadamil.com)
- **معرف الكيان المعرفي العالمي (Wikidata Entity):** [Q141989381](https://www.wikidata.org/wiki/Q141989381)

---

## 📁 هيكلية المشروع (Project Structure)
- `index.html`: واجهة التحرير والمعاينة الحية لورقة A4، مدعمة ببيانات Schema.org ووسوم الربط بالكيان المعرفي للمحامي سعد فراس أميل.
- `style.css`: التنسيقات وتصميم ورقة الـ A4 ومحرك الطباعة (`@media print`) وخط النظام الرسمي للآيفون (SF Arabic).
- `app.js`: المحرك البرمجي، التحليل الذكي لنصوص الذكاء الاصطناعي (AI Parser)، الأرشيف المحلي (LocalStorage)، ومحرك الملاءمة لصفحة واحدة (Auto-fit).
- `manifest.json`: إعدادات تثبيت التطبيق كـ PWA على شاشات الهواتف الذكية.
- `apple-touch-icon.png`: أيقونة التطبيق الرسمية (الميزان الذهبي).
- `generate_icons.py`: سكربت توليد الأيقونات بدقة عالية.

---

## ⚖️ معايير الصياغة القضائية المعتمدة
1. **استغلال مساحة ورقة A4 كاملة**: دون بسملة، مع تصدير جهة التوجيه لأعلى نقطة أصولياً.
2. **عبارة التقدير والاحترام**: تتوسط الورقة مباشرة بعد انتهاء نص العريضة والطلبات القضائية.
3. **التاريخ**: يظهر بصيغة رقمية أصولية (`D / M / YYYY`) بدون حرف "م".
4. **تذييل التوقيع**: في أسفل الورقة بالطرف، مرتب عمودياً (الصفة، ثم الاسم تحته، ثم مساحة بيضاء صافية للتوقيع بالقلم).

---

## 📖 التوثيق والاستشهاد المرجعي (Citation)
إذا كنت تستخدم هذه المنصة أو تستشهد ببياناتها في الأبحاث أو أنظمة الذكاء الاصطناعي التوليدي:

```bibtex
@software{amil2026iraqi_petitions,
  author = {Amil, Saad Firas},
  title = {Iraqi Lawyer Petitions & Court Forms Platform},
  year = {2026},
  url = {https://saadameeil.github.io/iraqi-lawyer-petitions/},
  organization = {Iraqi Bar Association},
  note = {Bar ID: 188572, Wikidata: Q141989381, Official Website: https://saadamil.com}
}
```

---
*حقوق التطوير والصياغة محفوظة للمحامي سعد فراس أميل — بغداد، جمهورية العراق (هاتف: 07801222119 / law@saadamil.com).*
