import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';

/**
 * API mockée entièrement fonctionnelle pour AssPharma
 * Simule une base de données complète avec isolation par pharmacie
 */
export const useMockPharmacyApi = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données mockées
  const [mockProducts, setMockProducts] = useState([
    {
      id: 1,
      pharmacy_id: "pharmacy-001",
      nom_commercial: "Doliprane 1000mg",
      dci: "Paracétamol",
      dosage: "1000mg",
      forme: "Comprimés",
      laboratoire: "Sanofi",
      rayon: "Médicaments en libre service",
      etagere: 2,
      code_barres: "3400937265034",
      prix_unitaire: 1600,
      stock_minimum: 50,
      statut: 'actif',
      type_vente: 'libre',
      created_at: "2025-01-15T00:00:00Z",
      stock_lots: [
        {
          id: 1,
          numero_lot: "DL2025A001",
          quantite: 248,
          date_expiration: "2025-12-15",
          statut: 'actif'
        }
      ]
    },
    {
      id: 2,
      pharmacy_id: "pharmacy-001",
      nom_commercial: "Amoxicilline Biogaran 500mg",
      dci: "Amoxicilline",
      dosage: "500mg",
      forme: "Gélules",
      laboratoire: "Biogaran",
      rayon: "Médicaments sur ordonnance",
      etagere: 1,
      code_barres: "3400938516234",
      prix_unitaire: 4800,
      stock_minimum: 30,
      statut: 'actif',
      type_vente: 'reglemente',
      created_at: "2025-02-10T00:00:00Z",
      stock_lots: [
        {
          id: 2,
          numero_lot: "AMX2025B002",
          quantite: 120,
          date_expiration: "2025-08-20",
          statut: 'actif'
        }
      ]
    },
    {
      id: 3,
      pharmacy_id: "pharmacy-001",
      nom_commercial: "Insuline Lantus",
      dci: "Insuline glargine",
      dosage: "100 UI/ml",
      forme: "Solution injectable",
      laboratoire: "Sanofi",
      rayon: "Médicaments sur ordonnance",
      etagere: 3,
      code_barres: "3400936404564",
      prix_unitaire: 12500,
      stock_minimum: 10,
      statut: 'rupture',
      type_vente: 'reglemente',
      created_at: "2025-03-05T00:00:00Z",
      stock_lots: [
        {
          id: 3,
          numero_lot: "INS2025C003",
          quantite: 3,
          date_expiration: "2025-11-30",
          statut: 'actif'
        }
      ]
    }
  ]);

  const [mockStockMovements, setMockStockMovements] = useState([
    {
      id: 1,
      produit_id: 1,
      produit: { nom: "Doliprane 1000mg" },
      numero_lot: "DL2025A001",
      type: 'entree',
      motif: 'achat',
      quantite: 100,
      quantite_avant: 150,
      quantite_apres: 250,
      utilisateur: { email: 'admin@pharmacie.sn' },
      date_creation: "2025-09-06T08:30:00Z",
      commentaire: "Livraison Grossiste Pharma",
      prix_unitaire: 1600
    },
    {
      id: 2,
      produit_id: 1,
      produit: { nom: "Doliprane 1000mg" },
      numero_lot: "DL2025A001",
      type: 'sortie',
      motif: 'vente',
      quantite: 2,
      quantite_avant: 250,
      quantite_apres: 248,
      utilisateur: { email: 'marie@pharmacie.sn' },
      date_creation: "2025-09-06T09:45:00Z",
      commentaire: "Vente client"
    }
  ]);

  const [mockStockLots, setMockStockLots] = useState([
    {
      id: 1,
      produit_id: 1,
      produit: { nom: "Doliprane 1000mg", stock_minimum: 50 },
      numero_lot: "DL2025A001",
      quantite: 248,
      date_expiration: "2025-12-15",
      date_entree: "2025-09-01",
      prix_achat: 1200,
      fournisseur: "Grossiste Pharma Dakar",
      statut: 'actif'
    },
    {
      id: 2,
      produit_id: 2,
      produit: { nom: "Amoxicilline Biogaran 500mg", stock_minimum: 30 },
      numero_lot: "AMX2025B002",
      quantite: 120,
      date_expiration: "2025-08-20",
      date_entree: "2025-02-10",
      prix_achat: 3800,
      fournisseur: "Laboratoire Biogaran",
      statut: 'actif'
    },
    {
      id: 3,
      produit_id: 3,
      produit: { nom: "Insuline Lantus", stock_minimum: 10 },
      numero_lot: "INS2025C003",
      quantite: 3,
      date_expiration: "2025-11-30",
      date_entree: "2025-03-05",
      prix_achat: 10000,
      fournisseur: "Sanofi Distribution",
      statut: 'actif'
    }
  ]);

  // Simulate API delay
  const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

  // === API PRODUITS ===
  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay();
      return mockProducts;
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
      await simulateDelay();
      const newProduct = {
        id: mockProducts.length + 1,
        pharmacy_id: "pharmacy-001",
        ...productData,
        created_at: new Date().toISOString(),
        stock_lots: []
      };
      setMockProducts([...mockProducts, newProduct]);
      return newProduct;
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
      await simulateDelay();
      setMockProducts(mockProducts.filter(p => p.id !== parseInt(id)));
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
      await simulateDelay();
      return mockStockLots;
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
      await simulateDelay();
      return mockStockMovements;
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
      await simulateDelay();
      const newMovement = {
        id: mockStockMovements.length + 1,
        ...movementData,
        produit: mockProducts.find(p => p.id === movementData.produit_id),
        utilisateur: { email: 'admin@pharmacie.sn' },
        date_creation: new Date().toISOString(),
        quantite_avant: 100,
        quantite_apres: movementData.type === 'entree' ? 100 + movementData.quantite : 100 - movementData.quantite
      };
      setMockStockMovements([newMovement, ...mockStockMovements]);
      return newMovement;
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
      await simulateDelay();
      const totalStock = mockStockLots.reduce((sum, lot) => sum + lot.quantite, 0);
      const todayMovements = mockStockMovements.filter(m => 
        m.date_creation.startsWith(new Date().toISOString().split('T')[0])
      ).length;
      
      return {
        salesToday: 847500,
        totalStock,
        clientsCount: 143,
        alertsCount: mockStockLots.filter(lot => lot.quantite < (lot.produit?.stock_minimum || 10)).length
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSales = async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay();
      return [
        {
          id: 1,
          montant_total: 3200,
          date_vente: new Date().toISOString(),
          details_vente: [
            { produit: { nom: "Doliprane 1000mg" }, quantite: 2, prix_unitaire: 1600 }
          ]
        },
        {
          id: 2,
          montant_total: 4800,
          date_vente: new Date().toISOString(),
          details_vente: [
            { produit: { nom: "Amoxicilline 500mg" }, quantite: 1, prix_unitaire: 4800 }
          ]
        }
      ];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay();
      const lowStock = mockStockLots.filter(lot => 
        lot.quantite < (lot.produit?.stock_minimum || 10)
      );
      
      return { lowStock };
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
    deleteProduct,
    // Stock
    getStockLots,
    getStockMovements,
    createStockMovement,
    // Sales
    getSales,
    // Alerts
    getAlerts,
    // Dashboard
    getDashboardStats,
  };
};
