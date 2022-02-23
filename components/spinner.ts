import type { ElementGenerator } from "@aspulse/applize";

export function spinner(v: ElementGenerator, sizePx: number, border: number) {
  const style = v().styleDefine({
    '&' : [
      `height: ${sizePx - border*2}px`,
      `width: ${sizePx - border*2}px`,
      'color: rgba(90, 90, 90, 0.2)',
      'position: relative',
      'display: inline-block',
      `border: ${border}px solid`,
      'border-radius: 50%',
      'border-right-color: #5a5a5a',
      'animation: rotate-spinner-1 1s linear infinite'
    ],
    '@keyframes rotate-spinner-1': [
      '0% {transform: rotate(0); }100%{ transform: rotate(360deg); }'
    ]
  });
  return v('div').classAdd(style);
}
