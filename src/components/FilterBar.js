"use client";
const FilterBar = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div style={filterBarStyle}>
      <input
        type="text"
        name="search"
        placeholder="Search cars"
        value={filters.search}
        onChange={handleInputChange}
        style={inputStyle}
      />
      <select
        name="type"
        value={filters.type}
        onChange={handleInputChange}
        style={selectStyle}
      >
        <option value="">All Types</option>
        <option value="sedan">Sedan</option>
        <option value="suv">SUV</option>
        <option value="sports">Sports</option>
        <option value="accessory">Accessory</option>
      </select>
    </div>
  );
};

const filterBarStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  background: "#1a1a1a",
  color: "white",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  background: "#1a1a1a",
  color: "white",
};

export default FilterBar;
