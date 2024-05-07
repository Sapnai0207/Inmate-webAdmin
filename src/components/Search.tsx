import React from "react";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex justify-center my-4">
      <input
        type="text"
        placeholder="Хайх"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>
  );
};

export default Search;
