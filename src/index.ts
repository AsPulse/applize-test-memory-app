import { Applize, PageRoute } from "@aspulse/applize";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { addWord } from "../pages/addWord";
import { index } from "../pages/index";
import { test } from "../pages/test";
import { words } from "../pages/words";
import { APISchema, IWord } from "./apiSchema";

const applize = new Applize<APISchema, {
  mongoDb: MongoClient
}>();

config();
applize.addPageRoute(PageRoute.fromPage(index)?.urlRoute('/')?.code(200));
applize.addPageRoute(PageRoute.fromPage(addWord)?.urlRoute('/words/add')?.code(200));
applize.addPageRoute(PageRoute.fromPage(words)?.urlRoute('/words')?.code(200));
applize.addPageRoute(PageRoute.fromPage(test)?.urlRoute('/test')?.code(200));

applize.implementAPI('addWords', async (input, plugin) => {
    const db = await plugin('mongoDb');
    db.db('memory').collection('words').insertMany(
        input.data.map(v => ({
            en: v.en, ja: v.ja,
            memoryLevel: 0, createdAt: new Date().getTime()
        }))
    );
    return {};
});

applize.implementAPI('getWords', async (input, plugin) => {
  const db = await plugin('mongoDb');
    const got = await db.db('memory').collection<IWord>('words')
    .find({}).sort({ createdAt: -1 }).map(v => ({
        en: v.en,
        ja: v.ja,
        memoryLevel: v.memoryLevel,
        createdAt: v.createdAt
    })).toArray();
    return { words: got };
});


applize.implementAPI('getWordsPage', async (input, plugin) => {
  const db = await plugin('mongoDb');
  const got = await db.db('memory').collection<IWord>('words')
  .find({}, { sort: input.sort === 'createdAt' ? { createdAt: input.sortLevel } : { memoryLevel: input.sortLevel }, skip: input.skip, limit: input.count }).map(v => ({
      en: v.en,
      ja: v.ja,
      memoryLevel: v.memoryLevel,
      createdAt: v.createdAt
  })).toArray();
  return { words: got };
});

applize.implementAPI('wordsCount', async (_, plugin) => {
  const db = await plugin('mongoDb');
  return {  count: await db.db('memory').collection<IWord>('words').countDocuments() };
});

applize.implementAPI('randompick', async (_, plugin) => {
  const db = await plugin('mongoDb');
  const count = await db.db('memory').collection('words').countDocuments();
  const rand = Math.floor(Math.random() * count);
  const target = await db.db('memory').collection<IWord>('words').find({}).limit(-1).skip(rand).next();
  return { id: target._id.toHexString(), en: target.en, ja: target.ja }
});

applize.implementAPI('increaseMemoryLevel', async (input, plugin) => {
  const db = await plugin('mongoDb');
  await db.db('memory').collection<IWord>('words')
      .updateOne({ _id: ObjectId.createFromHexString(input.id) }, { $inc: { memoryLevel: 1 } });
  return {};
});

applize.implementAPI('decreaseMemoryLevel', async (input, plugin) => {
  const db = await plugin('mongoDb');
  await db.db('memory').collection<IWord>('words')
      .updateOne({ _id: ObjectId.createFromHexString(input.id) }, { $inc: { memoryLevel: -1 } });
  return {};
});


applize.run({
  port: parseInt(process.env.PORT ?? '8080')
});

applize.pluginReady('mongoDb', () => {
  return new Promise(resolve => {
    MongoClient.connect(process.env.MONGO_URL, (err, db) => {
      console.log('mongodb connected!');
      resolve(db);
    });
  });
});
