import json

archive_path = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\archive.json"
with open(archive_path, "r", encoding="utf-8") as f:
    items = json.load(f)

for item in items:
    if item.get("id") == "case_saad_amori_apartment_2026":
        item["title"] = "⚖️ طلب ختام الكشف والإذن بالترميم وسحب نسخ مصدقة / شقة المحامي سعد ضد أحمد أموري"
        item["court"] = "السيد قاضي محكمة بداءة بغداد الجديدة المحترم"
        item["date"] = "3 / 11 / 2026 م"
        item["savedAt"] = "03/11/2026, 11:15 ص"
        d = item["data"]
        d["courtRecipient"] = "السيد قاضي محكمة بداءة بغداد الجديدة (علي عبد الكريم) المحترم"
        d["caseNumber"] = "74 / كشف مستعجل / 2026"
        d["complainantName"] = "المحامي سعد فراس أميل (أصالة عن نفسه)"
        d["complainantAddress"] = ""  # Cleaned / removed
        d["defendantName"] = "أحمد عموري عبدالرضا"
        d["defendantAddress"] = ""  # Cleaned / removed
        d["subject"] = "م / ختام إجراءات الكشف والإذن بالترميم وتزويدي بنسخ مصدقة"
        d["salutation"] = "تحية طيبة واحترام /"
        d["bodyText"] = (
            "نظراً لإجراء الكشف الموقعي المستعجل على العقار (الشقة) موضوع الإضبارة أعلاه بمعية المحكمة والخبير القضائي المنتدب؛\n\n"
            "وحيث إن الغاية الجوهرية من طلب الكشف هي تثبيت واقع حال العقار ودرء تفاقم الأضرار، ولتمكيني من الانتفاع به شرعاً وقانوناً؛\n\n"
            "لـذا؛ ألتمس من عدالتكم الموقرة التفضل بـ:\n\n"
            "1. الاطلاع على تقرير الخبير القضائي المودع في الإضبارة وختام إجراءات الكشف المستعجل، وتضمين المستدعى ضده المصاريف.\n\n"
            "2. منحي الإذن القضائي بالترميم والإصلاح ورفع الأضرار الحاصلة في العقار على نفقتي الخاصة، مع حفظ حقي بالرجوع على المستدعى ضده بما ينفق قانوناً.\n\n"
            "3. تزويدي بـ (نسختين) مصدقتين طبق الأصل من محضر الكشف وتقرير الخبير وقرار عدالتكم الموقر، لغرض تقديمهما للجهات المختصة."
        )
        d["closingSalutation"] = "ولعدالتكم فائق الشكر والتقدير والاحترام"
        d["sigRole"] = "المستدعي (أصالة عن نفسه)"
        d["sigName"] = "المحامي سعد فراس أميل"
        d["petitionDate"] = "3 / 11 / 2026 م"
        d["fontScale"] = 125

with open(archive_path, "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print("Updated archive.json with streamlined text!")
