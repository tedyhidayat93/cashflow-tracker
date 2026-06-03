import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface CategoryOption {
  label: string;
  value: string;
  subcategories?: CategoryOption[];
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory?: string;
  onCategoryChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory = '',
  onCategoryChange,
  placeholder = 'Pilih Kategori',
  className = ''
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initialExpanded: Record<string, boolean> = {};
    const initializeExpanded = (items: CategoryOption[]) => {
      items.forEach(item => {
        initialExpanded[item.value] = true;
        if (item.subcategories) {
          initializeExpanded(item.subcategories);
        }
      });
    };
    initializeExpanded(categories);
    return initialExpanded;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔒 click outside
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 🔽 toggle expand
  const toggleExpand = (value: string) => {
    setExpanded(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  // 🔍 recursive search filter (FIXED)
  const filterTree = (items: CategoryOption[]): CategoryOption[] => {
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();

    return items
      .map(item => {
        const match = item.label.toLowerCase().includes(term);

        const children = item.subcategories
          ? filterTree(item.subcategories)
          : [];

        if (match || children.length > 0) {
          return {
            ...item,
            subcategories: children
          };
        }

        return null;
      })
      .filter(Boolean) as CategoryOption[];
  };

  // 🔍 find label
  const findLabel = (items: CategoryOption[]): string | null => {
    for (const item of items) {
      if (item.value === selectedCategory) return item.label;

      if (item.subcategories) {
        const found = findLabel(item.subcategories);
        if (found) return found;
      }
    }
    return null;
  };

  // 🌲 render tree
  const renderTree = (items: CategoryOption[], level = 0) => {
    return items.map(item => {
      const hasChildren = item.subcategories && item.subcategories.length > 0;
      const isOpen = expanded[item.value];

      return (
        <div key={item.value}>
          <div
            className="flex items-center gap-2 px-3 py-2 hover:bg-amber-50 text-sm"
            style={{ paddingLeft: `${level * 16 + 12}px` }}
          >
            {/* toggle */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleExpand(item.value);
                }}
                className="w-4 text-gray-500"
              >
                {isOpen ? '▼' : '▶'}
              </button>
            ) : (
              <span className="w-4" />
            )}

            {/* label */}
            <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCategoryChange(item.value);
                setIsOpen(false);
                setSearchTerm('');
            }}
            className={`flex-1 cursor-pointer ${
                selectedCategory === item.value
                ? 'font-semibold text-black'
                : hasChildren
                ? 'font-semibold text-amber-600'
                : 'text-gray-800'
            }`}
            >
            {item.label}
            </div>
          </div>

          {/* children */}
          {hasChildren && isOpen && renderTree(item.subcategories!, level + 1)}
        </div>
      );
    });
  };

  const filtered = filterTree(categories);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full rounded-lg border-[2px] px-3 py-2 text-left bg-white flex items-center justify-between text-sm"
      >
        <span className="truncate">
          {findLabel(categories) ?? placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-md">
          
          {/* search */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full pl-8 pr-2 py-2 text-sm border rounded"
              />
            </div>
          </div>

          {/* list */}
          <div className="max-h-60 overflow-auto">
            <div
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                selectedCategory === '' ? 'font-semibold text-amber-600' : ''
              }`}
              onClick={() => {
                onCategoryChange('');
                setIsOpen(false);
              }}
            >
              Semua Kategori
            </div>

            {filtered.length > 0 ? (
              renderTree(filtered)
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                Tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}