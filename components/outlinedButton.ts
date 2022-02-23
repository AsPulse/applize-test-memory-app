import type { ElementGenerator } from "@aspulse/applize";
import { buttonBase } from "../style/button/base";

export function outlinedButton(v: ElementGenerator, text: string, background: string, foreground: string) {
  const style = v().styleDefine({
    '&': [
      ...buttonBase(),
      `border: 1px solid ${background}`,
      `background: transparent`,
      `color: ${foreground}`,
      'border-radius: 3px',
      'transition: all .2s ease-out',
    ]
  });
  return v('button').text(text).classAdd(style);
}
