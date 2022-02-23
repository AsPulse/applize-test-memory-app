import type { ElementGenerator } from "@aspulse/applize";
import { buttonBase } from "../style/button/base";
import { outlinedButton } from "./outlinedButton";
import { spinner } from "./spinner";

export function loadingButton(v: ElementGenerator, text: string, background: string, foreground: string, onClick: () => Promise<void>) {

  const inline = v().styleDefine({
    '&': [ 'display: inline-block', 'vertical-align: middle' ]
  })
  const hidden = v().styleDefine({
    '&': [ 'display: none' ]
  });
  const flexCenter = v().styleDefine({
    '&': [
      'display: flex',
      'align-items: center',
      'justify-content: center',
    ]
  });
  const button = v('div').classAdd(inline).in(v => {
    const buttonInstance = outlinedButton(v, text, background, foreground).on('click', () => {
      void (async () => {
        const height = buttonInstance.element.offsetHeight;
        const width = buttonInstance.element.offsetWidth;
        buttonInstance.classAdd(hidden);
        const spinnerI =
          v('div').classAdd(flexCenter).in(v => {
            spinner(v, Math.min(width, height) * 0.8, 3)
          });
        spinnerI.element.style.width = `${width}px`;
        spinnerI.element.style.height = `${height}px`;
        await onClick();
        spinnerI.element.remove();
        buttonInstance.classRemove(hidden);
      })();
    });
    return { button: buttonInstance }
  });
  return button.expose.button;
}
