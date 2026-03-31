import { forwardRef } from 'react';
import { Command, Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { value, onChange, placeholder = 'Find keywords or moments...' },
  ref,
) {
  return (
    <label className="results-search" aria-label="Search generated clips">
      <Search size={16} className="results-search-icon" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="results-search-input"
        spellCheck={false}
      />
      <span className="results-search-shortcut" aria-hidden="true">
        <Command size={12} /> K
      </span>
    </label>
  );
});

export default SearchBar;
