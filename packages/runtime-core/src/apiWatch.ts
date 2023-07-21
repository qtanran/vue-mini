import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { isReactive, ReactiveEffect } from '@vue/reactivity'
import { queuePreFlushCb } from './scheduler'

/**
 * watch 配置项属性
 */
export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
}

/**
 * 指定的 watch 函数
 * @param source 监听的响应性数据
 * @param cb 回调函数
 * @param options 配置对象
 */
export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source as any, cb, options)
}

function doWatch(source, cb: Function, { immediate, deep }: WatchOptions = EMPTY_OBJ) {
  // 触发 getter 的指定函数
  let getter: () => any

  // 判断 source 的数据类型
  if (isReactive(source)) {
    // 指定 getter
    getter = () => source
    // 深度
    deep = true
  } else {
    getter = () => {}
  }

  // 存在回调函数和 deep
  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  // 调度器
  let scheduler = () => queuePreFlushCb(job)
  const effect = new ReactiveEffect(getter, scheduler)

  // 旧值
  let oldValue = {}
  // job 执行方法
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

/**
 * 依次执行 getter，从而触发依赖收集
 * @param value
 */
export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }

  for (const key in value as object) {
    traverse((value as any)[key])
  }
  return value
}
