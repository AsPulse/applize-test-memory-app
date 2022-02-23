import type { ElementGenerator } from "@aspulse/applize";
import { interactPadding } from "../style/consts/padding";

export function textInput(v: ElementGenerator) {
  const style = v().styleDefine({
    '&': [
      'outline: none',
      `padding: ${interactPadding}`,
    ]
  });
  return v('input').classAdd(style);
}
