import { define } from '../../core.js'
import { transitionEnd, clickAway } from '../../util.js'
import '../ripple/main.js'

const template = `<style>::slotted(:nth-child(1)){background:var(--color-border);pointer-events:none;color:rgba(var(--color-accent));--color-icon:rgba(var(--color-accent))}</style><style>:host{display:inline-block;vertical-align:middle;user-select:none;height:40px;border-bottom:solid 1px var(--color-border);box-sizing:border-box;max-width:260px}:host([disabled=true]){pointer-events:none;filter:grayscale(1);opacity:.6}.root{position:relative;height:100%}.active{cursor:pointer;border-radius:2px;height:100%;overflow:hidden;display:flex;justify-content:space-between;align-items:center}.text{padding-left:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1}.icon>svg{fill:var(--color-icon);width:24px;height:24px;transform:rotate(90deg);margin:0 5px}.body{box-sizing:border-box;position:absolute;overflow:auto;overflow:overlay;scrollbar-width:thin;top:0;max-width:260px;min-width:128px;max-height:336px;border-radius:2px;background:var(--color-background-card);box-shadow:0 5px 5px -3px rgb(0 0 0 / 20%),0 8px 10px 1px rgb(0 0 0 / 14%),0 3px 14px 2px rgb(0 0 0 / 12%);padding:8px 0;transform-origin:top left;filter:opacity(0);transform:scale(.9);pointer-events:none;transition:filter .2s,transform .2s;z-index:2}.show>.body{filter:opacity(1);transform:scale(1);pointer-events:auto}slot{display:flex;flex-direction:column}@media(pointer:fine){.body::-webkit-scrollbar{width:6px;height:6px}.body::-webkit-scrollbar-thumb{background:0 0;border-radius:4px}.body:hover::-webkit-scrollbar-thumb{background:#dbdbdb}}</style><div class="root"><m-ripple class="active" part="active"><div class="text"></div><div class="icon" part="icon"><svg><path d="M10 7l5 5-5 5z"></path></svg></div></m-ripple><div class="body" part="body"><slot></slot></div></div>`

const props = ['select']
const setup = (shadow, node) => {
  const style = shadow.querySelector('style')
  const styleText = style.textContent
  const root = shadow.querySelector('.root')
  const active = shadow.querySelector('.active')
  const text = shadow.querySelector('.text')
  const body = shadow.querySelector('.body')
  const slot = shadow.querySelector('slot')
  let mask
  const close = () => {
    transitionEnd(body, () => body.removeAttribute('style'))
    root.classList.remove('show')
    mask()
  }
  active.addEventListener('click', () => {
    const rect = body.getBoundingClientRect()
    const offset = { top: '0', left: '0', bottom: 'auto', right: 'auto', transformOrigin: ['top', 'left'] }
    if (rect.top + body.offsetHeight > window.innerHeight) {
      offset.top = 'auto'
      offset.bottom = '0'
      offset.transformOrigin[0] = 'bottom'
    }
    if (rect.left + body.offsetWidth > window.innerWidth) {
      offset.left = 'auto'
      offset.right = '0'
      offset.transformOrigin[1] = 'right'
    }
    body.setAttribute('style', `transform-origin:${offset.transformOrigin.join(' ')};top:${offset.top};left:${offset.left};bottom:${offset.bottom};right:${offset.right}`)
    root.classList.add('show')
    mask = clickAway(node, close)
  })
  body.addEventListener('click', e => {
    const path = []
    for (const item of e.composedPath()) item.tagName && path.push(item.tagName)
    if (!path.includes('M-SPINNER-ITEM')) return
    node.select = [].slice.call(node.children).indexOf(e.target)
    node.dispatchEvent(new Event('change'))
    close()
  })
  const update = () => {
    const son = node.children[node.select]
    son && (text.innerText = son.innerText.trim())
  }
  new MutationObserver(update).observe(node, { childLists: true, subtree: true, characterDataOldValue: true })
  slot.addEventListener('slotchange', update)
  return {
    onConnected: update,
    disabled: false,
    select: {
      get: 0,
      set: v => {
        style.textContent = styleText.replace(new RegExp(':nth-child\\(1\\)', 'g'), `:nth-child(${v + 1})`)
        update()
      }
    }
  }
}

define('spinner', { template, props, setup })