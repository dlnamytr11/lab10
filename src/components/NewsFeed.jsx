import { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import NewsList from "./NewsList";
import NewsModal from "./NewsModal";
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";
import ViewedNews from "./ViewedNews";

// ❗ ВСТАВЬ СВОЙ API KEY
const API_KEY = "604c97830a9349c0bea7a523ef97ba5f";
const API_TOP_HEADLINES = "https://newsapi.org/v2/top-headlines";
const API_EVERYTHING = "https://newsapi.org/v2/everything";
const COUNTRY = "us";
const PAGE_SIZE = 10;

// Категории для выпадающего списка
const categories = [
  { value: "general", label: "Общее" },
  { value: "business", label: "Бизнес" },
  { value: "technology", label: "Технологии" },
  { value: "sports", label: "Спорт" },
  { value: "health", label: "Здоровье" },
  { value: "science", label: "Наука" },
  { value: "entertainment", label: "Развлечения" }
];

export default function NewsFeed() {
  const [category, setCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest

  // просмотренные новости
  const [viewedNews, setViewedNews] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);

  // ======== ЗАГРУЗКА ИСТОРИИ ПРИ СТАРТЕ ========
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viewedNews");
      if (saved) {
        setViewedNews(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Не удалось загрузить просмотренные:", e);
    }
  }, []);

  function saveViewed(list) {
    try {
      localStorage.setItem("viewedNews", JSON.stringify(list));
    } catch (e) {
      console.error("Не удалось сохранить:", e);
    }
  }

  function clearViewed() {
    setViewedNews([]);
    localStorage.removeItem("viewedNews");
  }

  // Добавить новость в историю (максимум 5)
  function addViewed(article) {
    setViewedNews(prev => {
      if (prev.some(a => a.url === article.url)) return prev;

      const updated = [article, ...prev].slice(0, 5);
      saveViewed(updated);
      return updated;
    });
  }

  // ======== СОРТИРОВКА ========
  function applySort(list, order) {
    return [...list].sort((a, b) => {
      const da = new Date(a.publishedAt || 0);
      const db = new Date(b.publishedAt || 0);
      return order === "newest" ? db - da : da - db;
    });
  }

  // ======== ЗАГРУЗКА НОВОСТЕЙ ========
  async function loadNews(reset = false, query = searchQuery) {
    setLoading(true);

    const currentPage = reset ? 1 : page;
    let url = "";

    if (query.trim().length > 0) {
      // поиск
      url =
        `${API_EVERYTHING}?q=${encodeURIComponent(query)}` +
        `&page=${currentPage}&pageSize=${PAGE_SIZE}` +
        `&sortBy=publishedAt&apiKey=${API_KEY}` +
        `&nocache=${Date.now()}`;
    } else {
      // обычные новости
      url =
        `${API_TOP_HEADLINES}?country=${COUNTRY}` +
        `&category=${category}` +
        `&page=${currentPage}&pageSize=${PAGE_SIZE}` +
        `&apiKey=${API_KEY}` +
        `&nocache=${Date.now()}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      const incoming = data.articles || [];
      setTotalResults(data.totalResults || 0);
      setPage(currentPage + 1);

      setArticles(prev => {
        const base = reset ? [] : prev;
        const combined = [...base, ...incoming];
        return applySort(combined, sortOrder);
      });

    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }

    setLoading(false);
  }

  // ======== Смена категории (если нет поиска) ========
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setPage(1);
      loadNews(true);
    }
  }, [category]);
  
  useEffect(() => {
  if (forceRefresh) {
    loadNews(true, searchQuery); // загружаем новости заново
    setForceRefresh(false);      // отключаем флаг
  }
}, [forceRefresh]);

  // ======== Изменение сортировки ========
  useEffect(() => {
    setArticles(prev => applySort(prev, sortOrder));
  }, [sortOrder]);

  // ======== Поиск ========
  function handleSearch(text) {
    setSearchQuery(text);
    setPage(1);
    loadNews(true, text);
  }

  function clearSearch() {
    setSearchQuery("");
    setPage(1);
    loadNews(true, "");
  }

  // ======== Открытие новости ========
  function openArticle(article) {
    addViewed(article);
    setSelected(article);
  }

  return (
    <div className="news-feed">

      {/* ПОИСК */}
      <SearchBar onSearch={handleSearch} onClear={clearSearch} />

      {/* СОРТИРОВКА */}
      <SortBar sortOrder={sortOrder} onChange={setSortOrder} />

      {/* БЛОК "ПРОСМОТРЕННЫЕ" */}
      <ViewedNews items={viewedNews} onOpen={setSelected} onClear={clearViewed} />

      {/* КАТЕГОРИИ (если нет поиска) */}
      {searchQuery.trim() === "" && (
        <CategoryFilter
          value={category}
          onChange={(cat) => {
            setCategory(cat);
            setArticles([]);
          }}
          categories={categories}
        />
      )}

      {/* ОБНОВИТЬ */}
      <button
        className="btn"
        onClick={() => {
            setArticles([]);     // очищаем ленту
            setPage(1);          // сбрасываем пагинацию
            setForceRefresh(true); // указываем, что нужен новый запрос
        }}
      >
        Обновить
      </button>

      {/* СПИСОК НОВОСТЕЙ */}
      <NewsList articles={articles} onOpen={openArticle} />

      {/* ЗАГРУЗИТЬ ЕЩЁ */}
      {articles.length < totalResults && (
        <button
          className="btn secondary"
          onClick={() => loadNews(false)}
          disabled={loading}
        >
          Загрузить ещё
        </button>
      )}

      {/* МОДАЛЬНОЕ ОКНО */}
      <NewsModal article={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
