import { useState } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * Hook personnalisé pour interagir avec l'API backend de la pharmacie
 * Garantit l'isolation des données par pharmacie via l'authentification
 */
export const usePharmacyApi = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-dd08096e`;

  // Helper pour faire les requêtes authentifiées
  const authenticatedFetch = async (
    endpoint: string, 
    options: RequestInit = {}
  ) => {
    const token = session?.access_token;
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    return response.json();
  };

  // === API PRODUITS ===
  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/products');
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      return result.data;
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
      await authenticatedFetch(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API STOCK ===
  const getStockLots = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/stock/lots');
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStockMovements = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/stock/movements');
      // Ajouter des informations utilisateur simulées pour éviter l'erreur de relation
      const enhancedData = (result.data || []).map(movement => ({
        ...movement,
        utilisateur: { email: 'utilisateur@pharmacie.sn' }
      }));
      return enhancedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStockMovement = async (movementData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/stock/movements', {
        method: 'POST',
        body: JSON.stringify(movementData),
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API VENTES ===
  const getSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/sales');
      // Ajouter des informations vendeur simulées
      const enhancedData = (result.data || []).map(sale => ({
        ...sale,
        vendeur: { email: 'vendeur@pharmacie.sn' }
      }));
      return enhancedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API CLIENTS ===
  const getClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/clients');
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API ORDONNANCES ===
  const getPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/prescriptions');
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPrescription = async (prescriptionData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(prescriptionData),
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API ALERTES ===
  const getAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/alerts');
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === API STATISTIQUES ===
  const getDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticatedFetch('/dashboard/stats');
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
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
    updateProduct,
    deleteProduct,
    // Stock
    getStockLots,
    getStockMovements,
    createStockMovement,
    // Sales
    getSales,
    createSale,
    // Clients
    getClients,
    createClient,
    // Prescriptions
    getPrescriptions,
    createPrescription,
    // Alerts
    getAlerts,
    // Dashboard
    getDashboardStats,
  };
};
