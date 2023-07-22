import { isArray, isFunction, isString, ShapeFlags } from '@vue/shared'

export interface VNode {
  __v_isVNode: true
  type: any
  props: any
  children: any
  shapeFlag: number
}

export const isVNode = (value: any): value is VNode => value?.__v_isVNode

/**
 * 生成一个 VNode 对象，并返回
 * @param type vnode.type
 * @param props 标签属性或自定义属性
 * @param children 子节点
 */
export function createVNode(type, props, children): VNode {
  // 通过 bit 位处理 shapeFlag 类型
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  return createBaseVNode(type, props, children, shapeFlag)
}

/**
 * 构建基础 vnode
 */
function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    shapeFlag
  } as VNode

  normalizeChildren(vnode, children)

  return vnode
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  if (children == null) {
    children = null
  } else if (isArray(children)) {
  } else if (typeof children === 'object') {
  } else if (isFunction(children)) {
  } else {
    // children 为 string
    children = String(children)
    // 为 type 指定 Flags
    type = ShapeFlags.TEXT_CHILDREN
  }
  // 修改 vnode 的 children
  vnode.children = children
  // 按位或赋值
  vnode.shapeFlag |= type
}
