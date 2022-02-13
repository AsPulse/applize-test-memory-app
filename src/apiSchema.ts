import type { ServerAPISchema } from "@aspulse/applize/lib/api/schema";


export interface IWord {
    en: string,
    ja: string,
    memoryLevel: number,
    createdAt: number,
}
export type APISchema = ServerAPISchema<{
    getWords: {
        input: { count: number },
        output: { words: {
            en: string,
            ja: string,
            memoryLevel: number,
            createdAt: number,
        }[] }
    },
    getWordsPage: {
      input: { count: number, skip: number, sort: 'createdAt' | 'memoryLevel', sortLevel: 1 | -1 },
      output: { words: {
        en: string,
        ja: string,
        memoryLevel: number,
        createdAt: number,
      }[] }
    },
    wordsCount: {
      input: {},
      output: { count: number }
    },
    addWords: {
        input: { data: { en: string, ja: string }[] },
        output: {}
    }

    randompick: {
        input: {}
        output: { id: string, en: string, ja: string }
    },

    increaseMemoryLevel: {
        input: { id: string },
        output: {}
    },

    decreaseMemoryLevel: {
        input: { id: string },
        output: {}
    }
}>;
