import { SPRITE_SOURCES } from '../data/sprite-sources';
export async function readSite(){
 return {title:"Pokémon Sprite Gallery",description:"跨来源 Pokémon 素材比较与浏览器 favicon 体验。",source:'https://github.com/wangrui2025/sprites-gallery',home:'https://wangrui2025.github.io/sprites-gallery/',limitations:['独立素材展示，不代表 Pokémon 官方。','外部素材可能缺失，来源支持范围以实际数据与上游许可为准。','本索引不读取浏览器中的个人选择。'],sections:[{title:'图库',url:'https://wangrui2025.github.io/sprites-gallery/',description:"浏览同一 Pokémon 的不同来源；支持图标选择、世代过滤与语言切换。",items:SPRITE_SOURCES.map(s=>({title:s.name,url:s.url(1),description:[s.generation,s.format,s.size,'示例素材 URL（ID 1），并非完整可用性证明'].filter(Boolean).join(' · ')}))}]};
}
