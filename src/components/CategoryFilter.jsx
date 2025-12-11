export default function CategoryFilter({ value, onChange, categories }) {
  return (
    <select className="select" value={value} onChange={e => onChange(e.target.value)}>
      {categories.map(c => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
