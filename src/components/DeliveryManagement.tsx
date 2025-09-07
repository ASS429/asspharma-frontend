import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Truck, 
  Plus, 
  Search,
  Package,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Archive,
  BarChart3
} from "lucide-react";

interface DeliveryItem {
  produitId: number;
  nomProduit: string;
  quantiteCommandee: number;
  quantiteLivree: number;
  numeroLot: string;
  datePeremption: string;
  prixUnitaire: number;
  statut: 'conforme' | 'ecart' | 'manquant';
}

interface Delivery {
  id: number;
  numeroCommande: string;
  numeroBordereau: string;
  fournisseur: string;
  dateLivraison: string;
  dateReception: string;
  statut: 'en_attente' | 'recu' | 'controle' | 'valide' | 'litige';
  produits: DeliveryItem[];
  montantTotal: number;
  observations: string;
  livreur: string;
  transporteur: string;
}

export default function DeliveryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("tous");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const fournisseurs = [
    "Laborex Sénégal",
    "Ubipharm",
    "Pharma Distribution",
    "Sedico",
    "Nouvelles Galéniques",
    "Sanofi Winthrop",
    "Pfizer Sénégal"
  ];

  const deliveries: Delivery[] = [
    {
      id: 1,
      numeroCommande: "CMD-2025-0234",
      numeroBordereau: "BL-LAB-25-0789",
      fournisseur: "Laborex Sénégal",
      dateLivraison: "2025-09-01",
      dateReception: "2025-09-01T10:30:00",
      statut: 'valide',
      montantTotal: 2456000,
      observations: "Livraison conforme, tous les produits en bon état",
      livreur: "Mamadou Diop",
      transporteur: "Transport Express",
      produits: [
        {
          produitId: 1,
          nomProduit: "Doliprane 1000mg",
          quantiteCommandee: 50,
          quantiteLivree: 50,
          numeroLot: "DL2025A001",
          datePeremption: "2025-12-15",
          prixUnitaire: 1600,
          statut: 'conforme'
        },
        {
          produitId: 2,
          nomProduit: "Amoxicilline 500mg",
          quantiteCommandee: 30,
          quantiteLivree: 30,
          numeroLot: "AMX2025B002",
          datePeremption: "2025-08-20",
          prixUnitaire: 4800,
          statut: 'conforme'
        }
      ]
    },
    {
      id: 2,
      numeroCommande: "CMD-2025-0235",
      numeroBordereau: "BL-UBI-25-1234",
      fournisseur: "Ubipharm",
      dateLivraison: "2025-09-01",
      dateReception: "2025-09-01T14:15:00",
      statut: 'litige',
      montantTotal: 1890000,
      observations: "Écart sur Insuline Lantus - 5 unités commandées, 3 livrées",
      livreur: "Fatou Ba",
      transporteur: "Ubipharm Logistique",
      produits: [
        {
          produitId: 3,
          nomProduit: "Insuline Lantus",
          quantiteCommandee: 5,
          quantiteLivree: 3,
          numeroLot: "INS2025C003",
          datePeremption: "2025-11-30",
          prixUnitaire: 12500,
          statut: 'manquant'
        },
        {
          produitId: 4,
          nomProduit: "Aspirine 100mg",
          quantiteCommandee: 20,
          quantiteLivree: 20,
          numeroLot: "ASP2026A004",
          datePeremption: "2026-01-10",
          prixUnitaire: 800,
          statut: 'conforme'
        }
      ]
    },
    {
      id: 3,
      numeroCommande: "CMD-2025-0236",
      numeroBordereau: "EN_ATTENTE",
      fournisseur: "Sanofi Winthrop",
      dateLivraison: "2025-09-02",
      dateReception: "",
      statut: 'en_attente',
      montantTotal: 3200000,
      observations: "",
      livreur: "",
      transporteur: "DHL",
      produits: [
        {
          produitId: 5,
          nomProduit: "Vaccin Hépatite B",
          quantiteCommandee: 10,
          quantiteLivree: 0,
          numeroLot: "",
          datePeremption: "",
          prixUnitaire: 25000,
          statut: 'manquant'
        }
      ]
    }
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.numeroBordereau.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.numeroCommande.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.fournisseur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = selectedStatut === "tous" || delivery.statut === selectedStatut;
    return matchesSearch && matchesStatut;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'secondary';
      case 'recu': return 'default';
      case 'controle': return 'secondary';
      case 'valide': return 'default';
      case 'litige': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'recu': return 'Reçu';
      case 'controle': return 'En contrôle';
      case 'valide': return 'Validé';
      case 'litige': return 'Litige';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente': return Clock;
      case 'recu': return Package;
      case 'controle': return Search;
      case 'valide': return CheckCircle;
      case 'litige': return AlertTriangle;
      default: return Package;
    }
  };

  const openDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Livraisons</h1>
          <p className="text-muted-foreground">
            Bordereaux de livraison et suivi des réceptions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Bordereau
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau bordereau de livraison</DialogTitle>
              <DialogDescription>
                Enregistrer une nouvelle livraison de fournisseur.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Numéro de commande *</Label>
                <Input placeholder="CMD-2025-XXXX" />
              </div>
              <div className="space-y-2">
                <Label>Numéro bordereau *</Label>
                <Input placeholder="BL-XXX-XX-XXXX" />
              </div>
              <div className="space-y-2">
                <Label>Fournisseur *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {fournisseurs.map(fournisseur => (
                      <SelectItem key={fournisseur} value={fournisseur}>
                        {fournisseur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date de livraison *</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Transporteur</Label>
                <Input placeholder="Nom du transporteur" />
              </div>
              <div className="space-y-2">
                <Label>Livreur</Label>
                <Input placeholder="Nom du livreur" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Observations</Label>
                <Textarea placeholder="Observations sur la livraison..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer Bordereau
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livraisons en Attente</CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {deliveries.filter(d => d.statut === 'en_attente').length}
            </div>
            <p className="text-xs text-muted-foreground">à réceptionner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validées</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deliveries.filter(d => d.statut === 'valide').length}
            </div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Litiges</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {deliveries.filter(d => d.statut === 'litige').length}
            </div>
            <p className="text-xs text-muted-foreground">à résoudre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {deliveries.reduce((acc, d) => acc + d.montantTotal, 0).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher par bordereau, commande ou fournisseur..."
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
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="recu">Reçu</SelectItem>
            <SelectItem value="controle">En contrôle</SelectItem>
            <SelectItem value="valide">Validé</SelectItem>
            <SelectItem value="litige">Litige</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((delivery) => {
          const StatusIcon = getStatusIcon(delivery.statut);
          return (
            <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{delivery.numeroBordereau}</CardTitle>
                      <CardDescription>
                        Commande: {delivery.numeroCommande}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(delivery.statut)} className="flex items-center gap-1">
                    <StatusIcon className="w-3 h-3" />
                    {getStatusText(delivery.statut)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Supplier */}
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{delivery.fournisseur}</span>
                </div>

                {/* Dates */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison prévue:</span>
                    <span>{new Date(delivery.dateLivraison).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {delivery.dateReception && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reçu le:</span>
                      <span>{new Date(delivery.dateReception).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {/* Products Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Produits:</span>
                    <span>{delivery.produits.length} référence{delivery.produits.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Montant total:</span>
                    <span className="font-semibold text-green-600">
                      {delivery.montantTotal.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Transport Info */}
                {delivery.transporteur && (
                  <div className="text-xs bg-muted p-2 rounded">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transporteur:</span>
                      <span>{delivery.transporteur}</span>
                    </div>
                    {delivery.livreur && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livreur:</span>
                        <span>{delivery.livreur}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openDeliveryDetails(delivery)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  {delivery.statut === 'valide' && (
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <Archive className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delivery Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDelivery && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Bordereau {selectedDelivery.numeroBordereau}
                </DialogTitle>
                <DialogDescription>
                  Détails de la livraison et contrôle qualité
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Delivery Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label>Commande</Label>
                      <p className="font-medium">{selectedDelivery.numeroCommande}</p>
                    </div>
                    <div>
                      <Label>Fournisseur</Label>
                      <p className="font-medium">{selectedDelivery.fournisseur}</p>
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <Badge variant={getStatusColor(selectedDelivery.statut)}>
                        {getStatusText(selectedDelivery.statut)}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Date de livraison</Label>
                      <p className="font-medium">
                        {new Date(selectedDelivery.dateLivraison).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <Label>Transporteur</Label>
                      <p className="font-medium">{selectedDelivery.transporteur || '-'}</p>
                    </div>
                    <div>
                      <Label>Livreur</Label>
                      <p className="font-medium">{selectedDelivery.livreur || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Produits livrés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDelivery.produits.map((produit, index) => (
                        <div key={index} className="border rounded p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{produit.nomProduit}</h4>
                            <Badge variant={
                              produit.statut === 'conforme' ? 'default' :
                              produit.statut === 'ecart' ? 'secondary' : 'destructive'
                            }>
                              {produit.statut === 'conforme' ? 'Conforme' :
                               produit.statut === 'ecart' ? 'Écart' : 'Manquant'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Commandé</p>
                              <p className="font-medium">{produit.quantiteCommandee}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Livré</p>
                              <p className={`font-medium ${
                                produit.quantiteLivree < produit.quantiteCommandee ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {produit.quantiteLivree}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Lot</p>
                              <p className="font-mono text-xs">{produit.numeroLot}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Expiration</p>
                              <p className="text-xs">{produit.datePeremption}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Observations */}
                {selectedDelivery.observations && (
                  <div>
                    <Label>Observations</Label>
                    <p className="mt-2 p-3 bg-muted rounded text-sm">
                      {selectedDelivery.observations}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {selectedDelivery.statut === 'en_attente' && (
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer comme Reçu
                    </Button>
                  )}
                  {selectedDelivery.statut === 'recu' && (
                    <Button>
                      <Search className="w-4 h-4 mr-2" />
                      Commencer Contrôle
                    </Button>
                  )}
                  {selectedDelivery.statut === 'controle' && (
                    <>
                      <Button>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Valider
                      </Button>
                      <Button variant="destructive">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Signaler Litige
                      </Button>
                    </>
                  )}
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune livraison trouvée</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucune livraison ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Bordereau
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
