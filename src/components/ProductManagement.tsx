import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useMockPharmacyApi } from "../hooks/useMockPharmacyApi";
import { WelcomeMessage } from "./PharmacyBranding";
import { toast } from "sonner@2.0.3";
import { 
  Search, 
  Plus, 
  Package, 
  Edit, 
  AlertTriangle,
  Filter,
  ScanLine,
  Building,
  Calendar,
  Pill,
  MapPin,
  Trash2
} from "lucide-react";

interface Product {
  id: number;
  pharmacy_id: string; // Champ obligatoire pour l'isolation des données
  nom_commercial: string;
  dci: string;
  dosage: string;
  forme: string;
  laboratoire: string;
  rayon: string;
  etagere?: number;
  code_barres?: string;
  prix_unitaire: number;
  stock_minimum: number;
  statut: 'actif' | 'expire' | 'rappele' | 'rupture';
  type_vente: 'libre' | 'reglemente';
  created_at?: string;
  updated_at?: string;
  // Informations de stock (depuis les lots)
  stock_lots?: Array<{
    id: number;
    numero_lot: string;
    quantite: number;
    date_expiration: string;
    statut: string;
  }>;
}

export default function ProductManagement() {
  const { getProducts, createProduct, deleteProduct, loading, error } = useMockPharmacyApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRayon, setSelectedRayon] = useState("tous");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRayonDialogOpen, setIsRayonDialogOpen] = useState(false);
  const [isFormeDialogOpen, setIsFormeDialogOpen] = useState(false);
  const [newRayon, setNewRayon] = useState("");
  const [newForme, setNewForme] = useState("");
  
  // États pour le nouveau produit
  const [productForm, setProductForm] = useState({
    nom_commercial: "",
    dci: "",
    dosage: "",
    forme: "",
    laboratoire: "",
    rayon: "",
    etagere: "",
    code_barres: "",
    prix_unitaire: "",
    stock_minimum: "",
    type_vente: "libre"
  });

  const [rayons, setRayons] = useState([
    "Médicaments sur ordonnance",
    "Médicaments en libre service",
    "Parapharmacie",
    "Orthopédie",
    "Cosmétiques",
    "Hygiène",
    "Nutrition",
    "Soin de corps"
  ]);

  const [formes, setFormes] = useState([
    "Comprimés",
    "Gélules", 
    "Sirop",
    "Solution injectable",
    "Pommade",
    "Crème",
    "Suppositoires",
    "Gouttes",
    "Spray",
    "Poudre"
  ]);

  const laboratoires = [
    "Sanofi",
    "Pfizer",
    "GSK",
    "Novartis",
    "Roche",
    "Bayer",
    "Merck",
    "AstraZeneca",
    "Johnson & Johnson",
    "Boehringer Ingelheim"
  ];

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  // Fonction pour gérer l'ajout d'un produit
  const handleCreateProduct = async () => {
    try {
      if (!productForm.nom_commercial || !productForm.dci || !productForm.prix_unitaire) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const newProduct = {
        nom_commercial: productForm.nom_commercial,
        dci: productForm.dci,
        dosage: productForm.dosage,
        forme: productForm.forme,
        laboratoire: productForm.laboratoire,
        rayon: productForm.rayon,
        etagere: productForm.etagere ? parseInt(productForm.etagere) : null,
        code_barres: productForm.code_barres,
        prix_unitaire: parseFloat(productForm.prix_unitaire),
        stock_minimum: productForm.stock_minimum ? parseInt(productForm.stock_minimum) : 0,
        type_vente: productForm.type_vente,
        statut: 'actif'
      };

      await createProduct(newProduct);
      toast.success('Produit ajouté avec succès');
      
      // Reset form et fermer dialog
      setProductForm({
        nom_commercial: "",
        dci: "",
        dosage: "",
        forme: "",
        laboratoire: "",
        rayon: "",
        etagere: "",
        code_barres: "",
        prix_unitaire: "",
        stock_minimum: "",
        type_vente: "libre"
      });
      setIsAddDialogOpen(false);
      
      // Recharger la liste
      await loadProducts();
    } catch (err) {
      console.error('Erreur lors de la création du produit:', err);
      toast.error('Erreur lors de la création du produit');
    }
  };

  // Fonction pour gérer la suppression d'un produit
  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId.toString());
        toast.success('Produit supprimé avec succès');
        await loadProducts();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom_commercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.dci?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code_barres?.includes(searchTerm);
    const matchesRayon = selectedRayon === "tous" || product.rayon === selectedRayon;
    return matchesSearch && matchesRayon;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "actif": return "default";
      case "rupture": return "destructive";
      case "expire": return "secondary";
      case "rappele": return "destructive";
      default: return "outline";
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case "actif": return "Actif";
      case "rupture": return "Rupture";
      case "expire": return "Expiré";
      case "rappele": return "Rappelé";
      default: return "Inconnu";
    }
  };

  const getTypeVenteColor = (type: string) => {
    return type === 'libre' ? 'default' : 'secondary';
  };

  const isExpiringSoon = (datePeremption: string) => {
    if (!datePeremption) return false;
    const expiryDate = new Date(datePeremption);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 90 && daysDiff > 0; // Expire dans moins de 3 mois
  };

  const addRayon = () => {
    if (newRayon.trim() && !rayons.includes(newRayon.trim())) {
      setRayons([...rayons, newRayon.trim()]);
      setNewRayon("");
      setIsRayonDialogOpen(false);
    }
  };

  const removeRayon = (rayonToRemove: string) => {
    setRayons(rayons.filter(rayon => rayon !== rayonToRemove));
  };

  const addForme = () => {
    if (newForme.trim() && !formes.includes(newForme.trim())) {
      setFormes([...formes, newForme.trim()]);
      setNewForme("");
      setIsFormeDialogOpen(false);
    }
  };

  const removeForme = (formeToRemove: string) => {
    setFormes(formes.filter(forme => forme !== formeToRemove));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Produits & Rayons</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produits trouvés
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRayonDialogOpen} onOpenChange={setIsRayonDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Gérer Rayons
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestion des Rayons</DialogTitle>
                <DialogDescription>
                  Ajouter ou supprimer des rayons de la pharmacie.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouveau rayon (ex: Soin de corps)"
                    value={newRayon}
                    onChange={(e) => setNewRayon(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRayon()}
                  />
                  <Button onClick={addRayon}>Ajouter</Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rayons.map((rayon) => (
                    <div key={rayon} className="flex items-center justify-between p-2 border rounded">
                      <span>{rayon}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeRayon(rayon)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isFormeDialogOpen} onOpenChange={setIsFormeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Gérer Formes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestion des Formes</DialogTitle>
                <DialogDescription>
                  Ajouter ou supprimer des formes pharmaceutiques.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouvelle forme (ex: Poudre)"
                    value={newForme}
                    onChange={(e) => setNewForme(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addForme()}
                  />
                  <Button onClick={addForme}>Ajouter</Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formes.map((forme) => (
                    <div key={forme} className="flex items-center justify-between p-2 border rounded">
                      <span>{forme}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeForme(forme)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm">
            <ScanLine className="w-4 h-4 mr-2" />
            Scanner Code-barres
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                <DialogDescription>
                  Remplissez toutes les informations requises pour le nouveau médicament.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nomCommercial">Nom commercial *</Label>
                  <Input 
                    id="nomCommercial" 
                    placeholder="ex: Doliprane 1000mg"
                    value={productForm.nom_commercial}
                    onChange={(e) => setProductForm({...productForm, nom_commercial: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dci">DCI (Substance active) *</Label>
                  <Input 
                    id="dci" 
                    placeholder="ex: Paracétamol"
                    value={productForm.dci}
                    onChange={(e) => setProductForm({...productForm, dci: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input 
                    id="dosage" 
                    placeholder="ex: 1000mg"
                    value={productForm.dosage}
                    onChange={(e) => setProductForm({...productForm, dosage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forme">Forme *</Label>
                  <Select value={productForm.forme} onValueChange={(value) => setProductForm({...productForm, forme: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une forme" />
                    </SelectTrigger>
                    <SelectContent>
                      {formes.map(forme => (
                        <SelectItem key={forme} value={forme}>{forme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laboratoire">Laboratoire *</Label>
                  <Select value={productForm.laboratoire} onValueChange={(value) => setProductForm({...productForm, laboratoire: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un laboratoire" />
                    </SelectTrigger>
                    <SelectContent>
                      {laboratoires.map(labo => (
                        <SelectItem key={labo} value={labo}>{labo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rayon">Rayon *</Label>
                  <Select value={productForm.rayon} onValueChange={(value) => setProductForm({...productForm, rayon: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rayon" />
                    </SelectTrigger>
                    <SelectContent>
                      {rayons.map(rayon => (
                        <SelectItem key={rayon} value={rayon}>{rayon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="etagere">Étagère</Label>
                  <Input 
                    id="etagere" 
                    type="number" 
                    placeholder="Numéro d'étagère"
                    value={productForm.etagere}
                    onChange={(e) => setProductForm({...productForm, etagere: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeBarres">Code-barres</Label>
                  <Input 
                    id="codeBarres" 
                    placeholder="Code-barres du produit"
                    value={productForm.code_barres}
                    onChange={(e) => setProductForm({...productForm, code_barres: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prixUnitaire">Prix unitaire (FCFA) *</Label>
                  <Input 
                    id="prixUnitaire" 
                    type="number" 
                    placeholder="Prix en FCFA"
                    value={productForm.prix_unitaire}
                    onChange={(e) => setProductForm({...productForm, prix_unitaire: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockMinimum">Stock minimum *</Label>
                  <Input 
                    id="stockMinimum" 
                    type="number" 
                    placeholder="Seuil d'alerte"
                    value={productForm.stock_minimum}
                    onChange={(e) => setProductForm({...productForm, stock_minimum: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeVente">Type de vente *</Label>
                  <Select value={productForm.type_vente} onValueChange={(value) => setProductForm({...productForm, type_vente: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de vente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="libre">Vente libre</SelectItem>
                      <SelectItem value="reglemente">Vente réglementée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateProduct} disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pharmacy Image Header */}
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-green-100 to-green-50">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1632024894467-10dd0266ad92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwYm90dGxlc3xlbnwxfHx8fDE3NTY3Mjc1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Produits pharmaceutiques"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-400/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-green-800">
              <Pill className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Catalogue Pharmaceutique</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, DCI ou code-barres..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedRayon} onValueChange={setSelectedRayon}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Tous les rayons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les rayons</SelectItem>
            {rayons.map(rayon => (
              <SelectItem key={rayon} value={rayon}>{rayon}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Plus de filtres
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.nom_commercial}</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Badge variant="outline">{product.dci}</Badge>
                      <Badge variant="outline">{product.dosage}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Badge variant={getTypeVenteColor(product.type_vente)}>
                        {product.type_vente === 'libre' ? 'Libre' : 'Ordonnance'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={getStatusColor(product.statut)} className="text-xs">
                    {getStatusText(product.statut)}
                  </Badge>
                  {product.stock_lots?.[0]?.date_expiration && isExpiringSoon(product.stock_lots[0].date_expiration) && (
                    <Badge variant="secondary" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Expire bientôt
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Product Details */}
              <div className="text-xs space-y-1 bg-muted p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forme:</span>
                  <span>{product.forme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Laboratoire:</span>
                  <span>{product.laboratoire}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot:</span>
                  <span className="font-mono">{product.stock_lots?.[0]?.numero_lot || 'N/A'}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{product.rayon}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Étag.</span> {product.etagere}
                </div>
              </div>

              {/* Stock Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock actuel</p>
                  <p className="text-xl font-bold text-primary">
                    {product.stock_lots?.reduce((total, lot) => total + lot.quantite, 0) || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Prix unitaire</p>
                  <p className="font-semibold text-green-600">{product.prix_unitaire?.toLocaleString()} FCFA</p>
                </div>
              </div>

              {/* Expiry */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiration</p>
                    <p className="text-sm font-medium">{product.stock_lots?.[0]?.date_expiration || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucun produit ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Produit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
