import { useAuth } from '../contexts/SimpleAuthContext';
import { supabase } from '../utils/supabase/client';

/**
 * Hook pour garantir l'isolation des données par pharmacie
 * Toutes les requêtes doivent être filtrées par pharmacy_id
 */
export const usePharmacyFilter = () => {
  const { profile } = useAuth();

  // Fonction pour obtenir le filtre de pharmacie
  const getPharmacyFilter = () => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    return { pharmacy_id: profile.pharmacy_id };
  };

  // Fonction pour ajouter pharmacy_id aux données à insérer
  const addPharmacyId = <T extends Record<string, any>>(data: T): T & { pharmacy_id: string } => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    return { ...data, pharmacy_id: profile.pharmacy_id };
  };

  // Fonction pour ajouter pharmacy_id à un tableau de données
  const addPharmacyIdToArray = <T extends Record<string, any>>(dataArray: T[]): (T & { pharmacy_id: string })[] => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    return dataArray.map(data => ({ ...data, pharmacy_id: profile.pharmacy_id }));
  };

  // Wrapper pour les requêtes SELECT avec filtre automatique
  const selectWithPharmacyFilter = (table: string) => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    return supabase.from(table).select('*').eq('pharmacy_id', profile.pharmacy_id);
  };

  // Wrapper pour les requêtes INSERT avec pharmacy_id automatique
  const insertWithPharmacyId = (table: string, data: any) => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    const dataWithPharmacyId = Array.isArray(data) 
      ? addPharmacyIdToArray(data)
      : addPharmacyId(data);
    
    return supabase.from(table).insert(dataWithPharmacyId);
  };

  // Wrapper pour les requêtes UPDATE avec filtre automatique
  const updateWithPharmacyFilter = (table: string, data: any, filters: Record<string, any>) => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    
    let query = supabase.from(table).update(data).eq('pharmacy_id', profile.pharmacy_id);
    
    // Ajouter les filtres supplémentaires
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    return query;
  };

  // Wrapper pour les requêtes DELETE avec filtre automatique
  const deleteWithPharmacyFilter = (table: string, filters: Record<string, any>) => {
    if (!profile?.pharmacy_id) {
      throw new Error('Aucune pharmacie associée au profil utilisateur');
    }
    
    let query = supabase.from(table).delete().eq('pharmacy_id', profile.pharmacy_id);
    
    // Ajouter les filtres supplémentaires
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    return query;
  };

  return {
    pharmacyId: profile?.pharmacy_id,
    pharmacyName: profile?.pharmacy_name,
    isPharmacySet: !!profile?.pharmacy_id,
    getPharmacyFilter,
    addPharmacyId,
    addPharmacyIdToArray,
    selectWithPharmacyFilter,
    insertWithPharmacyId,
    updateWithPharmacyFilter,
    deleteWithPharmacyFilter
  };
};
