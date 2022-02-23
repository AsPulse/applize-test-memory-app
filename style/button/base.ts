import { interactPadding } from "../consts/padding";

export function buttonBase() {
  return [
    `padding: ${interactPadding}`,
    'cursor: pointer',
    'border: none'
  ];
}
