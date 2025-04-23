import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiHeart,
  FiUserCheck,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const SearchAndFilter = ({ events, setFilteredEvents, setLoading, setError }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterFollowing, setFilterFollowing] = useState(false);
  const [filterLiked, setFilterLiked] = useState(false);
  const [sortDate, setSortDate] = useState(null);

  const baseCategories = [
    { id: "Music", name: "Music" },
    { id: "Sports", name: "Sports" },
    { id: "Arts", name: "Arts" },
    { id: "Business", name: "Business" },
    { id: "Food", name: "Food" },
    { id: "Technology", name: "Technology" },
    { id: "Education", name: "Education" },
    { id: "Health", name: "Health" },
    { id: "Other", name: "Other" },
  ];

  // Apply all filters whenever any filter criteria changes
  useEffect(() => {
    if (!events) return;

    let result = [...events];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term)
    }

    // Apply category filter if any selected
    if (selectedCategories.length > 0) {
      result = result.filter((event) =>
        event.categories.some((cat) => selectedCategories.includes(cat))
    }

    // Apply following filter
    if (filterFollowing) {
      result = result.filter((event) => event.isFollowing);
    }

    // Apply liked filter
    if (filterLiked) {
      result = result.filter((event) => event.isLiked);
    }

    // Apply date sorting
    if (sortDate) {
      result.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortDate === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    setFilteredEvents(result);
  }, [events, searchTerm, selectedCategories, filterFollowing, filterLiked, sortDate]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="button"
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter />
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h4>Categories</h4>
            <div className="category-bubbles">
              {baseCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`category-bubble ${
                    selectedCategories.includes(category.id) ? "active" : ""
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filterFollowing}
                onChange={() => setFilterFollowing(!filterFollowing)}
              />
              <FiUserCheck className="filter-icon" />
              Following Only
            </label>
          </div>

          <div className="filter-section">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filterLiked}
                onChange={() => setFilterLiked(!filterLiked)}
              />
              <FiHeart className="filter-icon" />
              Liked Only
            </label>
          </div>

          <div className="filter-section">
            <h4>Sort by Date</h4>
            <div className="sort-options">
              <button
                type="button"
                className={`sort-button ${sortDate === "asc" ? "active" : ""}`}
                onClick={() => setSortDate(sortDate === "asc" ? null : "asc")}
              >
                <FiCalendar /> Oldest First
              </button>
              <button
                type="button"
                className={`sort-button ${sortDate === "desc" ? "active" : ""}`}
                onClick={() => setSortDate(sortDate === "desc" ? null : "desc")}
              >
                <FiCalendar /> Newest First
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;