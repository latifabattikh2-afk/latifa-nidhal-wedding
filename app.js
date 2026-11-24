(function () {
  const T = {
    en: {
      names: "Latifa & Nidhal", tap: "Tap the seal to open", open: "Open the invitation",
      invite: "Together with their families", invite2: "invite you to celebrate their wedding",
      date: "2 January 2027", time: "at 3:30 PM", place: "Flamingo Golf Course", city: "Monastir, Tunisia",
      cdTitle: "Counting down to our day", d: "Days", h: "Hours", m: "Minutes", s: "Seconds",
      where: "The venue", openMap: "Open in Maps",
      rsvpTitle: "Kindly reply", rsvpNote: "Please reply by 31 December 2026.",
      fName: "Your name", fMsg: "A message or blessing (optional)", fBtn: "Confirm attendance",
      ok: "Thank you. Your reply is registered.", dup: "This name is already registered.",
      closed: "Replies closed on 31 December 2026.", invalid: "Please check the fields and try again.",
      err: "Something went wrong. Please try again in a moment.", sending: "Sending…",
      gbTitle: "Guestbook", gbText: "Leave your congratulations and prayers for the couple.", gbBtn: "Write a message",
      phTitle: "Share your photos", phText: "Add the pictures you take at the celebration to our shared album.", phBtn: "Open the album",
      foot: "With love, Latifa & Nidhal", musicOn: "Music on", musicOff: "Music off",
      gbpTitle: "Guestbook", gbpText: "Your words will be read by Latifa and Nidhal.", gbpName: "Your name (optional)",
      gbpMsg: "Your congratulations or prayer", gbpBtn: "Send message", gbpOk: "Thank you. Your message was sent.", back: "Back to the invitation"
    },
    ar: {
      names: "لطيفة ونضال", tap: "المسوا الختم لفتح الدعوة", open: "افتح الدعوة",
      invite: "بكل حبّ وسرور", invite2: "يسرّنا دعوتكم لمشاركتنا فرحة زفافنا",
      date: "02 جانفي 2027", time: "الساعة 3:30 مساءً", place: "ملعب فلامنغو للغولف", city: "المنستير، تونس",
      cdTitle: "العدّ التنازلي ليوم فرحتنا", d: "أيام", h: "ساعات", m: "دقائق", s: "ثوانٍ",
      where: "مكان الحفل", openMap: "افتح في الخرائط",
      rsvpTitle: "تأكيد الحضور", rsvpNote: "نرجو تأكيد الحضور قبل 31 ديسمبر 2026.",
      fName: "الاسم", fMsg: "رسالة أو دعاء (اختياري)", fBtn: "تأكيد الحضور",
      ok: "شكراً لكم، تم تسجيل ردّكم.", dup: "هذا الاسم مسجَّل من قبل.",
      closed: "انتهت مهلة الرد في 31 ديسمبر 2026.", invalid: "يرجى مراجعة الحقول والمحاولة مجدداً.",
      err: "حدث خطأ، يرجى المحاولة بعد قليل.", sending: "جارٍ الإرسال…",
      gbTitle: "دفتر التهاني", gbText: "اتركوا تهانيكم ودعواتكم للعروسين.", gbBtn: "اكتبوا رسالة",
      phTitle: "شاركونا صوركم", phText: "أضيفوا الصور التي تلتقطونها في الحفل إلى ألبومنا المشترك.", phBtn: "افتح الألبوم",
      foot: "مع المحبة، لطيفة ونضال", musicOn: "تشغيل الموسيقى", musicOff: "إيقاف الموسيقى",
      gbpTitle: "دفتر التهاني", gbpText: "سيقرأ لطيفة ونضال كلماتكم.", gbpName: "الاسم (اختياري)",
      gbpMsg: "تهنئتكم أو دعاؤكم", gbpBtn: "إرسال", gbpOk: "شكراً لكم، تم إرسال رسالتكم.", back: "العودة إلى الدعوة"
    }
  };
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let lang = store.get("lang") === "ar" ? "ar" : "en";
  const t = (k) => T[lang][k] || k;
  const cfg = window.WEDDING || {};
  const bgm = $("#bgm");
  let musicOn = false;

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((e) => { e.textContent = t(e.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((e) => e.setAttribute("aria-label", t(e.dataset.i18nAria)));
    document.querySelectorAll("[data-i18n-ph]").forEach((e) => e.setAttribute("placeholder", t(e.dataset.i18nPh)));
    const lb = $("#lang"); if (lb) lb.textContent = lang === "ar" ? "English" : "العربية";
    setMusicLabel();
  }
  function setMusicLabel() { const m = $("#music"); if (m) m.textContent = musicOn ? t("musicOff") : t("musicOn"); }

  $("#lang").addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; store.set("lang", lang); applyLang(); });

  // music
  if ($("#music") && bgm && cfg.musicFile) {
    bgm.src = cfg.musicFile;
    bgm.addEventListener("error", () => { $("#music").hidden = true; });
    bgm.addEventListener("loadedmetadata", () => { $("#music").hidden = false; });
    bgm.volume = 0.6;
    $("#music").addEventListener("click", () => {
      if (musicOn) { bgm.pause(); musicOn = false; setMusicLabel(); }
      else bgm.play().then(() => { musicOn = true; setMusicLabel(); }).catch(() => {});
    });
  }

  // envelope
  const seal = $("#seal");
  if (seal) {
    const open = () => {
      $("#env").classList.add("open");
      if (bgm && cfg.musicFile) bgm.play().then(() => { musicOn = true; setMusicLabel(); }).catch(() => {});
      setTimeout(() => { $("#intro").classList.add("done"); document.body.classList.remove("locked"); }, 1700);
    };
    seal.addEventListener("click", open, { once: true });
    $("#env").addEventListener("click", () => seal.click());
    if (bgm && cfg.musicFile) bgm.preload = "auto";
  } else document.body.classList.remove("locked");

  // countdown (2 Jan 2027, 15:30 Tunisia time = UTC+1)
  const target = Date.parse("2027-01-02T15:30:00+01:00");
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    if (!$("#d")) return;
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    $("#d").textContent = Math.floor(s / 86400);
    $("#h").textContent = pad(Math.floor((s % 86400) / 3600));
    $("#m").textContent = pad(Math.floor((s % 3600) / 60));
    $("#s").textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  // photos section
  if (cfg.photoAlbumUrl && $("#photos")) { $("#phLink").href = cfg.photoAlbumUrl; $("#photos").hidden = false; }

  // forms
  function wire(formSel, msgSel, url, okKey) {
    const f = $(formSel); if (!f) return;
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = $(msgSel), btn = f.querySelector("button[type=submit]");
      msg.className = "msg"; msg.textContent = t("sending"); btn.disabled = true;
      try {
        const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(f))) });
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.ok) { msg.className = "msg ok"; msg.textContent = t(okKey); f.reset(); }
        else { msg.className = "msg bad"; msg.textContent = t(["duplicate", "closed", "invalid"].includes(d.error) ? (d.error === "duplicate" ? "dup" : d.error) : "err"); }
      } catch (err) { msg.className = "msg bad"; msg.textContent = t("err"); }
      btn.disabled = false;
    });
  }
  wire("#rsvp", "#rsvpMsg", "/api/rsvp", "ok");
  wire("#gb", "#gbMsg", "/api/guestbook", "gbpOk");

  applyLang();
})();
