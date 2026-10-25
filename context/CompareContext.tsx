'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/Toast';

export interface CompareProductItem {
  id: string;
  title: string;
  price: string;
  retailer: string;
  faviconUrl?: string;
  productUrl?: string;
  availability?: string;
  shippingText?: string;
  rating?: number | null;
  reviewCount?: number | null;
}

interface CompareContextType {
  compareItems: CompareProductItem[];
  addToCompare: (item: CompareProductItem) => boolean;
  removeFromCompare: (id: string) => void;
  toggleCompare: (item: CompareProductItem) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<CompareProductItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const isComparing = useCallback(
    (id: string) => compareItems.some((item) => item.id === id),
    [compareItems]
  );

  const addToCompare = useCallback(
    (item: CompareProductItem): boolean => {
      if (compareItems.some((existing) => existing.id === item.id)) {
        return false;
      }
      if (compareItems.length >= 3) {
        toast({
          type: 'error',
          title: 'Limit reached',
          message: 'You can compare up to 3 products at a time.',
        });
        return false;
      }

      setCompareItems((prev) => [...prev, item]);
      toast({
        type: 'success',
        title: 'Added to comparison',
        message: `${item.retailer} offer added (${compareItems.length + 1}/3).`,
        duration: 2500,
      });
      return true;
    },
    [compareItems, toast]
  );

  const removeFromCompare = useCallback((id: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleCompare = useCallback(
    (item: CompareProductItem) => {
      if (isComparing(item.id)) {
        removeFromCompare(item.id);
      } else {
        addToCompare(item);
      }
    },
    [isComparing, removeFromCompare, addToCompare]
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  const value = useMemo(
    () => ({
      compareItems,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      isComparing,
      isModalOpen,
      setIsModalOpen,
    }),
    [compareItems, addToCompare, removeFromCompare, toggleCompare, clearCompare, isComparing, isModalOpen]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
