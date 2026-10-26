import json
import os
import sys
from datetime import datetime

ARCHIVE_PATH = os.path.join(os.path.dirname(__file__), "archive.json")

def add_petition(
    title,
    court,
    complainant,
    complainant_addr,
    defendant,
    defendant_addr,
    subject,
    body_text,
    sig_role="المشتكي / وكيله",
    sig_name="المحامي سعد فراس أميل",
    petition_date=None,
    font_scale=100,
    case_id=None
):
    now = datetime.now()
    if not petition_date:
        petition_date = f"{now.day} / {now.month} / {now.year}"
    
    saved_at = f"{now.day}/{now.month}/{now.year}, {now.strftime('%I:%M:%S')} {'م' if now.hour >= 12 else 'ص'}"
    
    if not case_id:
        case_id = f"case_{int(now.timestamp())}"

    item = {
        "id": case_id,
        "title": title,
        "court": court,
        "complainant": complainant,
        "defendant": defendant,
        "date": petition_date,
        "savedAt": saved_at,
        "data": {
            "courtRecipient": court,
            "complainantName": complainant,
            "complainantAddress": complainant_addr,
            "defendantName": defendant,
            "defendantAddress": defendant_addr,
            "subject": subject,
            "salutation": "تحية طيبة واحترام /",
            "bodyText": body_text,
            "closingSalutation": "ولعدالتكم فائق التقدير والاحترام",
            "sigRole": sig_role,
            "sigName": sig_name,
            "petitionDate": petition_date,
            "fontScale": font_scale
        }
    }

    archive = []
    if os.path.exists(ARCHIVE_PATH):
        try:
            with open(ARCHIVE_PATH, "r", encoding="utf-8") as f:
                archive = json.load(f)
                if not isinstance(archive, list):
                    archive = []
        except Exception:
            archive = []

    # Update if already exists or prepend
    existing_idx = next((i for i, x in enumerate(archive) if x.get("id") == case_id), -1)
    if existing_idx != -1:
        archive[existing_idx] = item
    else:
        archive.insert(0, item)

    with open(ARCHIVE_PATH, "w", encoding="utf-8") as f:
        json.dump(archive, f, ensure_ascii=False, indent=2)

    print(f"Petition '{title}' added to archive. Total items: {len(archive)}")

    # Auto push to GitHub Pages
    try:
        app_dir = os.path.dirname(__file__)
        subprocess.run(["git", "add", "archive.json"], cwd=app_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "commit", "-m", f"Update archive: {title}"], cwd=app_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "push"], cwd=app_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Pushed updated archive to live GitHub Pages!")
    except Exception as e:
        print("Git push error:", e)

    return item

if __name__ == "__main__":
    # Test with Zainab Al-Qarni's petition
    body = (
        "أعرض لعدالتكم بأن المشكو منه (زوجي المنفصلة عنه) عتيد العود في ارتكاب جرائم التهديد والترصد والسب، "
        "حيث سبق إدانته بثلاثة قرارات جزائية قطعية صادرة عن محكمة جنح الكرخ (العنف الأسري) بالدعاوى المرقمة: "
        "(58/ج-ع/2026، و 131/ج-ع/2026، و 143/ج-ع/2026).\n\n"
        "وحيث أن المشكو منه استخف بالأحكام القضائية السابقة ولم يرتدع بها، فقد عاد مجدداً للترصد والتضييق على دار سكني في اليرموك "
        "مستغلاً إقامتي بمفردي، وذلك بقصد ممارسة الإكراه والترهيب المعنوي لحثي على التنازل عن دعوى التعويض المقامة ضده أمام "
        "محكمة بداءة الكرخ بالعدد (2872/ب/2026) والمحددة جلستها بتاريخ 8/11/2026.\n\n"
        "وحيث أن أفعاله تشكل جريمة التهديد والتعرض المستمر المعاقب عليها بموجب قانون العقوبات العراقي، وبدلالة أحكام العود الجرمي "
        "(المادتين 139 و140 عقوبات)، ألتمس من عدالتكم بكل رجاء:\n"
        "1. تدوين أقوالي كمشتكية فوراً، وإحالة الأوراق لمركز شرطة اليرموك، مع توجيه مفارز الشرطة لسحب وتفريغ تسجيلات كاميرات المراقبة "
        "للزقاق لإثبات واقعة الترصد والتطويق الميداني.\n"
        "2. إصدار أمر قبض وتوقيف بحقه وفق المادة (109) من قانون أصول المحاكمات الجزائية؛ للخطورة الإجرامية والعود الجرمي ومحاولة "
        "الضغط على القضاء والمتقاضين.\n"
        "3. إلزام المشكو منه بتعهد عدلي ملزم مصحوب بكفالة مالية ضامنة مشددة بعدم التعرض المباشر أو الإلكتروني أو بوساطة الغير أو "
        "الاقتراب من دار سكني نهائياً، تحت طائلة التوقيف الفوري ومصادرة مبلغ الكفالة.\n"
        "4. تسطير كتاب رسمي لمنع سفره خارج جمهورية العراق لحين حسم القضايا الجزائية والمدنية المقامة بحقه.\n\n"
        "المرفقات:\n"
        "• صور قرارات محكمة جنح الكرخ (58 و 131 و 143/ج-ع/2026).\n"
        "• صورة عريضة دعوى بداءة الكرخ المرقمة 2872/ب/2026."
    )

    add_petition(
        title="شكوى ترصد وتهديد / زينب القرني ضد مهند ضياء",
        court="السيد قاضي محكمة تحقيق الكرخ المحترم",
        complainant="زينب فيصل اسماعيل القرني",
        complainant_addr="اليرموك – محلة (616) – زقاق (32) – دار (23)",
        defendant="مهند ضياء سلمان",
        defendant_addr="الصليخ – محلة (326) – زقاق (36) – دار (92)",
        subject="شكوى جزائية عن الترصد والتهديد المستمر والعود الجرمي",
        body_text=body,
        sig_role="المشتكية",
        sig_name="زينب فيصل اسماعيل القرني",
        petition_date="23 / 10 / 2026",
        font_scale=100,
        case_id="case_zainab_al_qarni_2026"
    )
