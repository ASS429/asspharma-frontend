import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  AlertTriangle,
  Calendar,
  BarChart3,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function Reports() {
  // Données pour les graphiques
  const salesData = [
    { mois: "Jan", ca: 2100000, ventes: 156, clients: 89 },
    { mois: "Fév", ca: 1950000, ventes: 142, clients: 82 },
    { mois: "Mar", ca: 2350000, ventes: 178, clients: 94 },
    { mois: "Avr", ca: 2200000, ventes: 165, clients: 87 },
    { mois: "Mai", ca: 2680000, ventes: 189, clients: 102 },
    { mois: "Juin", ca: 2450000, ventes: 171, clients: 95 },
    { mois: "Juil", ca: 2756800, ventes: 203, clients: 108 },
    { mois: "Août", ca: 2920300, ventes: 215, clients: 112 },
    { mois: "Sep", ca: 2524600, ventes: 187, clients: 98 }
  ];

  const categoryData = [
    { name: "Antalgiques", value: 35, color: "#22c55e" },
    { name: "Antibiotiques", value: 25, color: "#3b82f6" },
    { name: "Vitamines", value: 20, color: "#f59e0b" },
    { name: "Dermatologie", value: 12, color: "#8b5cf6" },
    { name: "Autres", value: 8, color: "#6b7280" }
  ];

  const weeklyData = [
    { jour: "Lun", matin: 145000, soir: 89000 },
    { jour: "Mar", matin: 167000, soir: 112000 },
    { jour: "Mer", matin: 134000, soir: 98000 },
    { jour: "Jeu", matin: 189000, soir: 145000 },
    { jour: "Ven", matin: 201000, soir: 167000 },
    { jour: "Sam", matin: 223000, soir: 189000 },
    { jour: "Dim", matin: 112000, soir: 67000 }
  ];

  const topProducts = [
    { nom: "Doliprane 1000mg", ventes: 245, ca: 392000, evolution: 12 },
    { nom: "Paracétamol 500mg", ventes: 189, ca: 132300, evolution: -5 },
    { nom: "Amoxicilline 500mg", ventes: 87, ca: 417600, evolution: 8 },
    { nom: "Vitamine C", ventes: 156, ca: 234000, evolution: 15 },
    { nom: "Aspirine 100mg", ventes: 134, ca: 107200, evolution: -2 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Rapports et Analyses</h1>
        <p className="text-muted-foreground">Analyses des performances et exportations réglementaires</p>
      </div>
      
      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Mensuel</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,524,600 FCFA</div>
            <div className="flex items-center space-x-2 text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+8.3% vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits Vendus</CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <div className="flex items-center space-x-2 text-xs">
              <ArrowUpRight className="w-3 h-3 text-blue-600" />
              <span className="text-blue-600">+12% ce mois</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordonnances</CardTitle>
            <FileText className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <div className="flex items-center space-x-2 text-xs">
              <ArrowDownRight className="w-3 h-3 text-red-600" />
              <span className="text-red-600">-3% ce mois</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Moyen</CardTitle>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13,470 FCFA</div>
            <div className="flex items-center space-x-2 text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+5% vs moyenne</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques Principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution du CA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Évolution du Chiffre d'Affaires
            </CardTitle>
            <CardDescription>Évolution mensuelle du CA et nombre de ventes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'ca' ? formatCurrency(value) : value,
                    name === 'ca' ? 'Chiffre d\'Affaires' : 'Nombre de Ventes'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="ca" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par Catégorie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Ventes par Catégorie
            </CardTitle>
            <CardDescription>Répartition des ventes par type de produit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventes Hebdomadaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Ventes par Jour de la Semaine
            </CardTitle>
            <CardDescription>Comparaison matin vs soir</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jour" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="matin" fill="#3b82f6" name="Matin" />
                <Bar dataKey="soir" fill="#8b5cf6" name="Soir" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendance des Ventes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Tendance Nombre de Ventes
            </CardTitle>
            <CardDescription>Évolution du nombre de transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="ventes" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Produits avec Évolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Produits avec Évolution
          </CardTitle>
          <CardDescription>Produits les plus vendus et leur tendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((produit, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{produit.nom}</p>
                    <p className="text-sm text-muted-foreground">{produit.ventes} unités vendues</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(produit.ca)}</p>
                  <div className="flex items-center gap-1">
                    {produit.evolution > 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs ${produit.evolution > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {produit.evolution > 0 ? '+' : ''}{produit.evolution}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et Surveillance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Alertes et Surveillance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Produits expirés</span>
                <Badge variant="destructive">5 références</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Stock faible</span>
                <Badge variant="secondary">12 produits</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Expire &lt; 30 jours</span>
                <Badge variant="secondary">8 lots</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Clients crédit bloqués</span>
                <Badge variant="destructive">3 comptes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Traçabilité et Conformité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Produits expirés détruits</span>
                <Badge variant="destructive">23 unités</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Lots tracés</span>
                <Badge variant="default">100% conformité</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ordonnances archivées</span>
                <Badge variant="outline">234 fichiers</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Audits réalisés</span>
                <Badge variant="default">12 ce mois</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exports Réglementaires */}
      <Card>
        <CardHeader>
          <CardTitle>Exports pour Autorités Sanitaires</CardTitle>
          <CardDescription>
            Rapports officiels requis par la réglementation pharmaceutique sénégalaise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Journal des Ventes</span>
              <span className="text-xs text-muted-foreground">CSV/PDF</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Registre Stupéfiants</span>
              <span className="text-xs text-muted-foreground">PDF sécurisé</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Destructions</span>
              <span className="text-xs text-muted-foreground">Rapport officiel</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Mouvements Stock</span>
              <span className="text-xs text-muted-foreground">Traçabilité complète</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Ordonnances</span>
              <span className="text-xs text-muted-foreground">Archive mensuelle</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Audit Complet</span>
              <span className="text-xs text-muted-foreground">Rapport DPM</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
