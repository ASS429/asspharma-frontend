import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { 
  Search, 
  Plus, 
  CreditCard, 
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  TrendingUp,
  TrendingDown,
  History,
  Eye,
  Send
} from "lucide-react";

interface ClientCredit {
  id: number;
  client: {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    adresse?: string;
    dateInscription: string;
  };
  limiteCreditAutorisee: number;
  soldeDette: number;
  nombreVentesCredit: number;
  derniereVente: string;
  dernierPaiement?: string;
  statut: 'actif' | 'bloque' | 'surveille';
  historiqueDettes: Array<{
    id: number;
    numeroVente: string;
    montant: number;
    dateVente: string;
    montantPaye: number;
    statutPaiement: 'non_paye' | 'partiellement_paye' | 'entierement_paye';
    echeance?: string;
    commentaire?: string;
  }>;
  historiquesPaiements: Array<{
    id: number;
    montant: number;
    datePaiement: string;
    modePaiement: string;
    reference?: string;
    commentaire?: string;
    operateur: string;
  }>;
}

export default function CreditManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("tous");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientCredit | null>(null);

  const clientsCredit: ClientCredit[] = [
    {
      id: 1,
      client: {
        nom: "Diallo",
        prenom: "Aminata",
        telephone: "+221 77 123 45 67",
        email: "aminata.diallo@email.com",
        adresse: "Parcelles Assainies, Dakar",
        dateInscription: "2024-03-15"
      },
      limiteCreditAutorisee: 50000,
      soldeDette: 23400,
      nombreVentesCredit: 8,
      derniereVente: "2025-08-28",
      dernierPaiement: "2025-08-25",
      statut: 'actif',
      historiqueDettes: [
        {
          id: 1,
          numeroVente: "VT-2025-0828-001",
          montant: 12500,
          dateVente: "2025-08-28",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-09-28",
          commentaire: "Médicaments pour traitement hypertension"
        },
        {
          id: 2,
          numeroVente: "VT-2025-0820-002",
          montant: 8900,
          dateVente: "2025-08-20",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-09-20"
        },
        {
          id: 3,
          numeroVente: "VT-2025-0815-003",
          montant: 15600,
          dateVente: "2025-08-15",
          montantPaye: 13600,
          statutPaiement: 'partiellement_paye',
          echeance: "2025-09-15"
        }
      ],
      historiquesPaiements: [
        {
          id: 1,
          montant: 13600,
          datePaiement: "2025-08-25",
          modePaiement: "Espèces",
          commentaire: "Paiement partiel vente du 15/08",
          operateur: "Assistant Marie"
        },
        {
          id: 2,
          montant: 25000,
          datePaiement: "2025-08-10",
          modePaiement: "Mobile Money",
          reference: "MM250810001",
          commentaire: "Règlement dettes précédentes",
          operateur: "Admin Pharmacien"
        }
      ]
    },
    {
      id: 2,
      client: {
        nom: "Sy",
        prenom: "Mamadou",
        telephone: "+221 70 987 65 43",
        adresse: "Médina, Dakar",
        dateInscription: "2024-06-10"
      },
      limiteCreditAutorisee: 75000,
      soldeDette: 67500,
      nombreVentesCredit: 12,
      derniereVente: "2025-09-01",
      statut: 'surveille',
      historiqueDettes: [
        {
          id: 4,
          numeroVente: "VT-2025-0901-004",
          montant: 18500,
          dateVente: "2025-09-01",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-10-01"
        },
        {
          id: 5,
          numeroVente: "VT-2025-0825-005",
          montant: 32000,
          dateVente: "2025-08-25",
          montantPaye: 15000,
          statutPaiement: 'partiellement_paye',
          echeance: "2025-09-25"
        },
        {
          id: 6,
          numeroVente: "VT-2025-0820-006",
          montant: 17000,
          dateVente: "2025-08-20",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-09-20"
        }
      ],
      historiquesPaiements: [
        {
          id: 3,
          montant: 15000,
          datePaiement: "2025-08-30",
          modePaiement: "Chèque",
          reference: "CHQ123456",
          commentaire: "Paiement partiel",
          operateur: "Assistant Marie"
        }
      ]
    },
    {
      id: 3,
      client: {
        nom: "Ba",
        prenom: "Omar",
        telephone: "+221 78 222 11 00",
        adresse: "Plateau, Dakar",
        dateInscription: "2024-01-20"
      },
      limiteCreditAutorisee: 100000,
      soldeDette: 105000,
      nombreVentesCredit: 15,
      derniereVente: "2025-08-30",
      statut: 'bloque',
      historiqueDettes: [
        {
          id: 7,
          numeroVente: "VT-2025-0830-007",
          montant: 28000,
          dateVente: "2025-08-30",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-09-30"
        },
        {
          id: 8,
          numeroVente: "VT-2025-0825-008",
          montant: 45000,
          dateVente: "2025-08-25",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-09-25"
        },
        {
          id: 9,
          numeroVente: "VT-2025-0820-009",
          montant: 32000,
          dateVente: "2025-08-20",
          montantPaye: 0,
          statutPaiement: 'non_paye',
          echeance: "2025-09-20"
        }
      ],
      historiquesPaiements: []
    }
  ];

  const filteredClients = clientsCredit.filter(client => {
    const matchesSearch = `${client.client.prenom} ${client.client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.client.telephone.includes(searchTerm);
    const matchesStatut = selectedStatut === "tous" || client.statut === selectedStatut;
    return matchesSearch && matchesStatut;
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "actif": return "default";
      case "surveille": return "secondary";
      case "bloque": return "destructive";
      default: return "outline";
    }
  };

  const getStatutText = (statut: string) => {
    const statuts: { [key: string]: string } = {
      actif: "Actif",
      surveille: "Surveillé",
      bloque: "Bloqué"
    };
    return statuts[statut] || statut;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "actif": return <CheckCircle className="w-4 h-4" />;
      case "surveille": return <AlertTriangle className="w-4 h-4" />;
      case "bloque": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentStatutColor = (statut: string) => {
    switch (statut) {
      case "non_paye": return "destructive";
      case "partiellement_paye": return "secondary";
      case "entierement_paye": return "default";
      default: return "outline";
    }
  };

  const getTotalDettes = () => {
    return clientsCredit.reduce((total, client) => total + client.soldeDette, 0);
  };

  const getClientsBloquesCount = () => {
    return clientsCredit.filter(client => client.statut === 'bloque').length;
  };

  const getClientsSurveillesCount = () => {
    return clientsCredit.filter(client => client.statut === 'surveille').length;
  };

  const getCreditUtilizationPercent = (client: ClientCredit) => {
    return Math.round((client.soldeDette / client.limiteCreditAutorisee) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Crédits Clients</h1>
          <p className="text-muted-foreground">
            {filteredClients.length} clients avec crédit
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Client Crédit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un client crédit</DialogTitle>
                <DialogDescription>
                  Créez un nouveau compte client avec autorisation de crédit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="clientNom">Nom *</Label>
                    <Input id="clientNom" placeholder="Nom du client" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPrenom">Prénom *</Label>
                    <Input id="clientPrenom" placeholder="Prénom du client" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientTelephone">Téléphone *</Label>
                  <Input id="clientTelephone" placeholder="+221 XX XXX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input id="clientEmail" type="email" placeholder="email@exemple.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAdresse">Adresse</Label>
                  <Textarea id="clientAdresse" placeholder="Adresse complète" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limiteCredit">Limite de crédit (FCFA) *</Label>
                  <Input id="limiteCredit" type="number" placeholder="Montant maximum autorisé" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddClientOpen(false)}>
                  Créer le Compte
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dettes</CardTitle>
            <DollarSign className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {getTotalDettes().toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">montant total dû</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientsCredit.filter(c => c.statut === 'actif').length}
            </div>
            <p className="text-xs text-muted-foreground">comptes en règle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Surveillés</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getClientsSurveillesCount()}
            </div>
            <p className="text-xs text-muted-foreground">approchent la limite</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Bloqués</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getClientsBloquesCount()}
            </div>
            <p className="text-xs text-muted-foreground">limite dépassée</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou téléphone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedStatut} onValueChange={setSelectedStatut}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="actif">Actifs</SelectItem>
            <SelectItem value="surveille">Surveillés</SelectItem>
            <SelectItem value="bloque">Bloqués</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.map((client) => {
          const creditPercent = getCreditUtilizationPercent(client);
          const detteNonPayee = client.historiqueDettes
            .filter(d => d.statutPaiement !== 'entierement_paye')
            .reduce((total, d) => total + (d.montant - d.montantPaye), 0);

          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {client.client.prenom[0]}{client.client.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {client.client.prenom} {client.client.nom}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.client.telephone}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Client depuis {new Date(client.client.dateInscription).toLocaleDateString('fr-FR')}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {creditPercent >= 90 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Limite proche
                      </Badge>
                    )}
                    <Badge variant={getStatutColor(client.statut)} className="flex items-center gap-1">
                      {getStatutIcon(client.statut)}
                      {getStatutText(client.statut)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Credit Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Limite autorisée</span>
                      <span className="font-semibold">{client.limiteCreditAutorisee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dette actuelle</span>
                      <span className="font-bold text-red-600">{client.soldeDette.toLocaleString()} FCFA</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span>Utilisation</span>
                        <span>{creditPercent}%</span>
                      </div>
                      <Progress value={creditPercent} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ventes à crédit</span>
                      <span className="font-semibold">{client.nombreVentesCredit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dernière vente</span>
                      <span className="font-medium">{new Date(client.derniereVente).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {client.dernierPaiement && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Dernier paiement</span>
                        <span className="font-medium text-green-600">
                          {new Date(client.dernierPaiement).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Dettes en cours</h4>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {client.historiqueDettes.filter(d => d.statutPaiement !== 'entierement_paye').slice(0, 3).map((dette) => (
                        <div key={dette.id} className="flex justify-between items-center text-xs">
                          <span>{dette.numeroVente}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{(dette.montant - dette.montantPaye).toLocaleString()} FCFA</span>
                            <Badge variant={getPaymentStatutColor(dette.statutPaiement)} className="text-xs px-1 py-0">
                              {dette.statutPaiement === 'non_paye' ? 'Non payé' : 'Partiel'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedClient(client)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Historique
                  </Button>
                  <Dialog open={isPaymentOpen && selectedClient?.id === client.id} onOpenChange={setIsPaymentOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedClient(client)}
                        disabled={client.soldeDette === 0}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Enregistrer Paiement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enregistrer un paiement</DialogTitle>
                        <DialogDescription>
                          Client: {client.client.prenom} {client.client.nom} 
                          - Dette: {client.soldeDette.toLocaleString()} FCFA
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="montantPaiement">Montant du paiement (FCFA) *</Label>
                          <Input 
                            id="montantPaiement" 
                            type="number" 
                            placeholder="Montant reçu"
                            max={client.soldeDette}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="modePaiement">Mode de paiement *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="especes">Espèces</SelectItem>
                              <SelectItem value="mobile_money">Mobile Money</SelectItem>
                              <SelectItem value="cheque">Chèque</SelectItem>
                              <SelectItem value="virement">Virement</SelectItem>
                              <SelectItem value="carte">Carte bancaire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reference">Référence</Label>
                          <Input id="reference" placeholder="Numéro de référence" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="commentairePaiement">Commentaire</Label>
                          <Textarea id="commentairePaiement" placeholder="Commentaire optionnel..." />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={() => setIsPaymentOpen(false)}>
                          Enregistrer le Paiement
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {client.statut === 'bloque' && (
                    <Button variant="outline" size="sm" className="text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Débloquer
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Relance SMS
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun client crédit trouvé</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucun client ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setIsAddClientOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Client Crédit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
