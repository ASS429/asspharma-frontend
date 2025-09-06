import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/SimpleAuthContext";
import { NavigationBranding } from "./PharmacyBranding";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  FileText,
  CreditCard,
  Bell,
  Truck,
  DollarSign,
  Shield,
  LogOut
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home },
    { id: 'alerts', label: 'Alertes', icon: Bell, badge: 3 },
    { id: 'products', label: 'Produits & Rayons', icon: Package },
    { id: 'stock', label: 'Gestion Stock', icon: Package },
    { id: 'sales', label: 'Ventes', icon: ShoppingCart },
    { id: 'prescriptions', label: 'Ordonnances', icon: FileText },
    { id: 'credits', label: 'Crédits Clients', icon: CreditCard },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'deliveries', label: 'Livraisons', icon: Truck, badge: 1 },
    { id: 'ipm', label: 'IPM & Tiers Payant', icon: Shield },
    { id: 'cash', label: 'Caisse', icon: DollarSign },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary-foreground rotate-45" />
          </div>
          <NavigationBranding />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="text-xs h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs text-primary-foreground">
              {profile?.nom ? profile.nom.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AD'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.nom || 'Admin'}</p>
            <p className="text-xs text-muted-foreground">Pharmacien</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
