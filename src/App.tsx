import { useState } from "react";
import { AuthProvider } from "./contexts/SimpleAuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import StockManagement from "./components/StockManagement";
import Sales from "./components/Sales";
import PrescriptionManagement from "./components/PrescriptionManagement";
import CreditManagement from "./components/CreditManagement";
import AlertManagement from "./components/AlertManagement";
import CustomerManagement from "./components/CustomerManagement";
import DeliveryManagement from "./components/DeliveryManagement";
import CashManagement from "./components/CashManagement";
import IPMManagement from "./components/IPMManagement";
import Reports from "./components/Reports";
import CommunicationSettings from "./components/CommunicationSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/toaster";
import { 
  Users, 
  BarChart3, 
  Settings, 
  Calendar,
  FileText,
  Phone,
  Mail,
  Shield,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MessageCircle,
  Database
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <ProductManagement />;
      case "stock":
        return <StockManagement />;
      case "sales":
        return <Sales />;
      case "prescriptions":
        return <PrescriptionManagement />;
      case "credits":
        return <CreditManagement />;
      case "alerts":
        return <AlertManagement />;
      case "deliveries":
        return <DeliveryManagement />;
      case "cash":
        return <CashManagement />;
      case "ipm":
        return <IPMManagement />;
      case "users":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">Gestion des Utilisateurs</h1>
              <p className="text-muted-foreground">Comptes utilisateurs et gestion des rôles</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pharmaciens</CardTitle>
                  <UserCheck className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">accès complet</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assistants</CardTitle>
                  <Users className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">accès limité</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                  <Activity className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">connectés cette semaine</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                  <Shield className="w-4 h-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">niveaux d'accès</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  name: "Dr. Ndiaye", 
                  role: "Pharmacien Titulaire", 
                  permissions: "Accès complet", 
                  lastLogin: "Aujourd'hui 09:30",
                  status: "active" 
                },
                { 
                  name: "Marie Sow", 
                  role: "Assistant Pharmacien", 
                  permissions: "Ventes, Stock", 
                  lastLogin: "Aujourd'hui 08:15",
                  status: "active" 
                },
                { 
                  name: "Abdou Fall", 
                  role: "Assistant Pharmacien", 
                  permissions: "Ventes", 
                  lastLogin: "Hier 18:45",
                  status: "active" 
                },
                { 
                  name: "Fatou Ba", 
                  role: "Stagiaire", 
                  permissions: "Consultation", 
                  lastLogin: "Il y a 3 jours",
                  status: "inactive" 
                },
                { 
                  name: "Omar Dieng", 
                  role: "Assistant Pharmacien", 
                  permissions: "Ventes, Ordonnances", 
                  lastLogin: "Aujourd'hui 10:20",
                  status: "active" 
                }
              ].map((user, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <CardDescription>{user.role}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Permissions: </span>
                      <span className="font-medium">{user.permissions}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Dernière connexion: </span>
                      <span>{user.lastLogin}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Shield className="w-4 h-4 mr-2" />
                        Permissions
                      </Button>
                      <Button variant={user.status === 'active' ? 'secondary' : 'default'} size="sm">
                        {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "customers":
        return <CustomerManagement />;
      case "reports":
        return <Reports />;
      case "settings":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">Paramètres</h1>
              <p className="text-muted-foreground">Configuration de l'application</p>
            </div>
            
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="communications" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Communications
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Base de Données
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations de la Pharmacie</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Nom de la pharmacie</label>
                        <p className="text-sm text-muted-foreground mt-1">AssPharma - Pharmacie Moderne Dakar</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Slogan</label>
                        <p className="text-sm text-primary font-medium mt-1">l'As dans la gestion de la pharmacie</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Adresse</label>
                        <p className="text-sm text-muted-foreground mt-1">Avenue Léopold Sédar Senghor, Dakar</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">+221 33 823 45 67</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">contact@asspharma.sn</span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier Informations
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Système</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Notifications de stock</span>
                        <Badge variant="default">Activées</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sauvegarde automatique</span>
                        <Badge variant="default">Activée</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Synchronisation cloud</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Version</span>
                        <Badge variant="outline">v1.2.0</Badge>
                      </div>
                      <Button className="w-full mt-4">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres Avancés
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sécurité et Conformité</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Chiffrement des données</span>
                        <Badge variant="default">
                          <Shield className="w-3 h-3 mr-1" />
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Audit des actions</span>
                        <Badge variant="default">Activé</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conformité DPM</span>
                        <Badge variant="default">Conforme</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sauvegarde des ordonnances</span>
                        <Badge variant="default">Automatique</Badge>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Audit de Sécurité
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Licences et Autorisations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Numéro d'autorisation d'ouverture</label>
                        <p className="text-sm text-muted-foreground">AO-DK-2024-001234</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Licence logiciel</label>
                        <p className="text-sm text-muted-foreground">AssPharma Pro - Licence validée</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiration</label>
                        <p className="text-sm text-muted-foreground">31 Décembre 2025</p>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Renouveler Licence
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="communications">
                <CommunicationSettings />
              </TabsContent>

              <TabsContent value="database" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      Base de Données Supabase
                    </CardTitle>
                    <CardDescription>
                      Configuration et gestion de la base de données
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status de connexion</span>
                      <Badge variant="default">
                        <Shield className="w-3 h-3 mr-1" />
                        Connecté
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taille de la base</span>
                      <span className="text-sm font-medium">247 MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dernière sauvegarde</span>
                      <span className="text-sm font-medium">Il y a 2 heures</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Niveau de sécurité</span>
                      <Badge variant="default">RLS Activé</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Database className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Optimiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques des Données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">2,847</div>
                        <p className="text-sm text-muted-foreground">Produits</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">15,234</div>
                        <p className="text-sm text-muted-foreground">Ventes</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">892</div>
                        <p className="text-sm text-muted-foreground">Clients</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">1,456</div>
                        <p className="text-sm text-muted-foreground">Ordonnances</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="size-full flex bg-background">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
          <Toaster />
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
