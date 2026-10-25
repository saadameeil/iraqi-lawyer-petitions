import math
from PIL import Image, ImageDraw

def create_legal_icon(size=512):
    # Create high-res RGBA image
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background: Rounded rectangle or circle with rich gradient-like background
    # Colors: Deep navy/slate #0f172a to #1e293b
    bg_color = (15, 23, 42, 255) # Slate 900
    border_gold = (212, 175, 55, 255) # Classic legal gold
    gold_glow = (245, 215, 110, 255)
    
    # Draw rounded background
    corner_radius = int(size * 0.22) # Standard iOS squircle look
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=corner_radius, fill=bg_color)
    
    # Subtle gold ring inside
    margin = int(size * 0.05)
    ring_width = max(3, int(size * 0.012))
    draw.rounded_rectangle([(margin, margin), (size - 1 - margin, size - 1 - margin)], 
                           radius=corner_radius - margin//2, 
                           outline=border_gold, width=ring_width)

    cx = size // 2
    cy = int(size * 0.52)
    scale = size / 512.0
    
    # Draw Scales of Justice (ميزان العدالة)
    # 1. Central pillar
    pillar_top = int(140 * scale)
    pillar_bot = int(390 * scale)
    pw = max(4, int(10 * scale))
    draw.line([(cx, pillar_top), (cx, pillar_bot)], fill=gold_glow, width=pw)
    
    # 2. Top ornament (circle/finial)
    top_r = int(14 * scale)
    draw.ellipse([(cx - top_r, pillar_top - top_r), (cx + top_r, pillar_top + top_r)], fill=gold_glow)
    
    # 3. Base pedestal (stepped base)
    base_w1 = int(70 * scale)
    base_w2 = int(95 * scale)
    base_h1 = int(12 * scale)
    base_h2 = int(14 * scale)
    draw.rectangle([(cx - base_w1, pillar_bot - base_h1), (cx + base_w1, pillar_bot)], fill=border_gold)
    draw.rectangle([(cx - base_w2, pillar_bot), (cx + base_w2, pillar_bot + base_h2)], fill=gold_glow)
    
    # 4. Crossbeam (horizontal balance bar)
    beam_y = int(175 * scale)
    beam_w = int(150 * scale)
    bw = max(4, int(8 * scale))
    draw.line([(cx - beam_w, beam_y), (cx + beam_w, beam_y)], fill=gold_glow, width=bw)
    
    # Center pivot ring
    pr_r = int(10 * scale)
    draw.ellipse([(cx - pr_r, beam_y - pr_r), (cx + pr_r, beam_y + pr_r)], fill=border_gold, outline=gold_glow, width=2)
    
    # Left and right pans
    for side in [-1, 1]:
        px = cx + side * beam_w
        py = beam_y
        
        # Chains
        pan_y = int(285 * scale)
        pan_w = int(55 * scale)
        chain_w = max(2, int(3 * scale))
        
        # 2 chain lines from crossbeam end to pan edges
        draw.line([(px, py), (px - pan_w, pan_y)], fill=border_gold, width=chain_w)
        draw.line([(px, py), (px + pan_w, pan_y)], fill=border_gold, width=chain_w)
        
        # Pan arc / bowl
        pan_h = int(28 * scale)
        draw.chord([(px - pan_w, pan_y - pan_h//3), (px + pan_w, pan_y + pan_h)], start=0, end=180, fill=gold_glow, outline=border_gold)

    return img

if __name__ == "__main__":
    import os
    out_dir = r"C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions"
    os.makedirs(out_dir, exist_ok=True)
    
    icon512 = create_legal_icon(512)
    icon512.save(os.path.join(out_dir, "icon-512.png"))
    
    icon192 = icon512.resize((192, 192), Image.Resampling.LANCZOS)
    icon192.save(os.path.join(out_dir, "icon-192.png"))
    
    apple_icon = icon512.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(out_dir, "apple-touch-icon.png"))
    
    favicon = icon512.resize((64, 64), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(out_dir, "favicon.png"))
    print("Icons generated successfully!")
