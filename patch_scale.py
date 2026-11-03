import re

# 1. Update archive.json
import json
archive_path = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\archive.json"
with open(archive_path, "r", encoding="utf-8") as f:
    items = json.load(f)

for item in items:
    if item.get("id") == "case_saad_amori_apartment_2026":
        item["data"]["fontScale"] = 125  # Big, clear, readable font by default!

with open(archive_path, "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print("Updated archive.json with fontScale=125")
