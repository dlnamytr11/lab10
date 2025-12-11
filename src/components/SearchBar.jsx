import { useState } from "react";

export default function SearchBar({ onSearch, onClear }) {
  const [text, setText] = useState("");

  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="Поиск по заголовку..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="btn"
        onClick={() => onSearch(text)}
        disabled={!text.trim()}
      >
        Найти
      </button>

      <button className="btn secondary" onClick={() => {
        setText("");
        onClear();
      }}>
        Очистить
      </button>
    </div>
  );
}
