import { WriteStream, createWriteStream } from 'node:fs';
import { dirname } from 'node:path'
import { open, FileHandle, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { ILogger } from '../../types';

const DEFAULT_PATH = './logs/log.txt'

export interface LoggerFactoryConfig {
  path: string
  clearFile?: boolean
}

export class FileLogger implements ILogger {
  constructor(handle: FileHandle, writeStream: WriteStream) {
    this.handle = handle
    this.writeStream = writeStream
  }

  public static async factory(config: LoggerFactoryConfig): Promise<FileLogger> {
    let handle: FileHandle, stream: WriteStream
    try {
      const path = config.path || DEFAULT_PATH;
      await this.ensureLoggingDirectoryExists(path)
      handle = await open(path, 'w')
      stream = await createWriteStream(path)
    } catch (err) {
      console.log('error creating logger')
      console.log(err)
    }
    
    return new FileLogger(handle, stream);
  }

  public clearLogFile = async () => this.handle.write('')

  public close = async () => this.handle.close()

  public log = (val: string) => this.writeStream.write(`${val}\n`)

  public static  async ensureLoggingDirectoryExists(path: string) {
    const dir = dirname(path)
    if (existsSync(dir)) {
      return true;
    }
    await mkdir(dir, { recursive: true});
  }

  private handle: FileHandle
  private writeStream: WriteStream
}
