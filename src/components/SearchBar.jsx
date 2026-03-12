function SearchBar({ value, onChange, placeholder }) {
    return (
        <input
        className="search-input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default SearchBar;