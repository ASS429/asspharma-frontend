import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  DollarSign, 
  Plus,
  Minus,
  Calculator,
  Receipt,
  Clock,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Smartphone,
  FileText,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Eye
} from "lucide-react";

interface CashTransaction {
  id: number;
  type: 'entree' | 'sortie' | 'vente';
  montant: number;
  description: string;
  timestamp: string;
  utilisateur: string;
  reference?: string;
  methodePaiement: 'especes' | 'carte' | 'mobile_money' | 'cheque';
}

interface CashSession {
  id: number;
  dateOuverture: string;
  dateFermeture?: string;
  fondInitial: number;
  fondFinal?: number;
  totalVentes: number;
  totalEntrees: number;
  totalSorties: number;
  ecart?: number;
  statut: 'ouverte' | 'fermee';
  utilisateur: string;
  transactions: CashTransaction[];
}

export default function CashManagement() {
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [fondInitial, setFondInitial] = useState(50000);
  const [fondFinal, setFondFinal] = useState("");
  const [transactionType, setTransactionType] = useState<'entree' | 'sortie'>('entree');
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");

  const currentSession: CashSession = {
    id: 1,
    dateOuverture: "2025-09-01T08:00:00",
    fondInitial: 50000,
    totalVentes: 289650,
    totalEntrees: 15000,
    totalSorties: 8500,
    statut: 'ouverte',
    utilisateur: "Dr. Ndiaye",
    transactions: [
      {
        id: 1,
        type: 'entree',
        montant: 50000,
        description: "Ouverture de caisse - Fond initial",
        timestamp: "2025-09-01T08:00:00",
        utilisateur: "Dr. Ndiaye",
        methodePaiement: 'especes'
      },
      {
        id: 2,
        type: 'vente',
        montant: 12500,
        description: "Vente - Doliprane 1000mg x5",
        timestamp: "2025-09-01T09:15:00",
        utilisateur: "Marie Sow",
        reference: "V-2025-0234",
        methodePaiement: 'especes'
      },
      {
        id: 3,
        type: 'vente',
        montant: 8900,
        description: "Vente - Vitamines",
        timestamp: "2025-09-01T09:30:00",
        utilisateur: "Marie Sow",
        reference: "V-2025-0235",
        methodePaiement: 'mobile_money'
      },
      {
        id: 4,
        type: 'sortie',
        montant: 5000,
        description: "Achat papeterie bureau",
        timestamp: "2025-09-01T11:20:00",
        utilisateur: "Dr. Ndiaye",
        methodePaiement: 'especes'
      },
      {
        id: 5,
        type: 'entree',
        montant: 15000,
        description: "Remboursement assurance",
        timestamp: "2025-09-01T14:30:00",
        utilisateur: "Dr. Ndiaye",
        methodePaiement: 'especes'
      }
    ]
  };

  const recentSessions: CashSession[] = [
    {
      id: 2,
      dateOuverture: "2025-08-31T08:00:00",
      dateFermeture: "2025-08-31T18:30:00",
      fondInitial: 45000,
      fondFinal: 52300,
      totalVentes: 267800,
      totalEntrees: 8000,
      totalSorties: 3500,
      ecart: 0,
      statut: 'fermee',
      utilisateur: "Dr. Ndiaye",
      transactions: []
    },
    {
      id: 3,
      dateOuverture: "2025-08-30T08:00:00",
      dateFermeture: "2025-08-30T18:30:00",
      fondInitial: 50000,
      fondFinal: 48200,
      totalVentes: 234650,
      totalEntrees: 0,
      totalSorties: 6450,
      ecart: -1800,
      statut: 'fermee',
      utilisateur: "Dr. Ndiaye",
      transactions: []
    }
  ];

  const getSoldeTheorique = () => {
    return currentSession.fondInitial + 
           currentSession.totalVentes + 
           currentSession.totalEntrees - 
           currentSession.totalSorties;
  };

  const getVentesParMethode = () => {
    const methods = {
      especes: 0,
      carte: 0,
      mobile_money: 0,
      cheque: 0
    };
    
    currentSession.transactions
      .filter(t => t.type === 'vente')
      .forEach(t => {
        methods[t.methodePaiement] += t.montant;
      });
    
    return methods;
  };

  const ventesParMethode = getVentesParMethode();

  const openCashSession = () => {
    setIsSessionOpen(true);
    setIsOpenDialogOpen(false);
  };

  const closeCashSession = () => {
    const fondFinalNum = parseInt(fondFinal);
    const soldeTheorique = getSoldeTheorique();
    const ecart = fondFinalNum - soldeTheorique;
    
    setIsSessionOpen(false);
    setIsCloseDialogOpen(false);
    setFondFinal("");
  };

  const addTransaction = () => {
    // Add transaction logic here
    setIsTransactionDialogOpen(false);
    setTransactionAmount("");
    setTransactionDescription("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Gestion de Caisse
          </h1>
          <p className="text-muted-foreground">
            Suivi des mouvements de caisse et clôtures journalières
          </p>
        </div>
        <div className="flex gap-2">
          {!isSessionOpen ? (
            <Dialog open={isOpenDialogOpen} onOpenChange={setIsOpenDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Unlock className="w-4 h-4 mr-2" />
                  Ouvrir Caisse
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ouverture de caisse</DialogTitle>
                  <DialogDescription>
                    Démarrer une nouvelle session de caisse avec le fond initial.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fond initial (FCFA)</Label>
                    <Input
                      type="number"
                      value={fondInitial}
                      onChange={(e) => setFondInitial(parseInt(e.target.value) || 0)}
                      placeholder="Montant du fond de caisse"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Date et heure: {new Date().toLocaleString('fr-FR')}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsOpenDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={openCashSession}>
                    Ouvrir la Caisse
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Mouvement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau mouvement de caisse</DialogTitle>
                    <DialogDescription>
                      Enregistrer une entrée ou sortie de caisse.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de mouvement</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={transactionType === 'entree' ? 'default' : 'outline'}
                          onClick={() => setTransactionType('entree')}
                          className="flex-1"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Entrée
                        </Button>
                        <Button
                          variant={transactionType === 'sortie' ? 'default' : 'outline'}
                          onClick={() => setTransactionType('sortie')}
                          className="flex-1"
                        >
                          <TrendingDown className="w-4 h-4 mr-2" />
                          Sortie
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Montant (FCFA)</Label>
                      <Input
                        type="number"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        placeholder="Montant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={transactionDescription}
                        onChange={(e) => setTransactionDescription(e.target.value)}
                        placeholder="Description du mouvement..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={addTransaction}>
                      Enregistrer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Lock className="w-4 h-4 mr-2" />
                    Fermer Caisse
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clôture de caisse</DialogTitle>
                    <DialogDescription>
                      Fermer la session de caisse et calculer l'écart.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Solde théorique</Label>
                        <p className="text-xl font-bold text-green-600">
                          {getSoldeTheorique().toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Solde physique (FCFA)</Label>
                        <Input
                          type="number"
                          value={fondFinal}
                          onChange={(e) => setFondFinal(e.target.value)}
                          placeholder="Montant compté"
                        />
                      </div>
                    </div>
                    {fondFinal && (
                      <div className="p-3 bg-muted rounded">
                        <div className="flex justify-between items-center">
                          <span>Écart:</span>
                          <span className={`font-bold ${
                            parseInt(fondFinal) - getSoldeTheorique() === 0 ? 'text-green-600' :
                            parseInt(fondFinal) - getSoldeTheorique() > 0 ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {(parseInt(fondFinal) - getSoldeTheorique()).toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={closeCashSession}>
                      Fermer la Caisse
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Session Status */}
      <Card className={isSessionOpen ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSessionOpen ? (
              <>
                <Unlock className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Caisse Ouverte</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-red-600" />
                <span className="text-red-800">Caisse Fermée</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isSessionOpen 
              ? `Session ouverte le ${new Date(currentSession.dateOuverture).toLocaleString('fr-FR')} par ${currentSession.utilisateur}`
              : 'Aucune session active'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {isSessionOpen && (
        <>
          {/* Current Session Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fond Initial</CardTitle>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {currentSession.fondInitial.toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">au démarrage</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes du Jour</CardTitle>
                <Receipt className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {currentSession.totalVentes.toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">encaissements</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solde Théorique</CardTitle>
                <Calculator className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {getSoldeTheorique().toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">calculé</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <BarChart3 className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {currentSession.transactions.length}
                </div>
                <p className="text-xs text-muted-foreground">mouvements</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Encaissements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Espèces</p>
                    <p className="font-bold text-green-600">
                      {ventesParMethode.especes.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cartes</p>
                    <p className="font-bold text-blue-600">
                      {ventesParMethode.carte.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Money</p>
                    <p className="font-bold text-purple-600">
                      {ventesParMethode.mobile_money.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <FileText className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Chèques</p>
                    <p className="font-bold text-orange-600">
                      {ventesParMethode.cheque.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions History */}
          <Card>
            <CardHeader>
              <CardTitle>Mouvements du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentSession.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'entree' ? 'bg-green-100' :
                        transaction.type === 'sortie' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'entree' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : transaction.type === 'sortie' ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <Receipt className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleTimeString('fr-FR')} - {transaction.utilisateur}
                          {transaction.reference && ` - ${transaction.reference}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'entree' || transaction.type === 'vente' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'sortie' ? '-' : '+'}{transaction.montant.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.methodePaiement.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {new Date(session.dateOuverture).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.utilisateur} - {session.transactions.length || 0} transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p>Ventes: {session.totalVentes.toLocaleString()} FCFA</p>
                    {session.ecart !== undefined && (
                      <p className={`${session.ecart === 0 ? 'text-green-600' : session.ecart > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        Écart: {session.ecart.toLocaleString()} FCFA
                      </p>
                    )}
                  </div>
                  <Badge variant={session.ecart === 0 ? 'default' : 'secondary'}>
                    {session.ecart === 0 ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                    {session.ecart === 0 ? 'Conforme' : 'Écart'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
