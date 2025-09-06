import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { 
  Search, 
  Plus, 
  Users, 
  Phone, 
  Mail,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  History,
  DollarSign,
  Calendar,
  UserPlus
} from "lucide-react";

interface Customer {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse: string;
  dateNaissance?: string;
  profession?: string;
  numeroSecuriteSociale?: string;
  limiteCredit: number;
  creditActuel: number;
  derniereVisite: string;
  totalAchats: number;
  nombreVisites: number;
  statut: 'actif' | 'inactif' | 'bloque';
  typeClient: 'particulier' | 'entreprise' | 'institution';
  historiquePaiements: PaymentHistory[];
}

interface PaymentHistory {
  date: string;
  montant: number;
  type: 'paiement' | 'achat';
  description: string;
  soldeApres: number;
}

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const customers: Customer[] = [
    {
      id: 1,
      nom: "Diallo",
      prenom: "Aminata",
      telephone: "+221 77 123 45 67",
      email: "aminata.diallo@email.com",
      adresse: "Rue 10, Fann Résidence, Dakar",
      dateNaissance: "1985-03-15",
      profession: "Enseignante",
      limiteCredit: 75000,
      creditActuel: 45600,
      derniereVisite: "2025-08-30",
      totalAchats: 285400,
      nombreVisites: 23,
      statut: 'actif',
      typeClient: 'particulier',
      historiquePaiements: [
        { date: "2025-08-30", montant: -12500, type: 'achat', description: "Achat médicaments", soldeApres: 45600 },
        { date: "2025-08-25", montant: 20000, type: 'paiement', description: "Paiement crédit", soldeApres: 33100 },
      ]
    },
    {
      id: 2,
      nom: "Sy",
      prenom: "Mamadou",
      telephone: "+221 70 987 65 43",
      adresse: "Avenue Cheikh Anta Diop, Liberté 6",
      profession: "Commerçant",
      limiteCredit: 100000,
      creditActuel: 0,
      derniereVisite: "2025-09-01",
      totalAchats: 156800,
      nombreVisites: 15,
      statut: 'actif',
      typeClient: 'particulier',
      historiquePaiements: [
        { date: "2025-09-01", montant: -8900, type: 'achat', description: "Vitamines", soldeApres: 0 },
        { date: "2025-09-01", montant: 8900, type: 'paiement', description: "Paiement comptant", soldeApres: 0 },
      ]
    },
    {
      id: 3,
      nom: "Ndiaye",
      prenom: "Fatou",
      telephone: "+221 76 555 44 33",
      email: "fatou.ndiaye@entreprise.com",
      adresse: "Zone B, Almadies, Dakar",
      profession: "Directrice RH",
      limiteCredit: 150000,
      creditActuel: 89200,
      derniereVisite: "2025-08-28",
      totalAchats: 423600,
      nombreVisites: 31,
      statut: 'actif',
      typeClient: 'particulier',
      historiquePaiements: [
        { date: "2025-08-28", montant: -25400, type: 'achat', description: "Ordonnance famille", soldeApres: 89200 },
        { date: "2025-08-20", montant: 50000, type: 'paiement', description: "Virement bancaire", soldeApres: 63800 },
      ]
    },
    {
      id: 4,
      nom: "Ba",
      prenom: "Omar",
      telephone: "+221 78 222 11 00",
      adresse: "Parcelles Assainies, Unité 15",
      limiteCredit: 50000,
      creditActuel: 50000,
      derniereVisite: "2025-08-15",
      totalAchats: 89400,
      nombreVisites: 12,
      statut: 'bloque',
      typeClient: 'particulier',
      historiquePaiements: [
        { date: "2025-08-15", montant: -15000, type: 'achat', description: "Médicaments", soldeApres: 50000 },
        { date: "2025-07-30", montant: -35000, type: 'achat', description: "Traitement diabète", soldeApres: 35000 },
      ]
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    `${customer.prenom} ${customer.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.telephone.includes(searchTerm)
  );

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'default';
      case 'inactif': return 'secondary';
      case 'bloque': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif';
      case 'inactif': return 'Inactif';
      case 'bloque': return 'Bloqué';
      default: return 'Inconnu';
    }
  };

  const getCreditStatus = (customer: Customer) => {
    const percentage = (customer.creditActuel / customer.limiteCredit) * 100;
    if (percentage >= 100) return { color: 'destructive', text: 'Limite atteinte' };
    if (percentage >= 80) return { color: 'secondary', text: 'Limite proche' };
    return { color: 'default', text: 'Normal' };
  };

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Clients</h1>
          <p className="text-muted-foreground">
            {filteredCustomers.length} client{filteredCustomers.length > 1 ? 's' : ''} trouvé{filteredCustomers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau client</DialogTitle>
              <DialogDescription>
                Créer un compte client pour les ventes à crédit et le suivi personnalisé.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input id="prenom" placeholder="Prénom du client" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input id="nom" placeholder="Nom de famille" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input id="telephone" placeholder="+221 XX XXX XX XX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemple.com" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="adresse">Adresse *</Label>
                <Input id="adresse" placeholder="Adresse complète" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input id="dateNaissance" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" placeholder="Profession" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limiteCredit">Limite de crédit (FCFA)</Label>
                <Input id="limiteCredit" type="number" placeholder="Limite autorisée" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer le Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">clients enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédit Total</CardTitle>
            <CreditCard className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.reduce((acc, c) => acc + c.creditActuel, 0).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">crédits en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.statut === 'actif').length}
            </div>
            <p className="text-xs text-muted-foreground">clients actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Bloqués</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {customers.filter(c => c.statut === 'bloque').length}
            </div>
            <p className="text-xs text-muted-foreground">limite atteinte</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou téléphone..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const creditStatus = getCreditStatus(customer);
          return (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {customer.prenom[0]}{customer.nom[0]}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {customer.prenom} {customer.nom}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.telephone}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={getStatusColor(customer.statut)} className="text-xs">
                      {getStatusText(customer.statut)}
                    </Badge>
                    <Badge variant={creditStatus.color} className="text-xs">
                      {creditStatus.text}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Address */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{customer.adresse}</span>
                </div>

                {/* Credit Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Crédit actuel:</span>
                    <span className="font-medium text-red-600">
                      {customer.creditActuel.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Limite:</span>
                    <span>{customer.limiteCredit.toLocaleString()} FCFA</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        customer.creditActuel >= customer.limiteCredit ? 'bg-red-500' :
                        customer.creditActuel >= customer.limiteCredit * 0.8 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min((customer.creditActuel / customer.limiteCredit) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total achats</p>
                    <p className="font-medium text-green-600">
                      {customer.totalAchats.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Visites</p>
                    <p className="font-medium">{customer.nombreVisites}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Dernière visite: </span>
                  <span>{new Date(customer.derniereVisite).toLocaleDateString('fr-FR')}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openCustomerDetails(customer)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {selectedCustomer.prenom} {selectedCustomer.nom}
                </DialogTitle>
                <DialogDescription>
                  Informations détaillées et historique du client
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.telephone}</span>
                    </div>
                  </div>
                  {selectedCustomer.email && (
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 col-span-2">
                    <Label>Adresse</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.adresse}</span>
                    </div>
                  </div>
                  {selectedCustomer.profession && (
                    <div className="space-y-2">
                      <Label>Profession</Label>
                      <span>{selectedCustomer.profession}</span>
                    </div>
                  )}
                  {selectedCustomer.dateNaissance && (
                    <div className="space-y-2">
                      <Label>Date de naissance</Label>
                      <span>{new Date(selectedCustomer.dateNaissance).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {/* Credit Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Situation de Crédit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Crédit actuel</p>
                        <p className="text-xl font-bold text-red-600">
                          {selectedCustomer.creditActuel.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Limite autorisée</p>
                        <p className="text-xl font-bold">
                          {selectedCustomer.limiteCredit.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Crédit disponible</p>
                        <p className="text-xl font-bold text-green-600">
                          {(selectedCustomer.limiteCredit - selectedCustomer.creditActuel).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Historique des Paiements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCustomer.historiquePaiements.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              payment.type === 'paiement' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {payment.type === 'paiement' ? 
                                <DollarSign className="w-4 h-4 text-green-600" /> :
                                <Calendar className="w-4 h-4 text-red-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              payment.type === 'paiement' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {payment.type === 'paiement' ? '+' : ''}{payment.montant.toLocaleString()} FCFA
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Solde: {payment.soldeApres.toLocaleString()} FCFA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Nouvelle Vente à Crédit
                  </Button>
                  <Button variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Enregistrer Paiement
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun client trouvé</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucun client ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
