import { isArray, isObject, isString } from './index'

/**
 * 规范 class 类，处理 class 的增强
 * @param value
 */
export function normalizeClass(value: unknown): string {
  let res = ''
  // 判断是否为 string，如果是 string 就不需要专门处理
  if (isString(value)) {
    res = value
  }
  // 额外的数组增强
  else if (isArray(value)) {
    // 循环得到数组中的每个元素，通过 normalizeClass 方法进行迭代处理
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i])
      if (normalized) {
        res += normalized + ' '
      }
    }
  }
  // 额外的对象增强
  else if (isObject(value)) {
    // name 为类名，value 为 boolean 值
    for (const name in value as object) {
      if ((value as object)[name]) {
        res += name + ' '
      }
    }
  }
  // 去左右空格
  return res.trim()
}
