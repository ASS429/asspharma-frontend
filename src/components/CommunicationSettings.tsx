import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Send, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Package,
  Shield,
  TestTube,
  Smartphone
} from "lucide-react";

export default function CommunicationSettings() {
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: true,
    phoneNumber: "+221771234567",
    apiToken: "EAABwzLixnjYBO...",
    verifyToken: "votre_verify_token",
    webhookUrl: "https://votre-domaine.com/webhook"
  });

  const [emailConfig, setEmailConfig] = useState({
    enabled: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "contact@asspharma.sn",
    smtpPassword: "••••••••••••",
    fromEmail: "contact@asspharma.sn",
    fromName: "AssPharma"
  });

  const [notifications, setNotifications] = useState({
    stockAlerts: true,
    prescriptionReminders: true,
    deliveryConfirmations: true,
    creditReminders: true,
    promotions: false,
    systemAlerts: true
  });

  const messageTemplates = [
    {
      id: 'stock_alert',
      name: 'Alerte Stock Faible',
      icon: Package,
      type: 'whatsapp',
      template: 'Bonjour! Le stock de {product_name} est faible ({stock_quantity} restants). Pensez à vous réapprovisionner. - AssPharma'
    },
    {
      id: 'prescription_ready',
      name: 'Ordonnance Prête',
      icon: FileText,
      type: 'whatsapp',
      template: 'Bonjour {customer_name}, votre ordonnance {prescription_id} est prête pour le retrait. Merci! - AssPharma'
    },
    {
      id: 'delivery_confirmation',
      name: 'Confirmation Livraison',
      icon: Phone,
      type: 'whatsapp',
      template: 'Votre commande {order_id} a été livrée avec succès à {delivery_address}. Merci pour votre confiance! - AssPharma'
    },
    {
      id: 'credit_reminder',
      name: 'Rappel Crédit',
      icon: AlertTriangle,
      type: 'whatsapp',
      template: 'Bonjour {customer_name}, votre solde crédit est de {credit_amount} FCFA. Pensez à régulariser votre situation. - AssPharma'
    },
    {
      id: 'weekly_report',
      name: 'Rapport Hebdomadaire',
      icon: FileText,
      type: 'email',
      template: 'Voici votre rapport hebdomadaire des ventes et performances de la pharmacie.'
    }
  ];

  const testMessage = async (type: 'whatsapp' | 'email') => {
    // Simulation d'envoi de test
    if (type === 'whatsapp') {
      alert('Message WhatsApp test envoyé vers ' + whatsappConfig.phoneNumber);
    } else {
      alert('Email test envoyé vers ' + emailConfig.fromEmail);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Communications & Notifications</h2>
        <p className="text-muted-foreground">Configuration des notifications WhatsApp et Email</p>
      </div>

      {/* Configuration WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Configuration WhatsApp Business
          </CardTitle>
          <CardDescription>
            Intégration avec l'API WhatsApp Business pour les notifications clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activer WhatsApp</Label>
              <p className="text-sm text-muted-foreground">Notifications automatiques via WhatsApp</p>
            </div>
            <Switch 
              checked={whatsappConfig.enabled}
              onCheckedChange={(checked) => setWhatsappConfig({...whatsappConfig, enabled: checked})}
            />
          </div>

          {whatsappConfig.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-phone">Numéro WhatsApp Business</Label>
                <Input
                  id="whatsapp-phone"
                  value={whatsappConfig.phoneNumber}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumber: e.target.value})}
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">Token API WhatsApp</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  value={whatsappConfig.apiToken}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, apiToken: e.target.value})}
                  placeholder="Votre token d'accès"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verify-token">Token de Vérification</Label>
                <Input
                  id="verify-token"
                  value={whatsappConfig.verifyToken}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, verifyToken: e.target.value})}
                  placeholder="Token de vérification webhook"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL Webhook</Label>
                <Input
                  id="webhook-url"
                  value={whatsappConfig.webhookUrl}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, webhookUrl: e.target.value})}
                  placeholder="https://votre-domaine.com/webhook"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => testMessage('whatsapp')} variant="outline" className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Tester WhatsApp
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Documentation API
            </Button>
          </div>

          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Guide de configuration :</strong>
              <br />1. Créez un compte WhatsApp Business
              <br />2. Configurez l'API WhatsApp Business sur Meta for Developers
              <br />3. Obtenez votre token d'accès permanent
              <br />4. Configurez le webhook pour recevoir les réponses
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuration Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Configuration Email SMTP
          </CardTitle>
          <CardDescription>
            Configuration du serveur SMTP pour l'envoi d'emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activer Email</Label>
              <p className="text-sm text-muted-foreground">Notifications et rapports par email</p>
            </div>
            <Switch 
              checked={emailConfig.enabled}
              onCheckedChange={(checked) => setEmailConfig({...emailConfig, enabled: checked})}
            />
          </div>

          {emailConfig.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Serveur SMTP</Label>
                <Select value={emailConfig.smtpHost} onValueChange={(value) => setEmailConfig({...emailConfig, smtpHost: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp.gmail.com">Gmail (smtp.gmail.com)</SelectItem>
                    <SelectItem value="smtp.outlook.com">Outlook (smtp.outlook.com)</SelectItem>
                    <SelectItem value="smtp.orange.sn">Orange Sénégal (smtp.orange.sn)</SelectItem>
                    <SelectItem value="smtp.custom.com">Serveur personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port SMTP</Label>
                <Select value={emailConfig.smtpPort} onValueChange={(value) => setEmailConfig({...emailConfig, smtpPort: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="587">587 (TLS)</SelectItem>
                    <SelectItem value="465">465 (SSL)</SelectItem>
                    <SelectItem value="25">25 (Non chiffré)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-user">Nom d'utilisateur</Label>
                <Input
                  id="smtp-user"
                  value={emailConfig.smtpUser}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpUser: e.target.value})}
                  placeholder="votre-email@domaine.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">Mot de passe</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={emailConfig.smtpPassword}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpPassword: e.target.value})}
                  placeholder="Mot de passe ou token d'application"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">Email expéditeur</Label>
                <Input
                  id="from-email"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                  placeholder="contact@asspharma.sn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-name">Nom expéditeur</Label>
                <Input
                  id="from-name"
                  value={emailConfig.fromName}
                  onChange={(e) => setEmailConfig({...emailConfig, fromName: e.target.value})}
                  placeholder="AssPharma"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => testMessage('email')} variant="outline" className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Tester Email
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Guide Sécurité
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Types de Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Types de Notifications
          </CardTitle>
          <CardDescription>
            Configurez quelles notifications sont envoyées automatiquement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertes de Stock</Label>
                <p className="text-sm text-muted-foreground">Stock faible ou épuisé</p>
              </div>
              <Switch 
                checked={notifications.stockAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, stockAlerts: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels Ordonnances</Label>
                <p className="text-sm text-muted-foreground">Ordonnances prêtes</p>
              </div>
              <Switch 
                checked={notifications.prescriptionReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, prescriptionReminders: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmations Livraisons</Label>
                <p className="text-sm text-muted-foreground">Statut des livraisons</p>
              </div>
              <Switch 
                checked={notifications.deliveryConfirmations}
                onCheckedChange={(checked) => setNotifications({...notifications, deliveryConfirmations: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels Crédit</Label>
                <p className="text-sm text-muted-foreground">Soldes impayés</p>
              </div>
              <Switch 
                checked={notifications.creditReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, creditReminders: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Promotions</Label>
                <p className="text-sm text-muted-foreground">Offres spéciales</p>
              </div>
              <Switch 
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertes Système</Label>
                <p className="text-sm text-muted-foreground">Maintenance, erreurs</p>
              </div>
              <Switch 
                checked={notifications.systemAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, systemAlerts: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates de Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-amber-500" />
            Templates de Messages
          </CardTitle>
          <CardDescription>
            Personnalisez les messages automatiques envoyés aux clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messageTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant={template.type === 'whatsapp' ? 'default' : 'secondary'}>
                          {template.type === 'whatsapp' ? 'WhatsApp' : 'Email'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                  <Textarea 
                    value={template.template}
                    className="text-sm"
                    rows={2}
                    readOnly
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status de Connexion */}
      <Card>
        <CardHeader>
          <CardTitle>Status des Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>WhatsApp Business API</span>
              </div>
              <Badge variant={whatsappConfig.enabled ? "default" : "secondary"}>
                {whatsappConfig.enabled ? <><CheckCircle className="w-3 h-3 mr-1" />Connecté</> : "Désactivé"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Serveur Email SMTP</span>
              </div>
              <Badge variant={emailConfig.enabled ? "default" : "secondary"}>
                {emailConfig.enabled ? <><CheckCircle className="w-3 h-3 mr-1" />Connecté</> : "Désactivé"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Notifications Clients</span>
              </div>
              <Badge variant="default">
                <CheckCircle className="w-3 h-3 mr-1" />
                Actives
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="flex-1">
          <CheckCircle className="w-4 h-4 mr-2" />
          Sauvegarder Configuration
        </Button>
        <Button variant="outline">
          <TestTube className="w-4 h-4 mr-2" />
          Tester Tous les Services
        </Button>
      </div>
    </div>
  );
}
