import { Transform, pipeline } from 'stream'
import { stdin } from 'node:process'
import {Component, ComponentAlignChildren} from 'libs/component'
import {right, left} from 'libs/monads'
import {clearScreen, hideCursor, moveCursor} from 'libs/terminal'
import { FileLogger } from 'libs/logging'

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

  clearScreen()
  moveCursor(0,0)

  const vComponent = new Component([right('some'), right('more')], ComponentAlignChildren.Vertical, logger)
  const hComponent = new Component([right('one'), right('two'), right('three'), left(vComponent)], ComponentAlignChildren.Horizontal, logger)

  const content = hComponent.render(ComponentAlignChildren.Horizontal, 30, 30)
  content.map(line => console.log(line))
  hideCursor()
  await pipeline(stdin, handleExit, (err) => {})
}

main()

