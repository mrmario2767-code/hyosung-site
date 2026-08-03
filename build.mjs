// (주)효성중전기 사이트 생성 스크립트
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const NOTES = '/home/user/hyosung/notes/cyclo';
const OUT = '/home/user/hyosung/site';
const J = f => JSON.parse(readFileSync(join(NOTES, f), 'utf8'));

/* ───────────────────────── shared template ───────────────────────── */
const CSS = `
:root{--space:#0A1230;--space2:#101A42;--blue:#2A5CFF;--violet:#7A5CFF;--cyan:#2BD9E5;
--ink:#141B33;--slate:#5A6480;--cloud:#F5F7FB;--line:#E3E7F0;--white:#fff}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Noto Sans KR',sans-serif;color:var(--ink);background:#fff;line-height:1.65;overflow-x:hidden}
a{text-decoration:none;color:inherit}ul{list-style:none}
.wrap{max-width:1200px;margin:0 auto;padding:0 28px}
header{position:sticky;top:0;left:0;right:0;z-index:100;background:rgba(10,18,48,.94);backdrop-filter:blur(14px)}
header .hd{display:flex;align-items:center;justify-content:space-between;height:74px}
.logo{display:flex;flex-direction:column;line-height:1;color:#fff}
.logo .lrow{display:flex;align-items:center;gap:9px}
.logo .en{font-family:'Marcellus',serif;font-size:24px;letter-spacing:.05em}
.logo .he{display:flex;flex-direction:column;gap:3px;font-family:'Outfit',sans-serif;font-size:9.5px;letter-spacing:.22em;color:var(--cyan);font-weight:600}
.logo .kr{display:flex;justify-content:space-between;font-size:13.5px;color:#fff;margin-top:6px;font-weight:700}
.logo .sub{font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:.42em;color:var(--cyan);margin-top:4px;font-weight:500}
nav.gnb>ul{display:flex;gap:2px}
nav.gnb>ul>li{position:relative}
nav.gnb>ul>li>a{display:block;padding:11px 15px;font-weight:500;font-size:15px;color:rgba(255,255,255,.88);border-radius:99px;transition:.2s}
nav.gnb>ul>li>a:hover,nav.gnb>ul>li>a.on{color:#fff;background:rgba(255,255,255,.10)}
nav.gnb .dep2{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);background:rgba(13,21,54,.96);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.12);border-radius:14px;min-width:160px;padding:8px;display:none}
nav.gnb .dep2::before{content:"";position:absolute;left:-10px;right:-10px;top:-14px;height:14px}
nav.gnb>ul>li:hover .dep2{display:block}
nav.gnb .dep2 a{display:block;padding:9px 14px;font-size:14px;border-radius:8px;color:rgba(255,255,255,.75);white-space:nowrap}
nav.gnb .dep2 a:hover{background:rgba(255,255,255,.10);color:#fff}
.cta-btn{font-weight:700;font-size:14.5px;padding:10px 24px;border-radius:99px;color:#fff;background:linear-gradient(135deg,var(--blue),var(--violet));box-shadow:0 6px 20px rgba(42,92,255,.35);transition:.25s}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(42,92,255,.5)}
.m-toggle{display:none;background:none;border:none;font-size:26px;color:#fff;cursor:pointer}
/* page hero */
.phero{position:relative;background:radial-gradient(900px 460px at 80% 0%,rgba(122,92,255,.4),transparent 60%),radial-gradient(700px 400px at 10% 100%,rgba(43,217,229,.18),transparent 55%),linear-gradient(140deg,#0A1230 10%,#16246E 70%,#22348F 100%);color:#fff;padding:74px 0 58px;overflow:hidden}
.phero::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 55px,rgba(255,255,255,.04) 56px),repeating-linear-gradient(90deg,transparent,transparent 55px,rgba(255,255,255,.04) 56px)}
.phero .wrap{position:relative;z-index:1}
.phero .tag{font-family:'Outfit',sans-serif;font-size:13.5px;letter-spacing:.32em;font-weight:600;color:var(--cyan);text-transform:uppercase}
.phero h1{font-size:clamp(30px,4vw,44px);font-weight:900;margin-top:10px;letter-spacing:-.01em}
.phero p{margin-top:12px;color:rgba(255,255,255,.75);font-weight:300;max-width:70ch}
/* content */
.content{padding:56px 0 90px}
.card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px}
/* tabs */
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 28px}
.tabs button{font-family:'Noto Sans KR',sans-serif;font-size:15px;font-weight:500;padding:10px 22px;border-radius:99px;border:1.5px solid var(--line);background:#fff;color:var(--slate);cursor:pointer;transition:.2s}
.tabs button:hover{border-color:var(--blue);color:var(--blue)}
.tabs button.on{background:var(--space);border-color:var(--space);color:#fff;font-weight:700}
.subtabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 22px}
.subtabs a,.subtabs button{font-size:13.5px;font-weight:500;padding:7px 16px;border-radius:99px;background:var(--cloud);border:1px solid var(--line);color:var(--slate);cursor:pointer;transition:.2s}
.subtabs a:hover,.subtabs button:hover{color:var(--blue);border-color:var(--blue)}
.subtabs button.on{background:#EDEBFF;border-color:var(--violet);color:var(--violet);font-weight:700}
/* tables */
.tbl-sec{margin-bottom:46px}
.tbl-sec h3{font-size:21px;font-weight:900;display:flex;align-items:center;gap:10px;margin-bottom:6px}
.tbl-sec h3::before{content:"";width:5px;height:22px;border-radius:3px;background:linear-gradient(180deg,var(--blue),var(--cyan))}
.tbl-sec .desc{color:var(--slate);font-size:14px;margin-bottom:14px}
.tbl-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:#fff}
table.spec{border-collapse:collapse;width:100%;min-width:640px;font-size:13.5px}
table.spec th,table.spec td{border:1px solid #E9EDF4;padding:7px 10px;text-align:center;white-space:nowrap}
table.spec thead th{background:var(--space);color:#fff;font-weight:500;font-size:13px;border-color:#26325E}
table.spec thead tr:nth-child(2) th{background:#1A2450;font-weight:400;font-size:12px;color:#BFC9E4}
table.spec tbody th{background:var(--cloud);font-weight:700;color:var(--ink)}
table.spec tbody tr:nth-child(even) td{background:#F8FAFD}
table.spec tbody tr:hover td{background:#EEF3FF}
table.spec td.num{font-family:'Outfit','Noto Sans KR',sans-serif;font-variant-numeric:tabular-nums}
table.spec td.dim{color:#B6BECF}
.note-box{background:#F4F7FF;border:1px solid #D9E3FF;border-radius:12px;padding:14px 18px;font-size:13.5px;color:#40507E;margin:14px 0 0}
.note-box b{color:var(--blue)}
/* download list */
.dl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.dl-card{border:1px solid var(--line);border-radius:16px;padding:24px;background:#fff;transition:.2s;display:flex;flex-direction:column;gap:6px}
.dl-card:hover{border-color:var(--blue);box-shadow:0 12px 28px rgba(42,92,255,.10);transform:translateY(-3px)}
.dl-card .cat{font-family:'Outfit',sans-serif;font-size:11.5px;letter-spacing:.2em;font-weight:600;color:var(--violet)}
.dl-card h4{font-size:16px;font-weight:700;line-height:1.4}
.dl-card .meta{font-size:12.5px;color:#98A2B8}
.dl-card .act{margin-top:auto;padding-top:12px}
.dl-btn{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:700;color:var(--blue);border:1.5px solid var(--blue);border-radius:99px;padding:7px 18px;transition:.2s}
.dl-btn:hover{background:var(--blue);color:#fff}
/* board table */
table.board{border-collapse:collapse;width:100%;font-size:14.5px}
table.board th,table.board td{padding:13px 14px;border-bottom:1px solid var(--line);text-align:left}
table.board thead th{background:var(--cloud);font-weight:700;font-size:13.5px;color:var(--slate);border-top:2px solid var(--space)}
table.board td.c,table.board th.c{text-align:center;white-space:nowrap}
table.board tbody tr:hover td{background:#F8FAFD}
.badge{display:inline-block;font-size:11.5px;font-weight:700;border-radius:6px;padding:2px 8px;background:#EDEBFF;color:var(--violet)}
.badge.lang{background:#E8F8FA;color:#0E96A5}
/* section head */
.sec-h{margin:44px 0 18px}
.sec-h h2{font-size:24px;font-weight:900}
.sec-h p{color:var(--slate);font-size:14.5px;margin-top:4px}
/* about */
.about-lead{font-size:clamp(19px,2.2vw,26px);font-weight:700;line-height:1.6;letter-spacing:-.01em}
.about-lead em{font-style:normal;color:var(--blue)}
.about-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:34px}
.info-table{width:100%;border-collapse:collapse;font-size:15px}
.info-table th{width:130px;text-align:left;padding:13px 10px;border-bottom:1px solid var(--line);color:var(--slate);font-weight:500;vertical-align:top;white-space:nowrap}
.info-table td{padding:13px 10px;border-bottom:1px solid var(--line);font-weight:500}
/* contact band */
.cband{position:relative;background:linear-gradient(120deg,#12206B,#2A5CFF 55%,#7A5CFF);color:#fff;overflow:hidden;padding:56px 0}
.cband::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 55px,rgba(255,255,255,.05) 56px),repeating-linear-gradient(90deg,transparent,transparent 55px,rgba(255,255,255,.05) 56px)}
.cband .wrap{position:relative;z-index:1;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center}
.cband h2{font-size:clamp(24px,3vw,32px);font-weight:900}
.cband p{color:rgba(255,255,255,.82);font-weight:300;margin-top:8px}
.cband .tel{font-family:'Outfit',sans-serif;font-size:clamp(32px,4vw,46px);font-weight:600;text-align:right;line-height:1.1}
.cband .tel small{display:block;font-size:14px;letter-spacing:.3em;color:#BFF3F8;font-weight:500;margin-bottom:4px}
.cband .sub{margin-top:10px;color:rgba(255,255,255,.85);font-size:14px;font-weight:300;text-align:right}
footer{background:var(--space);color:#7E88A3;font-size:13.5px;padding:42px 0}
footer .f-logo{font-family:'Marcellus',serif;color:#fff;font-size:19px;letter-spacing:.07em}
footer .f-logo span{display:block;font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:.4em;color:var(--cyan);margin-top:4px}
footer p{margin-top:13px;line-height:2;font-weight:300}
footer .copy{margin-top:14px;color:#4A5470;font-size:12.5px}
.reveal{opacity:0;transform:translateY(30px);transition:.7s cubic-bezier(.2,.7,.3,1)}
.reveal.on{opacity:1;transform:none}
[hidden]{display:none!important}
@media(max-width:960px){
 nav.gnb{display:none}.m-toggle{display:block}
 .dl-grid{grid-template-columns:1fr}
 .about-grid{grid-template-columns:1fr}
 .cband .wrap{grid-template-columns:1fr}
 .cband .tel,.cband .sub{text-align:left}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}.reveal{opacity:1!important;transform:none!important}}
`;

const NAV = (active = '') => `
<header>
  <div class="wrap hd">
    <a href="index.html" class="logo" aria-label="효성중전기 홈">
      <span class="lrow"><span class="en">HYOSUNG</span><span class="he"><span>HEAVY</span><span>ELECTRIC</span></span></span>
      <span class="kr"><span>효</span><span>성</span><span>중</span><span>전</span><span>기</span></span>
    </a>
    <nav class="gnb" aria-label="주 메뉴">
      <ul>
        <li><a href="about.html" class="${active==='about'?'on':''}">회사소개</a></li>
        <li><a href="product-hv.html" class="${active==='hv'||active==='lv'?'on':''}">전동기</a>
          <ul class="dep2"><li><a href="product-hv.html">고압전동기</a></li><li><a href="product-lv.html">저압전동기</a></li></ul></li>
        <li><a href="product-gearbox.html" class="${active==='gb'||active==='gm'?'on':''}">기어드모터</a>
          <ul class="dep2"><li><a href="product-gearbox.html">기어박스</a></li><li><a href="product-gm.html">기어드모터</a></li></ul></li>
        <li><a href="cyclo.html" class="${active==='cyclo'?'on':''}">싸이크로감속기</a></li>
        <li><a href="index.html#products">변압기</a></li>
        <li><a href="data-spec.html" class="${active.startsWith('data')?'on':''}">자료실</a>
          <ul class="dep2">
            <li><a href="data-spec.html">사양서</a></li>
            <li><a href="data-manual.html">제품 매뉴얼</a></li>
            <li><a href="notice.html">공지사항</a></li>
            <li><a href="faq.html">자주 묻는 질문</a></li>
          </ul></li>
      </ul>
    </nav>
    <a class="cta-btn" href="quote.html">견적요청</a>
    <button class="m-toggle" aria-label="메뉴 열기">☰</button>
  </div>
</header>`;

const CBAND = `
<section class="cband">
  <div class="wrap">
    <div>
      <h2>구입 · 견적 문의</h2>
      <p>제품명이나 명판 사진, 필요한 사양만 보내주세요. 확인 후 빠르게 견적을 회신드립니다.</p>
    </div>
    <div>
      <div class="tel"><small>TEL</small>02-535-1571~2</div>
      <div class="sub">Mobile 010-3125-9666 · FAX 02-535-1573<br>E-mail hsgearmotor@korea.com</div>
    </div>
  </div>
</section>`;

const FOOTER = `
<footer>
  <div class="wrap">
    <div class="f-logo">HYOSUNG<span>HEAVY ELECTRIC</span></div>
    <p>상호: (주)효성중전기 &nbsp;|&nbsp; TEL: 02-535-1571~2 &nbsp;|&nbsp; FAX: 02-535-1573 &nbsp;|&nbsp; Mobile: 010-3125-9666<br>
    주소: (07072) 서울특별시 동작구 신대방1가길 38, 106동 214호 (동작상떼빌) &nbsp;|&nbsp; E-mail: hsgearmotor@korea.com</p>
    <p class="copy">Copyright © (주)효성중전기. All rights reserved.</p>
  </div>
</footer>
<script>
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
</script>`;

const page = (title, active, heroTag, heroTitle, heroDesc, body, extraJs = '') => `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — (주)효성중전기</title>
<meta name="description" content="(주)효성중전기 — 고압·저압 전동기, 기어드모터, 싸이크로감속기, 변압기 공급. ${heroDesc.replace(/<[^>]+>/g,'').slice(0,80)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${NAV(active)}
<div class="phero">
  <div class="wrap">
    <div class="tag">${heroTag}</div>
    <h1>${heroTitle}</h1>
    <p>${heroDesc}</p>
  </div>
</div>
<div class="content"><div class="wrap">
${body}
</div></div>
${CBAND}
${FOOTER}
${extraJs}
</body>
</html>`;

const fmt = v => v === null || v === undefined ? '<span class="dim">—</span>' : String(v);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ───────────────────────── cyclo page ───────────────────────── */

// 1) 양축형 선정표 (허용전달 용량표)
function capacityTable(t){
  const head1 = `<tr><th rowspan="3">형번</th>${t.inputRpm.map(r=>`<th colspan="2">입력 ${r}rpm</th>`).join('')}<th rowspan="3">정격출력<br>TORQUE<br>Kgf·m<br><span style="font-weight:400;font-size:11px">(출력 ${esc(t.lastCol)} rpm)</span></th></tr>`;
  const head2 = `<tr>${t.outputRpm.map(r=>`<th>출력 ${r}rpm</th>`).join('')}</tr>`.replace(/<th>/g,'<th colspan="2">');
  const head3 = `<tr>${t.inputRpm.map(()=>`<th>허용입력<br>kW</th><th>허용출력<br>TORQUE</th>`).join('')}</tr>`;
  const rows = t.rows.map(r=>`<tr><th>${r.model}</th>${r.data.map(d=>d?`<td class="num">${fmt(d[0])}</td><td class="num">${fmt(d[1])}</td>`:`<td class="dim">—</td><td class="dim">—</td>`).join('')}<td class="num"><b>${fmt(r.rated)}</b></td></tr>`).join('');
  return `<div class="tbl-wrap"><table class="spec"><thead>${head1}${head2}${head3}</thead><tbody>${rows}</tbody></table></div>`;
}

// 2) 2단형 용량표
function twoStageTable(t){
  const head1 = `<tr><th rowspan="3">형번</th>${t.ratios.map(r=>`<th>감속비 ${r.ratio}</th>`).join('')}</tr>`;
  const head2 = `<tr>${t.ratios.map(r=>`<th>(${esc(r.combo)})</th>`).join('')}</tr>`;
  const head3 = `<tr>${t.outputRpm.map(r=>`<th>출력 ${r}rpm</th>`).join('')}</tr>`;
  const rows = t.rows.map(r=>`<tr><th>${r.model}</th>${r.data.map(d=>d?`<td class="num">${fmt(d[0])}<br><span style="color:#7E88A3">${fmt(d[1])}</span></td>`:`<td class="dim">—</td>`).join('')}</tr>`).join('');
  return `<div class="tbl-wrap"><table class="spec"><thead>${head1}${head2}${head3}</thead><tbody>${rows}</tbody></table></div>
  <div class="note-box">각 셀 표기: <b>허용입력용량 kW</b> (위) / <span style="color:#7E88A3">허용출력 TORQUE Kgf·m</span> (아래) · 입력 1800rpm 기준</div>`;
}

// 3) 선정표 (5열)
function selTable(t){
  const rows = t.rows.map(r=>`<tr>${r.map((c,i)=>{
    const cls = (i===0||i===2||i===3) ? 'num' : '';
    return i===4?`<td><b>${fmt(c)}</b></td>`:`<td class="${cls}">${fmt(c)}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="tbl-wrap"><table class="spec" style="min-width:520px"><thead><tr>${t.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

// 4) 치수표
function dimTable(t){
  const rows = t.rows.map(r=>`<tr><th>${esc(r[0])}</th>${r.slice(1).map(c=>`<td class="num">${fmt(c)}</td>`).join('')}</tr>`).join('');
  return `<div class="tbl-wrap"><table class="spec"><thead><tr>${t.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function buildCyclo(){
  // load
  const yang = ['yangchuk-seonjungpyo-6-13.json','yangchuk-seonjungpyo-15-21.json','yangchuk-seonjungpyo-25-43.json','yangchuk-seonjungpyo-51-87.json'].map(J);
  const yang2 = J('yangchuk-2dan-yongryang.json');
  const jik = ['jikgyeol-seonjungpyo-6-17.json','jikgyeol-seonjungpyo-21-51.json','jikgyeol-seonjungpyo-1247-3045.json','jikgyeol-seonjungpyo-3481-7569.json'].map(J);
  const jik6 = J('jikgyeol-6geuk.json');
  const dimJik = ['wr8-jikgyeol-supyeong-1dan.json','wr7-jikgyeol-supyeong-2dan.json','wr6-jikgyeol-sujik-1dan.json','wr5-jikgyeol-sujik-2dan.json'].map(J);
  const dimYang = ['wr4-yangchuk-supyeong-1dan.json','wr3-yangchuk-supyeong-2dan.json','wr2-yangchuk-sujik-1dan.json','wr1-yangchuk-sujik-2dan.json'].map(J);

  // ── panel: 전동기 직결형 (외형 치수)
  let pJik = '';
  for(const d of dimJik){
    pJik += `<div class="sec-h"><h2>${esc(d.post)}</h2><p>외형 치수표 (단위: mm · 모터는 효성모터 기준)</p></div>`;
    for(const t of d.tables){
      pJik += `<div class="tbl-sec"><h3 style="font-size:17px">${esc(t.title)}</h3>${dimTable(t)}</div>`;
    }
  }
  pJik += `<div class="note-box">외형 도면(치수 기호 그림)은 카탈로그 원본 이미지 업로드 후 추가됩니다. 치수 기호는 카탈로그 도면 기준입니다.</div>`;

  // ── panel: 양축형 (외형 치수)
  let pYang = '';
  for(const d of dimYang){
    pYang += `<div class="sec-h"><h2>양축형 ${esc(d.post).replace(' 전동기 직결형','')}</h2><p>외형 치수표 (단위: mm)</p></div>`;
    for(const t of d.tables){
      pYang += `<div class="tbl-sec"><h3 style="font-size:17px">${esc(t.title)}</h3>${dimTable(t)}</div>`;
    }
  }
  pYang += `<div class="note-box">외형 도면(치수 기호 그림)은 카탈로그 원본 이미지 업로드 후 추가됩니다.</div>`;

  // ── panel: 직결형 선정표
  let pJikSel = '';
  const jikChips = [];
  for(const d of [...jik, jik6]){
    for(const t of d.tables){
      const id = 'js-' + t.title.replace(/[^0-9a-zA-Z가-힣]/g,'-');
      jikChips.push(`<a href="#${id}">${esc(t.title)}${d===jik6?' (6극)':''}</a>`);
    }
  }
  pJikSel += `<div class="subtabs">${jikChips.join('')}</div>`;
  for(const d of [...jik, jik6]){
    const is6 = d === jik6;
    for(const t of d.tables){
      const id = 'js-' + t.title.replace(/[^0-9a-zA-Z가-힣]/g,'-');
      pJikSel += `<div class="tbl-sec" id="${id}"><h3>${esc(t.title)}${is6?' — 6극 전동기 직결형':''}</h3><div class="desc">전동기 직결형 선정표 · SFG = 서비스팩터</div>${selTable(t)}</div>`;
    }
  }
  pJikSel += `<div class="note-box"><b>참고</b> — 2단 조합 감속비(1247~7569)의 형번은 4자리(예: F0807)로 1단×2단 조합을 나타냅니다. SFG "※"는 카탈로그 원본 표기입니다.</div>`;

  // ── panel: 양축형 선정표 (용량표)
  let pYangSel = '';
  const yangChips = [];
  for(const d of yang) for(const t of d.tables) yangChips.push(`<a href="#ys-${t.ratio}">감속비 ${t.ratio}</a>`);
  yangChips.push(`<a href="#ys-2dan">2단형</a>`);
  pYangSel += `<div class="subtabs">${yangChips.join('')}</div>`;
  for(const d of yang){
    for(const t of d.tables){
      pYangSel += `<div class="tbl-sec" id="ys-${t.ratio}"><h3>감속비 ${t.ratio} — 1단형 허용전달 용량표</h3><div class="desc">입력회전수별 허용입력용량(kW) · 허용출력 TORQUE(Kgf·m)</div>${capacityTable(t)}</div>`;
    }
  }
  pYangSel += `<div class="sec-h" id="ys-2dan"><h2>2단형 허용전달 용량표</h2><p>입력 1800rpm 기준 · 감속비 104~7569 (1단×2단 조합)</p></div>`;
  for(const t of yang2.tables){
    pYangSel += `<div class="tbl-sec"><h3 style="font-size:17px">${esc(t.part)}</h3>${twoStageTable(t)}</div>`;
  }

  const body = `
<div class="tabs" role="tablist">
  <button class="on" data-t="all">전체</button>
  <button data-t="jik">전동기 직결형</button>
  <button data-t="yang">양축형</button>
  <button data-t="jiksel">직결형 선정표</button>
  <button data-t="yangsel">양축형 선정표</button>
</div>
<div id="panel-jik" data-p="jik"><div class="sec-h" style="margin-top:0"><h2 style="font-size:28px">전동기 직결형</h2></div>${pJik}</div>
<div id="panel-yang" data-p="yang"><div class="sec-h"><h2 style="font-size:28px">양축형</h2></div>${pYang}</div>
<div id="panel-jiksel" data-p="jiksel"><div class="sec-h"><h2 style="font-size:28px">직결형 선정표</h2></div>${pJikSel}</div>
<div id="panel-yangsel" data-p="yangsel"><div class="sec-h"><h2 style="font-size:28px">양축형 선정표</h2></div>${pYangSel}</div>`;

  const js = `<script>
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  const t=b.dataset.t;
  document.querySelectorAll('[data-p]').forEach(p=>{p.hidden = (t!=='all' && p.dataset.p!==t)});
  window.scrollTo({top:0});
}));
</script>`;
  writeFileSync(join(OUT,'cyclo.html'), page('싸이크로감속기','cyclo','Cyclo Reducer','싸이크로감속기','전동기 직결형 · 양축형 외형 치수와 감속비별 선정표·허용전달 용량표를 한눈에 확인하세요.',body,js));
}

/* ───────────────────────── about page ───────────────────────── */
function buildAbout(){
  const body = `
<div class="card reveal" style="padding:44px 46px">
  <div class="tag" style="font-family:'Outfit';font-size:13px;letter-spacing:.3em;color:#7A5CFF;font-weight:600">ABOUT US</div>
  <p class="about-lead" style="margin-top:14px">
    (주)효성중전기는 <em>고압·저압 전동기, 기어드모터,<br>싸이크로감속기, 변압기</em>를 공급하는<br>산업용 동력·전력 설비 전문 기업입니다.
  </p>
  <p style="margin-top:22px;color:var(--slate);max-width:72ch">
    산업 현장의 동력 설비는 사양 하나, 치수 하나가 정확해야 합니다. 저희는 제품을 파는 데서 끝나지 않고,
    현장 조건에 맞는 형번 선정부터 사양서·도면 확인, 납품, 사후 상담까지 전 과정을 함께합니다.
    감속기·전동기·변압기 어떤 제품이든, 명판 사진 한 장만 보내주시면 가장 빠르고 정확한 답을 드리겠습니다.
  </p>
</div>

<div class="about-grid">
  <div class="card reveal">
    <h3 style="font-size:18px;font-weight:900;margin-bottom:8px">정확한 사양 선정</h3>
    <p style="font-size:14.5px;color:var(--slate)">현장 부하·감속비·설치 조건에 맞는 형번을 선정표 기준으로 정확하게 안내합니다.</p>
  </div>
  <div class="card reveal">
    <h3 style="font-size:18px;font-weight:900;margin-bottom:8px">신속한 견적·납품</h3>
    <p style="font-size:14.5px;color:var(--slate)">제품명·명판·사양만 보내주시면 재고 확인 후 빠르게 견적을 회신드립니다.</p>
  </div>
  <div class="card reveal">
    <h3 style="font-size:18px;font-weight:900;margin-bottom:8px">자료 지원</h3>
    <p style="font-size:14.5px;color:var(--slate)">사양서·외형도·매뉴얼을 자료실에서 회원가입 없이 바로 내려받을 수 있습니다.</p>
  </div>
</div>

<div class="sec-h"><h2>취급 품목</h2></div>
<div class="card reveal" style="padding:26px 30px">
  <table class="info-table">
    <tr><th>전동기</th><td>고압전동기 · 저압전동기 (AC/DC)</td></tr>
    <tr><th>기어드모터</th><td>기어박스 · 모터 일체형 기어드모터</td></tr>
    <tr><th>감속기</th><td>싸이크로감속기 (전동기 직결형 · 양축형)</td></tr>
    <tr><th>변압기</th><td>용량별 변압기 공급 및 교체 상담</td></tr>
    <tr><th>기타</th><td>펌프 등 산업용 동력 설비 — 필요 사양 문의 시 수급 지원</td></tr>
  </table>
</div>

<div class="sec-h"><h2>회사 정보</h2></div>
<div class="card reveal" style="padding:26px 30px">
  <table class="info-table">
    <tr><th>상호</th><td>(주)효성중전기 (HYOSUNG HEAVY ELECTRIC)</td></tr>
    <tr><th>주소</th><td>(07072) 서울특별시 동작구 신대방1가길 38, 106동 214호 (동작상떼빌)</td></tr>
    <tr><th>전화</th><td>02-535-1571~2</td></tr>
    <tr><th>팩스</th><td>02-535-1573</td></tr>
    <tr><th>휴대전화</th><td>010-3125-9666</td></tr>
    <tr><th>이메일</th><td>hsgearmotor@korea.com</td></tr>
  </table>
</div>`;
  writeFileSync(join(OUT,'about.html'), page('회사소개','about','About Us','회사소개','산업 현장의 동력을 정확한 사양으로 책임지는 (주)효성중전기입니다.',body));
}

/* ───────────────────────── data-spec page ───────────────────────── */
function buildSpec(){
  const HY = 'https://www.hyosungheavyindustries.com';
  const lvSpec = [
    ['계획품','계획품 사양서.zip','/upload/motor/files/Planned_Low_Voltage_Motor.zip'],
    ['권선형','권선형 사양서.zip','/upload/motor/files/WoundRotor.zip'],
    ['발전소','발전소 사양서.zip','/upload/motor/files/DATASHEET_PLANT_20200227.zip'],
    ['저압고출력','저압고출력 사양서.zip','/upload/motor/files/Low_voltage_high_output.zip'],
    ['NEMA','NEMA 사양서.zip','/upload/motor/files/NEMA_Motor.zip'],
  ];
  const lvDim = [
    ['IEC 소형','IEC_소형.zip','/upload/motor/files/IEC_Small.zip'],
    ['IEC 중형(1)','IEC_중형(1).zip','/upload/motor/files/IEC_Medium_1.zip'],
    ['IEC 중형(2)','IEC_중형(2).zip','/upload/motor/files/IEC_Medium_2.zip'],
    ['IEC 발전소 소형','IEC_발전소_소형.zip','/upload/motor/files/IEC_PowerPlant_Small.zip'],
    ['IEC 저압고출력','IEC_저압고출력.zip','/upload/motor/files/IEC_LV_HighOutput.zip'],
    ['IEC 내압(방폭)','IEC_내압.zip','/upload/motor/files/IEC_ExplosionProof.zip'],
    ['LF','LF.zip','/upload/motor/files/LF.zip'],
    ['NEMA','NEMA.zip','/upload/motor/files/NEMA.zip'],
    ['기타 외형도','그외 외형도.zip','/upload/motor/files/Other_Dimensions.zip'],
    ['단자박스','단자박스.zip','/upload/motor/files/Terminal_Box.zip'],
  ];
  const card = (cat,[name,file,url]) => `
  <div class="dl-card">
    <span class="cat">${cat}</span>
    <h4>${esc(name)}</h4>
    <span class="meta">${esc(file)} · ZIP</span>
    <div class="act"><a class="dl-btn" href="${HY}${url}" target="_blank" rel="noopener">↓ 다운로드</a></div>
  </div>`;

  const body = `
<div class="tabs">
  <button class="on" data-t="lv">저압전동기 사양서</button>
  <button data-t="gm">기어드모터 사양서</button>
</div>

<div data-p="lv">
  <div class="sec-h" style="margin-top:0"><h2>사양서 다운로드</h2><p>제품군별 사양서 일괄 다운로드 (ZIP)</p></div>
  <div class="dl-grid">${lvSpec.map(x=>card('SPEC',x)).join('')}</div>

  <div class="sec-h"><h2>외형도 다운로드</h2><p>PDF·CAD 외형도 및 조견표</p></div>
  <div class="dl-grid">
    <div class="dl-card"><span class="cat">TABLE</span><h4>저압전동기 외형도 조견표</h4><span class="meta">LV_Motor_Dim_Table_2603.xlsm · Excel</span>
      <div class="act"><a class="dl-btn" href="${HY}/upload/motor/files/LV_Motor_Dim_Table_2603.xlsm" target="_blank" rel="noopener">↓ 다운로드</a></div></div>
    ${lvDim.map(x=>card('DIMENSION',x)).join('')}
  </div>

  <div class="sec-h"><h2>인증 문서</h2></div>
  <div class="dl-grid">
    <div class="dl-card"><span class="cat">CE</span><h4>CE 인증 문서 — 계획품 (TEFC, TE-F)</h4><span class="meta">CEDOC_TEFCTE-F.pdf · PDF</span>
      <div class="act"><a class="dl-btn" href="${HY}/upload/motor/files/CEDOC_TEFCTE-F.pdf" target="_blank" rel="noopener">↓ 다운로드</a></div></div>
  </div>

  <div class="sec-h"><h2>3D 모델링</h2></div>
  <div class="card">
    <p style="font-size:14.5px;color:var(--slate)">IEC 규격(TEFC/TE-F) 프레임 80M~355L, IE3 규격(EFFC/EF-F) 프레임 71M~315M의 FOOT/ROUND FRAME 3D 모델링 파일을 제공합니다. 필요한 프레임을 알려주시면 파일을 보내드립니다.</p>
    <div style="margin-top:14px"><a class="dl-btn" href="index.html#contact">프레임별 3D 파일 요청하기</a></div>
  </div>

  <div class="sec-h"><h2>개별 사양 검색</h2></div>
  <div class="card">
    <p style="font-size:14.5px;color:var(--slate)">IEC 규격 · KS PREMIUM 효율 · 출력 0.75~375kW · 2/4/6/8극 — 총 9,912개 제품 사양을 조건별로 검색할 수 있습니다. 원하는 조건을 알려주시면 정확한 사양서를 찾아드립니다.</p>
    <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
      <a class="dl-btn" href="https://www.hyosungheavyindustries.com/kr/data/low-voltage" target="_blank" rel="noopener">사양 검색 바로가기 ↗</a>
      <a class="dl-btn" href="index.html#contact">사양 문의하기</a>
    </div>
  </div>
</div>

<div data-p="gm" hidden>
  <div class="sec-h" style="margin-top:0"><h2>기어드모터 사양 검색</h2><p>총 11,574개 제품 사양 — 조건 선택 후 데이터시트·외형도를 받을 수 있습니다</p></div>
  <div class="card">
    <table class="info-table">
      <tr><th>동력 (kW)</th><td>0.2 · 0.4 · 0.75 · 1.5 · 2.2 · 3.7 · 5.5 · 7.5 · 11 · 15 · 18.5 · 22 · 30 · 37 · 45 · 55 · 75</td></tr>
      <tr><th>극수</th><td>4극</td></tr>
      <tr><th>감속비</th><td>5 · 10 · 15 · 20 · 25 · 30 · 40 · 45 · 50 · 60 · 75 · 80 · 90 · 100 · 120</td></tr>
      <tr><th>전압/주파수</th><td>220/380V 50·60Hz, 380V 50·60Hz, 415V 50Hz, 440V 60Hz</td></tr>
      <tr><th>취부방법</th><td>G/M Hor. · G/M Ver. · IEC Flange Hor./Ver. · Line Power Hor./Ver.</td></tr>
      <tr><th>모터형식</th><td>TE-F · TEFC</td></tr>
      <tr><th>설치장소</th><td>INDOOR · OUTDOOR</td></tr>
      <tr><th>시리즈</th><td>F · F1 · FN · H · RP</td></tr>
      <tr><th>제공 자료</th><td>데이터시트 · 2D 외형도(PDF/DWG) · 3D 모델(STP)</td></tr>
    </table>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
      <a class="dl-btn" href="https://www.hyosungheavyindustries.com/kr/data/geared-motors" target="_blank" rel="noopener">사양 검색 바로가기 ↗</a>
      <a class="dl-btn" href="index.html#contact">조건 보내고 사양서 받기</a>
    </div>
  </div>
  <div class="note-box">원하는 동력·감속비·취부방법만 알려주시면 데이터시트와 외형도(2D/3D)를 찾아서 보내드립니다. 전화 02-535-1571~2 또는 이메일 hsgearmotor@korea.com</div>
</div>`;

  const js = `<script>
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  document.querySelectorAll('[data-p]').forEach(p=>p.hidden = p.dataset.p!==b.dataset.t);
}));
</script>`;
  writeFileSync(join(OUT,'data-spec.html'), page('자료실 — 사양서','data-spec','Data Room','사양서','저압전동기·기어드모터 사양서와 외형도를 내려받을 수 있습니다.',body,js));
}

/* ───────────────────────── data-manual page ───────────────────────── */
function buildManual(){
  const HY = 'https://www.hyosungheavyindustries.com/kr/customer/download-center/';
  const hv = [
    [2361,'고압전동기_취급설명서(고압)_국문_개정_REV 2.5','한국어'],
    [1963,'고압전동기_취급설명서(고압)_국문_개정_REV 2.4','한국어'],
    [1935,'고압전동기_취급설명서(고압)_영문_개정_REV 2.3','영어'],
    [1933,'고압전동기_취급설명서(고압)_국문_개정_REV 2.3','한국어'],
    [1692,'[Korean] Low voltage motor','한국어'],
    [1691,'[Korean] Hazardous area - Low voltage motor','한국어'],
    [1612,'전용기 Robot Seam Series 취급설명서 국문 201806','한국어'],
    [1611,'전용기 INVERTER PROJECTION Series 취급설명서 국문 201806','한국어'],
    [1572,'High Voltage Motor Manual','영어'],
    [1205,'고압전동기 취급설명서 (KOR)','한국어'],
    [126,'High Voltage Motor Manual(ENG)_HVM-0206_REV 2.1','영어'],
    [134,'고압전동기 취급설명서(KOR)_HVM-0206 REV 2.1','한국어'],
    [133,'GEARED MOTOR MANUAL(ENG)','영어'],
    [132,'기어드모터 취급설명서(KOR)','한국어'],
    [131,'GEARBOX MANUAL(JP)','일본어'],
    [130,'GEARBOX MANUAL(ENG)','영어'],
    [129,'감속기 취급설명서(KOR)','한국어'],
    [127,'저압전동기 취급설명서(KOR)','한국어'],
  ];
  const lv = [
    [1578,'저압전동기 취급설명서','한국어'],
    [127,'저압전동기 취급설명서(KOR)','한국어'],
  ];
  const gm = [
    [1612,'전용기 Robot Seam Series 취급설명서 국문 201806','한국어'],
    [1611,'전용기 INVERTER PROJECTION Series 취급설명서 국문 201806','한국어'],
    [1604,'기어드모터 취급설명서 (KOR)','한국어'],
    [1602,'GEARED MOTOR MANUAL','영어'],
    [126,'High Voltage Motor Manual(ENG)_HVM-0206_REV 2.1','영어'],
    [134,'고압전동기 취급설명서(KOR)_HVM-0206 REV 2.1','한국어'],
    [133,'GEARED MOTOR MANUAL(ENG)','영어'],
    [132,'기어드모터 취급설명서(KOR)','한국어'],
    [131,'GEARBOX MANUAL(JP)','일본어'],
    [130,'GEARBOX MANUAL(ENG)','영어'],
    [129,'감속기 취급설명서(KOR)','한국어'],
    [127,'저압전동기 취급설명서(KOR)','한국어'],
  ];
  const board = (rows, id) => `
  <div class="tbl-wrap" style="border-radius:14px">
  <table class="board">
    <thead><tr><th class="c" style="width:70px">NO</th><th class="c" style="width:90px">분류</th><th>자료명</th><th class="c" style="width:80px">언어</th><th class="c" style="width:120px">다운로드</th></tr></thead>
    <tbody id="${id}">${rows.map(([no,name,lang],i)=>`<tr>
      <td class="c" style="color:#98A2B8;font-family:'Outfit'">${rows.length-i}</td>
      <td class="c"><span class="badge">매뉴얼</span></td>
      <td>${esc(name)}</td>
      <td class="c"><span class="badge lang">${lang}</span></td>
      <td class="c"><a class="dl-btn" style="padding:5px 14px;font-size:12.5px" href="${HY}${no}" target="_blank" rel="noopener">↓ 받기</a></td>
    </tr>`).join('')}</tbody>
  </table></div>`;

  const body = `
<div class="tabs">
  <button class="on" data-t="hv">고압전동기 <span style="font-weight:400">(${hv.length})</span></button>
  <button data-t="lv">저압전동기 <span style="font-weight:400">(${lv.length})</span></button>
  <button data-t="gm">기어드모터 <span style="font-weight:400">(${gm.length})</span></button>
</div>
<div data-p="hv">${board(hv,'tb-hv')}</div>
<div data-p="lv" hidden>${board(lv,'tb-lv')}</div>
<div data-p="gm" hidden>${board(gm,'tb-gm')}</div>
<div class="note-box" style="margin-top:20px">다운로드 버튼은 제조사(효성중공업) 다운로드 센터의 해당 자료 페이지로 연결됩니다. 파일이 필요하신데 받기 어려우시면 연락 주세요 — 이메일로 바로 보내드립니다. (02-535-1571~2 / hsgearmotor@korea.com)</div>`;

  const js = SB_SCRIPTS + `<script>
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  document.querySelectorAll('[data-p]').forEach(p=>p.hidden = p.dataset.p!==b.dataset.t);
}));
// 어드민에서 직접 업로드한 파일이 있으면 해당 탭 목록을 교체
(async()=>{
  if(!window.sb) return;
  const MAP={'manual-hv':'tb-hv','manual-lv':'tb-lv','manual-gm':'tb-gm'};
  const {data}=await sb.from('resources').select('*').in('category',Object.keys(MAP)).order('created_at',{ascending:false});
  if(!data||!data.length) return;
  const esc=s=>(s||'').replace(/</g,'&lt;');
  for(const cat of Object.keys(MAP)){
    const rows=data.filter(r=>r.category===cat);
    if(!rows.length) continue;
    document.getElementById(MAP[cat]).innerHTML=rows.map((r,i)=>\`<tr>
      <td class="c" style="color:#98A2B8;font-family:'Outfit'">\${rows.length-i}</td>
      <td class="c"><span class="badge">매뉴얼</span></td>
      <td>\${esc(r.title)}</td>
      <td class="c"><span class="badge lang">\${esc(r.lang)}</span></td>
      <td class="c"><a class="dl-btn" style="padding:5px 14px;font-size:12.5px" href="\${r.file_url}" target="_blank" rel="noopener">↓ 받기</a></td></tr>\`).join('');
    const btn=document.querySelector('.tabs button[data-t="'+cat.replace('manual-','')+'"] span');
    if(btn) btn.textContent='('+rows.length+')';
  }
})();
</script>`;
  writeFileSync(join(OUT,'data-manual.html'), page('자료실 — 제품 매뉴얼','data-manual','Data Room','제품 매뉴얼','고압전동기 · 저압전동기 · 기어드모터 취급설명서를 제품별로 확인하세요.',body,js));
}

/* ───────────────────────── product pages ───────────────────────── */
function specTable(tb){
  if(tb.kv){
    return `<div class="tbl-wrap" style="margin-top:14px"><table class="spec" style="min-width:420px"><tbody>${tb.rows.map(r=>`<tr><th style="width:160px;background:var(--cloud)">${esc(r[0])}</th><td style="text-align:left;white-space:normal">${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>`;
  }
  return `<div class="tbl-wrap" style="margin-top:14px"><table class="spec" style="min-width:420px"><thead><tr>${tb.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${tb.rows.map(r=>`<tr>${r.map((c,i)=>`<td style="${i===tb.headers.length-1&&tb.leftLast?'text-align:left;white-space:normal':''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function productPage(cfg){
  let body = `
<div class="card reveal" style="display:grid;grid-template-columns:1.15fr .85fr;gap:36px;align-items:center;padding:40px 44px">
  <div>
    <div style="font-family:'Outfit';font-size:13px;letter-spacing:.3em;color:#7A5CFF;font-weight:600">${cfg.en}</div>
    <h2 style="font-size:27px;font-weight:900;margin:10px 0 14px">${cfg.introTitle}</h2>
    <p style="color:var(--slate)">${cfg.intro}</p>
  </div>
  <div style="text-align:center"><img src="img/${cfg.mainImg}" alt="${cfg.title}" style="max-width:100%;max-height:340px;object-fit:contain"></div>
</div>

<div class="sec-h"><h2>특장점</h2></div>
<div style="display:grid;grid-template-columns:repeat(${cfg.features.length>4?3:2},1fr);gap:14px">
  ${cfg.features.map(f=>`<div class="card reveal" style="padding:24px">
    <h3 style="font-size:16.5px;font-weight:900;margin-bottom:6px;color:var(--brand,#2A5CFF)">${esc(f[0])}</h3>
    <p style="font-size:14px;color:var(--slate)">${esc(f[1])}</p></div>`).join('')}
</div>

<div class="sec-h"><h2>제품 라인업</h2></div>`;

  for(const l of cfg.lineups){
    body += `
<div class="card reveal" style="margin-bottom:18px;padding:34px 38px">
  <div style="display:grid;grid-template-columns:220px 1fr;gap:32px;align-items:start">
    <div style="background:var(--cloud);border-radius:14px;padding:14px;text-align:center"><img src="img/${l.img}" alt="${esc(l.name)}" style="width:100%;max-width:200px;border-radius:8px"></div>
    <div>
      <h3 style="font-size:20px;font-weight:900">${esc(l.name)}</h3>
      <p style="color:var(--slate);font-size:14.5px;margin-top:8px">${l.desc}</p>
      ${l.points?`<ul style="margin-top:12px;display:grid;gap:6px">${l.points.map(p=>`<li style="font-size:14px;color:var(--ink);padding-left:18px;position:relative"><span style="position:absolute;left:0;color:var(--cyan,#0E96A5);font-weight:900">✓</span>${esc(p)}</li>`).join('')}</ul>`:''}
      ${l.uses?`<div style="margin-top:14px"><span class="badge" style="margin-bottom:6px">적용 분야</span><p style="font-size:13.5px;color:var(--slate);margin-top:6px">${esc(l.uses)}</p></div>`:''}
    </div>
  </div>
  ${(l.tables||[]).map(tb=>`<div style="margin-top:20px">${tb.title?`<div style="font-weight:700;font-size:15px;margin-bottom:-4px">${esc(tb.title)}</div>`:''}${specTable(tb)}</div>`).join('')}
</div>`;
  }

  if(cfg.links){
    body += `<div class="note-box" style="margin-top:24px">${cfg.links}</div>`;
  }

  writeFileSync(join(OUT, cfg.file), page(cfg.title, cfg.active, cfg.en, cfg.title, cfg.heroDesc, body));
}

function buildProducts(){
  // ── 고압전동기
  productPage({
    file:'product-hv.html', active:'hv', en:'HIGH VOLTAGE MOTOR', title:'고압전동기',
    heroDesc:'KS·IEC·NEMA 국제 규격에 대응하는 고압전동기 — 발전, 석유화학, 담수, 선박, 철강 등 산업 전반에 공급합니다.',
    mainImg:'hv-main.png',
    introTitle:'다양한 부하 조건에 최적화된 고압전동기',
    intro:'우수한 절연 시스템을 기반으로 발전소, Oil&Gas, 석유화학, 담수 플랜트, 선박, 철강 등 폭넓은 산업 현장에 적용되는 고압전동기를 공급합니다. 필요한 출력·전압·형식을 알려주시면 최적 사양을 안내해 드립니다.',
    features:[
      ['우수한 절연 시스템','F종 SUPACT 절연 시스템 적용으로 높은 신뢰성을 확보했습니다.'],
      ['특수 농형 회전자 구조','이중농형·심구농형 등 다양한 회전자 구조로 광범위한 부하 조건에 대응합니다.'],
      ['저진동 · 저소음','구조 해석(ANSYS·NASTRAN) 기반 설계로 진동과 소음을 낮췄습니다.'],
      ['최적 설계','유동·전자계 해석(ANSYS CFX·FLUX 2D)을 통한 정밀 설계로 성능을 극대화했습니다.'],
    ],
    lineups:[
      { name:'IEC Standard Motor (HV)', img:'hv-iec.png',
        desc:'IEC 국제규격 대응 고압전동기. 우수한 절연 시스템과 특수 바니쉬 처리, 이중 농형 구조로 광범위한 부하 조건에 대응합니다.',
        uses:'펌프·팬·압축기·크레인·밀·분쇄기 / 일반 산업·철강 / 석유화학·시멘트 플랜트 / 석탄화력·복합화력 / 원자력(Class-1E, Non Class-1E) / 선박용',
        tables:[{kv:true, rows:[['출력','Max. 25,000kW'],['극수','Max. 30P'],['형식','TEFC, TEAAC, TEWAC, ODP, WPI, WPII, Explosion-proof'],['전압','Max. 13.8kV'],['주파수','50Hz / 60Hz']]}] },
      { name:'NEMA Standard Motor (HV)', img:'hv-nema.png',
        desc:'NEMA 국제규격 대응 고압전동기. 동일한 고성능 절연 시스템과 저진동 설계가 특징입니다.',
        uses:'IEC Standard Motor와 동일',
        tables:[{kv:true, rows:[['출력','Max. 25,000kW'],['전압','Max. 13.8kV'],['주파수','50Hz / 60Hz']]}] },
      { name:'Explosion-proof Motor (HV)', img:'hv-exp.png',
        desc:'Oil&Gas 산업 등 폭발성 가스 환경용 방폭 전동기. IECEx, ATEX, UL, CSA, GOST, KGS 등 국제 규격에 대응합니다.',
        tables:[
          {title:'방폭 구조 유형', headers:['구조','설명'], leftLast:true, rows:[
            ['Ex d (내압 방폭)','용기 내부 폭발 시 압력을 견디고, 접합부를 통해 외부 폭발성 가스가 점화되지 않도록 하는 구조'],
            ['Ex p (압력 방폭)','보호가스(공기·불연성가스)를 압입해 폭발성 가스의 내부 유입을 차단하는 구조'],
            ['Ex e (안전증 방폭)','정상 운전 중 점화원(불꽃·아크·고온) 발생을 방지하는 구조'],
            ['Ex n (비점화 방폭)','정상 동작 상태에서 주변 가스를 점화시키지 않는 구조']]},
          {title:'생산 범위', headers:['구조','극수','최대 출력','최대 Frame'], rows:[
            ['Ex d','~20P','~4,000kW','~800Fr.'],
            ['Ex p','~20P','~13,000kW','~1,500Fr.'],
            ['Ex e','~20P','~13,000kW','~1,500Fr.'],
            ['Ex n','~20P','~13,000kW','~1,500Fr.']]}
        ] },
    ],
    links:`관련 자료: <a href="data-manual.html" style="color:var(--blue);font-weight:700">고압전동기 취급설명서 (제품 매뉴얼)</a> · 견적은 <b>02-535-1571~2</b> 로 문의해 주세요.`
  });

  // ── 저압전동기
  productPage({
    file:'product-lv.html', active:'lv', en:'LOW VOLTAGE MOTOR', title:'저압전동기',
    heroDesc:'IEC·NEMA 규격의 프리미엄 효율 저압전동기 — 규격별 재고 확인과 빠른 납품이 가능합니다.',
    mainImg:'lv-main.jpg',
    introTitle:'프리미엄 효율의 친환경 저압전동기',
    intro:'혁신적인 철심 설계와 최적화된 권선 설계를 바탕으로 한 프리미엄 효율 저압전동기를 공급합니다. IEC·NEMA 등 국제 규격에 대응하며, 전폐형·플랜지형 등 다양한 형식의 규격별 재고 확인이 가능합니다.',
    features:[
      ['에너지 절감','혁신적인 철심 설계와 최적화된 권선 설계로 손실을 줄인 프리미엄 전동기입니다.'],
      ['긴 수명','권선 절연 수명을 평균 1.5배 연장해 유지보수 부담을 낮췄습니다.'],
      ['경제성','IEC·NEMA 프레임 대비 컴팩트한 설계로 설치 공간과 초기 투자를 절감합니다.'],
      ['높은 효율','IE3, NEMA Premium 기준을 상회하는 효율을 제공합니다.'],
      ['신뢰성','주물 케이스와 IP55 보호등급으로 분진·습기 등 환경 영향을 최소화했습니다.'],
      ['빠른 공급','규격별 재고 확인 후 신속한 견적·납품이 가능합니다.'],
    ],
    lineups:[
      { name:'IEC Standard Motor (LV)', img:'lv-iec.png',
        desc:'IEC 규격의 저압전동기 전 형식 — 전폐형, 반폐형, 플랜지형, 고효율 전동기까지 폭넓게 공급합니다.',
        uses:'일반 산업 설비 전반의 표준 구동용' },
      { name:'NEMA Standard Motor (LV)', img:'lv-nema.png',
        desc:'북미 시장 요구에 맞춘 NEMA 규격 설계의 고효율 저압전동기입니다.',
        uses:'북미 규격이 요구되는 산업 설비' },
      { name:'Explosion-proof Motor (LV)', img:'lv-exp.png',
        desc:'폭발성 가스·증기 환경에서 사용하는 방폭형 저압전동기입니다.',
        uses:'석유화학 공장 등 방폭 지역' },
    ],
    links:`관련 자료: <a href="data-spec.html" style="color:var(--blue);font-weight:700">저압전동기 사양서·외형도 다운로드</a> · <a href="data-manual.html" style="color:var(--blue);font-weight:700">취급설명서</a>`
  });

  // ── 기어박스
  productPage({
    file:'product-gearbox.html', active:'gb', en:'GEARBOX', title:'기어박스',
    heroDesc:'일반 산업기계부터 제철·발전·시멘트·석유화학 설비까지 — 용도에 맞는 기어박스를 공급합니다.',
    mainImg:'gb-main.png',
    introTitle:'현장 조건에 맞춘 기어박스 솔루션',
    intro:'최신 설계·해석 기술로 제작된 다양한 기어박스를 공급합니다. 일반 산업기계는 물론 제철, 발전, 시멘트, 고무, 석유·화학 설비까지 — 부하 조건과 설치 환경에 맞는 제품을 선정해 드립니다.',
    features:[
      ['누유 방지','듀얼 립(Dual Lip) 타입 오일 실을 표준 채택해 누유 걱정을 덜었습니다.'],
      ['고효율','최소 96% 이상의 전달 효율을 확보했습니다.'],
      ['철저한 품질 관리','소재 단계부터 출하까지 전 과정 검사를 거칩니다.'],
      ['다양한 옵션','센서, 펌프, 필터, 게이지, 오일 쿨러 등 옵션 선택이 가능합니다.'],
    ],
    lineups:[
      { name:'Parallel Shaft Gearbox', img:'gb-parallel.png',
        desc:'헬리컬 기어를 사용해 입력축과 출력축이 평행을 이루는 표준 기어박스입니다.',
        tables:[{kv:true, rows:[['표준화 사이즈','11종'],['기어비','최대 500 : 1'],['출력 토크','40,000kg·m'],['비고','주문제작 가능']]}] },
      { name:'Right Angle Gearbox', img:'gb-angle.png',
        desc:'베벨 기어를 사용해 입력축과 출력축이 직각을 이루는 기어박스로, 설치 공간 제약이 있는 환경에 적합합니다. KISS Soft, Romax 등 검증된 해석 툴로 설계되어 소음·진동을 크게 낮췄습니다.',
        tables:[{kv:true, rows:[['표준화 사이즈','11종'],['기어비','최대 500 : 1'],['출력 토크','40,000kg·m'],['비고','주문제작 가능']]}] },
      { name:'Planetary Gear Unit (RPS)', img:'gb-planetary.png',
        desc:'고부하·고감속비에 특화된 유성 기어 유닛으로, 높은 사양이 요구되는 설비에 최적입니다. 유성치차의 힘 분배와 동심축 설계로 소형·경량화를 실현했습니다.',
        points:['치형 최적 수정·침탄 열처리로 고효율·저소음','1,000,000 : 1 이상의 고감속비 구현 가능','모듈 시스템으로 빠른 생산·공급'],
        tables:[{kv:true, rows:[['모터 전력범위','15 ~ 75,000kW (4P 기준)'],['기어 감속비','3.55 : 1 ~ 630 : 1'],['출력 토크','530 ~ 325,000kg·m'],['비고','요청 시 별도 사양 제작 가능']]}] },
    ],
    links:`감속기 선정이 어려우시면 <b>부하 토크·감속비·설치 방향</b>만 알려주세요. 선정표 기준으로 형번을 찾아드립니다. → <a href="cyclo.html" style="color:var(--blue);font-weight:700">싸이크로감속기 선정표 보기</a>`
  });

  // ── 기어드모터
  productPage({
    file:'product-gm.html', active:'gm', en:'GEARED MOTOR', title:'기어드모터',
    heroDesc:'소형·경량·저소음 설계에 20,000시간 이상의 수명 — 시리즈별 기어드모터를 공급합니다.',
    mainImg:'gm-main.jpg',
    introTitle:'현장 요구에 맞춘 기어드모터 라인업',
    intro:'정밀한 설계로 소형·경량화된 기어드모터를 시리즈별로 공급합니다. 저소음, 20,000시간 이상의 긴 수명이 특징이며, 동력·감속비·취부방법만 알려주시면 맞는 제품을 선정해 드립니다.',
    features:[
      ['소형 · 경량','정밀 설계로 크기와 무게를 줄여 설치가 간편합니다.'],
      ['고효율','97% 이상의 높은 전달 효율을 제공합니다.'],
      ['긴 수명','20,000시간 이상의 무수리 운전이 가능합니다.'],
      ['저소음','고정밀 기어 가공으로 소음과 진동을 낮췄습니다.'],
    ],
    lineups:[
      { name:'Parallel Shaft Geared Motor — F · RP 시리즈', img:'gm-f.png',
        desc:'입출력축이 평행한 표준형 기어드모터입니다.',
        points:['F: 소형·경량 (0.4~3.7kW), 97% 이상 고효율, 그리스 윤활 완전밀폐로 설치 방향 자유','F: AGMA II Class 안전율 기준 설계','RP: 이상적인 강도 분배 설계로 소형·경량화','RP: 저소음·고정밀 기어, 표준화 부품으로 신속한 납기'] },
      { name:'Parallel Shaft Geared Motor — H 시리즈', img:'gm-h.png',
        desc:'베어링 하우징 일체화·케이스 단일화 구조의 평행축 기어드모터입니다.',
        points:['축단하중·쓰러스트 하중을 충분히 지탱','진동 흡수·저소음 설계','단일 기계 세팅 가공으로 고정밀도 실현','부품 수 감소로 유지보수비 절감','자유로운 부착 위치'] },
      { name:'Right Angle Geared Motor — K 시리즈', img:'gm-k.png',
        desc:'입출력축이 직각을 이루는 직교축 기어드모터로, 설치 제약이 많은 현장에 적합합니다.',
        points:['견고한 주물 하우징, 고강도','중공축·중실축 / Foot·Flange·Shaft Mounting 선택 가능','고정밀 기어로 원활한 운전','표준화 부품으로 신속 공급'] },
      { name:'Planetary Geared Motor — P 시리즈', img:'gm-p.png',
        desc:'동심축 설계의 유성 기어드모터로 고감속비가 필요한 설비에 최적입니다.',
        points:['소형·경량, 97% 이상 고효율','1,000,000 : 1 이상의 고감속비 가능','특수공구 없이 분해·조립 가능','극저소음, 배 이상의 긴 수명'] },
    ],
    links:`관련 자료: <a href="data-spec.html" style="color:var(--blue);font-weight:700">기어드모터 사양 검색 안내</a> · <a href="data-manual.html" style="color:var(--blue);font-weight:700">기어드모터 취급설명서</a>`
  });
}

/* ───────────────────────── dynamic pages (Supabase) ───────────────────────── */
const SB_SCRIPTS = `
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="supabase-config.js"></script>
<script>window.sb=(window.SB_URL&&window.SB_KEY&&window.supabase)?window.supabase.createClient(window.SB_URL,window.SB_KEY):null;</script>`;

// ── 공지사항
function buildNotice(){
  const body = `
<div id="list-view">
  <div class="tbl-wrap" style="border-radius:14px">
    <table class="board">
      <thead><tr><th class="c" style="width:70px">NO</th><th>제목</th><th class="c" style="width:130px">작성일</th></tr></thead>
      <tbody id="notice-rows"><tr><td colspan="3" style="text-align:center;color:#98A2B8;padding:34px">등록된 공지사항이 없습니다.</td></tr></tbody>
    </table>
  </div>
</div>
<div id="detail-view" hidden>
  <div class="card" style="padding:36px 40px">
    <div style="font-size:13px;color:#98A2B8" id="d-date"></div>
    <h2 style="font-size:24px;font-weight:900;margin:6px 0 18px" id="d-title"></h2>
    <div style="border-top:1px solid var(--line);padding-top:20px;white-space:pre-wrap;font-size:15.5px" id="d-body"></div>
    <div style="margin-top:26px"><button class="dl-btn" onclick="showList()" style="cursor:pointer;background:#fff">← 목록으로</button></div>
  </div>
</div>`;
  const js = SB_SCRIPTS + `
<script>
const rowsEl=document.getElementById('notice-rows');
let notices=[];
function showList(){document.getElementById('detail-view').hidden=true;document.getElementById('list-view').hidden=false;}
function showDetail(n){
  document.getElementById('d-date').textContent=(n.created_at||'').slice(0,10);
  document.getElementById('d-title').textContent=n.title;
  document.getElementById('d-body').textContent=n.body||'';
  document.getElementById('list-view').hidden=true;document.getElementById('detail-view').hidden=false;
  window.scrollTo({top:0});
}
function render(){
  if(!notices.length) return;
  rowsEl.innerHTML=notices.map((n,i)=>\`<tr style="cursor:pointer" onclick="showDetail(notices[\${i}])">
    <td class="c" style="color:#98A2B8;font-family:'Outfit'">\${notices.length-i}</td>
    <td><b style="font-weight:500">\${n.title.replace(/</g,'&lt;')}</b></td>
    <td class="c" style="color:#98A2B8;font-size:13px">\${(n.created_at||'').slice(0,10)}</td></tr>\`).join('');
}
(async()=>{
  if(!window.sb) return;
  const {data}=await sb.from('notices').select('*').order('created_at',{ascending:false}).limit(100);
  if(data&&data.length){notices=data;render();}
})();
</script>`;
  writeFileSync(join(OUT,'notice.html'), page('공지사항','data-notice','Notice','공지사항','(주)효성중전기의 새소식과 안내사항입니다.',body,js));
}

// ── FAQ
function buildFaqPage(){
  const FALLBACK = [
    ['견적은 어떻게 요청하나요?','전화(02-535-1571~2), 이메일(hsgearmotor@korea.com), 또는 견적요청 페이지로 문의해 주세요. 제품명이나 필요한 사양을 알려주시면 재고 확인 후 빠르게 회신드립니다.'],
    ['모터 명판만 보내드려도 견적이 가능한가요?','네, 가능합니다. 명판 사진을 문자나 이메일로 보내주시면 동일 사양 또는 대체 가능한 제품으로 견적을 드립니다.'],
    ['지방 현장도 납품이 가능한가요?','네, 전국 납품 가능합니다. 지역과 수량에 따라 배송 방법과 일정을 안내드립니다.'],
    ['단종 모델 대체품도 찾아주시나요?','네. 단종된 모델의 사양을 확인해 현재 생산 중인 대체 가능 모델을 선정해 드립니다.'],
  ];
  const body = `
<div id="faq-list">
${FALLBACK.map(([q,a],i)=>`
  <div class="card faq-item" style="margin-bottom:12px;padding:0;overflow:hidden">
    <button onclick="this.parentElement.classList.toggle('open')" style="all:unset;display:flex;gap:14px;align-items:center;width:100%;padding:20px 26px;cursor:pointer;box-sizing:border-box">
      <span style="font-family:'Outfit';font-weight:700;color:var(--blue);font-size:18px">Q</span>
      <span style="font-weight:700;font-size:16px;flex:1">${q}</span>
      <span class="chev" style="color:#98A2B8">▾</span>
    </button>
    <div class="ans" style="display:none;padding:0 26px 22px 58px;color:var(--slate);font-size:14.5px;white-space:pre-wrap">${a}</div>
  </div>`).join('')}
</div>
<style>.faq-item.open .ans{display:block!important}.faq-item.open .chev{transform:rotate(180deg)}</style>
<div class="note-box">찾는 답이 없으신가요? <a href="quote.html" style="color:var(--blue);font-weight:700">견적·문의 남기기</a> 또는 02-535-1571~2로 전화 주세요.</div>`;
  const js = SB_SCRIPTS + `
<script>
(async()=>{
  if(!window.sb) return;
  const {data}=await sb.from('faqs').select('*').order('sort',{ascending:true});
  if(data&&data.length){
    document.getElementById('faq-list').innerHTML=data.map(f=>\`
    <div class="card faq-item" style="margin-bottom:12px;padding:0;overflow:hidden">
      <button onclick="this.parentElement.classList.toggle('open')" style="all:unset;display:flex;gap:14px;align-items:center;width:100%;padding:20px 26px;cursor:pointer;box-sizing:border-box">
        <span style="font-family:'Outfit';font-weight:700;color:var(--blue);font-size:18px">Q</span>
        <span style="font-weight:700;font-size:16px;flex:1">\${f.question.replace(/</g,'&lt;')}</span>
        <span class="chev" style="color:#98A2B8">▾</span></button>
      <div class="ans" style="display:none;padding:0 26px 22px 58px;color:var(--slate);font-size:14.5px;white-space:pre-wrap">\${(f.answer||'').replace(/</g,'&lt;')}</div>
    </div>\`).join('');
  }
})();
</script>`;
  writeFileSync(join(OUT,'faq.html'), page('자주 묻는 질문','data-faq','FAQ','자주 묻는 질문','견적·납품·제품 선정에 대해 자주 받는 질문을 모았습니다.',body,js));
}

// ── 견적요청
function buildQuote(){
  const body = `
<div style="display:grid;grid-template-columns:1.2fr .8fr;gap:20px" class="quote-grid">
<div class="card" style="padding:36px 40px">
  <h2 style="font-size:22px;font-weight:900;margin-bottom:6px">견적 요청서</h2>
  <p style="color:var(--slate);font-size:14px;margin-bottom:24px">아래 내용을 남겨주시면 확인 후 빠르게 연락드립니다. 명판 사진이 있으면 함께 첨부해 주세요.</p>
  <form id="qform" style="display:grid;gap:16px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <label style="display:grid;gap:6px;font-size:13.5px;font-weight:700">성함 / 회사명 *
        <input name="name" required style="border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit"></label>
      <label style="display:grid;gap:6px;font-size:13.5px;font-weight:700">연락처 *
        <input name="phone" required placeholder="010-0000-0000" style="border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit"></label>
    </div>
    <label style="display:grid;gap:6px;font-size:13.5px;font-weight:700">이메일
      <input name="email" type="email" style="border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit"></label>
    <label style="display:grid;gap:6px;font-size:13.5px;font-weight:700">관심 제품
      <select name="product" style="border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit;background:#fff">
        <option>고압전동기</option><option>저압전동기</option><option>기어박스</option><option>기어드모터</option><option>싸이크로감속기</option><option>변압기</option><option>기타</option>
      </select></label>
    <label style="display:grid;gap:6px;font-size:13.5px;font-weight:700">문의 내용 *
      <textarea name="message" required rows="6" placeholder="필요한 제품 사양, 수량, 납기 등을 적어주세요." style="border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit;resize:vertical"></textarea></label>
    <label id="file-row" style="display:grid;gap:6px;font-size:13.5px;font-weight:700" hidden>명판 사진 첨부 (선택)
      <input name="file" type="file" accept="image/*,.pdf" style="border:1.5px dashed var(--line);border-radius:10px;padding:12px 14px;font-size:14px"></label>
    <button type="submit" class="cta-btn" style="border:none;cursor:pointer;font-size:16px;padding:14px">견적 요청 보내기</button>
    <div id="q-msg" style="font-size:14px;font-weight:700" hidden></div>
  </form>
</div>
<div>
  <div class="card" style="padding:28px 30px;margin-bottom:16px">
    <h3 style="font-size:16px;font-weight:900;margin-bottom:12px">전화가 가장 빠릅니다</h3>
    <div style="font-family:'Outfit';font-size:26px;font-weight:600;color:var(--blue)">02-535-1571~2</div>
    <p style="font-size:13.5px;color:var(--slate);margin-top:8px">Mobile 010-3125-9666<br>FAX 02-535-1573</p>
  </div>
  <div class="card" style="padding:28px 30px">
    <h3 style="font-size:16px;font-weight:900;margin-bottom:10px">이메일 문의</h3>
    <p style="font-size:14px"><a href="mailto:hsgearmotor@korea.com" style="color:var(--blue);font-weight:700">hsgearmotor@korea.com</a></p>
    <p style="font-size:13.5px;color:var(--slate);margin-top:8px">명판 사진·요구 사양을 첨부해 보내주시면 확인 후 회신드립니다.</p>
  </div>
</div>
</div>
<style>@media(max-width:860px){.quote-grid{grid-template-columns:1fr!important}}</style>`;
  const js = SB_SCRIPTS + `
<script>
const form=document.getElementById('qform'), msg=document.getElementById('q-msg');
if(window.sb) document.getElementById('file-row').hidden=false;
form.addEventListener('submit', async e=>{
  e.preventDefault();
  const fd=new FormData(form);
  const rec={name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email'),product:fd.get('product'),message:fd.get('message')};
  if(!window.sb){
    // Supabase 미연결 시: 메일 작성창으로 대체
    const bodyTxt=encodeURIComponent('성함/회사명: '+rec.name+'\\n연락처: '+rec.phone+'\\n이메일: '+rec.email+'\\n관심 제품: '+rec.product+'\\n\\n'+rec.message);
    location.href='mailto:hsgearmotor@korea.com?subject='+encodeURIComponent('[견적요청] '+rec.product+' - '+rec.name)+'&body='+bodyTxt;
    return;
  }
  msg.hidden=false; msg.style.color='#5A6480'; msg.textContent='전송 중...';
  try{
    const f=fd.get('file');
    if(f&&f.size){
      const path='inquiries/'+Date.now()+'-'+f.name.replace(/[^\\w.\\-가-힣]/g,'_');
      const {error:ue}=await sb.storage.from('files').upload(path,f);
      if(!ue){const {data:pu}=sb.storage.from('files').getPublicUrl(path); rec.file_url=pu.publicUrl;}
    }
    const {error}=await sb.from('inquiries').insert(rec);
    if(error) throw error;
    msg.style.color='#0E96A5'; msg.textContent='접수되었습니다! 확인 후 빠르게 연락드리겠습니다.';
    form.reset();
  }catch(err){
    msg.style.color='#D14343'; msg.textContent='전송에 실패했습니다. 전화(02-535-1571~2)나 이메일로 문의해 주세요.';
  }
});
</script>`;
  writeFileSync(join(OUT,'quote.html'), page('견적요청','quote','Request a Quote','견적요청','필요한 사양을 남겨주시면 재고 확인 후 빠르게 견적을 드립니다.',body,js));
}

// ── 어드민
function buildAdmin(){
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>관리자 — (주)효성중전기</title>
<meta name="robots" content="noindex,nofollow">
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Noto+Sans+KR:wght@400;500;700;900&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CSS}
body{background:var(--cloud)}
.admin-wrap{max-width:1000px;margin:0 auto;padding:40px 24px}
.input, textarea.input, select.input{border:1.5px solid var(--line);border-radius:10px;padding:11px 13px;font-size:14.5px;font-family:inherit;width:100%;box-sizing:border-box;background:#fff}
.btn{border:none;cursor:pointer;font-weight:700;font-size:14px;padding:10px 20px;border-radius:99px;background:var(--space);color:#fff}
.btn.ghost{background:#fff;color:var(--ink);border:1.5px solid var(--line)}
.btn.danger{background:#FDECEC;color:#D14343}
.row-item{display:flex;gap:12px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--line);font-size:14.5px}
.a-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0}
.a-tabs button{font-size:14.5px;font-weight:500;padding:9px 20px;border-radius:99px;border:1.5px solid var(--line);background:#fff;cursor:pointer}
.a-tabs button.on{background:var(--space);border-color:var(--space);color:#fff;font-weight:700}
label.f{display:grid;gap:6px;font-size:13px;font-weight:700;margin-bottom:12px}
</style>
</head>
<body>
<header><div class="wrap hd">
  <a href="index.html" class="logo"><span class="en">HYOSUNG</span><span class="sub">ADMIN</span></a>
  <button class="btn ghost" id="logout-btn" hidden>로그아웃</button>
</div></header>
<div class="admin-wrap">

<!-- 연결 안내 -->
<div id="no-sb" class="card" style="padding:34px" hidden>
  <h2 style="font-weight:900;font-size:20px">Supabase 연결이 필요합니다</h2>
  <p style="color:var(--slate);margin-top:10px;font-size:14.5px">아직 데이터베이스가 연결되지 않았어요. supabase-config.js 파일에 프로젝트 URL과 KEY를 입력하면 관리자 기능(공지·FAQ·자료실 파일·견적문의)이 활성화됩니다.</p>
</div>

<!-- 로그인 -->
<div id="login-view" class="card" style="max-width:420px;margin:60px auto;padding:36px" hidden>
  <h2 style="font-weight:900;font-size:20px;margin-bottom:18px">관리자 로그인</h2>
  <label class="f">이메일<input class="input" id="l-email" type="email"></label>
  <label class="f">비밀번호<input class="input" id="l-pw" type="password"></label>
  <button class="btn" style="width:100%;padding:13px" onclick="doLogin()">로그인</button>
  <div id="l-msg" style="color:#D14343;font-size:13.5px;margin-top:10px" hidden></div>
</div>

<!-- 대시보드 -->
<div id="dash" hidden>
  <div class="a-tabs">
    <button class="on" data-t="inq">견적문의 <span id="cnt-inq"></span></button>
    <button data-t="notice">공지사항</button>
    <button data-t="faq">FAQ</button>
    <button data-t="res">자료실 파일</button>
  </div>

  <div data-p="inq" class="card" style="padding:26px 30px">
    <h3 style="font-weight:900;margin-bottom:10px">견적문의 목록</h3>
    <div id="inq-list"></div>
  </div>

  <div data-p="notice" class="card" style="padding:26px 30px" hidden>
    <h3 style="font-weight:900;margin-bottom:14px">공지사항 작성</h3>
    <input type="hidden" id="n-id">
    <label class="f">제목<input class="input" id="n-title"></label>
    <label class="f">내용<textarea class="input" id="n-body" rows="6"></textarea></label>
    <button class="btn" onclick="saveNotice()">저장</button>
    <button class="btn ghost" onclick="resetNotice()">새 글</button>
    <div style="margin-top:22px" id="notice-list"></div>
  </div>

  <div data-p="faq" class="card" style="padding:26px 30px" hidden>
    <h3 style="font-weight:900;margin-bottom:14px">FAQ 관리</h3>
    <input type="hidden" id="f-id">
    <label class="f">질문<input class="input" id="f-q"></label>
    <label class="f">답변<textarea class="input" id="f-a" rows="4"></textarea></label>
    <label class="f">정렬 순서 (숫자가 작을수록 위)<input class="input" id="f-sort" type="number" value="0" style="width:120px"></label>
    <button class="btn" onclick="saveFaq()">저장</button>
    <button class="btn ghost" onclick="resetFaq()">새 항목</button>
    <div style="margin-top:22px" id="faq-list"></div>
  </div>

  <div data-p="res" class="card" style="padding:26px 30px" hidden>
    <h3 style="font-weight:900;margin-bottom:14px">자료실 파일 업로드</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <label class="f">분류
        <select class="input" id="r-cat">
          <option value="manual-hv">제품 매뉴얼 — 고압전동기</option>
          <option value="manual-lv">제품 매뉴얼 — 저압전동기</option>
          <option value="manual-gm">제품 매뉴얼 — 기어드모터</option>
          <option value="spec-lv">사양서 — 저압전동기</option>
          <option value="spec-gm">사양서 — 기어드모터</option>
          <option value="etc">기타</option>
        </select></label>
      <label class="f">언어
        <select class="input" id="r-lang"><option>한국어</option><option>영어</option><option>일본어</option><option>중국어</option><option>기타</option></select></label>
    </div>
    <label class="f">자료명<input class="input" id="r-title" placeholder="예: 고압전동기 취급설명서 REV 2.5"></label>
    <label class="f">파일<input class="input" id="r-file" type="file"></label>
    <button class="btn" onclick="uploadRes()">업로드</button>
    <div id="r-msg" style="font-size:13.5px;margin-top:10px"></div>
    <div style="margin-top:22px" id="res-list"></div>
  </div>
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="supabase-config.js"></script>
<script>
const sb=(window.SB_URL&&window.SB_KEY&&window.supabase)?window.supabase.createClient(window.SB_URL,window.SB_KEY):null;
const $=id=>document.getElementById(id);
const esc=s=>(s||'').replace(/</g,'&lt;');
if(!sb){$('no-sb').hidden=false;}
else{init();}
async function init(){
  const {data:{session}}=await sb.auth.getSession();
  if(session){showDash();}else{$('login-view').hidden=false;}
}
async function doLogin(){
  const {error}=await sb.auth.signInWithPassword({email:$('l-email').value,password:$('l-pw').value});
  if(error){$('l-msg').hidden=false;$('l-msg').textContent='로그인 실패: 이메일/비밀번호를 확인해 주세요.';return;}
  $('login-view').hidden=true; showDash();
}
$('logout-btn').addEventListener('click',async()=>{await sb.auth.signOut();location.reload();});
function showDash(){
  $('dash').hidden=false;$('logout-btn').hidden=false;
  loadInq();loadNotices();loadFaqs();loadRes();
}
document.querySelectorAll('.a-tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.a-tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.querySelectorAll('[data-p]').forEach(p=>p.hidden=p.dataset.p!==b.dataset.t);
}));
// 견적문의
async function loadInq(){
  const {data}=await sb.from('inquiries').select('*').order('created_at',{ascending:false});
  $('cnt-inq').textContent=data?('('+data.length+')'):'';
  $('inq-list').innerHTML=(data||[]).map(q=>\`<div class="row-item" style="display:block;padding:14px 4px">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <b>\${esc(q.name)}</b><span class="badge">\${esc(q.product)}</span>
      <span style="color:#98A2B8;font-size:12.5px">\${(q.created_at||'').slice(0,16).replace('T',' ')}</span>
      <button class="btn danger" style="margin-left:auto;padding:5px 14px;font-size:12px" onclick="delRow('inquiries','\${q.id}',loadInq)">삭제</button></div>
    <div style="font-size:13.5px;color:var(--slate);margin-top:6px">☎ \${esc(q.phone)} \${q.email?' · ✉ '+esc(q.email):''}</div>
    <div style="font-size:14px;margin-top:8px;white-space:pre-wrap">\${esc(q.message)}</div>
    \${q.file_url?'<a href="'+q.file_url+'" target="_blank" style="color:var(--blue);font-size:13.5px;font-weight:700">첨부파일 보기</a>':''}
  </div>\`).join('')||'<p style="color:#98A2B8">아직 접수된 문의가 없습니다.</p>';
}
// 공지
async function loadNotices(){
  const {data}=await sb.from('notices').select('*').order('created_at',{ascending:false});
  $('notice-list').innerHTML=(data||[]).map(n=>\`<div class="row-item">
    <b style="flex:1;font-weight:500">\${esc(n.title)}</b>
    <span style="color:#98A2B8;font-size:12.5px">\${(n.created_at||'').slice(0,10)}</span>
    <button class="btn ghost" style="padding:5px 14px;font-size:12px" onclick='editNotice(\${JSON.stringify(n).replace(/'/g,"&#39;")})'>수정</button>
    <button class="btn danger" style="padding:5px 14px;font-size:12px" onclick="delRow('notices','\${n.id}',loadNotices)">삭제</button>
  </div>\`).join('')||'<p style="color:#98A2B8">등록된 공지가 없습니다.</p>';
}
function editNotice(n){$('n-id').value=n.id;$('n-title').value=n.title;$('n-body').value=n.body||'';}
function resetNotice(){$('n-id').value='';$('n-title').value='';$('n-body').value='';}
async function saveNotice(){
  const rec={title:$('n-title').value,body:$('n-body').value};
  if(!rec.title)return alert('제목을 입력해 주세요.');
  const id=$('n-id').value;
  const {error}=id?await sb.from('notices').update(rec).eq('id',id):await sb.from('notices').insert(rec);
  if(error)return alert('저장 실패: '+error.message);
  resetNotice();loadNotices();
}
// FAQ
async function loadFaqs(){
  const {data}=await sb.from('faqs').select('*').order('sort');
  $('faq-list').innerHTML=(data||[]).map(f=>\`<div class="row-item">
    <span class="badge">\${f.sort}</span><b style="flex:1;font-weight:500">\${esc(f.question)}</b>
    <button class="btn ghost" style="padding:5px 14px;font-size:12px" onclick='editFaq(\${JSON.stringify(f).replace(/'/g,"&#39;")})'>수정</button>
    <button class="btn danger" style="padding:5px 14px;font-size:12px" onclick="delRow('faqs','\${f.id}',loadFaqs)">삭제</button>
  </div>\`).join('')||'<p style="color:#98A2B8">등록된 FAQ가 없습니다.</p>';
}
function editFaq(f){$('f-id').value=f.id;$('f-q').value=f.question;$('f-a').value=f.answer||'';$('f-sort').value=f.sort||0;}
function resetFaq(){$('f-id').value='';$('f-q').value='';$('f-a').value='';$('f-sort').value=0;}
async function saveFaq(){
  const rec={question:$('f-q').value,answer:$('f-a').value,sort:Number($('f-sort').value)||0};
  if(!rec.question)return alert('질문을 입력해 주세요.');
  const id=$('f-id').value;
  const {error}=id?await sb.from('faqs').update(rec).eq('id',id):await sb.from('faqs').insert(rec);
  if(error)return alert('저장 실패: '+error.message);
  resetFaq();loadFaqs();
}
// 자료실
async function loadRes(){
  const {data}=await sb.from('resources').select('*').order('created_at',{ascending:false});
  const CATS={'manual-hv':'매뉴얼·고압','manual-lv':'매뉴얼·저압','manual-gm':'매뉴얼·기어드','spec-lv':'사양서·저압','spec-gm':'사양서·기어드','etc':'기타'};
  $('res-list').innerHTML=(data||[]).map(r=>\`<div class="row-item">
    <span class="badge">\${CATS[r.category]||r.category}</span>
    <b style="flex:1;font-weight:500">\${esc(r.title)}</b>
    <span class="badge lang">\${esc(r.lang)}</span>
    <a href="\${r.file_url}" target="_blank" class="btn ghost" style="padding:5px 14px;font-size:12px;text-decoration:none">보기</a>
    <button class="btn danger" style="padding:5px 14px;font-size:12px" onclick="delRes('\${r.id}','\${r.file_path||''}')">삭제</button>
  </div>\`).join('')||'<p style="color:#98A2B8">업로드된 파일이 없습니다.</p>';
}
async function uploadRes(){
  const f=$('r-file').files[0], title=$('r-title').value;
  if(!f||!title)return alert('자료명과 파일을 모두 입력해 주세요.');
  $('r-msg').textContent='업로드 중...';
  const path='resources/'+Date.now()+'-'+f.name.replace(/[^\\w.\\-가-힣]/g,'_');
  const {error:ue}=await sb.storage.from('files').upload(path,f);
  if(ue){$('r-msg').textContent='업로드 실패: '+ue.message;return;}
  const {data:pu}=sb.storage.from('files').getPublicUrl(path);
  const {error}=await sb.from('resources').insert({category:$('r-cat').value,lang:$('r-lang').value,title,file_url:pu.publicUrl,file_path:path});
  if(error){$('r-msg').textContent='DB 저장 실패: '+error.message;return;}
  $('r-msg').textContent='업로드 완료!';$('r-title').value='';$('r-file').value='';
  loadRes();
}
async function delRes(id,path){
  if(!confirm('삭제할까요?'))return;
  if(path)await sb.storage.from('files').remove([path]);
  await sb.from('resources').delete().eq('id',id);
  loadRes();
}
async function delRow(table,id,cb){
  if(!confirm('삭제할까요?'))return;
  await sb.from(table).delete().eq('id',id);cb();
}
</script>
</body>
</html>`;
  writeFileSync(join(OUT,'admin.html'), html);
}

/* ───────────────────────── admin v2 (개선판) ───────────────────────── */
function buildAdminV2(){
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>관리자 — (주)효성중전기</title>
<meta name="robots" content="noindex,nofollow">
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Noto+Sans+KR:wght@400;500;700;900&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--space:#0A1230;--blue:#2A5CFF;--violet:#7A5CFF;--cyan:#0E96A5;--ink:#141B33;--slate:#5A6480;--cloud:#F5F7FB;--line:#E3E7F0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans KR',sans-serif;color:var(--ink);background:var(--cloud);line-height:1.6}
a{text-decoration:none;color:inherit}
header{background:var(--space);position:sticky;top:0;z-index:50}
.hd{max-width:1100px;margin:0 auto;padding:0 24px;height:66px;display:flex;align-items:center;justify-content:space-between}
.logo{color:#fff;display:flex;align-items:center;gap:10px}
.logo .en{font-family:'Marcellus',serif;font-size:20px;letter-spacing:.05em}
.logo .tag{font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:.3em;color:#2BD9E5;font-weight:600;background:rgba(43,217,229,.12);border:1px solid rgba(43,217,229,.35);border-radius:99px;padding:3px 10px}
.wrap{max-width:1100px;margin:0 auto;padding:34px 24px 80px}
.card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px 28px}
.input,textarea.input,select.input{border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit;width:100%;background:#fff}
.input:focus{outline:2px solid rgba(42,92,255,.3)}
.btn{border:none;cursor:pointer;font-weight:700;font-size:14.5px;padding:11px 24px;border-radius:99px;background:var(--blue);color:#fff;font-family:inherit}
.btn:hover{background:#1F49D6}
.btn.ghost{background:#fff;color:var(--ink);border:1.5px solid var(--line)}
.btn.sm{padding:6px 14px;font-size:12.5px}
.btn.danger{background:#FDECEC;color:#D14343}
.btn.big{padding:14px 34px;font-size:16px}
.a-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.a-tabs button{font-family:inherit;font-size:15px;font-weight:500;padding:11px 22px;border-radius:99px;border:1.5px solid var(--line);background:#fff;cursor:pointer}
.a-tabs button.on{background:var(--space);border-color:var(--space);color:#fff;font-weight:700}
label.f{display:grid;gap:6px;font-size:13.5px;font-weight:700;margin-bottom:14px}
table.list{border-collapse:collapse;width:100%;font-size:14.5px;background:#fff}
table.list th{background:var(--cloud);text-align:left;padding:11px 14px;font-size:13px;color:var(--slate);border-top:2px solid var(--space);border-bottom:1px solid var(--line);white-space:nowrap}
table.list td{padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:middle}
table.list tr:hover td{background:#F8FAFD}
.badge{display:inline-block;font-size:12px;font-weight:700;border-radius:6px;padding:2px 9px;background:#EDEBFF;color:var(--violet);white-space:nowrap}
.badge.lang{background:#E8F8FA;color:var(--cyan)}
.step{display:flex;gap:10px;align-items:center;font-size:14px;color:var(--slate);margin-bottom:8px}
.step b{display:inline-flex;width:22px;height:22px;border-radius:50%;background:var(--blue);color:#fff;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
.sec-title{font-size:19px;font-weight:900;margin:30px 0 12px;display:flex;align-items:center;gap:10px}
.sec-title .cnt{font-size:13px;color:var(--slate);font-weight:500}
.filebox{border:2px dashed #C9D4E8;border-radius:12px;padding:22px;text-align:center;cursor:pointer;transition:.2s;background:#FAFBFE}
.filebox:hover{border-color:var(--blue)}
.filebox.has{border-color:var(--cyan);background:#F0FBFC}
.empty{padding:30px;text-align:center;color:#98A2B8;font-size:14px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.msg{font-size:14px;font-weight:700;margin-top:10px}
@media(max-width:760px){.grid2{grid-template-columns:1fr}}
[hidden]{display:none!important}
</style>
</head>
<body>
<header><div class="hd">
  <a href="index.html" class="logo"><span class="en">HYOSUNG</span><span class="tag">관리자</span></a>
  <div style="display:flex;gap:10px">
    <a class="btn ghost sm" href="index.html" target="_blank" style="line-height:1.6">사이트 보기 ↗</a>
    <button class="btn ghost sm" id="logout-btn" hidden>로그아웃</button>
  </div>
</div></header>
<div class="wrap">

<div id="no-sb" class="card" hidden>
  <h2 style="font-weight:900;font-size:20px">Supabase 연결이 필요합니다</h2>
  <p style="color:var(--slate);margin-top:10px;font-size:14.5px">supabase-config.js에 프로젝트 URL과 KEY를 입력하면 관리자 기능이 활성화됩니다.</p>
</div>

<div id="login-view" class="card" style="max-width:420px;margin:60px auto" hidden>
  <h2 style="font-weight:900;font-size:20px;margin-bottom:6px">관리자 로그인</h2>
  <p style="font-size:13.5px;color:var(--slate);margin-bottom:18px">사이트 관리는 관리자만 할 수 있어요.</p>
  <label class="f">이메일<input class="input" id="l-email" type="email" autocomplete="username"></label>
  <label class="f">비밀번호<input class="input" id="l-pw" type="password" autocomplete="current-password"></label>
  <button class="btn big" style="width:100%" onclick="doLogin()">로그인</button>
  <div id="l-msg" class="msg" style="color:#D14343" hidden></div>
</div>

<div id="dash" hidden>
  <div class="a-tabs">
    <button class="on" data-t="inq">📥 견적문의 <span id="cnt-inq"></span></button>
    <button data-t="res">📂 자료실 파일 <span id="cnt-res"></span></button>
    <button data-t="notice">📢 공지사항 <span id="cnt-notice"></span></button>
    <button data-t="faq">❓ FAQ <span id="cnt-faq"></span></button>
  </div>

  <!-- 견적문의 -->
  <div data-p="inq">
    <div class="card" style="padding:18px 24px;margin-bottom:16px;background:#F4F7FF;border-color:#D9E3FF">
      <div style="font-size:14px;color:#40507E">사이트 <b>견적요청</b> 페이지로 접수된 문의가 여기에 쌓여요. 새 문의가 왔는지 이 탭에서 확인하세요.</div>
    </div>
    <div id="inq-list"></div>
  </div>

  <!-- 자료실 -->
  <div data-p="res" hidden>
    <div class="card">
      <h3 style="font-size:17px;font-weight:900;margin-bottom:12px">새 파일 올리기</h3>
      <div class="step"><b>1</b> 아래 점선 박스를 눌러 PDF 등 파일을 선택하고</div>
      <div class="step"><b>2</b> 어느 게시판에 올릴지(분류)와 자료명을 정한 뒤</div>
      <div class="step"><b>3</b> 업로드 버튼을 누르면 → 사이트 자료실에 바로 표시돼요</div>
      <div class="filebox" id="filebox" onclick="document.getElementById('r-file').click()" style="margin:16px 0">
        <div id="filebox-text" style="font-size:15px;font-weight:700;color:var(--slate)">📄 여기를 눌러 파일 선택</div>
        <div style="font-size:12.5px;color:#98A2B8;margin-top:4px">PDF, 이미지, 압축파일 등 · 최대 50MB</div>
      </div>
      <input id="r-file" type="file" hidden>
      <div class="grid2">
        <label class="f">분류 (어느 게시판에 표시할지)
          <select class="input" id="r-cat">
            <option value="manual-hv">제품 매뉴얼 → 고압전동기 탭</option>
            <option value="manual-lv">제품 매뉴얼 → 저압전동기 탭</option>
            <option value="manual-gm">제품 매뉴얼 → 기어드모터 탭</option>
            <option value="spec-lv">사양서 → 저압전동기</option>
            <option value="spec-gm">사양서 → 기어드모터</option>
            <option value="etc">기타</option>
          </select></label>
        <label class="f">언어
          <select class="input" id="r-lang"><option>한국어</option><option>영어</option><option>일본어</option><option>중국어</option><option>기타</option></select></label>
      </div>
      <label class="f">자료명 (사이트에 표시될 이름)<input class="input" id="r-title" placeholder="예: 고압전동기 취급설명서 REV 2.5"></label>
      <button class="btn big" onclick="uploadRes()">⬆ 업로드하기</button>
      <div id="r-msg" class="msg"></div>
    </div>
    <div class="sec-title">올라가 있는 파일 <span class="cnt" id="res-cnt2"></span></div>
    <div class="card" style="padding:0;overflow-x:auto"><div id="res-list"></div></div>
  </div>

  <!-- 공지 -->
  <div data-p="notice" hidden>
    <div class="card">
      <h3 style="font-size:17px;font-weight:900;margin-bottom:14px" id="n-form-title">새 공지 쓰기</h3>
      <input type="hidden" id="n-id">
      <label class="f">제목<input class="input" id="n-title" placeholder="예: 여름 휴가 기간 배송 안내"></label>
      <label class="f">내용<textarea class="input" id="n-body" rows="6" placeholder="공지 내용을 적어주세요"></textarea></label>
      <div style="display:flex;gap:10px">
        <button class="btn" onclick="saveNotice()">등록하기</button>
        <button class="btn ghost" onclick="resetNotice()">새로 쓰기</button>
      </div>
    </div>
    <div class="sec-title">등록된 공지 <span class="cnt" id="notice-cnt2"></span></div>
    <div class="card" style="padding:0;overflow-x:auto"><div id="notice-list"></div></div>
  </div>

  <!-- FAQ -->
  <div data-p="faq" hidden>
    <div class="card">
      <h3 style="font-size:17px;font-weight:900;margin-bottom:14px" id="f-form-title">새 질문 추가</h3>
      <input type="hidden" id="f-id">
      <label class="f">질문<input class="input" id="f-q" placeholder="예: 견적은 어떻게 요청하나요?"></label>
      <label class="f">답변<textarea class="input" id="f-a" rows="4" placeholder="답변 내용을 적어주세요"></textarea></label>
      <label class="f" style="max-width:200px">정렬 순서 (작을수록 위)<input class="input" id="f-sort" type="number" value="0"></label>
      <div style="display:flex;gap:10px">
        <button class="btn" onclick="saveFaq()">등록하기</button>
        <button class="btn ghost" onclick="resetFaq()">새로 쓰기</button>
      </div>
    </div>
    <div class="sec-title">등록된 FAQ <span class="cnt" id="faq-cnt2"></span></div>
    <div class="card" style="padding:0;overflow-x:auto"><div id="faq-list"></div></div>
  </div>
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="supabase-config.js"></script>
<script>
const sb=(window.SB_URL&&window.SB_KEY&&window.supabase)?window.supabase.createClient(window.SB_URL,window.SB_KEY):null;
const $=id=>document.getElementById(id);
const esc=s=>(s||'').toString().replace(/</g,'&lt;');
const CATS={'manual-hv':'매뉴얼·고압전동기','manual-lv':'매뉴얼·저압전동기','manual-gm':'매뉴얼·기어드모터','spec-lv':'사양서·저압','spec-gm':'사양서·기어드','etc':'기타'};
if(!sb){$('no-sb').hidden=false;}else{init();}
async function init(){
  const {data:{session}}=await sb.auth.getSession();
  if(session){showDash();}else{$('login-view').hidden=false;}
}
async function doLogin(){
  const {error}=await sb.auth.signInWithPassword({email:$('l-email').value.trim(),password:$('l-pw').value});
  if(error){$('l-msg').hidden=false;$('l-msg').textContent='로그인 실패: 이메일/비밀번호를 확인해 주세요.';return;}
  $('login-view').hidden=true;showDash();
}
$('logout-btn').addEventListener('click',async()=>{await sb.auth.signOut();location.reload();});
$('l-pw').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
function showDash(){$('dash').hidden=false;$('logout-btn').hidden=false;loadInq();loadNotices();loadFaqs();loadRes();}
document.querySelectorAll('.a-tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.a-tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.querySelectorAll('[data-p]').forEach(p=>p.hidden=p.dataset.p!==b.dataset.t);
}));
// 파일박스 표시
$('r-file').addEventListener('change',()=>{
  const f=$('r-file').files[0];
  if(f){$('filebox').classList.add('has');$('filebox-text').textContent='✅ '+f.name+' ('+(f.size/1024/1024).toFixed(1)+'MB)';
    if(!$('r-title').value)$('r-title').value=f.name.replace(/\\.[^.]+$/,'');}
});
// ── 견적문의
async function loadInq(){
  const {data}=await sb.from('inquiries').select('*').order('created_at',{ascending:false});
  $('cnt-inq').textContent=data&&data.length?'('+data.length+')':'(0)';
  $('inq-list').innerHTML=(data&&data.length)?data.map(q=>\`
  <div class="card" style="margin-bottom:12px">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <b style="font-size:16px">\${esc(q.name)}</b><span class="badge">\${esc(q.product||'기타')}</span>
      <span style="color:#98A2B8;font-size:13px">\${(q.created_at||'').slice(0,16).replace('T',' ')}</span>
      <button class="btn danger sm" style="margin-left:auto" onclick="delRow('inquiries','\${q.id}',loadInq)">삭제</button>
    </div>
    <div style="font-size:14px;color:var(--slate);margin-top:8px">📞 <a href="tel:\${esc(q.phone)}" style="color:var(--blue);font-weight:700">\${esc(q.phone)}</a>\${q.email?' &nbsp;·&nbsp; ✉ '+esc(q.email):''}</div>
    <div style="font-size:15px;margin-top:10px;padding:14px;background:var(--cloud);border-radius:10px;white-space:pre-wrap">\${esc(q.message)}</div>
    \${q.file_url?'<div style="margin-top:10px"><a href="'+q.file_url+'" target="_blank" class="btn ghost sm">📎 첨부파일 보기</a></div>':''}
  </div>\`).join(''):'<div class="card"><div class="empty">아직 접수된 문의가 없어요. 문의가 들어오면 여기에 표시됩니다.</div></div>';
}
// ── 자료실
async function loadRes(){
  const {data}=await sb.from('resources').select('*').order('created_at',{ascending:false});
  const n=data?data.length:0;
  $('cnt-res').textContent='('+n+')';$('res-cnt2').textContent=n+'개';
  $('res-list').innerHTML=n?\`<table class="list">
    <tr><th>분류</th><th>자료명</th><th>언어</th><th>올린 날짜</th><th></th><th></th></tr>
    \${data.map(r=>\`<tr>
      <td><span class="badge">\${CATS[r.category]||r.category}</span></td>
      <td style="font-weight:500">\${esc(r.title)}</td>
      <td><span class="badge lang">\${esc(r.lang)}</span></td>
      <td style="color:#98A2B8;font-size:13px">\${(r.created_at||'').slice(0,10)}</td>
      <td><a href="\${r.file_url}" target="_blank" class="btn ghost sm">파일 보기</a></td>
      <td><button class="btn danger sm" onclick="delRes('\${r.id}','\${r.file_path||''}')">삭제</button></td>
    </tr>\`).join('')}</table>\`
  :'<div class="empty">아직 올린 파일이 없어요. 위 "새 파일 올리기"에서 첫 파일을 올려보세요!</div>';
}
async function uploadRes(){
  const f=$('r-file').files[0],title=$('r-title').value.trim();
  if(!f){$('r-msg').style.color='#D14343';$('r-msg').textContent='① 파일을 먼저 선택해 주세요.';return;}
  if(!title){$('r-msg').style.color='#D14343';$('r-msg').textContent='② 자료명을 입력해 주세요.';return;}
  $('r-msg').style.color='var(--slate)';$('r-msg').textContent='업로드 중... 잠시만요';
  const path='resources/'+Date.now()+'-'+f.name.replace(/[^\\w.\\-가-힣]/g,'_');
  const {error:ue}=await sb.storage.from('files').upload(path,f);
  if(ue){$('r-msg').style.color='#D14343';$('r-msg').textContent='업로드 실패: '+ue.message;return;}
  const {data:pu}=sb.storage.from('files').getPublicUrl(path);
  const {error}=await sb.from('resources').insert({category:$('r-cat').value,lang:$('r-lang').value,title,file_url:pu.publicUrl,file_path:path});
  if(error){$('r-msg').style.color='#D14343';$('r-msg').textContent='저장 실패: '+error.message;return;}
  $('r-msg').style.color='#0E96A5';$('r-msg').textContent='✅ 업로드 완료! 사이트 자료실에 바로 표시돼요.';
  $('r-title').value='';$('r-file').value='';$('filebox').classList.remove('has');$('filebox-text').textContent='📄 여기를 눌러 파일 선택';
  loadRes();
}
async function delRes(id,path){
  if(!confirm('이 파일을 삭제할까요? 사이트에서도 사라져요.'))return;
  if(path)await sb.storage.from('files').remove([path]);
  await sb.from('resources').delete().eq('id',id);loadRes();
}
// ── 공지
async function loadNotices(){
  const {data}=await sb.from('notices').select('*').order('created_at',{ascending:false});
  const n=data?data.length:0;
  $('cnt-notice').textContent='('+n+')';$('notice-cnt2').textContent=n+'개';
  $('notice-list').innerHTML=n?\`<table class="list">
    <tr><th>제목</th><th>작성일</th><th></th><th></th></tr>
    \${data.map(x=>\`<tr>
      <td style="font-weight:500">\${esc(x.title)}</td>
      <td style="color:#98A2B8;font-size:13px;white-space:nowrap">\${(x.created_at||'').slice(0,10)}</td>
      <td><button class="btn ghost sm" onclick='editNotice(\${JSON.stringify(x).replace(/'/g,"&#39;")})'>수정</button></td>
      <td><button class="btn danger sm" onclick="delRow('notices','\${x.id}',loadNotices)">삭제</button></td>
    </tr>\`).join('')}</table>\`
  :'<div class="empty">아직 등록된 공지가 없어요. 위에서 첫 공지를 써보세요!</div>';
}
function editNotice(x){$('n-id').value=x.id;$('n-title').value=x.title;$('n-body').value=x.body||'';$('n-form-title').textContent='공지 수정하기';window.scrollTo({top:0,behavior:'smooth'});}
function resetNotice(){$('n-id').value='';$('n-title').value='';$('n-body').value='';$('n-form-title').textContent='새 공지 쓰기';}
async function saveNotice(){
  const rec={title:$('n-title').value.trim(),body:$('n-body').value};
  if(!rec.title)return alert('제목을 입력해 주세요.');
  const id=$('n-id').value;
  const {error}=id?await sb.from('notices').update(rec).eq('id',id):await sb.from('notices').insert(rec);
  if(error)return alert('저장 실패: '+error.message);
  resetNotice();loadNotices();
}
// ── FAQ
async function loadFaqs(){
  const {data}=await sb.from('faqs').select('*').order('sort');
  const n=data?data.length:0;
  $('cnt-faq').textContent='('+n+')';$('faq-cnt2').textContent=n+'개';
  $('faq-list').innerHTML=n?\`<table class="list">
    <tr><th style="width:60px">순서</th><th>질문</th><th></th><th></th></tr>
    \${data.map(x=>\`<tr>
      <td><span class="badge">\${x.sort}</span></td>
      <td style="font-weight:500">\${esc(x.question)}</td>
      <td><button class="btn ghost sm" onclick='editFaq(\${JSON.stringify(x).replace(/'/g,"&#39;")})'>수정</button></td>
      <td><button class="btn danger sm" onclick="delRow('faqs','\${x.id}',loadFaqs)">삭제</button></td>
    </tr>\`).join('')}</table>\`
  :'<div class="empty">아직 등록된 FAQ가 없어요. 사이트에는 기본 질문 4개가 표시 중이에요 — 여기서 등록하면 그걸로 교체돼요.</div>';
}
function editFaq(x){$('f-id').value=x.id;$('f-q').value=x.question;$('f-a').value=x.answer||'';$('f-sort').value=x.sort||0;$('f-form-title').textContent='FAQ 수정하기';window.scrollTo({top:0,behavior:'smooth'});}
function resetFaq(){$('f-id').value='';$('f-q').value='';$('f-a').value='';$('f-sort').value=0;$('f-form-title').textContent='새 질문 추가';}
async function saveFaq(){
  const rec={question:$('f-q').value.trim(),answer:$('f-a').value,sort:Number($('f-sort').value)||0};
  if(!rec.question)return alert('질문을 입력해 주세요.');
  const id=$('f-id').value;
  const {error}=id?await sb.from('faqs').update(rec).eq('id',id):await sb.from('faqs').insert(rec);
  if(error)return alert('저장 실패: '+error.message);
  resetFaq();loadFaqs();
}
async function delRow(table,id,cb){if(!confirm('삭제할까요?'))return;await sb.from(table).delete().eq('id',id);cb();}
</script>
</body>
</html>`;
  writeFileSync(join(OUT,'admin.html'), html);
}

/* ───────────────────────── run ───────────────────────── */
mkdirSync(OUT, { recursive: true });
buildCyclo();
buildAbout();
buildSpec();
buildManual();
buildProducts();
buildNotice();
buildFaqPage();
buildQuote();
buildAdminV2();
console.log('built:', readdirSync(OUT).filter(f=>f.endsWith('.html')).join(', '));
