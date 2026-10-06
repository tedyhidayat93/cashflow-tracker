import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  className?: string;
}

export function DynamicIcon({ name, className = 'size-4' }: DynamicIconProps) {
  if (!name) return null;
  
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[name];
  
  if (!IconComponent) {
    const Fallback = Icons.Folder;
    return <Fallback className={className} />;
  }

  return <IconComponent className={className} />;
}