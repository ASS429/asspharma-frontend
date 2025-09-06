import { useState, useEffect } from "react";
import { useMockPharmacyApi } from "../hooks/useMockPharmacyApi";
import { toast } from "sonner@2.0.3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Search, 
  Plus, 
  Package, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Filter,
  Calendar,
  User,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  History,
  Eye
} from "lucide-react";

interface StockMovement {
  id: number;
  produit_id: number;
  produit?: { nom: string };
  numero_lot?: string;
  type: 'entree' | 'sortie';
  motif: 'achat' | 'vente' | 'destruction' | 'retour' | 'inventaire' | 'peremption';
  quantite: number;
  quantite_avant?: number;
  quantite_apres?: number;
  utilisateur?: { email: string };
  date_creation: string;
  commentaire?: string;
  prix_unitaire?: number;
}

interface StockLot {
  id: number;
  produit_id: number;
  produit?: { nom: string; stock_minimum?: number };
  numero_lot: string;
  quantite: number;
  date_expiration: string;
  date_entree: string;
  prix_achat?: number;
  fournisseur?: string;
  statut: 'actif' | 'expire' | 'detruit';
}

export default function StockManagement() {
  const { getStockLots, getStockMovements, createStockMovement, loading } = useMockPharmacyApi();
  const [activeTab, setActiveTab] = useState("movements");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);
  const [stockMovements, setStockMovements] = useState([]);
  const [stockLots, setStockLots] = useState([]);
  
  // État pour le nouveau mouvement
  const [movementForm, setMovementForm] = useState({
    type: "",
    motif: "",
    produit_id: "",
    quantite: "",
    commentaire: "",
    prix: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [movements, lots] = await Promise.all([
        getStockMovements(),
        getStockLots()
      ]);
      setStockMovements(movements || []);
      setStockLots(lots || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données de stock');
      
      // Utiliser des données par défaut en cas d'erreur pour éviter que l'app crash
      setStockMovements([]);
      setStockLots([]);
    }
  };

  const handleCreateMovement = async () => {
    try {
      if (!movementForm.type || !movementForm.motif || !movementForm.produit_id || !movementForm.quantite) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const movement = {
        type: movementForm.type,
        motif: movementForm.motif,
        produit_id: parseInt(movementForm.produit_id),
        quantite: parseInt(movementForm.quantite),
        commentaire: movementForm.commentaire,
        prix_unitaire: movementForm.prix ? parseFloat(movementForm.prix) : null
      };

      await createStockMovement(movement);
      toast.success('Mouvement de stock enregistré avec succès');
      
      // Reset form
      setMovementForm({
        type: "",
        motif: "",
        produit_id: "",
        quantite: "",
        commentaire: "",
        prix: ""
      });
      setIsAddMovementOpen(false);
      
      // Recharger les données
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la création du mouvement:', error);
      toast.error('Erreur lors de l\'enregistrement du mouvement');
    }
  };



  const filteredMovements = stockMovements.filter(movement => {
    const matchesSearch = movement.produit?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.numero_lot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.utilisateur?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "tous" || movement.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredLots = stockLots.filter(lot => {
    return lot.produit?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lot.numero_lot?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getMotifColor = (motif: string) => {
    switch (motif) {
      case "achat": return "default";
      case "vente": return "default";
      case "destruction": return "destructive";
      case "retour": return "secondary";
      case "peremption": return "destructive";
      case "inventaire": return "outline";
      default: return "outline";
    }
  };

  const getMotifText = (motif: string) => {
    const motifs: { [key: string]: string } = {
      achat: "Achat",
      vente: "Vente",
      destruction: "Destruction",
      retour: "Retour",
      peremption: "Péremption",
      inventaire: "Inventaire"
    };
    return motifs[motif] || motif;
  };

  const getStatutLotColor = (statut: string) => {
    switch (statut) {
      case "actif": return "default";
      case "expire": return "secondary";
      case "detruit": return "destructive";
      default: return "outline";
    }
  };

  const getDaysUntilExpiry = (datePeremption: string) => {
    const expiry = new Date(datePeremption);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalStock = () => {
    return stockLots.filter(lot => lot.statut === 'actif').reduce((total, lot) => total + lot.quantite, 0);
  };

  const getExpiringStock = () => {
    return stockLots.filter(lot => {
      const days = getDaysUntilExpiry(lot.date_expiration);
      return lot.statut === 'actif' && days <= 90 && days > 0;
    }).length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion du Stock</h1>
          <p className="text-muted-foreground">
            Suivi FEFO et traçabilité complète des mouvements
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Mouvement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Enregistrer un mouvement de stock</DialogTitle>
                <DialogDescription>
                  Ajoutez une entrée ou sortie de stock avec traçabilité.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="typeOperation">Type d'opération *</Label>
                  <Select value={movementForm.type} onValueChange={(value) => setMovementForm({...movementForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entree">Entrée de stock</SelectItem>
                      <SelectItem value="sortie">Sortie de stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motifOperation">Motif *</Label>
                  <Select value={movementForm.motif} onValueChange={(value) => setMovementForm({...movementForm, motif: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le motif" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="achat">Achat</SelectItem>
                      <SelectItem value="vente">Vente</SelectItem>
                      <SelectItem value="retour">Retour</SelectItem>
                      <SelectItem value="destruction">Destruction</SelectItem>
                      <SelectItem value="inventaire">Inventaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="produit">Produit *</Label>
                  <Select value={movementForm.produit_id} onValueChange={(value) => setMovementForm({...movementForm, produit_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockLots.map(lot => (
                        <SelectItem key={lot.id} value={lot.produit_id?.toString()}>
                          {lot.produit?.nom} - Lot: {lot.numero_lot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantite">Quantité *</Label>
                    <Input 
                      id="quantite" 
                      type="number" 
                      placeholder="Quantité"
                      value={movementForm.quantite}
                      onChange={(e) => setMovementForm({...movementForm, quantite: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix unitaire (FCFA)</Label>
                    <Input 
                      id="prix" 
                      type="number" 
                      placeholder="Prix"
                      value={movementForm.prix}
                      onChange={(e) => setMovementForm({...movementForm, prix: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commentaire">Commentaire</Label>
                  <Textarea 
                    id="commentaire" 
                    placeholder="Commentaire optionnel..."
                    value={movementForm.commentaire}
                    onChange={(e) => setMovementForm({...movementForm, commentaire: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddMovementOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateMovement} disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
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
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalStock().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">unités en stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mouvements Jour</CardTitle>
            <History className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockMovements.filter(m => m.date_creation?.startsWith(new Date().toISOString().split('T')[0])).length}
            </div>
            <p className="text-xs text-muted-foreground">transactions aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiration Proche</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getExpiringStock()}</div>
            <p className="text-xs text-muted-foreground">lots à surveiller</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lots Actifs</CardTitle>
            <Eye className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockLots.filter(lot => lot.statut === 'actif').length}
            </div>
            <p className="text-xs text-muted-foreground">lots en circulation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="movements">Mouvements de Stock</TabsTrigger>
          <TabsTrigger value="lots">Gestion par Lots (FEFO)</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'movements' ? "Rechercher dans les mouvements..." : "Rechercher dans les lots..."}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'movements' && (
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de mouvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="entree">Entrées</SelectItem>
                <SelectItem value="sortie">Sorties</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        <TabsContent value="movements" className="space-y-4">
          <div className="space-y-4">
            {filteredMovements.map((movement) => (
              <Card key={movement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        movement.type === 'entree' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {movement.type === 'entree' ? (
                          <ArrowUpCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{movement.produit?.nom || 'Produit'}</h3>
                          <Badge variant="outline" className="text-xs">
                            Lot: {movement.numero_lot || 'N/A'}
                          </Badge>
                          <Badge variant={getMotifColor(movement.motif)} className="text-xs">
                            {getMotifText(movement.motif)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {movement.utilisateur?.email || 'Utilisateur'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(movement.date_creation).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        {movement.commentaire && (
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            "{movement.commentaire}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-lg font-bold ${
                          movement.type === 'entree' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'entree' ? '+' : '-'}{movement.quantite}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {movement.quantiteAvant} → {movement.quantiteApres}
                      </div>
                      {movement.prix && (
                        <div className="text-sm font-semibold text-green-600">
                          {(movement.prix).toLocaleString()} FCFA
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lots" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLots.map((lot) => {
              const daysUntilExpiry = getDaysUntilExpiry(lot.date_expiration);
              const isExpiringSoon = daysUntilExpiry <= 90 && daysUntilExpiry > 0;
              const isExpired = daysUntilExpiry <= 0;

              return (
                <Card key={lot.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{lot.produit?.nom}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {lot.numero_lot}
                          </Badge>
                          <Badge variant={getStatutLotColor(lot.statut)} className="text-xs">
                            {lot.statut.charAt(0).toUpperCase() + lot.statut.slice(1)}
                          </Badge>
                        </CardDescription>
                      </div>
                      {(isExpiringSoon || isExpired) && (
                        <AlertTriangle className={`w-5 h-5 ${
                          isExpired ? 'text-red-500' : 'text-amber-500'
                        }`} />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stock Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Quantité</p>
                        <p className="text-2xl font-bold text-primary">{lot.quantite}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Prix d'achat</p>
                        <p className="font-semibold text-green-600">{lot.prix_achat?.toLocaleString()} FCFA</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entrée:</span>
                        <span>{lot.date_entree}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiration:</span>
                        <span className={isExpired ? 'text-red-600 font-semibold' : isExpiringSoon ? 'text-amber-600 font-semibold' : ''}>
                          {lot.date_expiration}
                        </span>
                      </div>
                      {daysUntilExpiry > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reste:</span>
                          <span className={isExpiringSoon ? 'text-amber-600 font-semibold' : ''}>
                            {daysUntilExpiry} jours
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Supplier */}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Fournisseur: </span>
                      <span>{lot.fournisseur}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      {lot.statut === 'expire' && (
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Détruire
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
