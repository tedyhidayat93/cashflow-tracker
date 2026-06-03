import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HeaderTitleProps {
  title: string;
  description?: string;
  addButtonText?: string;
  addButtonHref?: string;
  children?: React.ReactNode;
}

export default function HeaderTitle({ 
  title, 
  description, 
  addButtonText = "Add", 
  addButtonHref,
  children
}: HeaderTitleProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="">
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children ? (
        children
      ) : addButtonHref ? (
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      ) : null}
    </div>
  );
}
