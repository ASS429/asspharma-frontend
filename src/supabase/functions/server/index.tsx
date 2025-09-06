import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as kv from "./kv_store.tsx";
import { getUserProfile } from "./profile.tsx";
const app = new Hono();

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware pour vérifier l'authentification
async function verifyAuth(c, next) {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return c.json({ error: 'Token d\'authentification requis' }, 401);
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return c.json({ error: 'Token invalide' }, 401);
    }
    
    c.set('user', user);
    await next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return c.json({ error: 'Erreur d\'authentification' }, 401);
  }
}

// Helper function to get pharmacy_id from user
async function getPharmacyIdFromUser(userId: string) {
  const profile = await getUserProfile(userId);
  if (!profile || !profile.pharmacy_id) {
    throw new Error('Aucune pharmacie associée au profil utilisateur');
  }
  return profile.pharmacy_id;
}

// Helper function to get user info by ID
async function getUserById(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  return data.user;
}

// Health check endpoint
app.get("/make-server-dd08096e/health", (c) => {
  return c.json({ status: "ok" });
});

// Get user profile endpoint to avoid RLS recursion
app.post("/make-server-dd08096e/profile", async (c) => {
  try {
    const { userId } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const profile = await getUserProfile(userId);
    return c.json({ data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({ error: error.message }, 500);
  }
});

// RPC function to get user profile (alternative endpoint)
app.post("/make-server-dd08096e/rpc/get_user_profile", async (c) => {
  try {
    const { user_id } = await c.req.json();
    
    if (!user_id) {
      return c.json({ error: "user_id is required" }, 400);
    }

    const profile = await getUserProfile(user_id);
    return c.json(profile);
  } catch (error) {
    console.error("RPC error fetching profile:", error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS PRODUITS ===

// Obtenir tous les produits de la pharmacie
app.get("/make-server-dd08096e/products", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        stock_lots (
          id,
          numero_lot,
          quantite,
          date_expiration,
          date_entree,
          prix_achat,
          fournisseur,
          statut
        )
      `)
      .eq('pharmacy_id', pharmacyId);
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Ajouter un nouveau produit
app.post("/make-server-dd08096e/products", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const productData = await c.req.json();
    
    const { data, error } = await supabase
      .from('produits')
      .insert({ ...productData, pharmacy_id: pharmacyId })
      .select();
    
    if (error) throw error;
    
    return c.json({ data: data[0] });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Mettre à jour un produit
app.put("/make-server-dd08096e/products/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const productId = c.req.param('id');
    const productData = await c.req.json();
    
    const { data, error } = await supabase
      .from('produits')
      .update(productData)
      .eq('id', productId)
      .eq('pharmacy_id', pharmacyId)
      .select();
    
    if (error) throw error;
    
    return c.json({ data: data[0] });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Supprimer un produit
app.delete("/make-server-dd08096e/products/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const productId = c.req.param('id');
    
    const { error } = await supabase
      .from('produits')
      .delete()
      .eq('id', productId)
      .eq('pharmacy_id', pharmacyId);
    
    if (error) throw error;
    
    return c.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS STOCK ===

// Obtenir tous les lots de stock
app.get("/make-server-dd08096e/stock/lots", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const { data, error } = await supabase
      .from('stock_lots')
      .select(`
        *,
        produit:produits(nom, dci, dosage, forme, laboratoire)
      `)
      .eq('pharmacy_id', pharmacyId);
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération des lots:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Ajouter un nouveau mouvement de stock
app.post("/make-server-dd08096e/stock/movements", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const movementData = await c.req.json();
    
    // Ajouter le mouvement de stock
    const { data: movement, error: movementError } = await supabase
      .from('mouvements_stock')
      .insert({ 
        ...movementData, 
        pharmacy_id: pharmacyId,
        utilisateur_id: user.id,
        date_creation: new Date().toISOString()
      })
      .select();
    
    if (movementError) throw movementError;
    
    // Mettre à jour le stock du lot correspondant
    if (movementData.type === 'entree') {
      await supabase.rpc('increment_stock', {
        lot_id: movementData.lot_id,
        quantity: movementData.quantite
      });
    } else if (movementData.type === 'sortie') {
      await supabase.rpc('decrement_stock', {
        lot_id: movementData.lot_id,
        quantity: movementData.quantite
      });
    }
    
    return c.json({ data: movement[0] });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du mouvement:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Obtenir l'historique des mouvements de stock
app.get("/make-server-dd08096e/stock/movements", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const { data, error } = await supabase
      .from('mouvements_stock')
      .select(`
        *,
        produit:produits(nom)
      `)
      .eq('pharmacy_id', pharmacyId)
      .order('date_creation', { ascending: false });
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération des mouvements:', error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS VENTES ===

// Créer une nouvelle vente
app.post("/make-server-dd08096e/sales", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const saleData = await c.req.json();
    
    // Créer la vente
    const { data: sale, error: saleError } = await supabase
      .from('ventes')
      .insert({
        ...saleData,
        pharmacy_id: pharmacyId,
        vendeur_id: user.id,
        date_vente: new Date().toISOString()
      })
      .select();
    
    if (saleError) throw saleError;
    
    // Ajouter les détails de vente et mettre à jour le stock
    for (const item of saleData.items) {
      // Ajouter le détail de vente
      await supabase
        .from('details_vente')
        .insert({
          vente_id: sale[0].id,
          produit_id: item.produit_id,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire,
          pharmacy_id: pharmacyId
        });
      
      // Créer un mouvement de sortie de stock
      await supabase
        .from('mouvements_stock')
        .insert({
          produit_id: item.produit_id,
          type: 'sortie',
          motif: 'vente',
          quantite: item.quantite,
          utilisateur_id: user.id,
          vente_id: sale[0].id,
          pharmacy_id: pharmacyId,
          date_creation: new Date().toISOString()
        });
    }
    
    return c.json({ data: sale[0] });
  } catch (error) {
    console.error('Erreur lors de la création de la vente:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Obtenir l'historique des ventes
app.get("/make-server-dd08096e/sales", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const { data, error } = await supabase
      .from('ventes')
      .select(`
        *,
        details_vente (
          *,
          produit:produits(nom)
        ),
        client:clients(prenom, nom)
      `)
      .eq('pharmacy_id', pharmacyId)
      .order('date_vente', { ascending: false });
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS CLIENTS ===

// Obtenir tous les clients
app.get("/make-server-dd08096e/clients", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('pharmacy_id', pharmacyId);
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Ajouter un nouveau client
app.post("/make-server-dd08096e/clients", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const clientData = await c.req.json();
    
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...clientData, pharmacy_id: pharmacyId })
      .select();
    
    if (error) throw error;
    
    return c.json({ data: data[0] });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS ORDONNANCES ===

// Obtenir toutes les ordonnances
app.get("/make-server-dd08096e/prescriptions", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const { data, error } = await supabase
      .from('ordonnances')
      .select(`
        *,
        details_ordonnance (
          *,
          produit:produits(nom, dci)
        )
      `)
      .eq('pharmacy_id', pharmacyId)
      .order('date_ordonnance', { ascending: false });
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération des ordonnances:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Ajouter une nouvelle ordonnance
app.post("/make-server-dd08096e/prescriptions", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    const prescriptionData = await c.req.json();
    
    const { data, error } = await supabase
      .from('ordonnances')
      .insert({ ...prescriptionData, pharmacy_id: pharmacyId })
      .select();
    
    if (error) throw error;
    
    return c.json({ data: data[0] });
  } catch (error) {
    console.error('Erreur lors de la création de l\'ordonnance:', error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS ALERTES ===

// Obtenir les alertes de stock faible et périmés
app.get("/make-server-dd08096e/alerts", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    // Alertes stock faible - using a simpler approach
    const { data: lowStock, error: lowStockError } = await supabase
      .from('stock_lots')
      .select(`
        *,
        produit:produits(nom, stock_minimum)
      `)
      .eq('pharmacy_id', pharmacyId)
      .lt('quantite', 10); // Simple threshold for now
    
    if (lowStockError) throw lowStockError;
    
    // Alertes expiration proche (30 jours)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data: expiringSoon, error: expiringError } = await supabase
      .from('stock_lots')
      .select(`
        *,
        produit:produits(nom)
      `)
      .eq('pharmacy_id', pharmacyId)
      .lt('date_expiration', thirtyDaysFromNow.toISOString())
      .eq('statut', 'actif');
    
    if (expiringError) throw expiringError;
    
    return c.json({ 
      data: {
        lowStock,
        expiringSoon
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    return c.json({ error: error.message }, 500);
  }
});

// === ENDPOINTS RAPPORTS ===

// Obtenir les statistiques du dashboard
app.get("/make-server-dd08096e/dashboard/stats", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const pharmacyId = await getPharmacyIdFromUser(user.id);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Ventes du jour
    const { data: salesToday, error: salesError } = await supabase
      .from('ventes')
      .select('montant_total')
      .eq('pharmacy_id', pharmacyId)
      .gte('date_vente', today);
    
    if (salesError) throw salesError;
    
    // Stock total
    const { data: stockData, error: stockError } = await supabase
      .from('stock_lots')
      .select('quantite')
      .eq('pharmacy_id', pharmacyId)
      .eq('statut', 'actif');
    
    if (stockError) throw stockError;
    
    // Nombre de clients
    const { count: clientsCount, error: clientsError } = await supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .eq('pharmacy_id', pharmacyId);
    
    if (clientsError) throw clientsError;
    
    // Alertes de stock
    const { count: alertsCount, error: alertsError } = await supabase
      .from('stock_lots')
      .select('id', { count: 'exact' })
      .eq('pharmacy_id', pharmacyId)
      .lt('quantite', 10); // Seuil d'alerte
    
    if (alertsError) throw alertsError;
    
    const totalSalesToday = salesToday.reduce((sum, sale) => sum + (sale.montant_total || 0), 0);
    const totalStock = stockData.reduce((sum, lot) => sum + (lot.quantite || 0), 0);
    
    return c.json({
      data: {
        salesToday: totalSalesToday,
        totalStock,
        clientsCount,
        alertsCount
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
