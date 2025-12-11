export default function ViewedNews({ items, onOpen, onClear }) {
  if (!items.length) return null;

  return (
    <div className="viewed-block">
      <div className="viewed-header">
        <h3>Недавно просмотренные</h3>

        <button className="btn small danger" onClick={onClear}>
          Очистить
        </button>
      </div>

      <div className="viewed-list">
        {items.map((article, index) => (
          <div
            key={article.url || index}
            className="viewed-item"
            onClick={() => onOpen(article)}
          >
            {article.urlToImage && (
              <img src={article.urlToImage} alt="" />
            )}
            <span>{article.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
