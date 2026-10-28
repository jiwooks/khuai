const PATHS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  market: 'M5 8h14l-1.3 10.5a2 2 0 0 1-2 1.5H8.3a2 2 0 0 1-2-1.5zM9 8V7a3 3 0 0 1 6 0v1',
  cart: 'M3 4h2.5l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.1L20 8H6.3M9.5 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01',
  orders: 'M7 3h10a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1zM9 8h6M9 12h6',
  ai: 'M5 19V11m5 8V6m5 13v-6m5 6V9',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  camera: 'M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.3-2h7l1.3 2h2.2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-14A1.5 1.5 0 0 1 3 17.5zM11.5 15.7a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z',
  calendar: 'M3.5 5.5h17v15h-17zM3.5 10h17M8.5 3.5v4M15.5 3.5v4',
}

export default function Icon({ name, width = 2, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d={PATHS[name]} />
    </svg>
  )
}
