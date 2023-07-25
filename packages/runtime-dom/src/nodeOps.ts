const doc = document

export const nodeOps = {
  /**
   * 插入指定元素到指定位置
   * @param child
   * @param parent
   * @param anchor
   */
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },
  /**
   * 创建指定 Element
   * @param tag
   */
  createElement: (tag): Element => doc.createElement(tag),
  /**
   * 为指定的 Element 设置 textContent
   * @param el
   * @param text
   */
  setElementText: (el, text) => {
    el.textContent = text
  },

  /**
   * 删除指定元素
   */
  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  /**
   * 创建 Text 节点
   */
  createText: text => doc.createTextNode(text),

  /**
   * 设置 text
   */
  setText: (node, text) => {
    node.nodeValue = text
  }
}
