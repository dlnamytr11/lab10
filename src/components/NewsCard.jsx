export default function NewsCard({ article, onClick }) {
  return (
    <div className="news-card" onClick={onClick}>
      {article.urlToImage && (
        <img className="news-img" src={article.urlToImage} alt="" />
      )}

      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <small className="source">{article.source?.name}</small>
    </div>
  );
}
