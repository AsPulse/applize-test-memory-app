import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

export const words = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('単語一覧');
    adb.build('div').in(v => {
        v('button').text('単語を追加').on('click', () => { location.href = '/words/add' });
        v('button').text('テストする').on('click', () => { location.href = '/test' });
    });
    const table = adb.build('table')
    void (async () => {
        const data = await adb.api('getWords', { count: 0 });
        table.in(v => {
            v('tr').in(v => {
                v('td').text('英語')
                v('td').text('日本語')
                v('td').text('記憶度')
            });
            data.words.forEach(word => {
                v('tr').in(v => {
                    v('td').text(word.en)
                    v('td').text(word.ja)
                    v('td').text(`${word.memoryLevel}`)
                });
            });
        });
    })();
});
