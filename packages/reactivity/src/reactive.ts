import { mutableHandlers } from './baseHandlers'
import { isObject } from '@vue/shared'

/**
 * 响应性 Map 缓存对象
 * key: target
 * val: proxy
 */
export const reactiveMap = new WeakMap<object, any>()

/**
 * 为复杂数据类型，创建响应性对象
 * @param target
 * @return 代理对象
 */
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

/**
 * 创建响应性对象
 * @param target 被代理对象
 * @param baseHandlers
 * @param proxyMap
 */
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  // 如果该实例已经被代理，直接读取即可
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 未被代理则生成 proxy 实例
  const proxy = new Proxy(target, baseHandlers)
  // 为 Reactive 增加标识
  proxy[ReactiveFlags.IS_REACTIVE] = true
  // 缓存代理对象
  proxyMap.set(target, proxy)
  return proxy
}

/**
 * 将指定数据变为 reactive 数据
 * @param value
 */
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value as object) : value

/**
 * 判断一个数据是否为 Reactive
 * @param value
 */
export const isReactive = (value): boolean => value?.[ReactiveFlags.IS_REACTIVE]
