(() => {
const C = window.CONFIG || {}, $ = s => document.querySelector(s), all = s => [...document.querySelectorAll(s)];
const T = {
en:{skip:"Skip",names:"Latifa & Nidhal",enter:"Open the invitation",t1:"Together with their families,",t2:"request the pleasure of your company<br>at the celebration of their wedding.",date:"02 January 2027",venue:"Flamingo Golf Course, Monastir, Tunisia",cdh:"Until we celebrate",prog:"The Day",p1:"Guest Reception",p2:"Marriage Ceremony",p3:"Photography",p4:"Musical Celebration",loc:"Location",dir:"Get directions",rs:"Kindly reply",rsd:"Please reply by 31 December 2026.",acc:"Joyfully accept",dec:"Regretfully decline",send:"Send reply",wl:"Words of Love",send2:"Send for review",vl:"Voices of Love",vs:"Every voice tells a story of love.",vlock:"Reply to the invitation first to record a message.",rec:"Record",stop:"Stop",vsend:"Send",again:"Record again",foot:"With love, Latifa & Nidhal",photos:"Share your wedding photos",fn:"Full name",yn:"Your name",bl:"A prayer or blessing (optional)",wp:"Write your wishes",d:["Days","Hours","Minutes","Seconds"],ok:"Thank you. Your reply is received.",dup:"This name has already replied.",closed:"Replies are now closed.",err:"Something went wrong. Please try again.",gok:"Thank you. Your words will appear once approved.",vok:"Thank you. Your voice is sent for review.",vready:"Record your message, then listen before sending.",vden:"Microphone access is needed to record.",lb:"العربية"},
ar:{skip:"تخطي",names:"لطيفة & نضال",enter:"افتح الدعوة",t1:"بكل الحب والسرور،",t2:"يتشرف السيدان بدعوتكم<br>لمشاركتهم فرحة زفافهما.",date:"02 جانفي 2027",venue:"نادي فلامينغو للغولف، المنستير، تونس",cdh:"متبقٍّ على الفرحة",prog:"برنامج اليوم",p1:"استقبال الضيوف",p2:"عقد القران",p3:"صور",p4:"حفل موسيقي",loc:"الموقع",dir:"احصل على الاتجاهات",rs:"تأكيد الحضور",rsd:"يرجى الرد قبل 31 ديسمبر 2026.",acc:"أؤكد حضوري",dec:"أعتذر عن الحضور",send:"إرسال الرد",wl:"كلمات محبة",send2:"إرسال للمراجعة",vl:"أصوات المحبة",vs:"كل صوت يحكي قصة حب.",vlock:"يرجى تأكيد الحضور أولاً لتسجيل رسالة صوتية.",rec:"تسجيل",stop:"إيقاف",vsend:"إرسال",again:"إعادة التسجيل",foot:"بكل محبة، لطيفة ونضال",photos:"شاركونا صور الزفاف",fn:"الاسم الكامل",yn:"اسمكم",bl:"دعاء أو تهنئة (اختياري)",wp:"اكتبوا تهانيكم",d:["أيام","ساعات","دقائق","ثواني"],ok:"شكراً لكم. تم استلام ردكم.",dup:"هذا الاسم مسجّل مسبقاً.",closed:"انتهت مهلة الرد.",err:"حدث خطأ. يرجى المحاولة مرة أخرى.",gok:"شكراً لكم. ستظهر كلماتكم بعد الموافقة.",vok:"شكراً لكم. تم إرسال صوتكم للمراجعة.",vready:"سجّلوا رسالتكم ثم استمعوا إليها قبل الإرسال.",vden:"يلزم السماح بالميكروفون للتسجيل.",lb:"English"}};
let L = localStorage.getItem('ln_lang') || 'en', rec = null;
const st = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };
const api = async (p, o) => { try { const r = await fetch(p, o); let d = null; try { d = await r.json() } catch (e) {} return { ok: r.ok, s: r.status, d } } catch (e) { return { ok: false, s: 0, d: null } } };
const post = (p, b, h) => api(p, { method: 'POST', headers: { 'content-type': 'application/json', ...h }, body: JSON.stringify(b) });
const say = (el, k) => { el.dataset.k = k; el.textContent = T[L][k] || '' };

function setL(l) {
  L = l; st.set('ln_lang', l); const h = document.documentElement; h.lang = l; h.dir = l == 'ar' ? 'rtl' : 'ltr';
  all('[data-i]').forEach(e => e.innerHTML = T[l][e.dataset.i]);
  all('[data-p]').forEach(e => e.placeholder = T[l][e.dataset.p]);
  all('.msg').forEach(e => { if (e.dataset.k) e.textContent = T[l][e.dataset.k] });
  if (!$('#vui').hidden) { $('#vnote').textContent = T[l].vready; if (!(rec && rec.state == 'recording')) $('#vr').textContent = T[l].rec; else $('#vr').textContent = T[l].stop }
  $('#lb').textContent = T[l].lb; tick();
}
$('#lb').onclick = () => setL(L == 'en' ? 'ar' : 'en');

// ---- map + links
$('#map').src = 'https://maps.google.com/maps?q=' + encodeURIComponent(C.MAP_QUERY) + '&output=embed';
$('#dirl').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.MAP_QUERY);
if (C.PHOTO_URL) { const a = $('#photol'); a.href = C.PHOTO_URL; a.hidden = false }

// ---- sound (all optional; files that are missing stay silent)
const sounds = []; let muted = false;
function snd(k, vol, fade) {
  const u = C.audio && C.audio[k]; if (!u) return;
  const a = new Audio(u); a.preload = 'auto'; a.muted = muted; sounds.push(a); const target = vol;
  a.volume = fade ? 0 : vol; a.loop = k == 'music';
  a.play().then(() => { $('#snd').style.display = 'block'; if (fade) { let t = 0; const iv = setInterval(() => { t += .05; a.volume = Math.min(target, target * t / 6); if (t >= 6) clearInterval(iv) }, 300) } }).catch(() => {});
}
$('#snd').onclick = () => { muted = !muted; sounds.forEach(a => a.muted = muted); $('#snd').style.opacity = muted ? .45 : 1 };

// ---- opening sequence
const ls = all('#intro .l'), sleep = ms => new Promise(r => setTimeout(r, ms)); let gone = false;
function finish() { if (gone) return; gone = true; $('#main').classList.add('on'); const i = $('#intro'); i.style.transition = 'opacity 2.2s'; i.style.opacity = 0; setTimeout(() => i.remove(), 2300); scrollTo(0, 0) }
$('#skip').onclick = () => { if (!sounds.length) snd('music', .5, true); finish() };
$('#enter').onclick = async () => {
  $('#ctl').style.display = 'none'; snd('music', .5, true); snd('birds', .25);
  ls[0].classList.add('on'); await sleep(5200); if (gone) return;
  snd('wings', .15); ls[1].classList.add('on'); await sleep(5200); if (gone) return;
  ls[2].classList.add('on'); await sleep(3200); if (gone) return; $('#gate').classList.add('show');
};
$('#gate').onclick = async () => { $('#gate').classList.remove('show'); snd('gate', .35); ls[2].classList.add('go'); await sleep(1800); finish() };

// ---- countdown: 2 Jan 2027, 3:30 PM Monastir (UTC+1, no daylight saving)
const target = new Date('2027-01-02T15:30:00+01:00');
function tick() {
  const d = Math.max(0, target - Date.now()) / 1000 | 0, v = [d / 86400 | 0, d % 86400 / 3600 | 0, d % 3600 / 60 | 0, d % 60];
  $('#cd').innerHTML = v.map((n, i) => `<div><b>${String(n).padStart(2, '0')}</b>${T[L].d[i]}</div>`).join('');
}
setInterval(tick, 1000);

// ---- RSVP
const open_ = () => Date.now() < Date.parse('2027-01-01T00:00:00+01:00');
function unlock() { $('#vui').hidden = false; $('#vnote').textContent = T[L].vready }
if (st.get('ln_token')) { unlock(); $('#rn').value = st.get('ln_name') || '' }
$('#rf').onsubmit = async e => {
  e.preventDefault(); const b = e.submitter || $('#rf button'); b.disabled = true;
  if (!open_()) { say($('#rmsg'), 'closed'); b.disabled = false; return }
  const r = await post('/api/rsvp', { name: $('#rn').value, attending: $('#rf').a.value, message: $('#rm').value });
  if (r.ok) { st.set('ln_token', r.d.token); st.set('ln_name', r.d.name); say($('#rmsg'), 'ok'); $('#rm').value = ''; unlock(); }
  else say($('#rmsg'), r.s == 409 ? 'dup' : r.s == 410 ? 'closed' : 'err');
  b.disabled = false;
};

// ---- guestbook
const tx = (t, s) => { const e = document.createElement(t); e.textContent = s; return e };
async function loadWall() {
  const r = await api('/api/wishes'); if (!r.ok) return; const w = $('#wall'); w.replaceChildren();
  r.d.forEach(x => { const d = document.createElement('div'); d.className = 'wish'; d.append(tx('b', x.name), tx('span', x.message)); w.append(d) });
}
$('#gf').onsubmit = async e => {
  e.preventDefault(); const r = await post('/api/wish', { name: $('#gn').value, message: $('#gm').value });
  say($('#gmsg'), r.ok ? 'gok' : 'err'); if (r.ok) $('#gm').value = '';
};

// ---- voices
async function loadVoices() {
  const r = await api('/api/voices'); if (!r.ok) return; const w = $('#vwall'); w.replaceChildren();
  r.d.forEach(v => { const d = document.createElement('div'); d.className = 'vl'; const a = document.createElement('audio'); a.controls = true; a.preload = 'none'; a.src = '/api/voice/' + v.id + '/audio'; d.append(tx('b', v.name), a); w.append(d) });
}
let blob = null;
$('#vr').onclick = async () => {
  if (rec && rec.state == 'recording') { rec.stop(); return }
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true }); const chunks = []; rec = new MediaRecorder(s);
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => { clearTimeout(rec.t); s.getTracks().forEach(t => t.stop()); blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' }); const a = $('#va'); a.src = URL.createObjectURL(blob); a.hidden = false; $('#vact').hidden = false; $('#vr').hidden = true };
    rec.start(); rec.t = setTimeout(() => rec.state == 'recording' && rec.stop(), 60000); $('#vr').textContent = T[L].stop; say($('#vmsg'), 'vready');
  } catch (x) { say($('#vmsg'), 'vden') }
};
$('#vre').onclick = () => { $('#va').hidden = true; $('#vact').hidden = true; $('#vr').hidden = false; $('#vr').textContent = T[L].rec };
$('#vs2').onclick = async () => {
  if (!blob) return; $('#vs2').disabled = true;
  const r = await api('/api/voice', { method: 'POST', headers: { 'x-token': st.get('ln_token') || '', 'content-type': blob.type.split(';')[0] }, body: blob });
  say($('#vmsg'), r.ok ? 'vok' : 'err'); if (r.ok) { $('#vact').hidden = true; $('#va').hidden = true; blob = null; $('#vr').hidden = false } $('#vs2').disabled = false;
};

setL(L); loadWall(); loadVoices();
})();
