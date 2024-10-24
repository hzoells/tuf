export const hideCursor = () => {
  console.log('\x1b[?25l')
}

export const moveCursor = (x: number, y: number) => {
  console.log(`\x1b[${x};${y}H`)
}
