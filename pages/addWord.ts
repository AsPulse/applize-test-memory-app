import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

export const addWord = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('単語の追加');
    [
        '新しい単語を追加します。',
        '「英語,日本語」のようにカンマ区切りで書いてください。'
    ].forEach(v => adb.build('p').text(v));
    const textarea = adb.build('textarea')
    const submit = adb.build('div').in(v => adb.build('button').text('追加')).expose;
    adb.build('button').text('単語一覧へ戻る').on('click', () => { location.href = '/words' })

    submit.on('click', async () => {
        const data = textarea.element.value
            .split('\n').map(v => v.split(','))
            .map(v => ({
                en: v[0], ja: v[1]
            }));
        await adb.api('addWords', { data });
        location.href = '/words';
    });
});
