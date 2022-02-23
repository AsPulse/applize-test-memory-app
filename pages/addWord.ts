import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { filledButton } from "../components/filledButton";
import { outlinedButton } from "../components/outlinedButton";
import { APISchema } from "../src/apiSchema";
import { mainColor } from "../style/consts/color";
import { horizontalSpace } from "../style/horizontalSpace";

export const addWord = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('単語の追加');
    [
        '新しい単語を追加します。',
        '「英語,日本語」のようにカンマ区切りで書いてください。'
    ].forEach(v => adb.build('p').text(v));
    const textarea = adb.build('textarea')
    adb.build('div').in(v => {
      adb.build('div').classAdd(horizontalSpace(v, '.3em', '.5em')).in(v => {
        filledButton(v, '追加', mainColor, 'white').on('click', async () => {
          const data = textarea.element.value
              .split('\n').map(v => v.split(','))
              .map(v => ({
                  en: v[0], ja: v[1]
              }));
          await adb.api('addWords', { data });
          adb.pageMove('/words');
        });
        outlinedButton(v, '単語一覧へ戻る', 'rgb(0 0 0 / 20%)', 'black').on('click', () => adb.pageMove('/words'));
      });
    });



    adb.finish({ title: '単語の追加' });
});
