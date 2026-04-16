export interface SpriteSource {
  id: string;
  name: string;
  url: (id: number) => string;
  format: 'PNG' | 'SVG';
  size: string;
  style: string;
  generation?: string;
  maxId?: number;
}

export const SPRITE_SOURCES: SpriteSource[] = [
  // 现代风格
  {
    id: 'default',
    name: 'PokeAPI 默认 (XY)',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    format: 'PNG',
    size: '96×96',
    style: '现代像素',
    generation: 'Gen VI+',
  },
  {
    id: 'shiny',
    name: '闪光配色',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`,
    format: 'PNG',
    size: '96×96',
    style: '现代像素-闪光',
    generation: 'Gen VI+',
  },
  // 复古世代
  {
    id: 'gen1-rb',
    name: 'Gen I 红/蓝',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${id}.png`,
    format: 'PNG',
    size: '56×56',
    style: '8-bit GameBoy',
    generation: 'Gen I',
    maxId: 151,
  },
  {
    id: 'gen1-yellow',
    name: 'Gen I 皮卡丘版',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/${id}.png`,
    format: 'PNG',
    size: '56×56',
    style: '8-bit 彩色',
    generation: 'Gen I',
    maxId: 151,
  },
  {
    id: 'gen2-gold',
    name: 'Gen II 金',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/${id}.png`,
    format: 'PNG',
    size: '56×56',
    style: '16-bit 像素',
    generation: 'Gen II',
    maxId: 251,
  },
  {
    id: 'gen2-silver',
    name: 'Gen II 银',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/${id}.png`,
    format: 'PNG',
    size: '56×56',
    style: '16-bit 像素(银)',
    generation: 'Gen II',
    maxId: 251,
  },
  // Pokemon Showdown（像素风，与 XY 风格一致）
  {
    id: 'showdown',
    name: 'Pokemon Showdown',
    url: (id: number) =>
      `https://play.pokemonshowdown.com/sprites/gen5/${id}.png`,
    format: 'PNG',
    size: '96×96',
    style: '现代像素',
    generation: 'Gen V+',
    maxId: 649,
  },
    // 高清/艺术风格
  {
    id: 'home',
    name: 'HOME 高清渲染',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
    format: 'PNG',
    size: '高清(512×512)',
    style: '3D 官绘',
    generation: 'All',
  },
  {
    id: 'dream-world',
    name: 'Dream World SVG',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
    format: 'SVG',
    size: '矢量',
    style: '剪影艺术',
    generation: 'Gen V',
    maxId: 649,
  },
  {
    id: 'official-artwork',
    name: '官方立绘',
    url: (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    format: 'PNG',
    size: '高清',
    style: '官方插画',
    generation: 'All',
  },
];

export function isValidForSource(id: number, source: SpriteSource): boolean {
  if (id < 1 || id > 1025) return false;
  if (source.maxId && id > source.maxId) return false;
  return true;
}

export function getSpriteUrl(sourceId: string, id: number): string {
  const source = SPRITE_SOURCES.find((s) => s.id === sourceId);
  if (!source) return SPRITE_SOURCES[0].url(id);
  return source.url(id);
}
