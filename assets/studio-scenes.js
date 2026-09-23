/* Progressive scene enhancements; city and project content stays in studio.js. */
(() => {
  const wall = document.querySelector('.timeline-visual');
  const deck = wall.querySelector('.timeline-photo-pins');
  wall.classList.add('travel-table');
  const dates = ['BEFORE 2018', '2018 — 2024', '2025', '2025 — NOW'];
  const names = ['HAMI', 'SHANGHAI', 'HANGZHOU', 'SAN JOSE'];
  const cards = [...deck.querySelectorAll('[data-city]')];
  cards.forEach((card, index) => {
    card.classList.add('travel-pass');
    card.style.setProperty('--order', index);
    card.style.setProperty('--offset', `${(index - 1.5) * 86}px`);
    card.style.setProperty('--compact-offset', `${(index - 1.5) * 64}px`);
    card.style.setProperty('--angle', `${[-12, -5, 6, 13][index]}deg`);
    const photo = document.createElement('div');
    photo.className = 'travel-pass-photo';
    photo.setAttribute('aria-hidden', 'true');
    card.prepend(photo);
    const cityName = document.createElement('small');
    cityName.className = 'travel-pass-city';
    cityName.textContent = names[index];
    card.append(cityName);
    const date = document.createElement('em');
    date.textContent = dates[index];
    card.append(date);
  });
  function fan(index) {
    cards.forEach((card, i) => {
      card.style.setProperty('--spread', `${i < index ? -22 : i > index ? 22 : 0}px`);
      card.classList.toggle('is-raised', i === index);
    });
  }
  const selected = () => cards.findIndex(card => card.getAttribute('aria-pressed') === 'true');
  cards.forEach((card, i) => {
    card.addEventListener('pointerenter', () => fan(i));
    card.addEventListener('focus', () => fan(i));
    card.addEventListener('blur', () => fan(selected()));
  });
  deck.addEventListener('pointerleave', () => fan(selected()));
  new MutationObserver(() => fan(selected())).observe(deck, {subtree: true, attributes: true, attributeFilter: ['aria-pressed']});
  fan(selected());

  const desk = document.querySelector('.projects-visual');
  const pass = document.createElement('div');
  pass.className = 'work-pass';
  pass.innerHTML = `<span class="work-pass-band" aria-hidden="true"></span><button type="button" class="work-pass-card" aria-label="Cassie · 拖动工作牌 / Drag work pass"><span class="work-pass-clip" aria-hidden="true"></span><small>WORK IN PROGRESS</small><img src="assets/characters/cassie-favicon.png" alt=""><strong>Cassie Liang</strong><span>DESIGN · BUILD · LEARN</span><em>STUDIO PASS / 001</em></button>`;
  desk.append(pass);
  const card = pass.querySelector('button');
  let drag = null;
  const reset = () => {
    drag = null;
    pass.classList.remove('is-dragging');
    pass.style.setProperty('--dx', '0px');
    pass.style.setProperty('--dy', '0px');
    pass.style.setProperty('--tilt', '-7deg');
  };
  card.addEventListener('pointerdown', event => {
    if (event.button !== 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    drag = {x: event.clientX, y: event.clientY};
    card.setPointerCapture(event.pointerId);
    pass.classList.add('is-dragging');
  });
  card.addEventListener('pointermove', event => {
    if (!drag) return;
    const x = Math.max(-45, Math.min(75, event.clientX - drag.x));
    const y = Math.max(-25, Math.min(75, event.clientY - drag.y));
    pass.style.setProperty('--dx', `${x}px`);
    pass.style.setProperty('--dy', `${y}px`);
    pass.style.setProperty('--tilt', `${x / 8 - 7}deg`);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture', 'blur'].forEach(type => card.addEventListener(type, reset));
  card.addEventListener('keydown', event => { if (event.key === 'Escape') reset(); });
})();
