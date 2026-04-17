import { SPRITE_SOURCES, isValidForSource } from '../data/sprite-sources';

interface PokemonInfo {
  names: { en: string; ja: string; zh: string };
  types: string[];
}

let currentId = 1;
let selectedSourceId: string | null = null;
const pokeCache = new Map<number, PokemonInfo>();

export function showToast(message: string) {
  const toast = document.getElementById('toast') as HTMLDivElement | null;
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

export function getValidId(): number {
  const idInput = document.getElementById('poke-id') as HTMLInputElement;
  const val = parseInt(idInput?.value ?? '1', 10);
  if (Number.isNaN(val)) return 1;
  return Math.max(1, Math.min(1025, val));
}

export function getActiveSourceId(): string | null {
  const grid = document.getElementById('sprite-grid') as HTMLDivElement;
  if (!grid) return null;
  const visibleCards = Array.from(grid.querySelectorAll('.sprite-card:not([hidden])'));
  if (selectedSourceId) {
    const match = visibleCards.find((card) => card.getAttribute('data-source-id') === selectedSourceId);
    if (match) return match.getAttribute('data-source-id');
  }
  return visibleCards[0]?.getAttribute('data-source-id') || null;
}

export async function fetchPokemonInfo(id: number): Promise<PokemonInfo | null> {
  if (pokeCache.has(id)) {
    return pokeCache.get(id)!;
  }
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
    ]);
    if (!pokemonRes.ok) return null;
    const pokemon = await pokemonRes.json();
    const species = speciesRes.ok ? await speciesRes.json() : null;

    const names = species?.names ?? [];
    const getName = (lang: string) =>
      names.find((n: any) => n.language.name === lang)?.name ?? '';

    const info: PokemonInfo = {
      names: {
        en: getName('en') || pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        ja: getName('ja-hrkt') || getName('ja') || '',
        zh: getName('zh-hans') || getName('zh-hant') || '',
      },
      types: pokemon.types.map((t: any) => t.type.name),
    };
    pokeCache.set(id, info);
    return info;
  } catch {
    return null;
  }
}

export async function updatePokemonInfo(id: number): Promise<void> {
  const pokeName = document.getElementById('poke-name') as HTMLElement;
  const pokeTypes = document.getElementById('poke-types') as HTMLElement;
  if (!pokeName) return;

  pokeName.textContent = 'Loading...';
  if (pokeTypes) pokeTypes.textContent = '';

  const info = await fetchPokemonInfo(id);
  if (info) {
    const { names, types } = info;
    const typeText = types.map((t: string) => `<span class="type-badge type-${t}">${t}</span>`).join('');
    pokeName.innerHTML = `#${id} <span class="name-en">${names.en}</span>` +
      (names.ja ? ` <span class="name-ja">${names.ja}</span>` : '') +
      (names.zh ? ` <span class="name-zh">${names.zh}</span>` : '');
    if (pokeTypes) pokeTypes.innerHTML = typeText;
  } else {
    pokeName.textContent = `#${id}`;
  }

  // Sync favicon preview when info is available
  if (info) {
    const name = info.names.en.toLowerCase().replace(/[^a-z0-9]/g, '');
    const faviconUrl = `/sprites-gallery/favicons/${name}.png`;
    const previewImg = document.getElementById('favicon-preview-img') as HTMLImageElement | null;
    if (previewImg) previewImg.src = faviconUrl;
    const hasFaviconPref = localStorage.getItem('preferred-sprite-source');
    if (hasFaviconPref) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (link) link.href = faviconUrl;
    }
  }
}

export function updateImages(): void {
  const id = getValidId();
  currentId = id;
  const idInput = document.getElementById('poke-id') as HTMLInputElement;
  if (idInput) idInput.value = String(id);

  const grid = document.getElementById('sprite-grid') as HTMLDivElement;
  if (!grid) return;

  const images = grid.querySelectorAll('.sprite-img');
  images.forEach((img) => {
    const el = img as HTMLImageElement;
    const sourceId = el.dataset.source;
    if (!sourceId) return;
    const source = SPRITE_SOURCES.find((s) => s.id === sourceId);
    if (!source) return;

    if (!isValidForSource(id, source)) {
      el.src = '';
      el.classList.add('error');
      el.parentElement?.classList.add('show-placeholder');
    } else {
      el.classList.remove('error');
      el.parentElement?.classList.remove('show-placeholder');
      const newUrl = source.url(id);
      if (el.src !== newUrl) {
        el.src = newUrl;
      }
    }
  });

  const urlTemplate = document.getElementById('url-template') as HTMLElement;
  if (urlTemplate) {
    const sid = getActiveSourceId();
    const source = sid ? SPRITE_SOURCES.find((s) => s.id === sid) : undefined;
    if (source) {
      urlTemplate.textContent = source.url(1).replace(/\/(\d+)\.(png|svg)$/, '/{id}.$2');
    }
  }
}

export function applyGenFilter(): void {
  const genFilter = document.getElementById('gen-filter') as HTMLSelectElement;
  const grid = document.getElementById('sprite-grid') as HTMLDivElement;
  if (!genFilter || !grid) return;

  const gen = genFilter.value;
  const cards = grid.querySelectorAll('.sprite-card');
  cards.forEach((card) => {
    if (card.classList.contains('favicon-card')) return;
    const cardGen = card.getAttribute('data-generation') || '';
    if (!gen || cardGen === gen) {
      (card as HTMLElement).hidden = false;
    } else {
      (card as HTMLElement).hidden = true;
    }
  });
  updateImages();
}

export function randomize(): void {
  const id = Math.floor(Math.random() * 1025) + 1;
  const idInput = document.getElementById('poke-id') as HTMLInputElement;
  if (idInput) idInput.value = String(id);
  updateImages();
}

export function setAsFavicon(sourceId: string, pokemonId: number): void {
  const info = pokeCache.get(pokemonId);
  if (!info) return;
  const name = info.names.en.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = `/sprites-gallery/favicons/${name}.png`;
  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
  if (link) link.href = url;
  localStorage.setItem('preferred-pokemon-id', String(pokemonId));
  localStorage.setItem('preferred-sprite-source', sourceId);
  // Clear any stale canvas-generated URL from older versions
  localStorage.removeItem('preferred-favicon-url');
  showToast(`Set favicon to #${pokemonId}`);
}

export function initGallery(): void {
  const idInput = document.getElementById('poke-id') as HTMLInputElement;
  const btnRandom = document.getElementById('btn-random') as HTMLButtonElement;
  const genFilter = document.getElementById('gen-filter') as HTMLSelectElement;
  const grid = document.getElementById('sprite-grid') as HTMLDivElement;
  const copyTemplateBtn = document.getElementById('copy-template') as HTMLButtonElement;
  const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;

  // Event listeners
  idInput?.addEventListener('change', () => {
    updateImages();
    updatePokemonInfo(currentId);
  });
  idInput?.addEventListener('input', updateImages);
  btnRandom?.addEventListener('click', () => {
    randomize();
    updatePokemonInfo(currentId);
  });
  genFilter?.addEventListener('change', applyGenFilter);

  grid?.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.action-btn') as HTMLElement | null;
    if (!target) return;
    const sid = target.dataset.source;
    if (!sid) return;

    if (target.classList.contains('copy-url')) {
      const source = SPRITE_SOURCES.find((s) => s.id === sid);
      if (source) {
        navigator.clipboard.writeText(source.url(currentId));
        showToast('URL copied');
      }
    }
    if (target.classList.contains('set-favicon')) {
      selectedSourceId = sid;
      setAsFavicon(sid, currentId);
      updateImages();
    }
  });

  copyTemplateBtn?.addEventListener('click', () => {
    const urlTemplate = document.getElementById('url-template') as HTMLElement;
    const text = urlTemplate?.textContent || '';
    if (text) {
      navigator.clipboard.writeText(text);
      showToast('Template copied');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        return;
      }
    }

    const idInputEl = document.getElementById('poke-id') as HTMLInputElement;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (idInputEl) idInputEl.value = String(Math.max(1, currentId - 1));
        updateImages();
        updatePokemonInfo(currentId);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (idInputEl) idInputEl.value = String(Math.min(1025, currentId + 1));
        updateImages();
        updatePokemonInfo(currentId);
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        randomize();
        updatePokemonInfo(currentId);
        break;
      case 'f':
      case 'F': {
        e.preventDefault();
        const sid = getActiveSourceId();
        if (sid) {
          selectedSourceId = sid;
          setAsFavicon(sid, currentId);
          updateImages();
        } else {
          showToast('No visible source to set as favicon');
        }
        break;
      }
    }
  });

  // Image error handler
  grid?.addEventListener('error', (e) => {
    const target = e.target as HTMLImageElement;
    if (target.classList.contains('sprite-img')) {
      target.classList.add('error');
      target.parentElement?.classList.add('show-placeholder');
    }
  }, true);

  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Initial load
  const initialId = (window as any).__INITIAL_POKEMON_ID__ || 1;
  currentId = initialId;
  if (idInput) idInput.value = String(initialId);
  updateImages();
  updatePokemonInfo(currentId).then(() => {
    // Update favicon href using local trimmed favicons
    const info = pokeCache.get(currentId);
    if (info) {
      const name = info.names.en.toLowerCase().replace(/[^a-z0-9]/g, '');
      const faviconLink = document.getElementById('pokemon-favicon') as HTMLLinkElement | null;
      if (faviconLink) {
        faviconLink.href = `/sprites-gallery/favicons/${name}.png`;
      }
    }
  });
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  initGallery();
}
