with open(r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace preview scale-controls
old_scale_controls = """              <div class="scale-controls">
                <span>مقياس الخط:</span>
                <input type="range" id="scaleSlider" class="scale-slider" min="75" max="115" value="100">
                <span id="scaleLabel" style="font-weight: 700; color: #fff; min-width: 35px;">100%</span>
                <button class="btn btn-secondary btn-sm" onclick="autoFitSinglePage()" title="ضبط تلقائي لصفحة واحدة">
                  <span>⚡ ملاءمة تلقائية</span>
                </button>
              </div>"""

new_scale_controls = """              <div class="scale-controls" style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
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

if old_scale_controls in html:
    html = html.replace(old_scale_controls, new_scale_controls)
    print("Replaced preview-toolbar scale-controls!")
else:
    print("Warning: old_scale_controls not found in index.html")

# Add font control card in editorPane right above the action buttons
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

action_bar_marker = """          <!-- Actions Bar -->"""
if action_bar_marker in html and "scaleSliderEditor" not in html:
    html = html.replace(action_bar_marker, editor_font_card + "\n" + action_bar_marker)
    print("Added editor_font_card in index.html!")

# Update cache version
html = html.replace("?v=20261030_salam1", "?v=20261103_fontscale2")

with open(r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html successfully!")
