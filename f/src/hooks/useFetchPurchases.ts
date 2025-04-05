import { useState, useEffect, useCallback } from 'react';
import { Purchase, PurchaseFilter, UseFetchPurchasesResult } from '../types/purchasesTypes';
import purchasesService from '../../../services/purchasesService';

/**
 * Хук для загрузки данных о закупках с возможностью фильтрации
 */
const useFetchPurchases = (
  initialFilters?: PurchaseFilter,
  autoFetch: boolean = true
): UseFetchPurchasesResult => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<PurchaseFilter | undefined>(initialFilters);

  /**
   * Функция для загрузки закупок с фильтрацией
   */
  const fetchPurchases = useCallback(async (newFilters?: PurchaseFilter) => {
    if (newFilters) {
      setFilters(newFilters);
    }

    const currentFilters = newFilters || filters;

    try {
      setIsLoading(true);
      setError(null);

      // Вызов сервиса для получения данных
      const response = await purchasesService.getPurchases(currentFilters);
      
      setPurchases(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error('Ошибка при загрузке закупок:', err);
      setError(err instanceof Error ? err : new Error('Произошла ошибка при загрузке закупок'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Функция для повторной загрузки данных с текущими фильтрами
   */
  const refetch = useCallback(() => {
    return fetchPurchases(filters);
  }, [fetchPurchases, filters]);

  // Загрузка данных при монтировании компонента или изменении фильтров
  useEffect(() => {
    if (autoFetch) {
      fetchPurchases();
    }
  }, [autoFetch, fetchPurchases]);

  return {
    purchases,
    isLoading,
    error,
    totalCount,
    fetchPurchases,
    refetch
  };
};

export default useFetchPurchases;