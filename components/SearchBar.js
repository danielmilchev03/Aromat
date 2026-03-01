import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Fetch suggestions from API
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=5`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (perfume) => {
    router.push(`/perfume/${perfume.id}`);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search by fragrance name, brand, or note..."
          value={query}
          onChange={handleSearch}
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 focus:border-accent focus:outline-none transition-colors bg-white"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-8 bg-accent text-white font-serif text-lg hover:bg-yellow-600 transition-colors"
        >
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 border-t-0 shadow-lg z-50">
          {suggestions.map((perfume, idx) => (
            <button
              key={perfume.id || idx}
              onClick={() => handleSuggestionClick(perfume)}
              className="w-full text-left px-6 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
            >
              <div className="font-serif font-semibold text-gray-900">{perfume.name}</div>
              <div className="text-sm text-gray-600">{perfume.brand}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
