import re

app_path = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\app.js"
with open(app_path, "r", encoding="utf-8") as f:
    js = f.read()

# 1. Update initial state
js = js.replace(
    "fontScale: 100,",
    "fontScale: 125,\n    userManualScale: true,"
)

# 2. Add delta and preset helper functions
helpers = """
  // User manual font scale step (+/-)
  window.changeFontScaleDelta = function(delta) {
    state.userManualScale = true;
    let current = state.fontScale || 125;
    let next = Math.max(70, Math.min(160, current + delta));
    setFontScale(next, true);
    saveDraftToStorage();
  };

  // User preset font scale (e.g. 100, 115, 125, 140)
  window.setFontPreset = function(percent) {
    state.userManualScale = true;
    setFontScale(percent, true);
    saveDraftToStorage();
  };
"""

if "window.changeFontScaleDelta" not in js:
    js = js.replace("function setFontScale(percent) {", helpers + "\nfunction setFontScale(percent, isManual = true) {")
    print("Added helper functions!")

# 3. Update setFontScale implementation
old_setFontScale_body = re.search(r"function setFontScale\([\s\S]*?updateSinglePageFitIndicator\(\);\s*\}", js)
if old_setFontScale_body:
    new_setFontScale_body = """function setFontScale(percent, isManual = true) {
    if (isManual) {
      state.userManualScale = true;
    }
    state.fontScale = percent;
    const sheet = document.getElementById('a4Sheet');
    
    // Sync all labels
    ['scaleLabel', 'scaleLabelEditor'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = percent + '%';
    });
    
    // Sync all sliders
    ['scaleSlider', 'scaleSliderEditor'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = percent;
    });

    if (!sheet) return;

    const factor = percent / 100;
    const bodyPt = 14.0 * factor;
    const courtPt = Math.max(12, 16.5 * factor);
    const titlePt = Math.max(11.5, 15.0 * factor);
    const subPt = Math.max(10, 12.5 * factor);
    const lineH = factor < 0.88 ? 1.38 : (factor < 0.95 ? 1.45 : (factor > 1.25 ? 1.60 : 1.55));
    const spacingPt = Math.max(3, 8 * factor);

    sheet.style.setProperty('--paper-font-size', `${bodyPt.toFixed(1)}pt`);
    sheet.style.setProperty('--paper-line-height', `${lineH.toFixed(2)}`);
    sheet.style.setProperty('--paper-court-size', `${courtPt.toFixed(1)}pt`);
    sheet.style.setProperty('--paper-title-size', `${titlePt.toFixed(1)}pt`);
    sheet.style.setProperty('--paper-sub-size', `${subPt.toFixed(1)}pt`);
    sheet.style.setProperty('--paper-spacing', `${spacingPt.toFixed(1)}pt`);

    updateSinglePageFitIndicator();
  }"""
    js = js[:old_setFontScale_body.start()] + new_setFontScale_body + js[old_setFontScale_body.end():]
    print("Replaced setFontScale body!")

# 4. In printPetition, remove window.autoFitSinglePage(true)
js = js.replace(
    "window.printPetition = function() {\n    window.autoFitSinglePage(true);\n    renderPreview();",
    "window.printPetition = function() {\n    // Respect lawyer's custom font scale - NEVER auto-shrink!\n    renderPreview();"
)
js = js.replace(
    "window.printPetition = function() {\r\n    window.autoFitSinglePage(true);\r\n    renderPreview();",
    "window.printPetition = function() {\r\n    // Respect lawyer's custom font scale - NEVER auto-shrink!\r\n    renderPreview();"
)

# 5. In exportDirectPDF, remove window.autoFitSinglePage(true)
js = js.replace(
    "    // 1. Automatically fit content into 1 single page before capture\n    window.autoFitSinglePage(true);\n    renderPreview();",
    "    // 1. Respect lawyer's chosen font scale\n    renderPreview();"
)
js = js.replace(
    "    // 1. Automatically fit content into 1 single page before capture\r\n    window.autoFitSinglePage(true);\r\n    renderPreview();",
    "    // 1. Respect lawyer's chosen font scale\r\n    renderPreview();"
)

# 6. In loadCaseFromArchive, do not override fontScale with autoFitSinglePage
js = js.replace(
    "    if (state.fontScale) setFontScale(state.fontScale);\n    renderPreview();\n    window.autoFitSinglePage(true);",
    "    const targetScale = state.fontScale || 125;\n    setFontScale(targetScale, true);\n    renderPreview();"
)
js = js.replace(
    "    if (state.fontScale) setFontScale(state.fontScale);\r\n    renderPreview();\r\n    window.autoFitSinglePage(true);",
    "    const targetScale = state.fontScale || 125;\r\n    setFontScale(targetScale, true);\r\n    renderPreview();"
)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(js)

print("Updated app.js successfully!")
