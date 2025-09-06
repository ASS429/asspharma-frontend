import { useAuth } from "../contexts/SimpleAuthContext";
import { usePharmacyData } from "../hooks/usePharmacyData";

interface PharmacyBrandingProps {
  showSlogan?: boolean;
  showPharmacyName?: boolean;
  showUserName?: boolean;
  fallbackName?: string;
  className?: string;
}

export default function PharmacyBranding({
  showSlogan = true,
  showPharmacyName = true,
  showUserName = false,
  fallbackName = "AssPharma",
  className = ""
}: PharmacyBrandingProps) {
  const { profile } = useAuth();
  const { pharmacy } = usePharmacyData();

  const pharmacyName = pharmacy?.nom || profile?.pharmacy_name || fallbackName;
  const userName = profile?.nom;

  return (
    <div className={className}>
      {showPharmacyName && (
        <h1 className="text-lg font-semibold text-primary">
          {pharmacyName}
        </h1>
      )}
      {showUserName && userName && (
        <p className="text-sm text-muted-foreground">
          Dr. {userName}
        </p>
      )}
      {showSlogan && (
        <p className="text-sm text-muted-foreground italic">
          l'As dans la gestion de la pharmacie
        </p>
      )}
    </div>
  );
}

/**
 * Composant spécialisé pour les pages d'authentification
 * Affiche toujours "AssPharma" avec le slogan
 */
export function AuthPageBranding({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-white font-bold">A</span>
      </div>
      <h1 className="text-3xl font-bold text-primary">AssPharma</h1>
      <p className="text-muted-foreground italic">l'As dans la gestion de la pharmacie</p>
    </div>
  );
}

/**
 * Composant pour l'en-tête de navigation
 */
export function NavigationBranding() {
  const { profile } = useAuth();
  const { pharmacy } = usePharmacyData();

  const pharmacyName = pharmacy?.nom || profile?.pharmacy_name || "AssPharma";

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary">
        {pharmacyName}
      </h1>
      <p className="text-sm text-muted-foreground">l'As dans la gestion de la pharmacie</p>
    </div>
  );
}

/**
 * Composant pour les messages de bienvenue personnalisés
 */
export function WelcomeMessage({ 
  className = "",
  size = "large" 
}: { 
  className?: string;
  size?: "small" | "large";
}) {
  const { profile } = useAuth();
  const { pharmacy } = usePharmacyData();

  const pharmacyName = pharmacy?.nom || profile?.pharmacy_name || "AssPharma";
  const userName = profile?.nom;
  const userTitle = userName ? `Dr. ${userName}` : "Pharmacien";

  if (size === "small") {
    return (
      <div className={className}>
        <h2 className="text-xl font-semibold">
          Bienvenue dans {pharmacyName}
        </h2>
        <p className="text-muted-foreground">
          {userTitle} • Votre espace de gestion pharmaceutique
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-3xl font-bold mb-2">
        Bienvenue dans {pharmacyName}
      </h2>
      <p className="text-lg opacity-90">
        {userTitle} • {pharmacy?.ville || 'Votre solution moderne de gestion pharmaceutique'}
      </p>
    </div>
  );
}
