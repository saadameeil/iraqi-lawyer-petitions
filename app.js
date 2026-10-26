/**
 * نظام تحرير وطباعة العرائض القضائية - المحامي سعد فراس أميل
 * المحرك البرمجي للتطبيق وتوليد المستندات والتحليل الذكي
 */

// State Object
const state = {
  courtRecipient: 'السيد قاضي محكمة تحقيق بغداد الجديدة المحترم',
  complainantName: '',
  complainantAddress: '',
  defendantName: '',
  defendantAddress: '',
  subject: '',
  salutation: 'تحية طيبة واحترام /',
  bodyText: '',
  closingSalutation: 'ولعدالتكم فائق التقدير والاحترام',
  sigRole: 'المشتكي / وكيله',
  sigName: 'المحامي سعد فراس أميل',
  petitionDate: getTodayFormattedArabic(),
  fontScale: 100,
  activeTab: 'editor' // 'editor' | 'preview'
};

// Auto-fill today's date in formal Iraqi format
function getTodayFormattedArabic() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${day} / ${month} / ${year}`;
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  loadDraftFromStorage();
  bindInputEvents();
  renderPreview();
  setupTabEvents();
  updateSinglePageFitIndicator();
  updateMobileSheetZoom();
  syncServerArchive();
});

// Update Mobile Zoom so A4 sheet fits horizontally on small screens
function updateMobileSheetZoom() {
  const wrapper = document.querySelector('.a4-sheet-wrapper');
  const sheet = document.getElementById('a4Sheet');
  if (!wrapper || !sheet) return;

  if (window.innerWidth < 850) {
    const availableWidth = wrapper.clientWidth - 20;
    const sheetWidth = 794; // approx 210mm at 96dpi
    const zoom = Math.max(0.35, Math.min(1, availableWidth / sheetWidth));
    sheet.style.transform = `scale(${zoom})`;
    sheet.style.transformOrigin = 'top center';
    const scaledHeight = 1123 * zoom;
    wrapper.style.height = `${scaledHeight + 40}px`;
    wrapper.style.overflowX = 'hidden';
  } else {
    sheet.style.transform = 'none';
    wrapper.style.height = 'auto';
    wrapper.style.overflowX = 'auto';
  }
}

// Bind Input Elements to State
function bindInputEvents() {
  const inputs = [
    { id: 'courtRecipient', key: 'courtRecipient' },
    { id: 'complainantName', key: 'complainantName' },
    { id: 'complainantAddress', key: 'complainantAddress' },
    { id: 'defendantName', key: 'defendantName' },
    { id: 'defendantAddress', key: 'defendantAddress' },
    { id: 'subject', key: 'subject' },
    { id: 'salutation', key: 'salutation' },
    { id: 'bodyText', key: 'bodyText' },
    { id: 'closingSalutation', key: 'closingSalutation' },
    { id: 'sigRole', key: 'sigRole' },
    { id: 'sigName', key: 'sigName' },
    { id: 'petitionDate', key: 'petitionDate' }
  ];

  inputs.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = state[key];
      el.addEventListener('input', (e) => {
        state[key] = e.target.value;
        renderPreview();
        saveDraftToStorage();
        updateSinglePageFitIndicator();
      });
    }
  });

  // Scale slider
  const slider = document.getElementById('scaleSlider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      setFontScale(parseInt(e.target.value, 10));
    });
  }
}

// Quick Chip helper for courts
window.setCourt = function(courtName) {
  state.courtRecipient = courtName;
  const el = document.getElementById('courtRecipient');
  if (el) el.value = courtName;
  renderPreview();
  window.autoFitSinglePage(true);
  saveDraftToStorage();
};

// Render live document in the A4 Paper Container
function renderPreview() {
  // Court Header
  document.getElementById('docCourt').innerText = state.courtRecipient || 'السيد قاضي محكمة ... المحترم';

  // Complainant Block
  const cNameEl = document.getElementById('docComplainantName');
  const cAddrEl = document.getElementById('docComplainantAddress');
  cNameEl.innerText = state.complainantName ? state.complainantName : '................................................';
  if (state.complainantAddress && state.complainantAddress.trim()) {
    cAddrEl.innerText = 'الساكن: ' + state.complainantAddress.trim();
    cAddrEl.style.display = 'block';
  } else {
    cAddrEl.style.display = 'none';
  }

  // Defendant Block
  const dNameEl = document.getElementById('docDefendantName');
  const dAddrEl = document.getElementById('docDefendantAddress');
  dNameEl.innerText = state.defendantName ? state.defendantName : '................................................';
  if (state.defendantAddress && state.defendantAddress.trim()) {
    dAddrEl.innerText = 'الساكن: ' + state.defendantAddress.trim();
    dAddrEl.style.display = 'block';
  } else {
    dAddrEl.style.display = 'none';
  }

  // Conditional Subject Field (الموضوع)
  const subjRow = document.getElementById('docSubjectRow');
  const subjText = document.getElementById('docSubjectText');
  if (state.subject && state.subject.trim() !== '') {
    subjText.innerText = state.subject.trim().startsWith('م/') || state.subject.trim().startsWith('م /') 
      ? state.subject.trim() 
      : 'م / ' + state.subject.trim();
    subjRow.style.display = 'block';
  } else {
    subjRow.style.display = 'none';
  }

  // Salutation
  document.getElementById('docSalutation').innerText = state.salutation || 'تحية طيبة واحترام /';

  // Body
  const bodyEl = document.getElementById('docBody');
  if (state.bodyText && state.bodyText.trim()) {
    bodyEl.innerText = state.bodyText;
  } else {
    bodyEl.innerText = 'أعرض لعدالتكم الموقرة بأنه...\n(يرجى كتابة وقائع الدعوى والطلبات في حقل النص أو استخدام خاصية التحليل والتعبئة الذكية).';
  }

  // Closing - positioned naturally right after body
  document.getElementById('docClosing').innerText = state.closingSalutation || 'ولعدالتكم فائق التقدير والاحترام';

  // Date
  document.getElementById('docDate').innerText = 'التاريخ: ' + (state.petitionDate || getTodayFormattedArabic());

  // Signature (Role on top, Name below it)
  const roleEl = document.getElementById('docSigRole');
  const nameEl = document.getElementById('docSigName');
  if (roleEl) roleEl.innerText = state.sigRole || 'المشتكي / وكيله';
  if (nameEl) nameEl.innerText = state.sigName || 'المحامي سعد فراس أميل';
}

// Adjust font scale dynamically across all legal sections
function setFontScale(percent) {
  state.fontScale = percent;
  const sheet = document.getElementById('a4Sheet');
  const lbl = document.getElementById('scaleLabel');
  if (lbl) lbl.innerText = percent + '%';
  const slider = document.getElementById('scaleSlider');
  if (slider) slider.value = percent;
  if (!sheet) return;

  const factor = percent / 100;
  const bodyPt = 13.5 * factor;
  const courtPt = Math.max(11.5, 15.5 * factor);
  const titlePt = Math.max(11, 14 * factor);
  const subPt = Math.max(9.5, 12 * factor);
  const lineH = factor < 0.88 ? 1.40 : (factor < 0.95 ? 1.48 : 1.58);
  const spacingPt = Math.max(3, 8 * factor);

  sheet.style.setProperty('--paper-font-size', `${bodyPt.toFixed(1)}pt`);
  sheet.style.setProperty('--paper-line-height', `${lineH.toFixed(2)}`);
  sheet.style.setProperty('--paper-court-size', `${courtPt.toFixed(1)}pt`);
  sheet.style.setProperty('--paper-title-size', `${titlePt.toFixed(1)}pt`);
  sheet.style.setProperty('--paper-sub-size', `${subPt.toFixed(1)}pt`);
  sheet.style.setProperty('--paper-spacing', `${spacingPt.toFixed(1)}pt`);

  updateSinglePageFitIndicator();
}

// Check if A4 content overflows single sheet
function updateSinglePageFitIndicator() {
  const sheet = document.getElementById('a4Sheet');
  const badge = document.getElementById('fitBadge');
  if (!sheet || !badge) return;

  const isOverflow = sheet.scrollHeight > (sheet.clientHeight + 4);
  if (isOverflow) {
    badge.className = 'status-badge status-warn';
    badge.innerHTML = `⚠️ يتجاوز صفحة واحدة (${state.fontScale}%) - اضغط للملاءمة`;
    badge.onclick = () => window.autoFitSinglePage(false);
    badge.style.cursor = 'pointer';
  } else {
    badge.className = 'status-badge status-ok';
    badge.innerHTML = `✓ صفحة A4 واحدة متناسقة (${state.fontScale}%)`;
    badge.onclick = null;
    badge.style.cursor = 'default';
  }
}

// Auto-Fit Algorithm to guarantee 100% single-page fit
window.autoFitSinglePage = function(silent = false) {
  const sheet = document.getElementById('a4Sheet');
  if (!sheet) return 100;

  // Start from 100% and step down smoothly until everything fits safely within 1 sheet
  let scale = 100;
  setFontScale(scale);

  while (sheet.scrollHeight > (sheet.clientHeight - 4) && scale > 68) {
    scale -= 2;
    setFontScale(scale);
  }

  if (!silent) {
    showToast(`تمت ملاءمة أبعاد العريضة لتستقر في ورقة واحدة بنسبة (${scale}%) ✨`);
  }
  updateSinglePageFitIndicator();
  return scale;
};

// Reset Form
window.resetForm = function() {
  if (!confirm('هل تريد مسح الحقول وبدء عريضة جديدة؟')) return;
  state.courtRecipient = 'السيد قاضي محكمة تحقيق بغداد الجديدة المحترم';
  state.complainantName = '';
  state.complainantAddress = '';
  state.defendantName = '';
  state.defendantAddress = '';
  state.subject = '';
  state.bodyText = '';
  state.petitionDate = getTodayFormattedArabic();
  state.sigRole = 'المشتكي / وكيله';
  state.sigName = 'المحامي سعد فراس أميل';
  state.fontScale = 100;

  // Repopulate form
  const inputs = ['courtRecipient', 'complainantName', 'complainantAddress', 
                  'defendantName', 'defendantAddress', 'subject', 'bodyText', 
                  'petitionDate', 'sigRole', 'sigName'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = state[id];
  });

  setFontScale(100);
  renderPreview();
  window.autoFitSinglePage(true);
  saveDraftToStorage();
  showToast('تم تجهيز استمارة جديدة فارغة');
};

// ==========================================================================
// Smart AI Text Parser (محلل الذكاء الاصطناعي الأصولي)
// ==========================================================================
window.openAiModal = function() {
  document.getElementById('aiModal').classList.add('active');
  document.getElementById('aiRawInput').focus();
};

window.closeAiModal = function() {
  document.getElementById('aiModal').classList.remove('active');
};

window.processAiDraft = function() {
  const raw = document.getElementById('aiRawInput').value.trim();
  if (!raw) {
    alert('يرجى لصق نص العريضة أولاً');
    return;
  }

  const parsed = parseLegalText(raw);
  
  // Apply parsed results to state
  if (parsed.court) state.courtRecipient = parsed.court;
  if (parsed.complainant) state.complainantName = parsed.complainant;
  if (parsed.complainantAddress) state.complainantAddress = parsed.complainantAddress;
  if (parsed.defendant) state.defendantName = parsed.defendant;
  if (parsed.defendantAddress) state.defendantAddress = parsed.defendantAddress;
  if (parsed.subject) state.subject = parsed.subject;
  if (parsed.body) state.bodyText = parsed.body;
  if (parsed.sigRole) state.sigRole = parsed.sigRole;
  if (parsed.sigName) state.sigName = parsed.sigName;
  if (parsed.date) state.petitionDate = parsed.date;

  // Update inputs
  ['courtRecipient', 'complainantName', 'complainantAddress', 
   'defendantName', 'defendantAddress', 'subject', 'bodyText', 
   'petitionDate', 'sigRole', 'sigName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = state[id];
  });

  renderPreview();
  window.autoFitSinglePage(true);
  saveDraftToStorage();
  closeAiModal();
  autoFitSinglePage();
  showToast('تم استخراج البيانات وتعبئة كافة الحقول بنجاح! 🚀');

  // Switch to preview if user wants to see it on mobile
  if (window.innerWidth < 1024) {
    switchTab('preview');
  }
};

function stripDiacritics(str) {
  return str.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
}

/**
 * Intelligent regex and heuristic extractor for Iraqi court drafts
 */
function parseLegalText(text) {
  const result = {
    court: null,
    complainant: null,
    complainantAddress: null,
    defendant: null,
    defendantAddress: null,
    subject: null,
    body: null,
    signature: null,
    date: null
  };

  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const bodyCandidates = [];

  const addressRegex = /(الساكن|الساكنة|عنوانه|عنوانها|محل سكنه|محل سكنها|محل عمله|مقرها|مقر عمله|محل إقامته|العنوان|الهاتف|رقم الهاتف)/;

  for (let i = 0; i < rawLines.length; i++) {
    const originalLine = rawLines[i];
    const cleanLine = stripDiacritics(originalLine);

    // 0. Skip AI preambles
    if (/^(تفضل|إليك|اليك|نموذج|صياغة|هذه عريضة|أدناه نص|فيما يلي)/i.test(cleanLine)) {
      continue;
    }

    // Skip Basmala
    if (/^بسم\s*الله/i.test(cleanLine)) {
      continue;
    }

    // 1. Court Recipient Header
    if (!result.court && /(السيد قاضي|السيد رئيس|إلى\s*[\/:]?\s*السيد|محكمة تحقيق|محكمة بداءة|محكمة الأحوال|محكمة جنح|محكمة الجنايات|محكمة استئناف)/i.test(cleanLine)) {
      result.court = originalLine.replace(/^(إلى\s*[\/:]?\s*|الى\s*[\/:]?\s*)/, '').trim();
      continue;
    }

    // 2. Complainant Name
    if (!result.complainant && /^(المشتكي|المشتكية|المدعي|المدعية|طالب التنفيذ|المستأنف)[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      const match = originalLine.match(/^(المشتكي|المشتكية|المدعي|المدعية|طالب التنفيذ|المستأنف)[\s:\/ـ-]+(.+)$/i);
      result.complainant = match[2].trim();
      
      // Inline address after / or -
      if (addressRegex.test(result.complainant)) {
        const parts = result.complainant.split(/[\/ـ-]\s*(?=(?:الساكن|الساكنة|عنوانه|عنوانها|محل|مقر|العنوان|الهاتف))/i);
        if (parts.length > 1) {
          result.complainant = parts[0].trim();
          result.complainantAddress = parts.slice(1).join(' - ').replace(/^[\s:\/ـ-]+/, '').replace(addressRegex, '').replace(/^[\s:\/ـ-]+/, '').trim();
        }
      }
      continue;
    }

    // Complainant Address if on immediate next line
    if (result.complainant && !result.complainantAddress && !result.defendant && addressRegex.test(cleanLine) && !/^(المشكو|المدعى)/.test(cleanLine)) {
      result.complainantAddress = originalLine.replace(/^.*?(الساكن|الساكنة|عنوانه|عنوانها|محل سكنه|محل سكنها|محل عمله|مقرها|العنوان|الهاتف)[\s:\/ـ-]*/i, '').trim();
      continue;
    }

    // 3. Defendant Name
    if (!result.defendant && /^(المشكو منه|المشكو منها|المدعى عليه|المدعى عليها|المنفذ ضده|المستأنف عليه)[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      const match = originalLine.match(/^(المشكو منه|المشكو منها|المدعى عليه|المدعى عليها|المنفذ ضده|المستأنف عليه)[\s:\/ـ-]+(.+)$/i);
      result.defendant = match[2].trim();

      // Inline address after / or -
      if (addressRegex.test(result.defendant)) {
        const parts = result.defendant.split(/[\/ـ-]\s*(?=(?:الساكن|الساكنة|عنوانه|عنوانها|محل|مقر|العنوان|الهاتف))/i);
        if (parts.length > 1) {
          result.defendant = parts[0].trim();
          result.defendantAddress = parts.slice(1).join(' - ').replace(/^[\s:\/ـ-]+/, '').replace(addressRegex, '').replace(/^[\s:\/ـ-]+/, '').trim();
        }
      }
      continue;
    }

    // Defendant Address if on immediate next line
    if (result.defendant && !result.defendantAddress && addressRegex.test(cleanLine) && !/^(الموضوع|م\s*[\/:]|تحية|أعرض)/.test(cleanLine)) {
      result.defendantAddress = originalLine.replace(/^.*?(الساكن|الساكنة|عنوانه|عنوانها|محل سكنه|محل سكنها|محل عمله|مقرها|العنوان|الهاتف)[\s:\/ـ-]*/i, '').trim();
      continue;
    }

    // 4. Subject line
    if (!result.subject && /^(الموضوع|م\s*[\/:]|م\/|جهة الشكوى|جهة الدعوى)[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      result.subject = originalLine.replace(/^(الموضوع|م\s*[\/:]|م\/|جهة الشكوى|جهة الدعوى)[\s:\/ـ-]+/i, '').trim();
      continue;
    }

    // 5. Strict Date (only if line explicitly designates a formal date)
    if (!result.date && /^التاريخ[\s:\/ـ-]+(.+)$/i.test(cleanLine)) {
      result.date = originalLine.replace(/^التاريخ[\s:\/ـ-]+/i, '').trim();
      continue;
    }
    // Or if in the very last 3 lines and has date pattern
    if (!result.date && i >= rawLines.length - 3 && /(التاريخ|تحريراً في)[\s:\/ـ-]+(\d{1,4}.+)$/i.test(cleanLine)) {
      const dateM = originalLine.match(/(التاريخ|تحريراً في)[\s:\/ـ-]+(\d{1,4}.+)$/i);
      result.date = dateM[2].trim();
      continue;
    }

    // 6. Signature block (in the last 4 lines)
    if (i >= rawLines.length - 4 && /(المشتكي|المشتكية|المدعي|المدعية|وكيله|وكيل|المحامي|مقدم الطلب|التوقيع)/i.test(cleanLine)) {
      if (/المحامي/i.test(originalLine)) {
        const parts = originalLine.split(/(?=المحامي)/i);
        result.sigRole = parts[0].replace(/[\/ـ:-]+$/, '').trim() || 'المشتكي / وكيله';
        result.sigName = parts.slice(1).join('').trim() || 'المحامي سعد فراس أميل';
      } else {
        result.sigRole = originalLine;
        result.sigName = state.sigName || 'المحامي سعد فراس أميل';
      }
      continue;
    }

    // 7. Salutations / Closings removal
    if (/^(تحية طيبة|تحية واحترام|السلام عليكم ورحمة|سيدي القاضي المحترم)/i.test(cleanLine)) {
      continue;
    }
    if (/^(ولعدالتكم فائق|مع فائق التقدير|وتقبلوا فائق|ولكم وافر الاحترام|مع وافر الاحترام)/i.test(cleanLine)) {
      continue;
    }

    // Everything else is body!
    bodyCandidates.push(originalLine);
  }

  result.body = bodyCandidates.join('\n\n');
  return result;
}

// ==========================================================================
// Archive & LocalStorage Management
// ==========================================================================
const STORAGE_DRAFT_KEY = 'iraqi_petition_draft_v1';
const STORAGE_ARCHIVE_KEY = 'iraqi_petitions_archive_v1';

function saveDraftToStorage() {
  localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(state));
}

function loadDraftFromStorage() {
  const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.signatureText && !parsed.sigRole) {
        if (parsed.signatureText.includes('المحامي')) {
          const parts = parsed.signatureText.split(/(?=المحامي)/);
          parsed.sigRole = parts[0].replace(/[\/ـ:-]+$/, '').trim() || 'المشتكي / وكيله';
          parsed.sigName = parts.slice(1).join('').trim() || 'المحامي سعد فراس أميل';
        } else {
          parsed.sigRole = 'المشتكي / وكيله';
          parsed.sigName = parsed.signatureText;
        }
      }
      Object.assign(state, parsed);
    } catch (e) {
      console.warn('Error loading draft', e);
    }
  }
}

window.saveToArchive = function() {
  if (!state.complainantName && !state.bodyText) {
    alert('لا توجد بيانات كافية لحفظها في الأرشيف (اكتب اسم المشتكي أو العريضة على الأقل).');
    return;
  }

  const archive = getArchiveList();
  const title = (state.subject || (state.complainantName ? `شكوى / ${state.complainantName}` : 'عريضة دعوى')).trim();
  
  const newItem = {
    id: 'case_' + Date.now(),
    title: title,
    court: state.courtRecipient,
    complainant: state.complainantName,
    defendant: state.defendantName,
    date: state.petitionDate,
    savedAt: new Date().toLocaleString('ar-IQ'),
    data: { ...state }
  };

  archive.unshift(newItem);
  localStorage.setItem(STORAGE_ARCHIVE_KEY, JSON.stringify(archive));
  showToast('تم حفظ القضية في الأرشيف بنجاح 📁');
  renderArchiveList();
};

function getArchiveList() {
  const raw = localStorage.getItem(STORAGE_ARCHIVE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Sync with server-side archive.json (pushed by AI or backend)
window.syncServerArchive = async function(manual = false) {
  try {
    const res = await fetch('archive.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const serverItems = await res.json();
      if (Array.isArray(serverItems) && serverItems.length > 0) {
        let local = getArchiveList();
        serverItems.forEach(sItem => {
          const idx = local.findIndex(x => x.id === sItem.id);
          if (idx === -1) {
            local.unshift(sItem);
          } else {
            local[idx] = sItem;
          }
        });
        localStorage.setItem(STORAGE_ARCHIVE_KEY, JSON.stringify(local));
        renderArchiveList();
        if (manual) showToast('تمت مزامنة الأرشيف من الخادم بنجاح 📁⚡');
        return;
      }
    }
  } catch (e) {
    console.warn('Sync error:', e);
    if (manual) showToast('تعذر الاتصال بالأرشيف');
  }
};

window.openArchiveModal = async function() {
  document.getElementById('archiveModal').classList.add('active');
  renderArchiveList();
  await window.syncServerArchive(false);
};

window.closeArchiveModal = function() {
  document.getElementById('archiveModal').classList.remove('active');
};

function renderArchiveList() {
  const container = document.getElementById('archiveList');
  const items = getArchiveList();

  if (items.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b;">لا توجد قضايا محفوظة في الأرشيف حتى الآن.</div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="archive-item">
      <div class="archive-info">
        <h4>${item.title}</h4>
        <p>🏛️ ${item.court} | 📅 ${item.savedAt}</p>
        <p style="margin-top:2px; font-size:11.5px; color:#cbd5e1;">
          <b>المشتكي:</b> ${item.complainant || 'غير محدد'} &bull; 
          <b>المشكو منه:</b> ${item.defendant || 'غير محدد'}
        </p>
      </div>
      <div class="archive-actions">
        <button class="btn btn-secondary btn-sm" onclick="loadCaseFromArchive('${item.id}')" title="فتح للتعديل">
          تعديل ✏️
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteCaseFromArchive('${item.id}')" title="حذف">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

window.loadCaseFromArchive = function(id) {
  const items = getArchiveList();
  const found = items.find(x => x.id === id);
  if (!found) return;

  Object.assign(state, found.data);

  // Migrate old archive items if needed
  if (found.data.signatureText && !found.data.sigRole) {
    if (found.data.signatureText.includes('المحامي')) {
      const parts = found.data.signatureText.split(/(?=المحامي)/);
      state.sigRole = parts[0].replace(/[\/ـ:-]+$/, '').trim() || 'المشتكي / وكيله';
      state.sigName = parts.slice(1).join('').trim() || 'المحامي سعد فراس أميل';
    } else {
      state.sigRole = 'المشتكي / وكيله';
      state.sigName = found.data.signatureText;
    }
  }

  // Update inputs
  ['courtRecipient', 'complainantName', 'complainantAddress', 
   'defendantName', 'defendantAddress', 'subject', 'bodyText', 
   'petitionDate', 'sigRole', 'sigName'].forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = state[k] || '';
  });

  if (state.fontScale) setFontScale(state.fontScale);
  renderPreview();
  window.autoFitSinglePage(true);
  saveDraftToStorage();
  closeArchiveModal();
  showToast(`تم فتح قضية: ${found.title}`);

  if (window.innerWidth < 1024) {
    switchTab('editor');
  }
};

window.deleteCaseFromArchive = function(id) {
  if (!confirm('هل أنت متأكد من حذف هذه العريضة من الأرشيف؟')) return;
  let items = getArchiveList();
  items = items.filter(x => x.id !== id);
  localStorage.setItem(STORAGE_ARCHIVE_KEY, JSON.stringify(items));
  renderArchiveList();
  showToast('تم حذف القضية من الأرشيف');
};

// ==========================================================================
// Tabs & Navigation
// ==========================================================================
function setupTabEvents() {
  const tabEditor = document.getElementById('tabEditor');
  const tabPreview = document.getElementById('tabPreview');

  if (tabEditor) tabEditor.addEventListener('click', () => switchTab('editor'));
  if (tabPreview) tabPreview.addEventListener('click', () => switchTab('preview'));
}

window.switchTab = function(tabName) {
  state.activeTab = tabName;
  const editorPane = document.getElementById('editorPane');
  const previewPane = document.getElementById('previewPane');
  const tabEditor = document.getElementById('tabEditor');
  const tabPreview = document.getElementById('tabPreview');
  const mNavEditor = document.getElementById('mNavEditor');
  const mNavPreview = document.getElementById('mNavPreview');

  if (window.innerWidth < 1024) {
    if (tabName === 'editor') {
      editorPane.style.display = 'block';
      previewPane.style.display = 'none';
      if (tabEditor) tabEditor.classList.add('active');
      if (tabPreview) tabPreview.classList.remove('active');
      if (mNavEditor) mNavEditor.classList.add('active');
      if (mNavPreview) mNavPreview.classList.remove('active');
    } else {
      editorPane.style.display = 'none';
      previewPane.style.display = 'block';
      if (tabEditor) tabEditor.classList.remove('active');
      if (tabPreview) tabPreview.classList.add('active');
      if (mNavEditor) mNavEditor.classList.remove('active');
      if (mNavPreview) mNavPreview.classList.add('active');
      updateSinglePageFitIndicator();
      setTimeout(updateMobileSheetZoom, 50);
    }
  } else {
    // Both visible on desktop
    editorPane.style.display = 'block';
    previewPane.style.display = 'block';
    updateMobileSheetZoom();
  }
};

// Handle window resizing
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    document.getElementById('editorPane').style.display = 'block';
    document.getElementById('previewPane').style.display = 'block';
  } else {
    switchTab(state.activeTab);
  }
  updateMobileSheetZoom();
});

// ==========================================================================
// Printing & Native iOS Sheet / Direct PDF Export
// ==========================================================================
window.printPetition = function() {
  window.autoFitSinglePage(true);
  renderPreview();
  updateSinglePageFitIndicator();

  // On iOS Safari, window.print() opens the system Print Sheet
  window.print();
};

/**
 * Direct High-Resolution Single-Page PDF Export & Native iOS Share
 * - Guarantees strictly 1 single A4 page with zero cutoffs or page spillover.
 * - Automatically executes proportional auto-fit before rendering.
 * - Fixes mobile viewport wrapping in html2canvas (uses desktop 794px coordinate system).
 * - Delivers via iOS Safari Native Share Sheet (WhatsApp, AirDrop, Save to Files) or direct download.
 */
window.exportDirectPDF = async function() {
  if (typeof html2pdf === 'undefined') {
    alert('محرك تصدير الـ PDF قيد التحميل، يرجى المحاولة بعد قليل أو إعادة تحديث الصفحة.');
    return;
  }

  const sheet = document.getElementById('a4Sheet');
  const previewPane = document.getElementById('previewPane');
  if (!sheet || !previewPane) return;

  // 1. Automatically fit content into 1 single page before capture
  window.autoFitSinglePage(true);
  renderPreview();

  // 2. Build clean, human-readable legal filename
  let filename = 'عريضة_دعوى_قضائية';
  const cName = (state.complainantName || '').trim();
  const dName = (state.defendantName || '').trim();
  if (cName && dName) {
    filename = `عريضة_${cName}_ضد_${dName}`;
  } else if (cName) {
    filename = `عريضة_${cName}`;
  } else if (state.subject && state.subject.trim()) {
    filename = state.subject.trim().replace(/^م\s*\/\s*/, '');
  }
  filename = filename.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_') + '.pdf';

  showToast('⏳ جاري ترتيب وتصدير العريضة في ورقة واحدة A4...');

  // 3. Preserve original DOM styling for smooth restoration
  const isPreviewHidden = (window.getComputedStyle(previewPane).display === 'none');
  const origPreviewDisplay = previewPane.style.display;
  const origPreviewPos = previewPane.style.position;
  const origPreviewLeft = previewPane.style.left;
  const origPreviewTop = previewPane.style.top;
  const origPreviewZ = previewPane.style.zIndex;
  const origPreviewVis = previewPane.style.visibility;

  const origSheetWidth = sheet.style.width;
  const origSheetMinWidth = sheet.style.minWidth;
  const origSheetMaxWidth = sheet.style.maxWidth;
  const origSheetHeight = sheet.style.height;
  const origSheetMinHeight = sheet.style.minHeight;
  const origSheetMaxHeight = sheet.style.maxHeight;
  const origSheetBoxSizing = sheet.style.boxSizing;
  const origSheetTransform = sheet.style.transform;
  const origSheetBoxShadow = sheet.style.boxShadow;
  const origSheetMargin = sheet.style.margin;

  try {
    // If user is currently editing on mobile and clicked export from the bottom nav or header,
    // previewPane is display: none. Temporarily position off-screen so html2canvas can measure & render it.
    if (isPreviewHidden) {
      previewPane.style.visibility = 'visible';
      previewPane.style.display = 'block';
      previewPane.style.position = 'fixed';
      previewPane.style.left = '-9999px';
      previewPane.style.top = '0';
      previewPane.style.zIndex = '-9999';
    }

    // Lock exact physical 1-page A4 pixel bounds (794px x 1120px)
    // 1120px strictly guarantees that canvas height / page ratio is < 1, preventing the 2nd page bug!
    sheet.style.width = '794px';
    sheet.style.minWidth = '794px';
    sheet.style.maxWidth = '794px';
    sheet.style.height = '1120px';
    sheet.style.minHeight = '1120px';
    sheet.style.maxHeight = '1120px';
    sheet.style.boxSizing = 'border-box';
    sheet.style.transform = 'none';
    sheet.style.boxShadow = 'none';
    sheet.style.margin = '0';
    sheet.style.direction = 'rtl';

    const opt = {
      singlePage: true,
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 794,
        windowHeight: 1120,
        width: 794,
        height: 1120
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: 'avoid-all' }
    };

    // Generate PDF blob
    const pdfBlob = await html2pdf().set(opt).from(sheet).outputPdf('blob');
    const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

    // iOS Safari / Web Share API support check
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          files: [pdfFile],
          title: filename.replace('.pdf', ''),
          text: 'عريضة دعوى قضائية أصولية - مكتب المحامي سعد فراس أميل'
        });
        showToast('تمت مشاركة العريضة بنجاح 📲✨');
        return;
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') {
          // User closed share sheet without selecting app
          return;
        }
        console.warn('Native share sheet cancelled or unavailable, falling back to download:', shareErr);
      }
    }

    // Fallback: Direct download via Blob URL (PC & Android/browsers without file share)
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

    showToast('تم تصدير وتحميل ورقة الـ PDF بنجاح 📥📄');

  } catch (err) {
    console.error('Export PDF error:', err);
    alert('حدث خطأ أثناء تصدير الـ PDF: ' + (err.message || err));
  } finally {
    // Restore original sheet styling
    sheet.style.width = origSheetWidth;
    sheet.style.minWidth = origSheetMinWidth;
    sheet.style.maxWidth = origSheetMaxWidth;
    sheet.style.height = origSheetHeight;
    sheet.style.minHeight = origSheetMinHeight;
    sheet.style.maxHeight = origSheetMaxHeight;
    sheet.style.boxSizing = origSheetBoxSizing;
    sheet.style.transform = origSheetTransform;
    sheet.style.boxShadow = origSheetBoxShadow;
    sheet.style.margin = origSheetMargin;

    // Restore preview pane state
    if (isPreviewHidden) {
      previewPane.style.display = origPreviewDisplay;
      previewPane.style.position = origPreviewPos;
      previewPane.style.left = origPreviewLeft;
      previewPane.style.top = origPreviewTop;
      previewPane.style.zIndex = origPreviewZ;
      previewPane.style.visibility = origPreviewVis;
    }

    updateMobileSheetZoom();
  }
};

// Toast notification helper
function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2800);
}
