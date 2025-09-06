import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';
import { supabase } from '../utils/supabase/client';

export interface PharmacyInfo {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export const usePharmacyData = () => {
  const { profile } = useAuth();
  const [pharmacy, setPharmacy] = useState<PharmacyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPharmacyData = async () => {
      if (!profile?.pharmacy_id) {
        setLoading(false);
        return;
      }

      // Use profile data if available, otherwise fallback to mock data
      setPharmacy({
        id: profile.pharmacy_id,
        nom: profile.pharmacy_name || 'Pharmacie AssPharma',
        ville: 'Dakar', // Cette info pourrait venir du profil aussi
        pays: 'Sénégal',
        adresse: 'Avenue Léopold Sédar Senghor, Dakar',
        telephone: '+221 33 823 45 67',
        email: 'contact@asspharma.sn'
      });
      
      setLoading(false);
    };

    fetchPharmacyData();
  }, [profile?.pharmacy_id, profile?.pharmacy_name]);

  // Fonction helper pour filtrer les requêtes par pharmacy_id
  const getPharmacyFilter = () => {
    return profile?.pharmacy_id ? { pharmacy_id: profile.pharmacy_id } : null;
  };

  // Fonction helper pour ajouter le pharmacy_id aux inserts
  const addPharmacyId = (data: any) => {
    if (!profile?.pharmacy_id) return data;
    return { ...data, pharmacy_id: profile.pharmacy_id };
  };

  return {
    pharmacy,
    pharmacyId: profile?.pharmacy_id,
    loading,
    error,
    getPharmacyFilter,
    addPharmacyId
  };
};
