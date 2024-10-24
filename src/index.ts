import { Transform, pipeline } from 'stream'
import { stdin } from 'node:process'
import { Component, ComponentAlignChildren } from './component'
import {right, left} from './either'
import { FileLogger } from 'fileLogger'

const SIGINT = 3

let logger: FileLogger

const handleExit = new Transform({
  transform: (data, encoding, callback) => {
    if (data.toString().charCodeAt(0) === SIGINT) {
      callback(null)
      stdin.destroy()
      logger.close()
      console.log('\x1b[0;0H')
      console.log('\x1b[?25h')

      return
    }
    callback(null, data)
  }
})

const main = async () => {
  stdin.setRawMode(true)
  logger = await FileLogger.factory({ path: './logs/log.txt' })
  await logger.clearLogFile()

  console.log('\x1b[3J')
  console.log('\x1b[1J')

  console.log('\x1b[0;0H')
  const vComponent = new Component([right('some'), right('more')], ComponentAlignChildren.Vertical, logger)
  const hComponent = new Component([right('one'), right('two'), right('three'), left(vComponent)], ComponentAlignChildren.Horizontal, logger)

  const content = hComponent.render(ComponentAlignChildren.Horizontal, 30, 30)
  content.map(line => console.log(line))
  console.log('\x1b[?25l')

  logger.log(`${content.length}`)
  logger.log(`${content[0].length}`)
  await pipeline(stdin, handleExit, (err) => {})
}

main()

