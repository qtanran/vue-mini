import { ShapeFlags } from '@vue/shared'
import { Comment, Fragment } from './vnode'

/**
 * 渲染器配置对象
 */
export interface RendererOptions {
  // 为指定 element 的 prop 打补丁
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  // 为指定的 Element 设置 text
  setElementText(node: Element, text: string): void
  // 插入指定的 el 到 parent 中，anchor 表示插入的位置
  insert(el, parent: Element, anchor?): void
  // 创建指定的 element
  createElement(type: string)
}

/**
 * 生成 renderer 渲染器
 * @param options 兼容性操作配置对象
 */
export function createRenderer(options: RendererOptions): any {
  const {
    insert: hostInsert,
    patchProp: hostPatchProp,
    createElement: hostCreatElement,
    setElementText: hostSetElementText
  } = options

  /**
   * element 的打补丁操作
   * @param oldVNode
   * @param newVNode
   * @param container
   * @param anchor
   */
  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      mountElement(newVNode, container, anchor)
    } else {
    }
  }

  /**
   * element 的挂载操作
   * @param vnode
   * @param container
   * @param anchor
   */
  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode

    // 创建 element
    const el = (vnode.el = hostCreatElement(type))

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 设置 文本子节点
      hostSetElementText(el, vnode.children as string)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    }

    // 处理 props
    if (props) {
      // 遍历 props 对象
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    // 插入 el 到指定的位置
    hostInsert(el, container, anchor)
  }

  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) return

    const { type, shapeFlag } = newVNode
    switch (type) {
      case Text:
        break
      case Comment:
        break
      case Fragment:
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
        }
    }
  }

  /**
   * 渲染函数
   * @param vnode
   * @param container
   */
  const render = (vnode, container) => {
    if (vnode == null) {
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }

  return {
    render
  }
}
