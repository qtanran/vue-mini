/**
 * effect 函数
 * @param fn 执行方法
 */
export function effect<T = any>(fn: () => T) {
  // 生成 ReactiveEffect 实例
  const _effect = new ReactiveEffect(fn)
  // 执行 run 函数
  _effect.run()
}

// 单例的，当前的 effect
export let activeEffect: ReactiveEffect | undefined

/**
 * 响应性触发依赖时的执行类
 */
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    // 为 activeEffect 赋值
    activeEffect = this
    // 执行 fn 函数
    return this.fn()
  }
}

type KeyToDepMap = Map<any, ReactiveEffect>

/**
 * 收集所有依赖的 WeakMap 实例：
 * key：响应性对象
 * value：Map 对象
 *    key：响应性对象的指定属性
 *    value：指定对象的指定属性的 执行函数
 */
const targetMap = new WeakMap<any, KeyToDepMap>()

/**
 * 用于收集依赖的方法
 * @param target WeakMap 的 Key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 */
export function track(target: object, key: unknown) {
  // 如果当前不存在执行函数，则直接 return
  if (!activeEffect) return
  // 尝试从 targetMap 中，根据 target 获取 map
  let depsMap = targetMap.get(target)
  // 如果获取到的 map 不存在，则生成新的 map 对象，并把该对象赋值给对应的 value
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 为指定 map，指定 key 设置回调函数
  depsMap.set(key, activeEffect)
  console.log(targetMap)
}

/**
 * 触发依赖的方法
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 * @param newValue 指定 key 的最新值
 */
export function trigger(target: object, key?: unknown, newValue?: unknown) {
  console.log('trigger 触发依赖')
}
