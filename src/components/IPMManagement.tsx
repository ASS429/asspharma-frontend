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
  Shield, 
  Plus,
  Search,
  Building,
  Calendar,
  FileText,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calculator,
  Send,
  Eye,
  Edit,
  BarChart3
} from "lucide-react";

interface IPMSale {
  id: number;
  numeroFacture: string;
  dateVente: string;
  nomClient: string;
  numeroCarteBeneficiaire: string;
  montantTotal: number;
  partPatient: number;
  partIPM: number;
  tauxPriseEnCharge: number;
  produits: Array<{
    nom: string;
    quantite: number;
    prixUnitaire: number;
    montantTotal: number;
  }>;
  statut: 'en_attente' | 'facture' | 'paye';
}

interface IPM {
  id: number;
  nom: string;
  sigle: string;
  typeOrganisme: 'mutuelle' | 'assurance' | 'securite_sociale' | 'entreprise';
  contact: {
    responsable: string;
    telephone: string;
    email: string;
    adresse: string;
  };
  conditionsPriseEnCharge: {
    tauxRemboursement: number;
    plafondMensuel?: number;
    ticketModerateur: number;
    delaiPaiement: number;
  };
  ventesNonFacturees: IPMSale[];
  ventesEnAttente: IPMSale[];
  montantTotal: number;
  statut: 'actif' | 'suspendu';
}

export default function IPMManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIPM, setSelectedIPM] = useState<IPM | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);

  const ipms: IPM[] = [
    {
      id: 1,
      nom: "Institution de Prévoyance Maladie du Sénégal",
      sigle: "IPM",
      typeOrganisme: 'securite_sociale',
      contact: {
        responsable: "Dr. Fatima Sow",
        telephone: "+221 33 889 12 34",
        email: "facturation@ipm.sn",
        adresse: "Avenue Bourguiba, Dakar"
      },
      conditionsPriseEnCharge: {
        tauxRemboursement: 80,
        plafondMensuel: 500000,
        ticketModerateur: 20,
        delaiPaiement: 30
      },
      montantTotal: 2450000,
      statut: 'actif',
      ventesNonFacturees: [
        {
          id: 1,
          numeroFacture: "F-IPM-2025-0001",
          dateVente: "2025-09-01",
          nomClient: "Aminata Diallo",
          numeroCarteBeneficiaire: "IPM-254789632",
          montantTotal: 25600,
          partPatient: 5120,
          partIPM: 20480,
          tauxPriseEnCharge: 80,
          produits: [
            { nom: "Doliprane 1000mg", quantite: 2, prixUnitaire: 1600, montantTotal: 3200 },
            { nom: "Amoxicilline 500mg", quantite: 1, prixUnitaire: 4800, montantTotal: 4800 }
          ],
          statut: 'en_attente'
        }
      ],
      ventesEnAttente: []
    },
    {
      id: 2,
      nom: "Mutuelle des Agents de l'État",
      sigle: "MAE",
      typeOrganisme: 'mutuelle',
      contact: {
        responsable: "Mamadou Ba",
        telephone: "+221 33 825 67 89",
        email: "remboursements@mae.sn",
        adresse: "Point E, Dakar"
      },
      conditionsPriseEnCharge: {
        tauxRemboursement: 70,
        plafondMensuel: 300000,
        ticketModerateur: 30,
        delaiPaiement: 45
      },
      montantTotal: 1890000,
      statut: 'actif',
      ventesNonFacturees: [],
      ventesEnAttente: [
        {
          id: 2,
          numeroFacture: "F-MAE-2025-0012",
          dateVente: "2025-08-28",
          nomClient: "Omar Fall",
          numeroCarteBeneficiaire: "MAE-147852369",
          montantTotal: 45600,
          partPatient: 13680,
          partIPM: 31920,
          tauxPriseEnCharge: 70,
          produits: [
            { nom: "Insuline Lantus", quantite: 2, prixUnitaire: 12500, montantTotal: 25000 }
          ],
          statut: 'facture'
        }
      ]
    },
    {
      id: 3,
      nom: "Compagnie d'Assurance du Sénégal",
      sigle: "CAS",
      typeOrganisme: 'assurance',
      contact: {
        responsable: "Aïssa Ndiaye",
        telephone: "+221 33 842 15 96",
        email: "sante@cas.sn",
        adresse: "Plateau, Dakar"
      },
      conditionsPriseEnCharge: {
        tauxRemboursement: 90,
        ticketModerateur: 10,
        delaiPaiement: 60
      },
      montantTotal: 3200000,
      statut: 'actif',
      ventesNonFacturees: [],
      ventesEnAttente: []
    }
  ];

  const filteredIPMs = ipms.filter(ipm =>
    ipm.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ipm.sigle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'securite_sociale': return 'default';
      case 'mutuelle': return 'secondary';
      case 'assurance': return 'outline';
      case 'entreprise': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'securite_sociale': return 'Sécurité Sociale';
      case 'mutuelle': return 'Mutuelle';
      case 'assurance': return 'Assurance';
      case 'entreprise': return 'Entreprise';
      default: return 'Autre';
    }
  };

  const openIPMDetails = (ipm: IPM) => {
    setSelectedIPM(ipm);
    setIsDetailDialogOpen(true);
  };

  const openBillingDialog = (ipm: IPM) => {
    setSelectedIPM(ipm);
    setIsBillingDialogOpen(true);
  };

  const getTotalVentesNonFacturees = () => {
    return ipms.reduce((total, ipm) => {
      return total + ipm.ventesNonFacturees.reduce((ipmTotal, vente) => ipmTotal + vente.partIPM, 0);
    }, 0);
  };

  const getTotalVentesEnAttente = () => {
    return ipms.reduce((total, ipm) => {
      return total + ipm.ventesEnAttente.reduce((ipmTotal, vente) => ipmTotal + vente.partIPM, 0);
    }, 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion IPM & Tiers Payant</h1>
          <p className="text-muted-foreground">
            Institutions de Prévoyance Maladie et organismes de prise en charge
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Organisme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un organisme de prise en charge</DialogTitle>
              <DialogDescription>
                Créer un nouveau partenaire IPM, mutuelle ou assurance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nom complet *</Label>
                <Input placeholder="Nom de l'organisme" />
              </div>
              <div className="space-y-2">
                <Label>Sigle *</Label>
                <Input placeholder="Sigle ou abréviation" />
              </div>
              <div className="space-y-2">
                <Label>Type d'organisme *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="securite_sociale">Sécurité Sociale</SelectItem>
                    <SelectItem value="mutuelle">Mutuelle</SelectItem>
                    <SelectItem value="assurance">Assurance</SelectItem>
                    <SelectItem value="entreprise">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Taux de remboursement (%)</Label>
                <Input type="number" placeholder="80" />
              </div>
              <div className="space-y-2">
                <Label>Responsable</Label>
                <Input placeholder="Nom du responsable" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="+221 XX XXX XX XX" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@organisme.sn" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Adresse</Label>
                <Textarea placeholder="Adresse complète" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer l'Organisme
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organismes Actifs</CardTitle>
            <Building className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ipms.filter(ipm => ipm.statut === 'actif').length}
            </div>
            <p className="text-xs text-muted-foreground">partenaires</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Facturer</CardTitle>
            <FileText className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getTotalVentesNonFacturees().toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">ventes non facturées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {getTotalVentesEnAttente().toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">factures envoyées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mensuel</CardTitle>
            <BarChart3 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ipms.reduce((total, ipm) => total + ipm.montantTotal, 0).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">chiffre d'affaires</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Rechercher un organisme..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* IPMs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIPMs.map((ipm) => (
          <Card key={ipm.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ipm.sigle}</CardTitle>
                    <CardDescription className="text-sm">
                      {ipm.nom}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={getTypeColor(ipm.typeOrganisme)} className="text-xs">
                    {getTypeText(ipm.typeOrganisme)}
                  </Badge>
                  <Badge variant={ipm.statut === 'actif' ? 'default' : 'destructive'} className="text-xs">
                    {ipm.statut === 'actif' ? 'Actif' : 'Suspendu'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Contact Info */}
              <div className="text-sm space-y-1 bg-muted p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Responsable:</span>
                  <span>{ipm.contact.responsable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux:</span>
                  <span className="font-medium">{ipm.conditionsPriseEnCharge.tauxRemboursement}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Délai:</span>
                  <span>{ipm.conditionsPriseEnCharge.delaiPaiement} jours</span>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">À facturer:</span>
                  <span className="font-medium text-orange-600">
                    {ipm.ventesNonFacturees.reduce((total, vente) => total + vente.partIPM, 0).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">En attente:</span>
                  <span className="font-medium text-purple-600">
                    {ipm.ventesEnAttente.reduce((total, vente) => total + vente.partIPM, 0).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Total mensuel:</span>
                  <span className="font-semibold text-green-600">
                    {ipm.montantTotal.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openIPMDetails(ipm)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Détails
                </Button>
                {ipm.ventesNonFacturees.length > 0 && (
                  <Button 
                    size="sm"
                    onClick={() => openBillingDialog(ipm)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Facturer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* IPM Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedIPM && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {selectedIPM.nom}
                </DialogTitle>
                <DialogDescription>
                  Détails de l'organisme et historique des prises en charge
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact & Conditions */}
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Responsable:</span>
                        <span>{selectedIPM.contact.responsable}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Téléphone:</span>
                        <span>{selectedIPM.contact.telephone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-sm">{selectedIPM.contact.email}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Adresse:</span>
                        <p className="mt-1">{selectedIPM.contact.adresse}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux remboursement:</span>
                        <span className="font-medium">{selectedIPM.conditionsPriseEnCharge.tauxRemboursement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ticket modérateur:</span>
                        <span>{selectedIPM.conditionsPriseEnCharge.ticketModerateur}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Délai paiement:</span>
                        <span>{selectedIPM.conditionsPriseEnCharge.delaiPaiement} jours</span>
                      </div>
                      {selectedIPM.conditionsPriseEnCharge.plafondMensuel && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plafond mensuel:</span>
                          <span>{selectedIPM.conditionsPriseEnCharge.plafondMensuel.toLocaleString()} FCFA</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Ventes à facturer */}
                {selectedIPM.ventesNonFacturees.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Ventes à facturer</span>
                        <Button size="sm" onClick={() => openBillingDialog(selectedIPM)}>
                          <Send className="w-4 h-4 mr-2" />
                          Générer Facture
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedIPM.ventesNonFacturees.map((vente) => (
                          <div key={vente.id} className="border rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{vente.nomClient}</p>
                                <p className="text-sm text-muted-foreground">
                                  Carte: {vente.numeroCarteBeneficiaire}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">Part IPM: {vente.partIPM.toLocaleString()} FCFA</p>
                                <p className="text-sm text-muted-foreground">
                                  Total: {vente.montantTotal.toLocaleString()} FCFA
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Date: {new Date(vente.dateVente).toLocaleDateString('fr-FR')} - 
                              Prise en charge: {vente.tauxPriseEnCharge}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter Historique
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Billing Dialog */}
      <Dialog open={isBillingDialogOpen} onOpenChange={setIsBillingDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedIPM && (
            <>
              <DialogHeader>
                <DialogTitle>Générer Facture - {selectedIPM.sigle}</DialogTitle>
                <DialogDescription>
                  Créer une facture globale pour les ventes en attente de facturation.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Facture Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Résumé de la facture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre de ventes:</p>
                        <p className="text-xl font-bold">{selectedIPM.ventesNonFacturees.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Montant total IPM:</p>
                        <p className="text-xl font-bold text-green-600">
                          {selectedIPM.ventesNonFacturees.reduce((total, vente) => total + vente.partIPM, 0).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales List */}
                <div className="max-h-64 overflow-y-auto border rounded p-3">
                  {selectedIPM.ventesNonFacturees.map((vente) => (
                    <div key={vente.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{vente.nomClient}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(vente.dateVente).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <p className="font-medium">{vente.partIPM.toLocaleString()} FCFA</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsBillingDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setIsBillingDialogOpen(false)}>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer Facture
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
