import { ILogger } from 'libs/logging';
import { Either } from 'libs/monads'

export class Component {
  constructor(children: Either<Component, string>[], alignChildren: ComponentAlignChildren, logger: ILogger) {
    this.children = children;
    this.alignment = alignChildren || ComponentAlignChildren.Vertical
    this.logger = logger
  }

  private children: Either<Component, string>[]
  private alignment: ComponentAlignChildren
  private logger: ILogger

  getDimensions(maxHeight?: number, maxWidth?: number): {height: number, width: number} {
    let width = 0, height = 0;

    for (let i = 0; i < this.children.length; i++) {
      let childWidth = 0, childHeight = 0
      const child = this.children[i]
      if (child.isLeft()) {
        const childDimensions = child.left.getDimensions()
        childHeight = childDimensions.height
        childWidth = childDimensions.width
      } else {
        childHeight = 1
        childWidth = child.right.length
      }

      if (this.alignment == ComponentAlignChildren.Vertical) {
        height += childHeight
        width = Math.max(childWidth, width)
      } else {
        height = Math.max(childHeight, height)
        width += childWidth
      }
    }

    return {width, height}
  }

  rendero(parentAlignment: ComponentAlignChildren, maxWidth?: number, maxHeight?: number): string[] {
    const {width: fullWidth, height: fullHeight} = this.getDimensions(maxWidth, maxHeight);

    if (parentAlignment === ComponentAlignChildren.Horizontal) {
      if (this.alignment === ComponentAlignChildren.Vertical) {
        const content: string[] = []
        const width = Math.min(fullWidth, maxWidth)
        let remainingHeight = maxHeight

        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i]
          if (remainingHeight > 0) {
            if (child.isRight()) {
              const childContent = child.right.length > width ? child.right.slice(0, width) : child.right.concat(' '.repeat(width - child.right.length));
              content.push(childContent)
              remainingHeight--
            } else {
              const childContent = child.left.render(this.alignment, width, remainingHeight)

              content.push(...childContent.slice(0, remainingHeight))

              remainingHeight -= childContent.length
            }
          }
          
        }

        if (remainingHeight > 0) {
          const fullColumn = ' '.repeat(width)
          content.push(...Array(remainingHeight).fill(fullColumn))
        }

        return content
      } else {
        this.logger.log('h h')
        const height = maxHeight
        const content = Array(height).fill('')
        let remainingWidth = Math.min(maxWidth, fullWidth)

        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i]
          if (remainingWidth > 0) {
            if (child.isRight()) {
              const childWidth = Math.min(child.right.length, remainingWidth)
              content[0] = content[0].concat(child.right.slice(0, childWidth))
              const padString = ' '.repeat(childWidth)
              for (let j = 1; j < content.length; j++) {
                content[j] = content[j].concat(padString)
              }
              remainingWidth -= childWidth
            } else {
              const childContent = child.left.render(this.alignment, remainingWidth, height)
              for (let j = 0; j < content.length; j++) {
                content[j] = content[j].concat(childContent[j])
              }
              remainingWidth -= childContent[0].length
            }
          }
        }

        if (remainingWidth > 0) {
          const paddingString = ' '.repeat(remainingWidth)
          const paddedContent = content.map(row => row.concat(paddingString))
          return paddedContent
        }

        return content
      }
    } else {
      if (this.alignment === ComponentAlignChildren.Vertical) {
        const content: string[] = []
        const width = maxWidth
        let remainingHeight = Math.min(maxHeight, fullHeight)

        for (let i = 0; i < this.children.length; i++) {
          if (remainingHeight > 0) {
            const child = this.children[i]
            if (child.isRight()) {
              const childContent = child.right.length > width ? child.right.slice(0, width) : child.right.concat(' '.repeat(width - child.right.length));
              content.push(childContent)
              remainingHeight--
            } else {
              const childContent = child.left.render(this.alignment, width, remainingHeight)

              content.push(...childContent.slice(0, remainingHeight))

              remainingHeight -= childContent.length
            }
          }
        }

        if (remainingHeight > 0) {
          const fullColumn = ' '.repeat(width)
          content.push(...Array(remainingHeight).fill(fullColumn))
        }

        return content
      } else {
        const height = Math.min(maxHeight, fullHeight)
        const content = Array(height).fill('')
        let remainingWidth = Math.min(maxWidth, fullWidth)

        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i]
          if (remainingWidth > 0) {
            if (child.isRight()) {
              const childWidth = Math.min(child.right.length, remainingWidth)
              content[0] = content[0].concat(child.right.slice(0, childWidth))
              const padString = ' '.repeat(childWidth)
              for (let j = 1; j < content.length; j++) {
                content[j] = content[j].concat(padString)
              }
              remainingWidth -= childWidth
            } else {
              const childContent = child.left.render(this.alignment, remainingWidth, height)
              for (let j = 0; j < content.length; j++) {
                content[j] = content[j].concat(childContent[j])
              }
              remainingWidth -= childContent[0].length
            }
          }
        }

        if (remainingWidth > 0) {
          const paddingString = ' '.repeat(remainingWidth)
          const paddedContent = content.map(row => row.concat(paddingString))
          return paddedContent
        }

        return content
      }
    }
  }

  render(parentAlignment: ComponentAlignChildren, maxWidth?: number, maxHeight?: number): string[] {
    const {width: fullWidth, height: fullHeight} = this.getDimensions(maxWidth, maxHeight);

    if (this.alignment === ComponentAlignChildren.Vertical) {
      const content: string[] = []
        const width = parentAlignment === ComponentAlignChildren.Vertical ? maxWidth : Math.min(fullWidth, maxWidth)
        let remainingHeight = parentAlignment === ComponentAlignChildren.Vertical ? Math.min(maxHeight, fullHeight) : maxHeight

        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i]
          if (remainingHeight > 0) {
            if (child.isRight()) {
              const childContent = child.right.length > width ? child.right.slice(0, width) : child.right.concat(' '.repeat(width - child.right.length));
              content.push(childContent)
              remainingHeight--
            } else {
              const childContent = child.left.render(this.alignment, width, remainingHeight)

              content.push(...childContent.slice(0, remainingHeight))

              remainingHeight -= childContent.length
            }
          }
          
        }

        if (remainingHeight > 0) {
          const fullColumn = ' '.repeat(width)
          content.push(...Array(remainingHeight).fill(fullColumn))
        }

        return content
    } else {
      const height = parentAlignment === ComponentAlignChildren.Vertical ?  Math.min(maxHeight, fullHeight) : maxHeight
      const content = Array(height).fill('')
      let remainingWidth = parentAlignment === ComponentAlignChildren.Vertical ? maxWidth : Math.min(maxWidth, fullWidth)

      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        if (remainingWidth > 0) {
          if (child.isRight()) {
            const childWidth = Math.min(child.right.length, remainingWidth)
            content[0] = content[0].concat(child.right.slice(0, childWidth))
            const padString = ' '.repeat(childWidth)
            for (let j = 1; j < content.length; j++) {
              content[j] = content[j].concat(padString)
            }
            remainingWidth -= childWidth
          } else {
            const childContent = child.left.render(this.alignment, remainingWidth, height)
            for (let j = 0; j < content.length; j++) {
              content[j] = content[j].concat(childContent[j])
            }
            remainingWidth -= childContent[0].length
          }
        }
      }

      if (remainingWidth > 0) {
        const paddingString = ' '.repeat(remainingWidth)
        const paddedContent = content.map(row => row.concat(paddingString))
        return paddedContent
      }

      return content
    }
  }
}

export enum ComponentAlignChildren {
  Vertical,
  Horizontal,
}
