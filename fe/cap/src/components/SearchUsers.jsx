import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const SearchUsers = ({ users, setFilteredUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!users) return;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        (user.email && user.email.toLowerCase().includes(term))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); 
    }
  }, [users, searchTerm]);

  return (
    <div className="search-users-container mb-4">
      <div className="search-bar bg-light rounded p-2">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-0">
            <FiSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;