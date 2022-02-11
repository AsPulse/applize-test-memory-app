import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

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
                v('button').text('次の問題へ').on('click', () => newQuestion());
                v('button').text('単語一覧へ戻る').on('click', () => { location.href = '/words'});
            });
        }

        async function answer(answer: string) {
            if ( solving === null ) return;
            wrapper.empty();
            wrapper.in(v => {
                v('p').text(`単語: ${solving.en}`);
                v('p').text(`訳: ${solving.ja}`);
                v('p').text(`あなたの訳: ${answer}`);
                v('button').text('正解').on('click', () => judge(true));
                v('button').text('不正解').on('click', () => judge(false));
            });
        }
        async function newQuestion() {
            if ( solving !== null ) return;
            solving = await adb.api('randompick', {});
            wrapper.empty();
            wrapper.in(v => {
                v('p').text(`訳してください: ${solving.en}`);
                const input = v('input');
                v('button').text('確定！').on('click', () => answer(input.element.value));
            });
        }

        newQuestion();
    })();
});
