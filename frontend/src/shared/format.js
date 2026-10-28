export const won = (n) => Math.round(n).toLocaleString('ko-KR')
export const short = (name) => name.replace('못난이 ', '')
export const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export function timeLabel(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const n = new Date()
  const diff = Math.round((new Date(d.toDateString()) - new Date(n.toDateString())) / 864e5)
  const day = diff === 0 ? '오늘' : diff === -1 ? '어제' : diff === 1 ? '내일' : `${d.getMonth() + 1}/${d.getDate()}`
  return `${day} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
