import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

export const words = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('単語一覧');
    adb.build('div').in(v => {
        v('button').text('単語を追加').on('click', () => adb.pageMove('/words/add'));
        v('button').text('テストする').on('click', () => adb.pageMove('/test' ));
    });
    adb.build('div').in(v => {
      const select = v('select').in(v => {
        v('option').text('登録日（昇順）').element.value = 'createdAt/1';
        v('option').text('登録日（降順）').element.value = 'createdAt/-1';
        v('option').text('記憶度（昇順）').element.value = 'memoryLevel/1';
        v('option').text('記憶度（降順）').element.value = 'memoryLevel/-1';
      });
      select.on('change', () => {
        sort = select.element.value.split('/')[0] === 'createdAt' ? 'createdAt' : 'memoryLevel';
        sortLevel = select.element.value.split('/')[1] === '1' ? 1 : -1;
        void refresh();
      });
      const back = v('button').text('<<').on('click', () => {
        if(pageNumber > 1) { pageNumber--; void refresh(); }
      });
      const next = v('button').text('>>').on('click', async () => {
        if(pageNumber < (await adb.api('wordsCount', {})).count / pagePerWord) { pageNumber++; void refresh(); }
      });
  });
    const words = adb.build('p');
    const table = adb.build('table')

    let pageNumber = 1;
    let sort: 'createdAt' | 'memoryLevel' = 'createdAt';
    let sortLevel: 1 | -1;

    const pagePerWord = 20;
    async function refresh() {
      table.empty();
      table.in(v => {
        v('p').text('データ取得中...');
      });
      const data = await adb.api('getWordsPage', { skip: (pageNumber - 1) * pagePerWord, count: pagePerWord, sort, sortLevel });
      words.text(`${(pageNumber - 1) * pagePerWord + 1} - ${pageNumber * pagePerWord} / ${(await adb.api('wordsCount', {})).count}`);
      table.empty();
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
    }
    void refresh();
    adb.finish({ title: '単語の一覧' });
});
