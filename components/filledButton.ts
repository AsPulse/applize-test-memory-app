import type { ElementGenerator } from "@aspulse/applize";
import { buttonBase } from "../style/button/base";

export function filledButton(v: ElementGenerator, text: string, background: string, foreground: string) {
  const style = v().styleDefine({
    '&': [
      ...buttonBase(),
      `background-color: ${background}`,
      `color: ${foreground}`,
      'border-radius: 3px',
      'transition: all .2s ease-out',
      'box-shadow: rgb(0 0 0 / 20%) 0px 2px 2px 1px'
    ],
    '&:active': [
      'transform: translateY(1px)',
      'box-shadow: none'
    ],
    '&:hover': [
      'transform: translateY(-2px)',
      'box-shadow: rgb(0 0 0 / 30%) 0px 3px 4px 0px'
    ]
  });
  return v('button').text(text).classAdd(style);
}
