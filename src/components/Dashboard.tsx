import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/SimpleAuthContext";
import { usePharmacyData } from "../hooks/usePharmacyData";
import { useMockPharmacyApi } from "../hooks/useMockPharmacyApi";
import { WelcomeMessage } from "./PharmacyBranding";
import { toast } from "sonner";
import { 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Building
} from "lucide-react";

export default function Dashboard() {
  const { profile } = useAuth();
  const { pharmacy } = usePharmacyData();
  const { getDashboardStats, getSales, getAlerts, loading } = useMockPharmacyApi();
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [alerts, setAlerts] = useState(null);

  // Charger les données du dashboard
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, salesData, alertsData] = await Promise.all([
        getDashboardStats(),
        getSales(),
        getAlerts()
      ]);

      setStats(statsData);
      setRecentSales(salesData?.slice(0, 4) || []);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données du dashboard');
      // Valeurs par défaut en cas d'erreur
      setStats({
        salesToday: 0,
        totalStock: 0,
        clientsCount: 0,
        alertsCount: 0
      });
      setRecentSales([]);
      setAlerts({ lowStock: [] });
    }
  };

  const defaultStats = [
    {
      title: "Ventes du Jour",
      value: "847 500 FCFA",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Médicaments en Stock",
      value: "2,847",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Clients Aujourd'hui",
      value: "143",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Alertes Stock",
      value: "12",
      change: "critique",
      trend: "alert",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const defaultRecentSales = [
    { id: 1, medication: "Doliprane 1000mg", quantity: 2, price: "3,200 FCFA", time: "09:45" },
    { id: 2, medication: "Amoxicilline 500mg", quantity: 1, price: "4,800 FCFA", time: "09:32" },
    { id: 3, medication: "Paracétamol 500mg", quantity: 3, price: "2,100 FCFA", time: "09:20" },
    { id: 4, medication: "Vitamine C", quantity: 1, price: "1,500 FCFA", time: "09:15" },
  ];

  const defaultLowStock = [
    { name: "Insuline Rapid", stock: 3, minimum: 10, urgency: "high" },
    { name: "Aspirine 100mg", stock: 8, minimum: 20, urgency: "medium" },
    { name: "Oméprazole 20mg", stock: 12, minimum: 25, urgency: "low" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tableau de Bord</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Mercredi, 3 Septembre 2025
            </div>
            {pharmacy && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {pharmacy.nom}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Historique
          </Button>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-green-500 to-green-600">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1582146804102-b4a01b0a51ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwYm90dGxlc3xlbnwxfHx8fDE3NTY3Mjc1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Pharmacie moderne"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-500/90" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <WelcomeMessage />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(stats ? [
          {
            title: "Ventes du Jour",
            value: `${stats.salesToday?.toLocaleString() || 0} FCFA`,
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "text-green-600"
          },
          {
            title: "Médicaments en Stock",
            value: stats.totalStock?.toLocaleString() || "0",
            change: "-2.1%",
            trend: "down",
            icon: Package,
            color: "text-blue-600"
          },
          {
            title: "Clients Enregistrés",
            value: stats.clientsCount?.toString() || "0",
            change: "+8.3%",
            trend: "up",
            icon: Users,
            color: "text-purple-600"
          },
          {
            title: "Alertes Stock",
            value: stats.alertsCount?.toString() || "0",
            change: "critique",
            trend: "alert",
            icon: AlertTriangle,
            color: "text-red-600"
          }
        ] : defaultStats).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  <Badge 
                    variant={
                      stat.trend === "up" ? "default" : 
                      stat.trend === "down" ? "secondary" : 
                      "destructive"
                    }
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes Récentes</CardTitle>
            <CardDescription>Dernières transactions de la journée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentSales.length > 0 ? recentSales : defaultRecentSales).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b border-border last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.medication || sale.produit?.nom || 'Produit'}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {sale.quantity || sale.quantite_totale}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {sale.price || `${sale.montant_total?.toLocaleString()} FCFA`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.time || new Date(sale.date_vente).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Alertes Stock Faible
            </CardTitle>
            <CardDescription>Médicaments nécessitant un réapprovisionnement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(alerts?.lowStock && alerts.lowStock.length > 0 ? alerts.lowStock : defaultLowStock).map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border last:border-b-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-medium">{item.name || item.produit?.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {item.stock || item.quantite} / Min: {item.minimum || item.produit?.stock_minimum}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      (item.urgency === "high" || (item.quantite && item.quantite < 5)) ? "destructive" : 
                      (item.urgency === "medium" || (item.quantite && item.quantite < 15)) ? "secondary" : 
                      "outline"
                    }
                  >
                    {(item.urgency === "high" || (item.quantite && item.quantite < 5)) ? "Urgent" : 
                     (item.urgency === "medium" || (item.quantite && item.quantite < 15)) ? "Moyen" : "Bas"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Voir Tous les Stocks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
