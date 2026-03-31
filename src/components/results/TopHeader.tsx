import { PlaySquare } from 'lucide-react';
import { type RefObject } from 'react';
import SearchBar from './SearchBar';

interface TopHeaderProps {
  projectTitle: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export default function TopHeader({
  projectTitle,
  searchValue,
  onSearchChange,
  searchInputRef,
}: TopHeaderProps) {
  return (
    <header className="results-header">
      <div className="results-header-left">
        <PlaySquare size={14} />
        <span className="results-header-project" title={projectTitle}>
          {projectTitle}
        </span>
      </div>

      <div className="results-header-center">
        <SearchBar ref={searchInputRef} value={searchValue} onChange={onSearchChange} />
      </div>
    </header>
  );
}
