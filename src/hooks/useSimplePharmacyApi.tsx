import { useState } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';
import { supabase } from '../utils/supabase/client';
import { usePharmacyFilter } from './usePharmacyFilter';

/**
 * Version simplifiée de l'API pour éviter les erreurs de relations complexes
 * Utilise directement le client Supabase avec des requêtes simples
 */
export const useSimplePharmacyApi = () => {
  const { session } = useAuth();
  const { 
    selectWithPharmacyFilter,
    insertWithPharmacyId,
    updateWithPharmacyFilter,
    deleteWithPharmacyFilter,
    pharmacyId
  } = usePharmacyFilter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === API PRODUITS SIMPLIFIÉ ===
  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!pharmacyId) throw new Error('Aucune pharmacie associée');
      
      const { data, error } = await selectWithPharmacyFilter('produits').select('*');
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await insertWithPharmacyId('produits', productData).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await deleteWithPharmacyFilter('produits', { id: parseInt(id) });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API STOCK SIMPLIFIÉ ===
  const getStockLots = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!pharmacyId) throw new Error('Aucune pharmacie associée');
      
      const { data, error } = await selectWithPharmacyFilter('stock_lots').select('*');
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getStockMovements = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!pharmacyId) throw new Error('Aucune pharmacie associée');
      
      const { data, error } = await selectWithPharmacyFilter('mouvements_stock')
        .select('*')
        .order('date_creation', { ascending: false });
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // === API STATISTIQUES SIMPLIFIÉ ===
  const getDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!pharmacyId) throw new Error('Aucune pharmacie associée');

      const today = new Date().toISOString().split('T')[0];
      
      // Statistiques simples
      const [
        { count: totalStock },
        { count: clientsCount },
        { count: alertsCount }
      ] = await Promise.all([
        selectWithPharmacyFilter('stock_lots').select('*', { count: 'exact', head: true }),
        selectWithPharmacyFilter('clients').select('*', { count: 'exact', head: true }),
        selectWithPharmacyFilter('stock_lots').select('*', { count: 'exact', head: true }).lt('quantite', 10)
      ]);

      return {
        salesToday: 0, // Pour l'instant
        totalStock: totalStock || 0,
        clientsCount: clientsCount || 0,
        alertsCount: alertsCount || 0
      };
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
      return {
        salesToday: 0,
        totalStock: 0,
        clientsCount: 0,
        alertsCount: 0
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Products
    getProducts,
    createProduct,
    deleteProduct,
    // Stock
    getStockLots,
    getStockMovements,
    // Dashboard
    getDashboardStats,
  };
};
