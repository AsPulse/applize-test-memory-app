import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { filledButton } from "../components/filledButton";
import { outlinedButton } from "../components/outlinedButton";
import { textInput } from "../components/textInput";
import { APISchema } from "../src/apiSchema";
import { mainColor } from "../style/consts/color";
import { horizontalSpace } from "../style/horizontalSpace";

export const test = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('テストします');
    let wrapper = adb.build('div');
    void (async () => {
        let solving: null | { en: string, ja: string, id: string } = null;

        async function judge(correctly: boolean) {
            if ( solving === null ) return;
            await adb.api(correctly ? 'increaseMemoryLevel' : 'decreaseMemoryLevel', { id: solving.id });
            wrapper.empty();
            wrapper.in(v => {
                v('p').text(`単語 ${solving.en} の理解度が1${correctly ? '上がり' : '下がり'}ました。`);
                solving = null;
                v('div').classAdd(horizontalSpace(v, '0.3em', '0.5em')).in(v => {
                  filledButton(v, '次の問題へ', mainColor, 'white').on('click', () => newQuestion());
                  outlinedButton(v, '単語一覧へ戻る', 'rgb(0 0 0 / 20%)', 'black').on('click', () => adb.pageMove('/words'));
                });
            });
        }

        async function answer(answer: string) {
            if ( solving === null ) return;
            wrapper.empty();
            wrapper.in(v => {
                v('p').text(`単語: ${solving.en}`);
                v('p').text(`訳: ${solving.ja}`);
                v('p').text(`あなたの訳: ${answer}`);
                v('div').classAdd(horizontalSpace(v, '0.3em', '0.5em')).in(v => {
                  filledButton(v, '正解！', mainColor, 'white').on('click', () => judge(true));
                  filledButton(v, '不正解！', mainColor, 'white').on('click', () => judge(false));
                });
            });
        }
        async function newQuestion() {
            if ( solving !== null ) return;
            solving = await adb.api('randompick', {});
            wrapper.empty();
            wrapper.in(v => {
                v('p').text(`訳してください: ${solving.en}`);
                v('div').classAdd(horizontalSpace(v, '0.3em', '0.5em')).in(v => {
                  const input = textInput(v);
                  filledButton(v, '確定！', mainColor, 'white').on('click', () => answer(input.element.value));
                });
            });
        }

        newQuestion();
    })();
    adb.finish({ title: 'テスト' });
});
