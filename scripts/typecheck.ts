// temporary workaround until https://github.com/vuejs/language-tools/issues/4249 is solved
// otherwise, we will receive issues from node_modules/@shopware-pwa

import Bun from 'bun'

async function run(cmd: string[], pwd: string): Promise<boolean> {
  type stringString = string[][]

  const proc = Bun.spawn(cmd, {
    cwd: pwd,
  })
  const text = await new Response(proc.stdout).text()

  let chunks: stringString = []
  let chunkIndex = -1

  for (const line of text.split('\n')) {
    if (line.includes('error TS')) {
      chunkIndex++
    }

    chunks[chunkIndex] ??= []
    chunks[chunkIndex]?.push(line)
  }

  chunks = chunks.filter(chunk => !chunk[0]?.includes('@nuxt/ui'))
  chunks.forEach((chunk) => {
    chunk.forEach((line, index) => {
      if (index === 0) {
        console.log(`\x1B[31m${line}\x1B[0m`)
        return
      }
      console.log(line)
    })
    console.log('')
  })

  return chunks.length === 0
}

const success1 = await run(['bun', 'run', 'vue-tsc', '--noEmit'], '')
const success2 = await run(['bun', 'run', 'vue-tsc', '--noEmit'], './playground/')

process.exit(success1 && success2 ? 0 : 1)
