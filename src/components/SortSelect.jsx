function SortSelect({ value, onChange }) {
    return (
        <select
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        >
        <option value="id-asc">ID ascendente</option>
        <option value="id-desc">ID descendente</option>
        <option value="name-asc">Nombre A-Z</option>
        <option value="name-desc">Nombre Z-A</option>
        </select>
    );
}

export default SortSelect;