const ASSETS = {
  farmer: ['42ced.png', '농부 마스코트'],
  merchant: ['251be.png', '자영업자 마스코트'],
  welcome: ['b8d62.png', '농부와 자영업자가 함께하는 과일잇다'],
}

export default function Character({ type = 'farmer', className = '', decorative = true }) {
  const [file, description] = ASSETS[type]
  return <img className={`character character-${type} ${className}`} src={`/assets/figma/${file}`} alt={decorative ? '' : description} aria-hidden={decorative || undefined} />
}
