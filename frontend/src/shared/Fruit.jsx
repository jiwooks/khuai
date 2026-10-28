import { SPRITE } from './sprite.js'

// 과일 일러스트 SVG 스프라이트. 앱 최상단에 한 번만 렌더링합니다.
export function SpriteDefs() {
  return <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: SPRITE }} />
}

// id: apple, uapple, pear, shine, persim, tang, utang, kiwi, fig, yuzu, leaf, basket
export function FruitIcon({ id, className = 'fx' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <use href={`#fr-${id}`} />
    </svg>
  )
}

export function FruitTile({ fruit, size = 48, pad = 6, radius = 14, round = false, style }) {
  return (
    <span className="fr-bg" style={{ background: fruit.tint, width: size, height: size, padding: pad, borderRadius: round ? '50%' : radius, flex: 'none', ...style }}>
      <FruitIcon id={fruit.id ?? fruit.fruit_id} />
    </span>
  )
}
