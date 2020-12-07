/**
 * @description test demo
 * @author zhang
 */

function sum(a, b) {
  return a + b
}

test('deom', () => {
  const res = sum(10, 20)
  expect(res).toBe(30)
})