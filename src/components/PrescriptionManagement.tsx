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
import { 
  Search, 
  Plus, 
  FileText, 
  User,
  Calendar,
  Stethoscope,
  Camera,
  Upload,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Pill
} from "lucide-react";

interface Prescription {
  id: number;
  numeroOrdonnance: string;
  patient: {
    nom: string;
    prenom: string;
    telephone: string;
    dateNaissance: string;
    numeroAssurance?: string;
  };
  medecin: {
    nom: string;
    prenom: string;
    specialite: string;
    numeroOrdre: string;
  };
  dateCreation: string;
  dateValidite: string;
  statut: 'en_attente' | 'validee' | 'partiellement_delivree' | 'entierement_delivree' | 'expiree';
  medicaments: Array<{
    id: number;
    nom: string;
    dci: string;
    dosage: string;
    forme: string;
    quantitePrescrite: number;
    quantiteDelivree: number;
    posologie: string;
    dureeTraitement: string;
    statut: 'non_delivre' | 'partiellement_delivre' | 'entierement_delivre';
  }>;
  fichierOrdonnance?: string;
  commentairePharmacie?: string;
  validePar?: string;
  dateValidation?: string;
  totalPrescrit: number;
  totalDelivre: number;
}

export default function PrescriptionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("tous");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const prescriptions: Prescription[] = [
    {
      id: 1,
      numeroOrdonnance: "ORD-2025-001",
      patient: {
        nom: "Diallo",
        prenom: "Aminata",
        telephone: "+221 77 123 45 67",
        dateNaissance: "1985-03-15",
        numeroAssurance: "ASS123456789"
      },
      medecin: {
        nom: "Dr. Sow",
        prenom: "Mamadou",
        specialite: "Médecine générale",
        numeroOrdre: "MG12345"
      },
      dateCreation: "2025-09-01T08:30:00",
      dateValidite: "2025-10-01",
      statut: 'partiellement_delivree',
      medicaments: [
        {
          id: 1,
          nom: "Amoxicilline Biogaran 500mg",
          dci: "Amoxicilline",
          dosage: "500mg",
          forme: "Gélules",
          quantitePrescrite: 21,
          quantiteDelivree: 21,
          posologie: "1 gélule 3 fois par jour",
          dureeTraitement: "7 jours",
          statut: 'entierement_delivre'
        },
        {
          id: 2,
          nom: "Doliprane 1000mg",
          dci: "Paracétamol",
          dosage: "1000mg",
          forme: "Comprimés",
          quantitePrescrite: 20,
          quantiteDelivree: 10,
          posologie: "1 comprimé jusqu'à 3 fois par jour si douleur",
          dureeTraitement: "10 jours maximum",
          statut: 'partiellement_delivre'
        }
      ],
      fichierOrdonnance: "ordonnance_001.pdf",
      commentairePharmacie: "Patient régulier, traitement habituel",
      validePar: "Dr. Pharmacien Ndiaye",
      dateValidation: "2025-09-01T08:35:00",
      totalPrescrit: 41,
      totalDelivre: 31
    },
    {
      id: 2,
      numeroOrdonnance: "ORD-2025-002",
      patient: {
        nom: "Ba",
        prenom: "Omar",
        telephone: "+221 78 222 11 00",
        dateNaissance: "1978-11-22"
      },
      medecin: {
        nom: "Dr. Fall",
        prenom: "Fatou",
        specialite: "Cardiologie",
        numeroOrdre: "CARD67890"
      },
      dateCreation: "2025-09-01T10:15:00",
      dateValidite: "2025-12-01",
      statut: 'en_attente',
      medicaments: [
        {
          id: 3,
          nom: "Aspirine Protect 100mg",
          dci: "Acide acétylsalicylique",
          dosage: "100mg",
          forme: "Comprimés",
          quantitePrescrite: 90,
          quantiteDelivree: 0,
          posologie: "1 comprimé par jour le matin",
          dureeTraitement: "3 mois",
          statut: 'non_delivre'
        },
        {
          id: 4,
          nom: "Lisinopril 10mg",
          dci: "Lisinopril",
          dosage: "10mg",
          forme: "Comprimés",
          quantitePrescrite: 90,
          quantiteDelivree: 0,
          posologie: "1 comprimé par jour",
          dureeTraitement: "3 mois",
          statut: 'non_delivre'
        }
      ],
      fichierOrdonnance: "ordonnance_002.jpg",
      totalPrescrit: 180,
      totalDelivre: 0
    },
    {
      id: 3,
      numeroOrdonnance: "ORD-2025-003",
      patient: {
        nom: "Ndiaye",
        prenom: "Fatou",
        telephone: "+221 76 555 44 33",
        dateNaissance: "1992-07-08"
      },
      medecin: {
        nom: "Dr. Sarr",
        prenom: "Abdou",
        specialite: "Endocrinologie",
        numeroOrdre: "ENDO54321"
      },
      dateCreation: "2025-08-28T14:20:00",
      dateValidite: "2025-11-28",
      statut: 'entierement_delivree',
      medicaments: [
        {
          id: 5,
          nom: "Insuline Lantus",
          dci: "Insuline glargine",
          dosage: "100 UI/ml",
          forme: "Solution injectable",
          quantitePrescrite: 5,
          quantiteDelivree: 5,
          posologie: "Selon schéma personnalisé",
          dureeTraitement: "1 mois",
          statut: 'entierement_delivre'
        }
      ],
      fichierOrdonnance: "ordonnance_003.pdf",
      commentairePharmacie: "Patient diabétique de type 1, suivi régulier",
      validePar: "Dr. Pharmacien Ndiaye",
      dateValidation: "2025-08-28T14:25:00",
      totalPrescrit: 5,
      totalDelivre: 5
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.numeroOrdonnance.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${prescription.patient.prenom} ${prescription.patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${prescription.medecin.prenom} ${prescription.medecin.nom}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = selectedStatut === "tous" || prescription.statut === selectedStatut;
    return matchesSearch && matchesStatut;
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_attente": return "secondary";
      case "validee": return "default";
      case "partiellement_delivree": return "secondary";
      case "entierement_delivree": return "default";
      case "expiree": return "destructive";
      default: return "outline";
    }
  };

  const getStatutText = (statut: string) => {
    const statuts: { [key: string]: string } = {
      en_attente: "En attente",
      validee: "Validée",
      partiellement_delivree: "Partiellement délivrée",
      entierement_delivree: "Entièrement délivrée",
      expiree: "Expirée"
    };
    return statuts[statut] || statut;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "en_attente": return <Clock className="w-4 h-4" />;
      case "validee": return <CheckCircle className="w-4 h-4" />;
      case "partiellement_delivree": return <AlertCircle className="w-4 h-4" />;
      case "entierement_delivree": return <CheckCircle className="w-4 h-4" />;
      case "expiree": return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMedicamentStatutColor = (statut: string) => {
    switch (statut) {
      case "non_delivre": return "outline";
      case "partiellement_delivre": return "secondary";
      case "entierement_delivre": return "default";
      default: return "outline";
    }
  };

  const isExpiringSoon = (dateValidite: string) => {
    const expiry = new Date(dateValidite);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Ordonnances</h1>
          <p className="text-muted-foreground">
            {filteredPrescriptions.length} ordonnances trouvées
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            Scanner Ordonnance
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Ordonnance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enregistrer une nouvelle ordonnance</DialogTitle>
                <DialogDescription>
                  Saisissez les informations de l'ordonnance ou uploadez le fichier scan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Informations Patient</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="patientNom">Nom *</Label>
                      <Input id="patientNom" placeholder="Nom du patient" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientPrenom">Prénom *</Label>
                      <Input id="patientPrenom" placeholder="Prénom du patient" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientTelephone">Téléphone</Label>
                    <Input id="patientTelephone" placeholder="+221 XX XXX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientNaissance">Date de naissance</Label>
                    <Input id="patientNaissance" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientAssurance">N° Assurance</Label>
                    <Input id="patientAssurance" placeholder="Numéro d'assurance" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Informations Médecin</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="medecinNom">Nom *</Label>
                      <Input id="medecinNom" placeholder="Nom du médecin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medecinPrenom">Prénom *</Label>
                      <Input id="medecinPrenom" placeholder="Prénom du médecin" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medecinSpecialite">Spécialité</Label>
                    <Input id="medecinSpecialite" placeholder="Spécialité médicale" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medecinOrdre">N° Ordre *</Label>
                    <Input id="medecinOrdre" placeholder="Numéro d'ordre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateValidite">Date de validité *</Label>
                    <Input id="dateValidite" type="date" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Fichier Ordonnance</h3>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez et déposez le fichier ici, ou cliquez pour sélectionner
                  </p>
                  <Button variant="outline" size="sm">
                    Choisir un fichier
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Enregistrer
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
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => p.statut === 'en_attente').length}
            </div>
            <p className="text-xs text-muted-foreground">ordonnances à traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partiellement Délivrées</CardTitle>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => p.statut === 'partiellement_delivree').length}
            </div>
            <p className="text-xs text-muted-foreground">en cours de délivrance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complètes</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => p.statut === 'entierement_delivree').length}
            </div>
            <p className="text-xs text-muted-foreground">entièrement délivrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expire Bientôt</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => isExpiringSoon(p.dateValidite)).length}
            </div>
            <p className="text-xs text-muted-foreground">dans les 7 jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro, patient ou médecin..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedStatut} onValueChange={setSelectedStatut}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="validee">Validée</SelectItem>
            <SelectItem value="partiellement_delivree">Partiellement délivrée</SelectItem>
            <SelectItem value="entierement_delivree">Entièrement délivrée</SelectItem>
            <SelectItem value="expiree">Expirée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {prescription.patient.prenom[0]}{prescription.patient.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {prescription.patient.prenom} {prescription.patient.nom}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {prescription.numeroOrdonnance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(prescription.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isExpiringSoon(prescription.dateValidite) && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Expire bientôt
                    </Badge>
                  )}
                  <Badge variant={getStatutColor(prescription.statut)} className="flex items-center gap-1">
                    {getStatutIcon(prescription.statut)}
                    {getStatutText(prescription.statut)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Doctor Info */}
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                <span>
                  Dr. {prescription.medecin.prenom} {prescription.medecin.nom} 
                  - {prescription.medecin.specialite}
                </span>
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Médicaments prescrits:</h4>
                <div className="space-y-2">
                  {prescription.medicaments.map((medicament) => (
                    <div key={medicament.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Pill className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{medicament.nom}</p>
                          <p className="text-xs text-muted-foreground">
                            {medicament.posologie} - {medicament.dureeTraitement}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <p>
                            <span className="font-semibold">{medicament.quantiteDelivree}</span>
                            /{medicament.quantitePrescrite}
                          </p>
                          <p className="text-xs text-muted-foreground">délivré/prescrit</p>
                        </div>
                        <Badge variant={getMedicamentStatutColor(medicament.statut)} className="text-xs">
                          {medicament.statut === 'non_delivre' ? 'Non délivré' :
                           medicament.statut === 'partiellement_delivre' ? 'Partiel' :
                           'Complet'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between text-sm">
                <span>Progression:</span>
                <span className="font-semibold">
                  {prescription.totalDelivre}/{prescription.totalPrescrit} 
                  ({Math.round((prescription.totalDelivre / prescription.totalPrescrit) * 100)}%)
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Détails
                </Button>
                {prescription.fichierOrdonnance && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                )}
                {prescription.statut !== 'entierement_delivree' && (
                  <Button size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Délivrer
                  </Button>
                )}
              </div>

              {prescription.commentairePharmacie && (
                <div className="mt-3 p-3 bg-secondary rounded-lg">
                  <p className="text-sm italic">"{prescription.commentairePharmacie}"</p>
                  {prescription.validePar && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Validé par {prescription.validePar} le {new Date(prescription.dateValidation!).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune ordonnance trouvée</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucune ordonnance ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une Ordonnance
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
