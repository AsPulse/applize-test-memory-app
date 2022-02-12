import { Applize, PageRoute } from "@aspulse/applize";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { addWord } from "../pages/addWord";
import { index } from "../pages/index";
import { test } from "../pages/test";
import { words } from "../pages/words";
import { APISchema, IWord } from "./apiSchema";

const applize = new Applize<APISchema>();
let database: MongoClient;

applize.addPageRoute(PageRoute.fromPage(index)?.urlRoute('/')?.code(200));
applize.addPageRoute(PageRoute.fromPage(addWord)?.urlRoute('/words/add')?.code(200));
applize.addPageRoute(PageRoute.fromPage(words)?.urlRoute('/words')?.code(200));
applize.addPageRoute(PageRoute.fromPage(test)?.urlRoute('/test')?.code(200));

applize.implementsAPI('addWords', async input => {
    await database.db('memory').collection('words').insertMany(
        input.data.map(v => ({
            en: v.en, ja: v.ja,
            memoryLevel: 0, createdAt: new Date().getTime()
        }))
    );
    return {};
});

applize.implementsAPI('getWords', async input => {
    const got = await database.db('memory').collection<IWord>('words')
    .find({}).sort({ createdAt: -1 }).map(v => ({
        en: v.en,
        ja: v.ja,
        memoryLevel: v.memoryLevel,
        createdAt: v.createdAt
    })).toArray();
    return { words: got };
});


applize.implementsAPI('getWordsPage', async input => {
  const got = await database.db('memory').collection<IWord>('words')
  .find({}, { sort: input.sort === 'createdAt' ? { createdAt: input.sortLevel } : { memoryLevel: input.sortLevel }, skip: input.skip, limit: input.count }).map(v => ({
      en: v.en,
      ja: v.ja,
      memoryLevel: v.memoryLevel,
      createdAt: v.createdAt
  })).toArray();
  return { words: got };
});

applize.implementsAPI('wordsCount', async () => {
  return {  count: await database.db('memory').collection<IWord>('words').countDocuments() };
});

applize.implementsAPI('randompick', async input => {
    const count = await database.db('memory').collection('words').countDocuments();
    const rand = Math.floor(Math.random() * count);
    const target = await database.db('memory').collection<IWord>('words').find({}).limit(-1).skip(rand).next();
    return { id: target._id.toHexString(), en: target.en, ja: target.ja }
});

applize.implementsAPI('increaseMemoryLevel', async input => {
    await database.db('memory').collection<IWord>('words')
        .updateOne({ _id: ObjectId.createFromHexString(input.id) }, { $inc: { memoryLevel: 1 } });
    return {};
});

applize.implementsAPI('decreaseMemoryLevel', async input => {
    await database.db('memory').collection<IWord>('words')
        .updateOne({ _id: ObjectId.createFromHexString(input.id) }, { $inc: { memoryLevel: -1 } });
    return {};
});

config();
MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    database = db;
    console.log('mongodb connected!');
    applize.run({
        port: parseInt(process.env.PORT ?? '8080')
    });
});
