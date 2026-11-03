html_path = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

editor_font_card = """          <!-- Font Size Controller Card in Editor -->
          <div class="card" style="margin-top: 14px; background: rgba(30, 41, 59, 0.75); border: 1px solid rgba(245, 158, 11, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 16px;">🔤</span>
                <b style="color: #f8fafc; font-size: 13.5px;">التحكم بحجم الخط للطباعة (كبر وصغر بكيفك):</b>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="changeFontScaleDelta(-5)">➖ تصغير</button>
                <input type="range" id="scaleSliderEditor" class="scale-slider" min="70" max="160" step="2" value="125" oninput="setFontScale(parseInt(this.value, 10), true)" style="width: 110px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="changeFontScaleDelta(5)">➕ تكبير</button>
                <span id="scaleLabelEditor" style="font-weight: 800; color: #f59e0b; min-width: 45px; font-size: 14px;">125%</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(100)">عادي (100%)</button>
              <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(115)">واضح ومريح (115%)</button>
              <button type="button" class="btn btn-primary btn-xs" onclick="setFontPreset(125)">كبير للقاضي (125%)</button>
              <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(135)">كبير جداً (135%)</button>
              <button type="button" class="btn btn-secondary btn-xs" onclick="setFontPreset(150)">ضخم (150%)</button>
            </div>
          </div>
"""

marker = "<!-- Action Buttons -->"
if marker in html and "scaleSliderEditor" not in html:
    html = html.replace(marker, editor_font_card + "\n          " + marker)
    print("Inserted font card above Action Buttons!")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html!")
