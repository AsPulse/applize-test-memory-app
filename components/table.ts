import type { ElementGenerator } from "@aspulse/applize";

export function tableHorizontal(v: ElementGenerator) {
  const borderColor = `rgb(0 0 0 / 20%)`;
  const style = v().styleDefine({
    '&': [
      'border-collapse: collapse',
      'border-radius: 6px',
      'overflow: hidden',
      `box-shadow: 0 1px 3px 0 ${borderColor}`
    ],
    '& td': [
      'padding: .5em 1em',
      `border-top: 1px solid ${borderColor}`,
      `border-bottom: 1px solid ${borderColor}`,
    ],
    '& tr:nth-child(even) td': [
      'background-color: rgb(250, 250, 250)'
    ],
    '& tr:first-child td': [
      'background-color: rgb(40, 40, 40)',
      'color: white'
    ]
  })
  return v('table').classAdd(style);
}
