import { stripMarkdown, countWords, estimateReadingTime } from "../../utils/wordCount";

function ArticleWordCount({ body }) {
  if (!body) return null;

  const plainText = stripMarkdown(body);
  const wordCount = countWords(plainText);
  const readingTime = estimateReadingTime(wordCount);

  if (wordCount <= 0) return null;

  return (
    <p className="word-count text-muted">
      本文共 {wordCount} 字，预计阅读 {readingTime} 分钟
    </p>
  );
}

export default ArticleWordCount;
