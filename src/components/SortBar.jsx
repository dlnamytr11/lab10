export default function SortBar({ sortOrder, onChange }) {
  return (
    <div className="sort-bar">
      <label>Сортировка:</label>
      <select className="select" value={sortOrder} onChange={(e) => onChange(e.target.value)}>
        <option value="newest">Новые → Старые</option>
        <option value="oldest">Старые → Новые</option>
      </select>
    </div>
  );
}
