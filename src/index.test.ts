import { returnArg } from 'index'

describe('Return Args', () => {
  test('returns arg', () => {
    const arg = 2
    expect(returnArg(arg)).toBe(arg)
  })
})