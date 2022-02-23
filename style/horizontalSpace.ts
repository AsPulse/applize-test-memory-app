import type { ElementGenerator } from "@aspulse/applize";

export function horizontalSpace(v: ElementGenerator,h: string, vt:string) {
  return v().styleDefine({
    '& > *': [ `margin-right: ${h}` ],
    '&': [ `margin-bottom: ${vt}` ]
  });
}
