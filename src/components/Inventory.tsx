import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Search, 
  Plus, 
  Package, 
  Edit, 
  AlertTriangle,
  Filter,
  ScanLine
} from "lucide-react";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const medications = [
    {
      id: 1,
      name: "Doliprane 1000mg",
      category: "Antalgique",
      stock: 250,
      minStock: 50,
      price: "1,600 FCFA",
      expiry: "2025-12-15",
      batch: "DL2025A",
      status: "good"
    },
    {
      id: 2,
      name: "Amoxicilline 500mg",
      category: "Antibiotique",
      stock: 120,
      minStock: 30,
      price: "4,800 FCFA",
      expiry: "2025-08-20",
      batch: "AMX2025B",
      status: "good"
    },
    {
      id: 3,
      name: "Insuline Rapid",
      category: "Antidiabétique",
      stock: 3,
      minStock: 10,
      price: "12,500 FCFA",
      expiry: "2025-11-30",
      batch: "INS2025C",
      status: "low"
    },
    {
      id: 4,
      name: "Aspirine 100mg",
      category: "Antiagrégant",
      stock: 8,
      minStock: 20,
      price: "800 FCFA",
      expiry: "2026-01-10",
      batch: "ASP2026A",
      status: "low"
    },
    {
      id: 5,
      name: "Paracétamol 500mg",
      category: "Antalgique",
      stock: 450,
      minStock: 100,
      price: "700 FCFA",
      expiry: "2025-10-05",
      batch: "PAR2025D",
      status: "expiry_soon"
    }
  ];

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "default";
      case "low": return "destructive";
      case "expiry_soon": return "secondary";
      default: return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "good": return "Stock OK";
      case "low": return "Stock Faible";
      case "expiry_soon": return "Expire Bientôt";
      default: return "Normal";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion d'Inventaire</h1>
          <p className="text-muted-foreground">
            {filteredMedications.length} médicaments trouvés
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ScanLine className="w-4 h-4 mr-2" />
            Scanner
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Médicament
          </Button>
        </div>
      </div>

      {/* Pharmacy Image Header */}
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-green-100 to-green-50">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1632024894467-10dd0266ad92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwYm90dGxlc3xlbnwxfHx8fDE3NTY3Mjc1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Médicaments en stock"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-400/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-green-800">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Stock Pharmaceutique</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou catégorie..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedications.map((med) => (
          <Card key={med.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{med.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {med.category}
                    </Badge>
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(med.status)} className="text-xs">
                  {getStatusText(med.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stock Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock actuel</p>
                  <p className="text-xl font-bold text-primary">{med.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Stock minimum</p>
                  <p className="text-sm font-medium">{med.minStock}</p>
                </div>
              </div>

              {/* Price and Batch */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prix unitaire</p>
                  <p className="font-semibold text-green-600">{med.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Lot</p>
                  <p className="text-sm font-mono">{med.batch}</p>
                </div>
              </div>

              {/* Expiry */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiration</p>
                  <p className="text-sm font-medium">{med.expiry}</p>
                </div>
                {med.status === "expiry_soon" && (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  <Package className="w-4 h-4 mr-2" />
                  Réapprovisionner
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMedications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun médicament trouvé</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucun médicament ne correspond à votre recherche.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Médicament
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
