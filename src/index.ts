import { Transform, pipeline } from 'stream'
import { stdin } from 'node:process'

const SIGINT = 3

const handleExit = new Transform({
  transform: (data, encoding, callback) => {
    if (data.toString().charCodeAt(0) === SIGINT) {
      callback(null)
      stdin.destroy()
      return
    }
    callback(null, data)
  }
})

const main = async () => {
  console.log('\x1Bc')
  stdin.setRawMode(true)

  await pipeline(stdin, handleExit, (err) => {})
}

main()

