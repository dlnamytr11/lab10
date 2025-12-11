export default function NewsModal({ article, onClose }) {
  if (!article) return null;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>X</button>

        {article.urlToImage && (
          <img className="modal-img" src={article.urlToImage} alt="" />
        )}

        <h2>{article.title}</h2>
        <p>{article.content || article.description}</p>

        <a className="btn" href={article.url} target="_blank">
          Читать на сайте источника
        </a>
      </div>
    </div>
  );
}
