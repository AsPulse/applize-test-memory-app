import type { ElementGenerator } from "@aspulse/applize";
import { interactPadding } from "../style/consts/padding";

export function selectInput(v: ElementGenerator) {
  const style = v().styleDefine({
    '&': [
      'outline: none',
      `padding: ${interactPadding}`,
    ]
  });
  return v('select').classAdd(style);
}
