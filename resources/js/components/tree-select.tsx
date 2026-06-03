import React from 'react';

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface Props {
  data: Category[];
  value?: string | null;
  onChange: (val: string | null) => void;
}

export default function TreeSelect({ data, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [selected, setSelected] = React.useState<string | null | undefined>(value);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 🔄 sync dengan parent (Inertia)
  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  // 🔒 close when click outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  React.useEffect(() => {
    if (!selected) return;

    const path = findPath(data, selected);

    if (path) {
        const expandMap: Record<number, boolean> = {};

        path.forEach((id) => {
        expandMap[id] = true;
        });

        setExpanded(expandMap);
    }
    }, [selected, data]);

    // find path when edit page
    const findPath = (
    items: Category[],
    target: string | null,
    path: number[] = []
    ): number[] | null => {
    if (!target) return null;

    for (const item of items) {
        const newPath = [...path, item.id];

        if (String(item.id) === String(target)) {
        return newPath;
        }

        if (item.children) {
        const found = findPath(item.children, target, newPath);
        if (found) return found;
        }
    }

    return null;
    };   

  // 🔽 toggle expand
  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 🔍 find label (FIXED VERSION)
  const findLabel = (items: Category[]): string | null => {
    if (!selected) return null;
    
    for (const item of items) {
      if (String(item.id) === String(selected)) return item.name;

      if (item.children) {
        const found = findLabel(item.children);
        if (found !== null) return found;
      }
    }
    return null;
  };

  // 🌲 render tree
  const renderTree = (items: Category[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = expanded[item.id];

      return (
        <div key={item.id}>
          <div
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            {/* Toggle */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
                className="w-4 text-gray-500 hover:text-black"
              >
                {isOpen ? '▼' : '▶'}
              </button>
            ) : (
              <span className="w-4" />
            )}

            {/* Label */}
            <div
              className={`flex-1 cursor-pointer ${
                selected && String(selected) === String(item.id)
                  ? 'font-semibold text-primary'
                  : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const val = String(item.id);

                setSelected(val); // 🔥 langsung update UI
                onChange(val);    // 🔥 kirim ke parent

                setOpen(false);
              }}
            >
              {item.name}
            </div>
          </div>

          {/* Children */}
          {hasChildren && isOpen && renderTree(item.children!, level + 1)}
        </div>
      );
    });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <div
        className="border rounded-md px-3 py-2 bg-white cursor-pointer text-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        {findLabel(data) ?? 'Pilih induk (opsional)'}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto border bg-white rounded-md shadow-md">
          
          {/* Root option */}
          <div
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setSelected(null);
              onChange(null);

              setOpen(false);
            }}
          >
            Tidak Ada (Kategori Utama)
          </div>

          {/* Tree */}
          {renderTree(data)}
        </div>
      )}
    </div>
  );
}