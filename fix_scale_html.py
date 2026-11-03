import re

html_path = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

new_scale_controls = """<div class="scale-controls" style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:700; color:#f59e0b;">🔤 حجم الخط:</span>
                <button type="button" class="btn btn-secondary btn-xs" onclick="changeFontScaleDelta(-5)" title="تصغير الخط">➖</button>
                <input type="range" id="scaleSlider" class="scale-slider" min="70" max="160" step="2" value="125" oninput="setFontScale(parseInt(this.value, 10), true)" style="width:90px;">
                <button type="button" class="btn btn-secondary btn-xs" onclick="changeFontScaleDelta(5)" title="تكبير الخط">➕</button>
                <span id="scaleLabel" style="font-weight: 800; color: #f59e0b; min-width: 42px;">125%</span>
                <div style="display:inline-flex; gap:3px;">
                  <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(100)">100%</button>
                  <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(115)">115%</button>
                  <button type="button" class="btn btn-primary btn-xs" onclick="setFontPreset(125)">125% كبير</button>
                  <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(140)">140%</button>
                </div>
                <button class="btn btn-secondary btn-xs" onclick="autoFitSinglePage(false)" title="ضبط تلقائي لصفحة واحدة">
                  <span>⚡ ملاءمة تلقائية</span>
                </button>
              </div>"""

html, count = re.subn(r'<div class="scale-controls">[\s\S]*?</div>', new_scale_controls, html, count=1)
print(f"Substituted scale-controls: {count} matches")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html!")
