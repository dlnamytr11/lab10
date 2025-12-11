import NewsCard from "./NewsCard";

export default function NewsList({ articles, onOpen }) {
  return (
    <div className="news-list">
      {articles.map((article, index) => (
        <NewsCard
          key={article.url || index}
          article={article}
          onClick={() => onOpen(article)}
        />
      ))}
    </div>
  );
}
