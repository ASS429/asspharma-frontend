import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { NotificationHelpers, defaultNotificationConfig } from "../utils/notifications";
import { toast } from "sonner@2.0.3";
import { 
  AlertTriangle, 
  Clock, 
  Package, 
  Users, 
  CreditCard,
  Calendar,
  TrendingDown,
  Bell,
  X,
  CheckCircle,
  MessageCircle,
  Mail,
  Send
} from "lucide-react";

interface Alert {
  id: number;
  type: 'stock' | 'expiration' | 'credit' | 'paiement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  actionRequired: boolean;
  relatedId?: number;
}

export default function AlertManagement() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'expiration',
      priority: 'high',
      title: 'Produits expirant dans 7 jours',
      description: '5 produits expireront dans les 7 prochains jours - action requise',
      date: '2025-09-01T10:30:00',
      isRead: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'stock',
      priority: 'high',
      title: 'Stock critique - Insuline Lantus',
      description: 'Stock: 3 unités (Minimum: 10) - Rupture imminente',
      date: '2025-09-01T09:15:00',
      isRead: false,
      actionRequired: true,
      relatedId: 3
    },
    {
      id: 3,
      type: 'paiement',
      priority: 'medium',
      title: 'Retard de paiement - Aminata Diallo',
      description: 'Facture en retard de 15 jours - Montant: 45,600 FCFA',
      date: '2025-09-01T08:45:00',
      isRead: false,
      actionRequired: true,
      relatedId: 1
    },
    {
      id: 4,
      type: 'credit',
      priority: 'medium',
      title: 'Limite de crédit atteinte - Omar Ba',
      description: 'Crédit actuel: 50,000 FCFA / Limite: 50,000 FCFA',
      date: '2025-08-31T16:20:00',
      isRead: true,
      actionRequired: false,
      relatedId: 4
    },
    {
      id: 5,
      type: 'stock',
      priority: 'medium',
      title: 'Stock faible - Aspirine Protect 100mg',
      description: 'Stock: 8 unités (Minimum: 20) - Réapprovisionner',
      date: '2025-08-31T14:10:00',
      isRead: true,
      actionRequired: true,
      relatedId: 4
    },
    {
      id: 6,
      type: 'expiration',
      priority: 'low',
      title: 'Produits expirant dans 30 jours',
      description: '12 produits expireront dans les 30 prochains jours',
      date: '2025-08-30T11:00:00',
      isRead: true,
      actionRequired: false
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'stock': return Package;
      case 'expiration': return Calendar;
      case 'credit': return CreditCard;
      case 'paiement': return Clock;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Critique';
      case 'medium': return 'Important';
      case 'low': return 'Info';
      default: return 'Normal';
    }
  };

  const markAsRead = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  // Fonction pour envoyer une notification automatique
  const sendNotificationForAlert = async (alertItem: Alert) => {
    try {
      if (alertItem.type === 'stock') {
        // Exemple d'envoi de notification pour stock faible
        const result = await NotificationHelpers.sendStockAlert(defaultNotificationConfig, {
          product_name: alertItem.title.includes('Insuline') ? 'Insuline Lantus' : 'Aspirine Protect 100mg',
          current_stock: alertItem.title.includes('Insuline') ? 3 : 8,
          minimum_stock: alertItem.title.includes('Insuline') ? 10 : 20,
          lot_number: alertItem.title.includes('Insuline') ? 'INS2025C003' : 'ASP2026A004'
        });
        
        if (result.whatsapp || result.email) {
          toast.success('Notification de stock faible envoyée !', {
            description: `Envoyée via ${result.whatsapp ? 'WhatsApp' : ''} ${result.whatsapp && result.email ? 'et ' : ''} ${result.email ? 'Email' : ''}`
          });
        } else {
          toast.warning('Aucun service de notification configuré');
        }
      } else if (alertItem.type === 'paiement') {
        // Exemple pour rappel de paiement
        const result = await NotificationHelpers.sendCreditReminder(defaultNotificationConfig, {
          customer_name: 'Aminata Diallo',
          credit_amount: 45600,
          last_payment_date: '15 Août 2025',
          credit_limit: 50000,
          customer_phone: '+221771234567',
          customer_email: 'aminata.diallo@email.com'
        });
        
        if (result.whatsapp || result.email) {
          toast.success('Rappel de paiement envoyé au client !', {
            description: `Envoyé via ${result.whatsapp ? 'WhatsApp' : ''} ${result.whatsapp && result.email ? 'et ' : ''} ${result.email ? 'Email' : ''}`
          });
        } else {
          toast.warning('Aucun service de notification configuré');
        }
      } else if (alertItem.type === 'credit') {
        const result = await NotificationHelpers.sendCreditReminder(defaultNotificationConfig, {
          customer_name: 'Omar Ba',
          credit_amount: 50000,
          last_payment_date: '20 Août 2025',
          credit_limit: 50000,
          customer_phone: '+221775678901',
          customer_email: 'omar.ba@email.com'
        });
        
        if (result.whatsapp || result.email) {
          toast.success('Rappel de crédit envoyé !', {
            description: `Envoyé via ${result.whatsapp ? 'WhatsApp' : ''} ${result.whatsapp && result.email ? 'et ' : ''} ${result.email ? 'Email' : ''}`
          });
        } else {
          toast.warning('Aucun service de notification configuré');
        }
      } else if (alertItem.type === 'expiration') {
        const result = await NotificationHelpers.sendSystemAlert(defaultNotificationConfig, {
          alert_type: 'Alerte Expiration',
          alert_message: `${alertItem.title}: ${alertItem.description}`,
          timestamp: new Date().toLocaleString('fr-FR')
        });
        
        if (result.whatsapp || result.email) {
          toast.success('Alerte d\'expiration envoyée à l\'équipe !', {
            description: `Envoyée via ${result.whatsapp ? 'WhatsApp' : ''} ${result.whatsapp && result.email ? 'et ' : ''} ${result.email ? 'Email' : ''}`
          });
        } else {
          toast.warning('Aucun service de notification configuré');
        }
      }
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      toast.error('Erreur lors de l\'envoi de la notification', {
        description: 'Veuillez vérifier la configuration des services de communication'
      });
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.priority === 'high' && !alert.isRead).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Centre d'Alertes
          </h1>
          <p className="text-muted-foreground">
            Gestion des notifications et alertes système
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {criticalCount} Critique{criticalCount > 1 ? 's' : ''}
          </Badge>
          <Badge variant="secondary">
            {unreadCount} Non lu{unreadCount > 1 ? 'es' : ''}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Action immédiate requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Critique</CardTitle>
            <TrendingDown className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-xs text-muted-foreground">Produits en rupture</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirations</CardTitle>
            <Calendar className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <p className="text-xs text-muted-foreground">Expirent cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards Paiement</CardTitle>
            <Clock className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1</div>
            <p className="text-xs text-muted-foreground">Client en retard</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alertes Récentes</h2>
        
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune alerte</h3>
              <p className="text-muted-foreground text-center">
                Toutes les alertes ont été traitées. Le système fonctionne normalement.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <Card 
                  key={alert.id} 
                  className={`transition-all hover:shadow-md ${
                    !alert.isRead ? 'bg-accent/50 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100' :
                          alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            alert.priority === 'high' ? 'text-red-600' :
                            alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{alert.title}</CardTitle>
                            <Badge variant={getAlertColor(alert.priority)} className="text-xs">
                              {getPriorityText(alert.priority)}
                            </Badge>
                            {alert.actionRequired && (
                              <Badge variant="outline" className="text-xs">
                                Action requise
                              </Badge>
                            )}
                            {!alert.isRead && (
                              <Badge variant="default" className="text-xs">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {alert.description}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(alert.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!alert.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(alert.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {alert.actionRequired && (
                    <CardContent className="pt-0">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline">
                          Voir Détails
                        </Button>
                        {alert.type === 'stock' && (
                          <>
                            <Button size="sm">
                              Commander
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => sendNotificationForAlert(alert)}
                              className="flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Notifier
                            </Button>
                          </>
                        )}
                        {alert.type === 'paiement' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => sendNotificationForAlert(alert)}
                              className="flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              Contacter Client
                            </Button>
                          </>
                        )}
                        {alert.type === 'expiration' && (
                          <Button size="sm" variant="secondary">
                            Programmer Destruction
                          </Button>
                        )}
                        {alert.type === 'credit' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendNotificationForAlert(alert)}
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Rappeler Client
                          </Button>
                        )}
                        {alert.type === 'expiration' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendNotificationForAlert(alert)}
                            className="flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            Notifier Équipe
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
