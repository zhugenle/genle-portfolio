const manifest = window.GENLE_ASSETS || { hero: '', homeRows: [], work: [], post: [] };
const workList = document.querySelector('#home-work-list');
const arrow = '<svg viewBox="0 0 10 13" aria-hidden="true"><path d="M10 6.5 0 12.5V.5l10 6Z" fill="currentColor" /></svg>';
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const heroVideo = document.querySelector('.hero-media > video');
if (heroVideo && manifest.hero) {
  const source = heroVideo.querySelector('source');
  source.src = manifest.hero;
  heroVideo.load();
  heroVideo.play().catch(() => {});
}

if (workList && manifest.homeRows.length) {
  const speeds = [45, 60, 30, 65, 45, 60, 30];
  const sections = [...new Set(manifest.homeRows.map((row) => row.section || 'Work'))];
  let rowIndex = 0;
  workList.innerHTML = sections.map((section, sectionIndex) => `
    <section class="home-work-group" aria-labelledby="home-work-group-${sectionIndex + 1}">
      <h3 class="home-work-group-title" id="home-work-group-${sectionIndex + 1}">${escapeHtml(section)}</h3>
      ${manifest.homeRows.filter((row) => (row.section || 'Work') === section).map((row) => {
        const index = rowIndex++;
        return `<article class="home-work-row" data-row-index="${index + 1}" data-surface="dom-home-work-${index + 1}">
      <hr class="card-rule" />
      <div class="home-work-head">
        <h4>${escapeHtml(row.name)}</h4>
        <p aria-hidden="true"></p>
        
      </div>
      <div class="home-work-strip" aria-label="${escapeHtml(row.name)} image strip">
        <div class="home-strip-track" data-speed="${speeds[index % speeds.length]}"></div>
      </div>
    </article>`;
      }).join('')}
    </section>`).join('');

  function renderStrips() {
    manifest.homeRows.forEach((row, index) => {
      const strip = workList.querySelectorAll('.home-work-strip')[index];
      const track = strip.querySelector('.home-strip-track');
      const height = strip.clientHeight;
      const baseWidth = row.images.reduce((total, image) => total + height * image.width / image.height, 0) + 10 * (row.images.length - 1);
      const repeats = Math.max(1, Math.ceil((strip.clientWidth + 10) / (baseWidth + 10)));
      if (track.dataset.repeats === String(repeats)) return;
      const items = Array.from({ length: repeats }, () => row.images.map((image) =>
        `<div class="home-strip-item"><img src="${image.src}" width="${image.width}" height="${image.height}" alt="" loading="lazy" /></div>`
      ).join('')).join('');
      track.innerHTML = `<div class="home-strip-group">${items}</div><div class="home-strip-group" aria-hidden="true">${items}</div>`;
      track.dataset.repeats = String(repeats);
    });
  }
  renderStrips();
  window.addEventListener('resize', renderStrips, { passive: true });
}

const postList = document.querySelector('#home-post-list');
if (postList && manifest.post?.length) {
  postList.innerHTML = manifest.post.slice(0, 2).map((post, index) => `
    <article class="news-card${index === 0 ? ' news-card-large' : ''}">
      <div class="news-image"><img src="${escapeHtml(post.src)}" width="${post.width}" height="${post.height}" alt="${escapeHtml(post.alt || post.title)}" loading="lazy" /></div>
      <h3>${escapeHtml(post.title)}</h3>
    </article>`).join('');
}

const clientList = document.querySelector('#home-client-list');
if (clientList) {
  clientList.innerHTML = (manifest.clients || []).map(client => `
    <li class="client-logo" style="--logo-width:${client.visualWidth || 160}px">${client.markup || ''}</li>`).join('');
  clientList.querySelectorAll('svg').forEach(svg => {
    const bounds = svg.getBBox();
    if (bounds.width > 0 && bounds.height > 0) {
      const padding = Math.max(bounds.width, bounds.height) * .01;
      svg.setAttribute('viewBox', `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`);
    }
  });
}

const menuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}));
