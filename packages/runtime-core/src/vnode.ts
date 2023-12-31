import { isArray, isFunction, isObject, isString, normalizeClass, ShapeFlags } from '@vue/shared'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export interface VNode {
  __v_isVNode: true
  key: any
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
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  if (props) {
    const { class: klass } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
  }

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
  if (children === null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
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

/**
 * 根据 key || type 判断是否为相同类型节点
 */
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key
}
