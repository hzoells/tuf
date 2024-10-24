export const clearScreen = () => {
  console.log('\x1b[1J');
  console.log('\x1b[3J'); // scroll back cleared
}
