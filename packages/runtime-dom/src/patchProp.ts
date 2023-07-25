import { isOn } from '@vue/shared'
import { patchClass } from './modules/class'
import { patchAttr } from './modules/attrs'
import { patchDOMProp } from './modules/props'
import { patchStyle } from './modules/style'

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
    // style
    patchStyle(el, prevValue, nextValue)
  } else if (isOn(key)) {
  } else if (shouldSetAsProp(el, key)) {
    // 通过 DOM Properties 指定
    patchDOMProp(el, key, nextValue)
  } else {
    // 其他属性
    patchAttr(el, key, nextValue)
  }
}

/**
 * 判断指定元素的指定属性是否可以通过 DOM Properties 指定
 * @param el
 * @param key
 */
function shouldSetAsProp(el: Element, key: string) {
  // 各种边缘情况处理
  if (key === 'spellcheck' || key === 'draggable' || key === 'translate') {
    return false
  }

  // 表单元素的表单属性是只读的，必须设置为属性 attribute
  if (key === 'form') {
    return false
  }

  // <input list> 必须设置为属性 attribute
  if (key === 'list' && el.tagName === 'INPUT') {
    return false
  }

  // <textarea type> 必须设置为属性 attribute
  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false
  }

  return key in el
}
