import test from '@lib/fixture'

test.describe('Collect prices', async () => {

  test('Collect prices', { tag: ['@smoke'] }, 
    async ({ home }) => {
      await home.open()
    })
})