const D = window.POSTA_DATA;
const state = {
  screen: localStorage.getItem('posta:onboarded') ? 'app' : 'landing',
  mode: localStorage.getItem('posta:mode') || 'classic',
  selectedThread: D.threads[0].id,
  compose: false,
  overlay: null,
  loginError: '',
  offline: false,
  sending: false,
  failedSend: false,
  demo: localStorage.getItem('posta:demo') === 'open',
  demoStep: Number(localStorage.getItem('posta:demoStep') || 0),
  demoMode: localStorage.getItem('posta:demoMode') === 'true',
  presenterMode: localStorage.getItem('posta:presenter') === 'true',
  onboardingStep: 0,
  attachmentPreview: null,
  mentions: [],
  mentionOpen: false,
  mentionError: ''
};

const DEMO_STEPS = [
  {
    id: 'overview',
    title: 'One mailbox, two experiences',
    subtitle: 'Executive overview',
    body: 'Posta Mail delivers the same Exchange mailbox through two interfaces: <strong>Classic</strong> for premium folder-based control and <strong>Chat</strong> for fast conversation-style work. Switch anytime—every message, folder, and attachment stays in sync.',
    action: () => { state.mode = 'classic'; state.selectedThread = D.threads[0].id; state.offline = false; state.compose = false; state.failedSend = false; }
  },
  {
    id: 'classic',
    title: 'Classic: premium mail control',
    subtitle: 'Omar\'s workflow',
    body: 'Priority inbox surfaces urgent threads. The reading pane gives executives full message context with attachments and metadata. Compose, archive, and flag—enterprise-grade controls without compromise.',
    action: () => { state.mode = 'classic'; state.selectedThread = D.threads[0].id; state.compose = false; state.offline = false; state.failedSend = false; }
  },
  {
    id: 'switch',
    title: 'Same thread, different pace',
    subtitle: 'Mode switching',
    body: 'Click "View as chat" on any thread. The same proposal email becomes a conversation bubble—no data loss, no duplication. Every reply goes through Exchange as a real email.',
    action: () => { state.mode = 'chat'; state.selectedThread = D.threads[0].id; state.compose = false; state.offline = false; state.failedSend = false; }
  },
  {
    id: 'chat',
    title: 'Chat: fast replies, full context',
    subtitle: 'Sara\'s workflow',
    body: 'Quick-reply bar for speed. Open any bubble to see headers, attachments, and routing. Click "Open in Classic" to return to full-pane mode. All Exchange metadata preserved.',
    action: () => { state.mode = 'chat'; state.selectedThread = D.threads[0].id; state.compose = false; state.offline = false; state.failedSend = false; }
  },
  {
    id: 'resilience',
    title: 'Built for real conditions',
    subtitle: 'Resilience states',
    body: 'Offline banner shows connectivity issues. <strong>Click Retry below</strong> to see a failed send recover. Search and settings are ready for production integration.',
    action: () => { state.mode = 'classic'; state.offline = true; state.compose = false; state.failedSend = true; }
  }
];

const ONBOARDING_STEPS = [
  {
    icon: '✓',
    title: 'Identity verified',
    desc: 'Your enterprise credentials and MFA have been confirmed through Active Directory.'
  },
  {
    icon: '◈',
    title: 'Choose your workflow',
    desc: 'Classic for folder control or Chat for conversations. Switch anytime—same mailbox.'
  },
  {
    icon: '↻',
    title: 'Data stays synced',
    desc: 'Every message, draft, and attachment syncs to Exchange. Nothing is lost between modes.'
  }
];
const $ = (s) => document.querySelector(s);
const app = $('#app');
function contact(id){ return D.contacts.find(c=>c.id===id) || {name:'Me', email:D.profile.email, avatar:D.profile.avatar, presence:'available'}; }
function thread(){ return D.threads.find(t=>t.id===state.selectedThread) || D.threads[0]; }
function toast(msg){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); }
function set(patch){ Object.assign(state, patch); render(); }
function initials(name){ return name.split(' ').map(x=>x[0]).slice(0,2).join(''); }
function render(){
  document.body.classList.toggle('demo-active', state.demo);
  document.body.classList.toggle('presenter-mode', state.presenterMode);
  if(state.screen==='landing') return renderLanding();
  if(state.screen==='login') return renderLogin();
  if(state.screen==='mfa') return renderMfa();
  if(state.screen==='profile') return renderProfile();
  if(state.screen==='onboarding') return renderOnboarding();
  if(state.screen==='mode') return renderModeSelect();
  return renderApp();
}
function renderLanding(){ app.innerHTML = `
  <main class="landing-wrap">
    <div class="landing-backdrop"></div>
    <section class="landing-content">
      <div class="landing-brand">
        <div class="mark landing-mark">P</div>
        <span class="landing-wordmark">Posta Mail</span>
      </div>
      <h1 class="landing-headline">Enterprise mail,<br><span class="landing-accent">reimagined.</span></h1>
      <p class="landing-tagline">A premium dual-mode mailbox for high-performance teams. Executive folder control meets conversation-speed messaging—built on Exchange.</p>
      <div class="landing-ctas">
        <button class="landing-primary" id="landingDemo">
          <span class="landing-icon">▶</span>
          Start guided demo
        </button>
        <button class="landing-secondary" id="landingSignIn">Sign in</button>
      </div>
      <div class="landing-meta">
        <span>Enterprise-ready</span>
        <span>•</span>
        <span>Exchange native</span>
        <span>•</span>
        <span>Zero data migration</span>
      </div>
    </section>
    <aside class="landing-preview">
      <div class="preview-window">
        <div class="preview-topbar">
          <div class="preview-dots"><span></span><span></span><span></span></div>
          <div class="preview-toggle">
            <span class="pt-pill active">Classic</span>
            <span class="pt-pill">Chat</span>
          </div>
          <div class="preview-title">Posta Mail</div>
        </div>
        <div class="preview-content">
          <div class="preview-sidebar">
            <div class="ps-label">Mailboxes</div>
            <div class="ps-folder active"><span>Inbox</span><i>7</i></div>
            <div class="ps-folder"><span>Priority</span><i>3</i></div>
            <div class="ps-folder"><span>Sent</span></div>
            <div class="ps-folder"><span>Archive</span></div>
            <div class="ps-folder shared"><span>Support</span><i>5</i></div>
          </div>
          <div class="preview-list">
            <div class="pl-card active">
              <div class="pl-av" style="background:linear-gradient(135deg,#123f68,#082d4f)">SN</div>
              <div class="pl-body">
                <div class="pl-top"><strong>Sara Nabil</strong><span>09:42</span></div>
                <div class="pl-subj">Proposal review before demo</div>
                <div class="pl-snip">Can we make Classic feel premium…</div>
              </div>
            </div>
            <div class="pl-card">
              <div class="pl-av" style="background:linear-gradient(135deg,#315f70,#244b5a)">YS</div>
              <div class="pl-body">
                <div class="pl-top"><strong>Youssef Samir</strong><span>08:15</span></div>
                <div class="pl-subj">Invoice batch needs approval</div>
                <div class="pl-snip">Q2 vendor batch is ready, but…</div>
              </div>
            </div>
            <div class="pl-card">
              <div class="pl-av" style="background:linear-gradient(135deg,#8a651f,#b85f00)">LM</div>
              <div class="pl-body">
                <div class="pl-top"><strong>Lina Morgan</strong><span>Tue</span></div>
                <div class="pl-subj">Northstar onboarding: DNS</div>
                <div class="pl-snip">Ready for the migration window…</div>
              </div>
            </div>
          </div>
          <div class="preview-reading">
            <div class="pr-eyebrow">High priority · inbox</div>
            <div class="pr-title">Proposal review before Thursday demo</div>
            <div class="pr-from">Sara Nabil · Sales Lead</div>
            <div class="pr-msg">
              <div class="pr-msg-bar w90"></div>
              <div class="pr-msg-bar w70"></div>
            </div>
            <div class="pr-attach">▧ posta-demo-outline.pdf</div>
          </div>
        </div>
      </div>
      <div class="preview-chat">
        <div class="pc-head">
          <div class="pc-av">SN</div>
          <div class="pc-id"><strong>Sara Nabil</strong><span>Conversations</span></div>
        </div>
        <div class="pc-bubbles">
          <div class="pc-bubble">Make Classic feel premium for execs?</div>
          <div class="pc-bubble me">On it — same mailbox, faster pace.</div>
        </div>
        <div class="pc-reply"><span>Reply to Sara…</span><i>➤</i></div>
      </div>
    </aside>
  </main>`;
  $('#landingDemo').onclick = () => startDemoFromLanding();
  $('#landingSignIn').onclick = () => set({ screen: 'login' });
}

function startDemoFromLanding(){
  state.demoMode = true;
  state.screen = 'app';
  state.demo = true;
  state.demoStep = 0;
  state.selectedThread = D.threads[0].id;
  localStorage.setItem('posta:demoMode', 'true');
  DEMO_STEPS[0].action();
  syncDemoStorage();
  render();
}

function renderLogin(){ app.innerHTML = `
  <main class="auth-wrap">
    <section class="brand-stage">
      <div class="logo"><div class="mark">P</div><span>Posta Mail</span></div>
      <div class="hero-copy">
        <div class="product-kicker">Posta Mail prototype · dual-mode Exchange experience</div>
        <h1>Executive control meets conversation speed</h1>
        <p>A premium dual-mode mailbox for high-performance teams: enterprise-grade folder control with chat-style conversation threads over the same Exchange mailbox.</p>
      </div>
    </section>
    <section class="auth-card">
      <div class="eyebrow">Secure workspace access</div>
      <h2>Sign in to continue</h2>
      <p class="hint">Demo account credentials are pre-filled. This simulates Active Directory / Entra ID authentication with MFA.</p>
      ${state.loginError?`<div class="error">${state.loginError}</div>`:''}
      <div class="field">
        <label>Corporate email address</label>
        <input id="email" value="${D.profile.email}">
      </div>
      <div class="field">
        <label>Password</label>
        <input id="pass" type="password" value="posta-demo">
      </div>
      <button class="primary full" id="loginBtn">Continue with Posta ID</button>
      <p class="hint">Production deployment supports Kerberos SSO and certificate-based authentication for managed devices.</p>
    </section>
  </main>`;
  $('#loginBtn').onclick=()=>{ toast('Verifying credentials and policy compliance...'); setTimeout(()=>set({screen:'mfa'}),550); };
}
function renderMfa(){ app.innerHTML=`<main class="auth-wrap">
  <section class="brand-stage">
    <div class="logo"><div class="mark">P</div><span>Posta Mail</span></div>
    <div class="hero-copy">
      <div class="eyebrow">Multi-factor authentication</div>
      <h1>Approve sign-in on your registered device</h1>
      <p>Enterprise-grade security requires verification through your authenticator app or hardware token before granting mailbox access.</p>
    </div>
  </section>
  <section class="auth-card">
    <div class="eyebrow">Step 2 of 3</div>
    <h2>Multi-factor verification</h2>
    <p class="hint">A sign-in notification has been sent to Omar Hassan's registered Microsoft Authenticator. Approve the request to continue.</p>
    <div class="field">
      <label>One-time verification code (optional)</label>
      <input value="482 910" placeholder="Enter 6-digit code">
    </div>
    <button class="primary full" id="mfaOk">Approve and continue</button>
    <button class="ghost full" onclick="toast('Verification request resent to authenticator')">Resend notification</button>
  </section>
</main>`;
$('#mfaOk').onclick=()=>set({screen:'profile'});
}
function renderProfile(){ app.innerHTML=`<main class="auth-wrap">
  <section class="brand-stage">
    <div class="logo"><div class="mark">P</div><span>Posta Mail</span></div>
    <div class="hero-copy">
      <div class="eyebrow">Directory profile verification</div>
      <h1>Confirm your enterprise identity</h1>
      <p>Your profile, organizational structure, and mailbox permissions have been automatically resolved from Active Directory and Exchange Online.</p>
    </div>
  </section>
  <section class="auth-card">
    <div class="person" style="width:80px;height:80px;border-radius:20px;font-size:28px;margin-bottom:16px">${D.profile.avatar}</div>
    <h2>${D.profile.name}</h2>
    <p class="hint">
      ${D.profile.email}<br>
      ${D.profile.title}<br>
      ${D.profile.department}<br>
      Reports to: ${D.profile.manager}
    </p>
    <button class="primary full" id="profileOk" style="margin-top:24px">Confirm and continue</button>
  </section>
</main>`;
$('#profileOk').onclick=()=>set({screen:'onboarding', onboardingStep: 0});
}

function renderOnboarding(){
  const step = ONBOARDING_STEPS[state.onboardingStep];
  const isLast = state.onboardingStep === ONBOARDING_STEPS.length - 1;

  app.innerHTML = `
  <main class="onboarding-wrap">
    <div class="onboarding-backdrop"></div>
    <section class="onboarding-card">
      <div class="onboarding-progress">
        ${ONBOARDING_STEPS.map((s, i) => `
          <div class="onboarding-dot ${i === state.onboardingStep ? 'active' : ''} ${i < state.onboardingStep ? 'done' : ''}"></div>
        `).join('')}
      </div>
      <div class="onboarding-icon">${step.icon}</div>
      <h2 class="onboarding-title">${step.title}</h2>
      <p class="onboarding-desc">${step.desc}</p>
      <div class="onboarding-actions">
        <button class="primary onboarding-next" id="onboardNext">${isLast ? 'Choose mode →' : 'Continue →'}</button>
        <button class="ghost onboarding-skip" id="onboardSkip">Skip setup</button>
      </div>
      <div class="onboarding-counter">${state.onboardingStep + 1} of ${ONBOARDING_STEPS.length}</div>
    </section>
  </main>`;

  $('#onboardNext').onclick = () => {
    if(isLast){
      set({ screen: 'mode' });
    } else {
      set({ onboardingStep: state.onboardingStep + 1 });
    }
  };
  $('#onboardSkip').onclick = () => set({ screen: 'mode' });
}
function renderModeSelect(){ app.innerHTML=`<main class="auth-wrap"><section class="brand-stage"><div class="logo"><div class="mark">P</div><span>Posta Mail</span></div><div class="hero-copy"><div class="eyebrow">First-run setup</div><h1>Choose how email should feel.</h1><p>You can switch anytime. Both modes use the same mailbox, folders, permissions and Exchange messages.</p></div></section><section class="auth-card"><div class="eyebrow">Default experience</div><h2>Pick your starting mode</h2><div class="grid-2"><button class="choice ${state.mode==='classic'?'selected':''}" data-mode="classic"><h3>Classic Mail</h3><div class="mini-preview"></div><p class="hint">Premium 3-pane control for high-volume email work.</p></button><button class="choice ${state.mode==='chat'?'selected':''}" data-mode="chat"><h3>Conversations</h3><div class="mini-preview"></div><p class="hint">People-first threads with quick replies and email metadata intact.</p></button></div><button class="primary full" id="startApp" style="margin-top:18px">Enter Posta Mail</button></section></main>`; document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>set({mode:b.dataset.mode})); $('#startApp').onclick=()=>{localStorage.setItem('posta:onboarded','1'); localStorage.setItem('posta:mode',state.mode); set({screen:'app'});}; }
function shell(content){
  const presenterControls = state.presenterMode ? `
    <div class="presenter-bar">
      <span class="presenter-badge">Presenter Mode</span>
      <button class="presenter-btn" id="presenterPitch">Start pitch</button>
      <button class="presenter-btn" id="presenterReset">Reset demo</button>
      <button class="presenter-btn ghost" id="presenterExit">Exit</button>
    </div>` : '';

  const failedBanner = state.failedSend ? `
    <div class="failed-banner">
      <span class="failed-icon">⚠</span>
      <span class="failed-text">1 message failed to send. Queued for retry.</span>
      <button class="failed-retry" id="retryBtn">Retry now</button>
    </div>` : '';

  return `<div class="app-shell ${state.presenterMode ? 'presenter-active' : ''}">
    ${presenterControls}
    <header class="topbar">
      <div class="logo"><div class="mark">P</div><span>Posta Mail</span></div>
      ${state.demoMode ? '<span class="demo-mode-badge">Demo</span>' : ''}
      <button class="demo-btn" id="demoBtn"><span class="demo-icon">▶</span>Start demo</button>
      <button class="presenter-toggle ${state.presenterMode ? 'active' : ''}" id="presenterBtn">Presenter</button>
      <div class="mode-toggle"><button class="${state.mode==='classic'?'active':''}" data-mode="classic">Classic</button><button class="${state.mode==='chat'?'active':''}" data-mode="chat">Chat</button></div>
      <button class="search-pill" id="searchBtn"><span>Search mail, people, attachments</span><strong>/</strong></button>
      <button class="icon-btn" id="offlineBtn">${state.offline?'↯':'◌'}</button>
      <button class="icon-btn" id="notifBtn">●</button>
      <button class="icon-btn" id="settingsBtn">⚙</button>
      <div class="avatar">${D.profile.avatar}</div>
    </header>
    ${state.offline?'<div class="offline">Offline mode: showing cached threads. Search and presence are paused.</div>':''}
    ${failedBanner}
    <main class="main">${content}</main>
  </div>
  ${state.compose?compose():''}
  ${state.overlay?overlay():''}
  ${state.attachmentPreview ? attachmentModal() : ''}
  ${state.demo?demoPanel():''}`;
}
function renderApp(){ app.innerHTML = shell(state.mode==='classic'?classic():chat()); bindShell(); }
function bindShell(){
  document.querySelectorAll('.mode-toggle button').forEach(b=>b.onclick=()=>{localStorage.setItem('posta:mode',b.dataset.mode); set({mode:b.dataset.mode});});
  $('#searchBtn').onclick=()=>set({overlay:'search'});
  $('#settingsBtn').onclick=()=>set({overlay:'settings'});
  $('#notifBtn').onclick=()=>set({overlay:'notifications'});
  $('#offlineBtn').onclick=()=>{state.offline=!state.offline; state.failedSend=false; toast(state.offline?'Offline simulation on':'Back online. Syncing queued messages...'); render();};
  $('#demoBtn').onclick=()=>startDemo();
  $('#presenterBtn').onclick=()=>togglePresenter();

  const retryBtn = $('#retryBtn');
  if(retryBtn) retryBtn.onclick = () => retryFailedSend();

  const presenterPitch = $('#presenterPitch');
  const presenterReset = $('#presenterReset');
  const presenterExit = $('#presenterExit');
  if(presenterPitch) presenterPitch.onclick = () => startPitchFlow();
  if(presenterReset) presenterReset.onclick = () => resetDemo();
  if(presenterExit) presenterExit.onclick = () => togglePresenter();

  bindDemoControls();
  bindAttachmentClicks();
}

function togglePresenter(){
  state.presenterMode = !state.presenterMode;
  localStorage.setItem('posta:presenter', state.presenterMode ? 'true' : 'false');
  render();
}

function startPitchFlow(){
  state.demo = true;
  state.demoStep = 0;
  state.selectedThread = D.threads[0].id;
  DEMO_STEPS[0].action();
  syncDemoStorage();
  render();
}

function resetDemo(){
  localStorage.removeItem('posta:onboarded');
  localStorage.removeItem('posta:demo');
  localStorage.removeItem('posta:demoStep');
  localStorage.removeItem('posta:demoMode');
  state.screen = 'landing';
  state.demo = false;
  state.demoStep = 0;
  state.demoMode = false;
  state.offline = false;
  state.failedSend = false;
  state.compose = false;
  state.overlay = null;
  state.onboardingStep = 0;
  render();
  toast('Demo reset. Starting from landing page.');
}

function retryFailedSend(){
  state.failedSend = false;
  toast('Message sent successfully');
  render();
}

function bindAttachmentClicks(){
  setTimeout(() => {
    document.querySelectorAll('.attach').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const name = el.dataset.name || el.textContent.replace('▧ ', '').split(' · ')[0];
        const size = el.dataset.size || el.textContent.split(' · ')[1] || 'Unknown size';
        const type = getFileType(name);
        state.attachmentPreview = { name, size, type };
        render();
      };
    });
  }, 0);
}

function getFileType(name){
  const ext = name.split('.').pop().toLowerCase();
  const types = {
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    xls: 'Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet',
    csv: 'CSV Data File',
    png: 'PNG Image',
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    gif: 'GIF Image',
    zip: 'ZIP Archive'
  };
  return types[ext] || 'File';
}

function attachmentModal(){
  const a = state.attachmentPreview;
  const iconMap = {
    'PDF Document': '📄',
    'Word Document': '📝',
    'Excel Spreadsheet': '📊',
    'CSV Data File': '📋',
    'PNG Image': '🖼',
    'JPEG Image': '🖼',
    'GIF Image': '🖼',
    'ZIP Archive': '📦',
    'File': '📎'
  };
  const icon = iconMap[a.type] || '📎';

  return `<div class="overlay attachment-overlay" onclick="if(event.target.className.includes('overlay')){state.attachmentPreview=null;render()}">
    <div class="attachment-modal">
      <div class="attachment-header">
        <span class="attachment-title">Attachment Preview</span>
        <button class="attachment-close" onclick="state.attachmentPreview=null;render()">✕</button>
      </div>
      <div class="attachment-body">
        <div class="attachment-icon">${icon}</div>
        <div class="attachment-name">${a.name}</div>
        <div class="attachment-meta">
          <span class="attachment-type">${a.type}</span>
          <span>•</span>
          <span class="attachment-size">${a.size}</span>
        </div>
        <div class="attachment-preview-area">
          <div class="preview-placeholder">
            <span>Preview not available in prototype</span>
          </div>
        </div>
      </div>
      <div class="attachment-footer">
        <span class="attachment-note">Download disabled in prototype mode</span>
        <button class="secondary" onclick="state.attachmentPreview=null;render()">Close</button>
      </div>
    </div>
  </div>`;
}
const OL_FOLDER_ICONS = { inbox:'fa-solid fa-inbox', priority:'fa-solid fa-star', sent:'fa-solid fa-paper-plane', drafts:'fa-regular fa-pen-to-square', archive:'fa-solid fa-box-archive', shared:'fa-solid fa-users' };
function classic(){
  const t=thread();
  const c=contact(t.contact);
  const unreadCount = D.threads.filter(x=>x.unread).length;

  return `<section class="classic outlook">
    <div class="ol-ribbon">
      <button class="ol-rib-btn primary" onclick="state.compose=true;render()"><i class="ol-ic fa-regular fa-pen-to-square"></i>New Email</button>
      <span class="ol-rib-sep"></span>
      <button class="ol-rib-btn" onclick="toast('Deleted for prototype')"><i class="ol-ic fa-regular fa-trash-can"></i>Delete</button>
      <button class="ol-rib-btn" onclick="toast('Archived for prototype')"><i class="ol-ic fa-solid fa-box-archive"></i>Archive</button>
      <span class="ol-rib-sep"></span>
      <button class="ol-rib-btn" onclick="state.compose=true;render()"><i class="ol-ic fa-solid fa-reply"></i>Reply</button>
      <button class="ol-rib-btn" onclick="state.compose=true;render()"><i class="ol-ic fa-solid fa-reply-all"></i>Reply All</button>
      <button class="ol-rib-btn" onclick="state.compose=true;render()"><i class="ol-ic fa-solid fa-share"></i>Forward</button>
      <span class="ol-rib-sep"></span>
      <button class="ol-rib-btn" onclick="toast('Flag toggled')"><i class="ol-ic ol-ic-flag fa-solid fa-flag"></i>Flag</button>
      <button class="ol-rib-btn" onclick="toast('Marked as read')"><i class="ol-ic fa-regular fa-envelope-open"></i>Mark Read</button>
      <span class="ol-rib-spacer"></span>
      <button class="ol-rib-btn ghost" onclick="state.mode='chat';render()"><i class="ol-ic fa-regular fa-comments"></i>View as chat</button>
    </div>
    <div class="ol-body">
      <aside class="ol-folders">
        <div class="ol-fav"><i class="fa-solid fa-caret-down"></i> Favorites</div>
        <div class="ol-folder fav ${t.folder==='inbox'?'active':''}"><i class="ol-fic fa-solid fa-inbox"></i><span class="ol-fname">Inbox</span><i class="ol-fcount">${D.folders.find(f=>f.id==='inbox').unread}</i></div>
        <div class="ol-folder fav"><i class="ol-fic fa-solid fa-paper-plane"></i><span class="ol-fname">Sent Items</span></div>
        <div class="ol-acct"><i class="fa-solid fa-caret-down"></i> ${D.profile.email}</div>
        ${D.folders.map(f=>`<div class="ol-folder ${f.id===t.folder?'active':''}"><i class="ol-fic ${OL_FOLDER_ICONS[f.id]||'fa-regular fa-folder'}"></i><span class="ol-fname">${f.label}</span>${f.unread?`<i class="ol-fcount">${f.unread}</i>`:''}</div>`).join('')}
        <div class="ol-folder"><i class="ol-fic fa-regular fa-trash-can"></i><span class="ol-fname">Deleted Items</span></div>
      </aside>
      <section class="ol-list">
        <div class="ol-list-search"><i class="ol-ic fa-solid fa-magnifying-glass"></i>Search Current Mailbox <kbd>Ctrl+E</kbd></div>
        <div class="ol-list-bar">
          <div class="ol-foctabs"><button class="active">Focused</button><button onclick="toast('Other inbox is empty in prototype')">Other</button></div>
          <div class="ol-listmeta"><span>By Date <i class="ol-caret fa-solid fa-caret-down"></i></span></div>
        </div>
        <div class="ol-list-section">Today</div>
        <div class="ol-rows">${D.threads.map(x=>mailCard(x)).join('')}</div>
        <div class="ol-list-foot"><i class="fa-solid fa-circle-check ol-ic-ok"></i> ${D.threads.length} items · ${unreadCount} unread · Connected to Exchange</div>
      </section>
      <section class="ol-read">${readingPane(t,c)}</section>
    </div>
  </section>`;
}
function mailCard(t){
  const c=contact(t.contact);
  return `<article class="ol-row ${t.id===state.selectedThread?'active':''} ${t.unread?'unread':''}" data-thread="${t.id}">
    <span class="ol-unreadbar"></span>
    <div class="ol-av">${c.avatar}</div>
    <div class="ol-row-main">
      <div class="ol-row-l1"><span class="ol-from">${c.name}</span><span class="ol-date">${t.last}</span></div>
      <div class="ol-row-l2"><span class="ol-subj">${t.subject}</span>${t.flagged?'<i class="ol-flag fa-solid fa-flag"></i>':''}</div>
      <div class="ol-row-l3"><span class="ol-snip">${t.snippet}</span>${t.attachments.length?'<i class="ol-clip fa-solid fa-paperclip"></i>':''}</div>
    </div>
  </article>`;
}
function readingPane(t,c){
  setTimeout(()=>document.querySelectorAll('.ol-row').forEach(el=>el.onclick=()=>set({selectedThread:el.dataset.thread})),0);
  return `<div class="ol-read-head">
    <div class="ol-read-subj">${t.subject}${t.flagged?'<i class="ol-read-flag fa-solid fa-flag"></i>':''}</div>
    <div class="ol-read-from">
      <div class="ol-av big">${c.avatar}</div>
      <div class="ol-read-who">
        <div class="ol-read-name">${c.name} <span class="ol-read-email">&lt;${c.email}&gt;</span></div>
        <div class="ol-read-to">To: ${D.profile.name}${t.messages.some(m=>(m.meta||'').includes('CC'))?'; CC: Product':''}<span class="ol-read-time">${t.messages[t.messages.length-1].time}</span></div>
      </div>
      <div class="ol-read-actions">
        <button title="Reply" onclick="state.compose=true;render()"><i class="fa-solid fa-reply"></i></button>
        <button title="Reply All" onclick="state.compose=true;render()"><i class="fa-solid fa-reply-all"></i></button>
        <button title="Forward" onclick="state.compose=true;render()"><i class="fa-solid fa-share"></i></button>
      </div>
    </div>
  </div>
  <div class="ol-read-body">${t.messages.map(m=>msg(m)).join('')}</div>`;
}
function msg(m){
  const c=m.from==='me'?D.profile:contact(m.from);
  return `<article class="ol-msg"><div class="ol-msg-top"><div class="ol-av sm">${c.avatar}</div><div class="ol-msg-id"><strong>${c.name}</strong><span>${m.meta||''}</span></div><span class="ol-msg-time">${m.time}</span></div><p>${m.body}</p>${(m.attachments||[]).map(a=>`<span class="attach" data-name="${a.name}" data-size="${a.size}"><i class="fa-solid fa-paperclip"></i> ${a.name} · ${a.size}</span>`).join('')}</article>`;
}
function chat(){ const t=thread(), c=contact(t.contact); return `<section class="chat"><aside class="pane chat-list"><div class="eyebrow">Conversations</div><h2 style="letter-spacing:-.04em">People-first inbox</h2>${D.threads.map(x=>conv(x)).join('')}</aside><section class="thread"><div class="thread-head"><div><strong>${c.name}</strong><div class="hint">${t.subject}</div></div><div class="toolbar"><button onclick="state.mode='classic';render()">Open in Classic</button><button onclick="toast('Thread muted')">Mute</button></div></div><div class="bubbles">${t.messages.map(m=>bubble(m)).join('')}</div><div class="qr-wrap">${mentionChips()}${state.mentionOpen?mentionMenu():''}<div class="quick-reply"><button class="qr-mention ${state.mentionOpen?'active':''}" id="mentionBtn" aria-label="Mention another recipient" aria-expanded="${state.mentionOpen}" onclick="toggleMention()"><i class="fa-solid fa-at"></i></button><input id="quickText" placeholder="Reply to ${c.name}…"><button class="primary" id="quickSend">Send</button><button class="secondary" onclick="state.compose=true;render()">Expand</button></div></div></section></section>`; }
function mentionChips(){
  if(!state.mentions.length) return '';
  return `<div class="qr-chips"><span class="qr-chips-label"><i class="fa-solid fa-users"></i> Also to</span>${state.mentions.map((m,i)=>`<span class="qr-chip" title="${m.email}"><span class="qr-chip-av">${initials(m.name)}</span><span class="qr-chip-name">${m.name}</span><button class="qr-chip-x" aria-label="Remove ${m.name}" onclick="removeMention(${i})"><i class="fa-solid fa-xmark"></i></button></span>`).join('')}</div>`;
}
function mentionMenu(){
  const taken = new Set(state.mentions.map(m=>m.email));
  const cur = thread().contact;
  const list = D.contacts.filter(c=>!taken.has(c.email) && c.id!==cur);
  return `<div class="mention-menu" role="dialog" aria-label="Add recipient">
    <div class="mention-menu-head"><span><i class="fa-solid fa-at"></i> Mention a recipient</span><button class="mention-close" aria-label="Close" onclick="toggleMention()"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="mention-list">
      ${list.length?list.map(c=>`<button class="mention-item" onclick="addMention('${c.id}')"><span class="mention-av">${c.avatar}</span><span class="mention-id"><strong>${c.name}</strong><span>${c.email}</span></span><i class="fa-solid fa-plus mention-add"></i></button>`).join(''):'<div class="mention-empty">Everyone is already added.</div>'}
    </div>
    <div class="mention-personal">
      <label for="mentionEmail">Add personal or external email</label>
      <div class="mention-personal-row">
        <i class="fa-solid fa-envelope"></i>
        <input id="mentionEmail" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" onkeydown="if(event.key==='Enter'){event.preventDefault();addPersonalEmail()}">
        <button class="primary" onclick="addPersonalEmail()">Add</button>
      </div>
      ${state.mentionError?`<p class="mention-err" role="alert"><i class="fa-solid fa-circle-exclamation"></i> ${state.mentionError}</p>`:''}
    </div>
  </div>`;
}
function toggleMention(){ set({ mentionOpen: !state.mentionOpen, mentionError: '' }); }
function addMention(id){
  const c = contact(id);
  if(!state.mentions.some(m=>m.email===c.email)) state.mentions.push({ name:c.name, email:c.email });
  set({ mentionError:'' });
}
function addPersonalEmail(){
  const input = $('#mentionEmail');
  const val = (input?.value || '').trim();
  if(!val){ set({ mentionError:'Enter an email address.' }); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){ set({ mentionError:`"${val}" is not a valid email address.` }); return; }
  if(state.mentions.some(m=>m.email.toLowerCase()===val.toLowerCase())){ set({ mentionError:'That recipient is already added.' }); return; }
  const name = val.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,ch=>ch.toUpperCase());
  state.mentions.push({ name, email: val });
  set({ mentionError:'' });
}
function removeMention(i){ state.mentions.splice(i,1); set({ mentionError:'' }); }
function conv(t){ const c=contact(t.contact); setTimeout(()=>document.querySelectorAll('.conversation').forEach(el=>el.onclick=()=>set({selectedThread:el.dataset.thread})),0); return `<article class="conversation ${t.id===state.selectedThread?'active':''}" data-thread="${t.id}"><div style="position:relative"><div class="person">${c.avatar}</div><i class="presence"></i></div><div><div class="mail-meta"><strong>${c.name}</strong><span class="time">${t.last}</span></div><div class="subject">${t.subject}</div><div class="snippet">${t.snippet}</div></div></article>`; }
function bubble(m){ const isMe=m.from==='me'; return `<div class="bubble ${isMe?'me':''}"><div class="meta">${m.time} · ${m.meta||''}</div>${m.body}${(m.attachments||[]).map(a=>`<div class="attach" data-name="${a.name}" data-size="${a.size || 'Unknown'}">▧ ${a.name}</div>`).join('')}</div>`; }
function compose(){ return `<section class="compose"><div class="compose-head"><strong>New message</strong><button onclick="state.compose=false;render()" class="ghost">✕</button></div><div class="compose-body"><div class="field"><label>To</label><input value="${contact(thread().contact).email}"></div><div class="field"><label>Subject</label><input value="Re: ${thread().subject}"></div><div class="field"><label>Message</label><textarea>Thanks — I’ll review and send the final notes shortly.</textarea></div><div class="actions"><span class="hint">Draft saved · GAL autocomplete enabled</span><button class="primary" id="sendMail">Send email</button></div></div></section>`; }
function overlay(){ if(state.overlay==='search') return modal('Search', `<div class="field"><input id="searchInput" value="proposal"></div><div class="search-results">${D.threads.map(t=>`<div class="result"><strong>${t.subject}</strong><p class="hint">${contact(t.contact).name} · ${t.snippet}</p></div>`).join('')}</div>`); if(state.overlay==='settings') return modal('Settings', `<div class="settings-grid"><div class="setting"><strong>Default mode</strong><p class="hint">${state.mode}</p></div><div class="setting"><strong>Density</strong><p class="hint">Comfortable</p></div><div class="setting"><strong>AI smart replies</strong><p class="hint">Disabled pending privacy approval</p></div><div class="setting"><strong>Signature</strong><p class="hint">Managed by Exchange profile</p></div></div>`); return modal('Notifications', D.notifications.map(n=>`<div class="result">${n}</div>`).join('')); }
function modal(title,body){ return `<div class="overlay" onclick="if(event.target.className==='overlay'){state.overlay=null;render()}"><div class="modal"><div class="reading-head"><h2>${title}</h2><button class="secondary" onclick="state.overlay=null;render()">Close</button></div>${body}</div></div>`; }

function syncDemoStorage(){
  if(state.demo){
    localStorage.setItem('posta:demo','open');
    localStorage.setItem('posta:demoStep', String(state.demoStep));
  } else {
    localStorage.removeItem('posta:demo');
    localStorage.removeItem('posta:demoStep');
  }
}
function startDemo(){ state.demo = true; state.demoStep = 0; DEMO_STEPS[0].action(); syncDemoStorage(); render(); }
function endDemo(){ state.demo = false; state.demoStep = 0; state.offline = false; syncDemoStorage(); render(); }
function demoNext(){ if(state.demoStep < DEMO_STEPS.length - 1){ state.demoStep++; DEMO_STEPS[state.demoStep].action(); syncDemoStorage(); render(); } else { endDemo(); } }
function demoBack(){ if(state.demoStep > 0){ state.demoStep--; DEMO_STEPS[state.demoStep].action(); syncDemoStorage(); render(); } }

function demoPanel(){
  const step = DEMO_STEPS[state.demoStep];
  const isFirst = state.demoStep === 0;
  const isLast = state.demoStep === DEMO_STEPS.length - 1;

  return `<aside class="demo-panel">
    <div class="demo-header">
      <div class="demo-badge">Demo story</div>
      <button class="demo-close" onclick="endDemo()" title="Exit demo (Esc)">✕</button>
    </div>
    <div class="demo-progress">
      ${DEMO_STEPS.map((s, i) => `<button class="demo-pill ${i === state.demoStep ? 'active' : ''} ${i < state.demoStep ? 'done' : ''}" onclick="state.demoStep=${i};DEMO_STEPS[${i}].action();render()" title="${s.title}">${i + 1}</button>`).join('')}
    </div>
    <div class="demo-content">
      <div class="demo-step-label">${step.subtitle}</div>
      <h3 class="demo-title">${step.title}</h3>
      <p class="demo-body">${step.body}</p>
    </div>
    <div class="demo-nav">
      <button class="demo-nav-btn secondary" onclick="demoBack()" ${isFirst ? 'disabled' : ''}>← Back</button>
      <span class="demo-counter">${state.demoStep + 1} of ${DEMO_STEPS.length}</span>
      <button class="demo-nav-btn primary" onclick="demoNext()">${isLast ? 'End demo' : 'Next →'}</button>
    </div>
    <div class="demo-keys">
      <span><kbd>←</kbd> <kbd>→</kbd> navigate</span>
      <span><kbd>Esc</kbd> exit</span>
    </div>
  </aside>`;
}

function bindDemoControls(){
  document.addEventListener('keydown', (e) => {
    if(!state.demo) return;
    if(e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); demoNext(); }
    if(e.key === 'ArrowLeft') { e.preventDefault(); demoBack(); }
    if(e.key === 'Escape') { e.preventDefault(); endDemo(); }
  });
}
document.addEventListener('click',e=>{ if(e.target?.id==='sendMail'){ toast('Email sent through Exchange simulation'); state.compose=false; render(); } if(e.target?.id==='quickSend'){ const input=$('#quickText'); if(input?.value){ const extra=state.mentions.length; state.mentions=[]; state.mentionOpen=false; toast(extra?`Quick reply sent · also to ${extra} recipient${extra>1?'s':''}`:'Quick reply sent as real email simulation'); input.value=''; if(extra) render(); } else toast('Type a reply first'); }});
if(state.demo && DEMO_STEPS[state.demoStep]) DEMO_STEPS[state.demoStep].action();

// Update screen if returning from cleared onboarding
if(!localStorage.getItem('posta:onboarded') && state.screen === 'app'){
  state.screen = 'landing';
}

render();
