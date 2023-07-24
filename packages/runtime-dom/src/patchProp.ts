import { isOn } from '@vue/shared'
import { patchClass } from './modules/class'

/**
 * 为 prop 进行打补丁操作
 * @param el
 * @param key
 * @param prevValue
 * @param nextValue
 */
export const patchProp = (el, key, prevValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
  } else if (isOn(key)) {
  } else {
  }
}
