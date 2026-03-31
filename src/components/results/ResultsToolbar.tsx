import {
  CheckCircle2,
  Filter,
  LayoutGrid,
  List,
  Upload,
  MoreHorizontal,
} from 'lucide-react';

interface ResultsToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function ResultsToolbar({ viewMode, onViewModeChange }: ResultsToolbarProps) {
  return (
    <div className="results-toolbar" role="toolbar" aria-label="Clip result actions">
      <button type="button" className="results-toolbar-select">
        <CheckCircle2 size={15} />
        Select
      </button>

      <button type="button" className="results-toolbar-btn results-toolbar-btn--label">
        <Filter size={14} />
        Filter
      </button>

      <div className="results-toolbar-toggle" role="group" aria-label="Layout options">
        <button
          type="button"
          className={`results-toolbar-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
          title="Grid view"
        >
          <LayoutGrid size={14} />
        </button>
        <button
          type="button"
          className={`results-toolbar-btn ${viewMode === 'list' ? 'is-active' : ''}`}
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
          title="List view"
        >
          <List size={14} />
        </button>
      </div>

      <button type="button" className="results-toolbar-btn" aria-label="Export or share" title="Export or share">
        <Upload size={14} />
      </button>

      <button type="button" className="results-toolbar-btn" aria-label="More actions" title="More actions">
        <MoreHorizontal size={14} />
      </button>
    </div>
  );
}
