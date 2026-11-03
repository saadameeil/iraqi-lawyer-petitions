import re

# ==============================================================================
# 1. Update style.css
# ==============================================================================
css_path = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Add .btn-xs
if ".btn-xs" not in css:
    css = css.replace(
        ".btn-sm {",
        ".btn-xs {\n  padding: 3px 8px;\n  font-size: 11px;\n  border-radius: 6px;\n}\n\n.btn-sm {"
    )

# Fix print media query
old_print_block = re.search(r"@media print\s*\{[\s\S]*?\}\s*\}", css)
if old_print_block:
    new_print_block = """@media print {
  @page {
    size: A4 portrait;
    margin: 10mm 20mm 10mm 14mm !important; /* 20mm right margin for court docket hole-punching */
  }

  html, body {
    background: #ffffff !important;
    color: #000000 !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    height: auto !important;
  }

  .no-print, 
  .app-header, 
  .mobile-nav, 
  .tabs-header, 
  .preview-toolbar, 
  .modal-overlay, 
  .toast, 
  #editorPane {
    display: none !important;
  }

  .main-wrapper {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }

  .content-grid {
    display: block !important;
  }

  #previewPane {
    display: block !important;
  }

  .a4-sheet-wrapper {
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
  }

  .a4-sheet {
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-height: none !important;
    height: auto !important;
    min-height: auto !important;
    transform: none !important;
    overflow: visible !important;
    page-break-after: avoid;
    page-break-inside: auto;
  }
}"""
    css = css[:old_print_block.start()] + new_print_block + css[old_print_block.end():]

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css successfully!")
