import { Testament } from '../types';
import { SearchMode } from '../components/SearchBar';

export const normalizeArabicText = (text: string): string => {
  return text
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase();
};

export const searchBible = (
  text: string,
  testaments: Testament[],
  searchMode: SearchMode,
): { testament: string; book: string; chapter: number; verse: number; text: string }[] => {
  const searchTerms = text.trim().split(/\s+/);
  const normalizedSearchTerms = searchTerms.map(term => normalizeArabicText(term));
  const results: { testament: string; book: string; chapter: number; verse: number; text: string }[] = [];
  const seenResults = new Set<string>();

  testaments.forEach((testament) => {
    testament.books.forEach((book) => {
      book.chapters.forEach((chapter) => {
        chapter.verses.forEach((verse) => {
          const normalizedVerse = normalizeArabicText(verse.text);
          const resultKey = `${testament.name}-${book.name}-${chapter.number}-${verse.number}`;
          
          if (seenResults.has(resultKey)) return;

          let shouldInclude = false;

          switch (searchMode) {
            case 'partial':
              // Search for the complete phrase
              shouldInclude = normalizedVerse.includes(normalizeArabicText(text));
              break;

            case 'anyWord':
              // Search for any of the words
              shouldInclude = normalizedSearchTerms.some(term => 
                normalizedVerse.includes(term)
              );
              break;

            case 'allWords':
              // Search for all words
              shouldInclude = normalizedSearchTerms.every(term => 
                normalizedVerse.includes(term)
              );
              break;
          }
          
          if (shouldInclude) {
            seenResults.add(resultKey);
            results.push({
              testament: testament.name,
              book: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
            });
          }
        });
      });
    });
  });

  return results;
};