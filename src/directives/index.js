// 自定义指令
export const imagerror = {
  inserted: (dom, options) => {
    dom.onerror = () => {
      dom.src = options.value
    }
  }
}
