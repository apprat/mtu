import { define } from '../../core.js'
import '../ripple/main.js'
import '../tooltip/main.js'

const template = `<style>:host{display:block;width:var(--menu-item-width,auto);height:var(--menu-item-height,48px);margin:var(--menu-item-margin,0);position:relative}.root{display:flex;height:100%;align-items:center;cursor:pointer;padding:var(--menu-item-padding,0 16px);overflow:hidden;border-radius:var(--menu-item-border-radius,0)}.tooltip{pointer-events:var(--menu-item-tooltip-pointer-events,none);width:100%;height:var(--menu-item-tooltip-height,auto);position:var(--menu-item-tooltip-position,static);left:0}.tooltip::part(root){position:var(--menu-item-tooltip-root-position,static);filter:var(--menu-item-tooltip-root-filter,opacity(1));transform:var(--menu-item-tooltip-root-transform,scale(1));background:var(--menu-item-tooltip-root-background,0);color:var(--menu-item-tooltip-root-color,inherit);padding:var(--menu-item-tooltip-root-padding,0);font-size:var(--menu-item-tooltip-root-font-size,inherit)}::slotted([slot=start]){margin:var(--menu-item-start-marign,0 16px 0 0);flex-shrink:0;display:var(--menu-item-start-display,block)}::slotted([slot=end]){margin:0 -8px 0 16px}</style><m-ripple class="root" part="root" title=""><slot name="start"></slot><m-tooltip class="tooltip"><slot name="title" slot="text"></slot></m-tooltip><slot name="end"></slot></m-ripple>`

const setup = (shadow, node) => {
  const root = shadow.querySelector('.root')
  root.addEventListener('click', () => {
    node.dispatchEvent(new Event('menu-close', { bubbles: true }))
  })
}

define('menu-item', { template, setup })