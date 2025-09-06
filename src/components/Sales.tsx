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
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  Calculator,
  Receipt,
  User,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Clock,
  Shield
} from "lucide-react";

export default function Sales() {
  const { getProducts, loading } = useMockPharmacyApi();
  const [medications, setMedications] = useState([]);
  const [cart, setCart] = useState<Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
  }>>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await getProducts();
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.nom_commercial,
        price: product.prix_unitaire,
        stock: product.stock_lots?.reduce((total, lot) => total + lot.quantite, 0) || 0,
        type: product.type_vente,
        dci: product.dci,
        lot: product.stock_lots?.[0]?.numero_lot || 'N/A',
        expiry: product.stock_lots?.[0]?.date_expiration || new Date().toISOString()
      }));
      setMedications(formattedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  const [selectedPrescription, setSelectedPrescription] = useState<string>("");
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isCreditSale, setIsCreditSale] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("especes");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isNewCustomerMode, setIsNewCustomerMode] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    adresse: "",
    limiteCredit: 50000
  });

  // État pour les ventes en attente
  const [pendingSales, setPendingSales] = useState<Array<{
    id: string;
    timestamp: string;
    cart: typeof cart;
    customer?: any;
    prescription?: string;
    isCredit: boolean;
    paymentMethod: string;
    total: number;
  }>>([
    {
      id: "WAIT-001",
      timestamp: "09:15",
      cart: [
        { id: 1, name: "Doliprane 1000mg", price: 1600, quantity: 2, stock: 250 },
        { id: 3, name: "Paracétamol 500mg", price: 700, quantity: 3, stock: 450 }
      ],
      customer: { prenom: "Aminata", nom: "Diallo" },
      isCredit: true,
      paymentMethod: "credit",
      total: 5300
    },
    {
      id: "WAIT-002", 
      timestamp: "10:30",
      cart: [
        { id: 4, name: "Vitamine C", price: 1500, quantity: 1, stock: 80 }
      ],
      isCredit: false,
      paymentMethod: "especes",
      total: 1500
    }
  ]);
  const [showPendingSales, setShowPendingSales] = useState(false);



  const prescriptions = [
    { id: "ORD-2025-001", patient: "Aminata Diallo", medecin: "Dr. Sow", date: "2025-09-01", statut: "en_attente" },
    { id: "ORD-2025-002", patient: "Omar Ba", medecin: "Dr. Fall", date: "2025-09-01", statut: "partiellement_delivree" },
  ];

  const clients = [
    { id: 1, nom: "Diallo", prenom: "Aminata", telephone: "+221 77 123 45 67", creditLimit: 50000, currentDebt: 23400 },
    { id: 2, nom: "Sy", prenom: "Mamadou", telephone: "+221 70 987 65 43", creditLimit: 75000, currentDebt: 67500 },
    { id: 3, nom: "Ba", prenom: "Omar", telephone: "+221 78 222 11 00", creditLimit: 100000, currentDebt: 105000 },
  ];

  const addToCart = (medication: typeof medications[0]) => {
    // Vérifier si le produit nécessite une ordonnance
    if (medication.type === "reglemente" && !selectedPrescription) {
      alert("Ce médicament nécessite une ordonnance valide");
      return;
    }

    const existingItem = cart.find(item => item.id === medication.id);
    if (existingItem) {
      if (existingItem.quantity < medication.stock) {
        setCart(cart.map(item =>
          item.id === medication.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { ...medication, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, Math.min(item.stock, item.quantity + change));
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCreditSaleChange = (checked: boolean) => {
    setIsCreditSale(checked);
    if (checked) {
      setSelectedPaymentMethod("credit");
      if (!selectedCustomer) {
        setIsCustomerDialogOpen(true);
      }
    } else {
      setSelectedPaymentMethod("especes");
      setSelectedCustomer(null);
    }
  };

  const selectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerDialogOpen(false);
  };

  const createNewCustomer = () => {
    if (newCustomerData.prenom && newCustomerData.nom && newCustomerData.telephone) {
      const newCustomer = {
        id: Date.now(),
        ...newCustomerData,
        creditLimit: newCustomerData.limiteCredit,
        currentDebt: 0
      };
      setSelectedCustomer(newCustomer);
      setIsNewCustomerMode(false);
      setIsCustomerDialogOpen(false);
      // Reset form
      setNewCustomerData({
        prenom: "",
        nom: "",
        telephone: "",
        adresse: "",
        limiteCredit: 50000
      });
    }
  };

  // Fonctions pour gérer les ventes en attente
  const putOnHold = () => {
    if (cart.length === 0) return;
    
    const pendingSale = {
      id: `WAIT-${String(pendingSales.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      cart: [...cart],
      customer: selectedCustomer,
      prescription: selectedPrescription,
      isCredit: isCreditSale,
      paymentMethod: selectedPaymentMethod,
      total: getTotal()
    };
    
    setPendingSales([...pendingSales, pendingSale]);
    
    // Réinitialiser la vente actuelle
    setCart([]);
    setSelectedCustomer(null);
    setSelectedPrescription("");
    setIsCreditSale(false);
    setSelectedPaymentMethod("especes");
  };

  const resumeSale = (pendingSale: typeof pendingSales[0]) => {
    setCart(pendingSale.cart);
    setSelectedCustomer(pendingSale.customer || null);
    setSelectedPrescription(pendingSale.prescription || "");
    setIsCreditSale(pendingSale.isCredit);
    setSelectedPaymentMethod(pendingSale.paymentMethod);
    
    // Supprimer de la liste des ventes en attente
    setPendingSales(pendingSales.filter(sale => sale.id !== pendingSale.id));
    setShowPendingSales(false);
  };

  const deletePendingSale = (saleId: string) => {
    setPendingSales(pendingSales.filter(sale => sale.id !== saleId));
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left Panel - Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Point de Vente</h1>
              <p className="text-muted-foreground">Gestion des ventes libres et réglementées</p>
            </div>
            <div className="flex gap-2">
              {/* Ventes en attente */}
              <Dialog open={showPendingSales} onOpenChange={setShowPendingSales}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Clock className="w-4 h-4 mr-2" />
                    Ventes en Attente
                    {pendingSales.length > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center">
                        {pendingSales.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Ventes en Attente ({pendingSales.length})</DialogTitle>
                    <DialogDescription>
                      Reprendre ou supprimer les ventes mises en attente.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pendingSales.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Aucune vente en attente</p>
                      </div>
                    ) : (
                      pendingSales.map((sale) => (
                        <Card key={sale.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{sale.id}</Badge>
                                <span className="text-sm text-muted-foreground">{sale.timestamp}</span>
                                {sale.customer && (
                                  <Badge variant="secondary">
                                    {sale.customer.prenom} {sale.customer.nom}
                                  </Badge>
                                )}
                                {sale.isCredit && (
                                  <Badge variant="destructive">Crédit</Badge>
                                )}
                              </div>
                              <div className="space-y-1 text-sm">
                                {sale.cart.map((item, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 pt-2 border-t">
                                <div className="flex justify-between font-semibold text-primary">
                                  <span>Total:</span>
                                  <span>{sale.total.toLocaleString()} FCFA</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                onClick={() => resumeSale(sale)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Reprendre
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => deletePendingSale(sale.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {selectedCustomer && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedCustomer.prenom} {selectedCustomer.nom}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedCustomer(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
              
              {isCreditSale && (
                <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      {selectedCustomer ? 'Changer Client' : 'Sélectionner Client'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isNewCustomerMode ? 'Créer un nouveau client' : 'Sélectionner un client'}
                    </DialogTitle>
                    <DialogDescription>
                      {isNewCustomerMode 
                        ? 'Créer un compte client pour la vente à crédit.' 
                        : 'Recherchez et sélectionnez un client existant ou créez-en un nouveau.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!isNewCustomerMode ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input placeholder="Rechercher par nom ou téléphone..." className="pl-10" />
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {clients.map((client) => (
                          <div 
                            key={client.id} 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                            onClick={() => selectCustomer(client)}
                          >
                            <div>
                              <p className="font-medium">{client.prenom} {client.nom}</p>
                              <p className="text-sm text-muted-foreground">{client.telephone}</p>
                            </div>
                            <div className="text-right text-sm">
                              <p>Limite: {client.creditLimit.toLocaleString()} FCFA</p>
                              <p className={`${client.currentDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                Dette: {client.currentDebt.toLocaleString()} FCFA
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button variant="outline" onClick={() => setIsNewCustomerMode(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Nouveau Client
                        </Button>
                        <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPrenom">Prénom *</Label>
                          <Input 
                            id="newPrenom"
                            value={newCustomerData.prenom}
                            onChange={(e) => setNewCustomerData({...newCustomerData, prenom: e.target.value})}
                            placeholder="Prénom"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newNom">Nom *</Label>
                          <Input 
                            id="newNom"
                            value={newCustomerData.nom}
                            onChange={(e) => setNewCustomerData({...newCustomerData, nom: e.target.value})}
                            placeholder="Nom de famille"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newTelephone">Téléphone *</Label>
                          <Input 
                            id="newTelephone"
                            value={newCustomerData.telephone}
                            onChange={(e) => setNewCustomerData({...newCustomerData, telephone: e.target.value})}
                            placeholder="+221 XX XXX XX XX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newLimiteCredit">Limite de crédit (FCFA)</Label>
                          <Input 
                            id="newLimiteCredit"
                            type="number"
                            value={newCustomerData.limiteCredit}
                            onChange={(e) => setNewCustomerData({...newCustomerData, limiteCredit: parseInt(e.target.value) || 0})}
                            placeholder="50000"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="newAdresse">Adresse *</Label>
                          <Input 
                            id="newAdresse"
                            value={newCustomerData.adresse}
                            onChange={(e) => setNewCustomerData({...newCustomerData, adresse: e.target.value})}
                            placeholder="Adresse complète"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button variant="outline" onClick={() => setIsNewCustomerMode(false)}>
                          Retour
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button onClick={createNewCustomer}>
                            Créer Client
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Scanner Ordonnance
              </Button>
            </div>
          </div>

          {/* Prescription Selection */}
          <Card className="bg-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="prescription">Ordonnance (pour médicaments réglementés)</Label>
                  <Select value={selectedPrescription} onValueChange={setSelectedPrescription}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ordonnance..." />
                    </SelectTrigger>
                    <SelectContent>
                      {prescriptions.map((prescription) => (
                        <SelectItem key={prescription.id} value={prescription.id}>
                          {prescription.id} - {prescription.patient} ({prescription.medecin})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="creditSale"
                    checked={isCreditSale}
                    onChange={(e) => handleCreditSaleChange(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="creditSale" className="text-sm">Vente à crédit</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Rechercher un médicament..."
              className="w-full"
            />
          </div>

          {/* Medications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => {
              const isExpired = new Date(med.expiry) < new Date();
              const isExpiringSoon = new Date(med.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              
              return (
                <Card key={med.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{med.name}</CardTitle>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600 text-sm">
                              {med.price.toLocaleString()} FCFA
                            </span>
                            <Badge variant={med.type === "libre" ? "default" : "secondary"} className="text-xs">
                              {med.type === "libre" ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Libre
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3 h-3 mr-1" />
                                  Ordonnance
                                </>
                              )}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">DCI: {med.dci}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant={med.stock > 20 ? "default" : med.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                          Stock: {med.stock}
                        </Badge>
                        {isExpired && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Expiré
                          </Badge>
                        )}
                        {!isExpired && isExpiringSoon && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Expire bientôt
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs space-y-1 bg-muted p-2 rounded">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lot:</span>
                        <span className="font-mono">{med.lot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiration:</span>
                        <span className={isExpired ? 'text-red-600 font-semibold' : ''}>{med.expiry}</span>
                      </div>
                    </div>
                    
                    {med.type === "reglemente" && !selectedPrescription && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Une ordonnance est requise pour ce médicament
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      onClick={() => addToCart(med)}
                      disabled={med.stock === 0 || isExpired || (med.type === "reglemente" && !selectedPrescription)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter au Panier
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Panier ({getTotalItems()})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Cart Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Panier vide</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-green-600 font-semibold">
                          {item.price.toLocaleString()} FCFA
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  {/* Total */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Sous-total:</span>
                      <span className="font-semibold">
                        {getTotal().toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxe (0%):</span>
                      <span>0 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-primary border-t pt-2">
                      <span>Total:</span>
                      <span>{getTotal().toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Méthode de paiement:</p>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="especes">💵 Espèces</SelectItem>
                        <SelectItem value="carte">💳 Carte bancaire</SelectItem>
                        <SelectItem value="mobile_money">📱 Mobile Money</SelectItem>
                        <SelectItem value="cheque">📄 Chèque</SelectItem>
                        {isCreditSale && <SelectItem value="credit">🏦 Crédit</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>

                  {isCreditSale && selectedCustomer && (
                    <Alert className={selectedCustomer.currentDebt + getTotal() > selectedCustomer.creditLimit ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
                      <CreditCard className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <div className="space-y-1">
                          <p>Client: {selectedCustomer.prenom} {selectedCustomer.nom}</p>
                          <p>Dette actuelle: {selectedCustomer.currentDebt.toLocaleString()} FCFA</p>
                          <p>Dette après vente: {(selectedCustomer.currentDebt + getTotal()).toLocaleString()} FCFA</p>
                          <p>Limite: {selectedCustomer.creditLimit.toLocaleString()} FCFA</p>
                          {selectedCustomer.currentDebt + getTotal() > selectedCustomer.creditLimit && (
                            <p className="text-red-600 font-medium">⚠️ Limite de crédit dépassée!</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {isCreditSale && !selectedCustomer && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Vous devez sélectionner un client pour une vente à crédit.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={isCreditSale && (!selectedCustomer || (selectedCustomer.currentDebt + getTotal() > selectedCustomer.creditLimit))}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Finaliser la Vente
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={putOnHold}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Mettre en Attente
                      </Button>
                      {!isCreditSale && (
                        <Button variant="outline" className="w-full" size="sm">
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculer Monnaie
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Ventes du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transactions:</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="font-semibold text-green-600">847,500 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Moyenne:</span>
                  <span className="font-semibold">36,850 FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
