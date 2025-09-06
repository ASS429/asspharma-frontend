// Utilitaire pour l'envoi des notifications WhatsApp et Email

interface NotificationConfig {
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    apiToken: string;
  };
  email: {
    enabled: boolean;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
}

interface NotificationData {
  type: 'stock_alert' | 'prescription_ready' | 'delivery_confirmation' | 'credit_reminder' | 'system_alert';
  recipient: {
    phone?: string;
    email?: string;
    name: string;
  };
  data: Record<string, any>;
}

// Templates de messages
const messageTemplates = {
  stock_alert: {
    whatsapp: "🚨 *Alerte Stock AssPharma* 🚨\n\nBonjour,\n\nLe stock de *{product_name}* est critique :\n📦 Stock actuel : {current_stock} unités\n⚠️ Seuil minimum : {minimum_stock} unités\n\nMerci de procéder au réapprovisionnement.\n\n_AssPharma - l'As dans la gestion de la pharmacie_",
    email: {
      subject: "Alerte Stock Critique - {product_name}",
      body: `
        <h2>🚨 Alerte Stock Critique</h2>
        <p>Bonjour,</p>
        <p>Le produit <strong>{product_name}</strong> nécessite un réapprovisionnement urgent.</p>
        <ul>
          <li>Stock actuel : <strong>{current_stock} unités</strong></li>
          <li>Seuil minimum : <strong>{minimum_stock} unités</strong></li>
          <li>Lot concerné : {lot_number}</li>
        </ul>
        <p>Merci de prendre les mesures nécessaires.</p>
        <hr>
        <p><em>AssPharma - l'As dans la gestion de la pharmacie</em></p>
      `
    }
  },
  prescription_ready: {
    whatsapp: "✅ *Ordonnance Prête - AssPharma* ✅\n\nBonjour {customer_name},\n\nVotre ordonnance N° *{prescription_id}* est prête pour le retrait.\n\n📍 *AssPharma*\nAvenue Léopold Sédar Senghor, Dakar\n📞 +221 33 823 45 67\n\n⏰ Horaires : Lun-Sam 8h-20h\n\nMerci de votre confiance !\n\n_AssPharma - l'As dans la gestion de la pharmacie_",
    email: {
      subject: "Ordonnance N° {prescription_id} prête pour retrait",
      body: `
        <h2>✅ Ordonnance Prête</h2>
        <p>Bonjour <strong>{customer_name}</strong>,</p>
        <p>Nous avons le plaisir de vous informer que votre ordonnance N° <strong>{prescription_id}</strong> est prête pour le retrait.</p>
        <h3>📍 Informations de retrait :</h3>
        <ul>
          <li><strong>Pharmacie :</strong> AssPharma</li>
          <li><strong>Adresse :</strong> Avenue Léopold Sédar Senghor, Dakar</li>
          <li><strong>Téléphone :</strong> +221 33 823 45 67</li>
          <li><strong>Horaires :</strong> Lundi-Samedi 8h-20h</li>
        </ul>
        <p>Merci de votre confiance !</p>
        <hr>
        <p><em>AssPharma - l'As dans la gestion de la pharmacie</em></p>
      `
    }
  },
  delivery_confirmation: {
    whatsapp: "🚚 *Livraison Confirmée - AssPharma* 🚚\n\nBonjour {customer_name},\n\nVotre commande N° *{order_id}* a été livrée avec succès !\n\n📍 Adresse de livraison :\n{delivery_address}\n\n⏰ Heure de livraison : {delivery_time}\n🧾 Montant : {total_amount} FCFA\n\nMerci pour votre confiance !\n\n_AssPharma - l'As dans la gestion de la pharmacie_",
    email: {
      subject: "Confirmation de livraison - Commande N° {order_id}",
      body: `
        <h2>🚚 Livraison Confirmée</h2>
        <p>Bonjour <strong>{customer_name}</strong>,</p>
        <p>Votre commande N° <strong>{order_id}</strong> a été livrée avec succès !</p>
        <h3>📋 Détails de la livraison :</h3>
        <ul>
          <li><strong>Adresse :</strong> {delivery_address}</li>
          <li><strong>Heure :</strong> {delivery_time}</li>
          <li><strong>Montant :</strong> {total_amount} FCFA</li>
        </ul>
        <p>Nous espérons que vous êtes satisfait(e) de notre service.</p>
        <hr>
        <p><em>AssPharma - l'As dans la gestion de la pharmacie</em></p>
      `
    }
  },
  credit_reminder: {
    whatsapp: "💳 *Rappel Crédit - AssPharma* 💳\n\nBonjour {customer_name},\n\nNous vous rappelons que votre solde crédit nécessite une régularisation :\n\n💰 Solde actuel : *{credit_amount} FCFA*\n📅 Depuis le : {last_payment_date}\n\nMerci de passer régler votre compte.\n\n📍 AssPharma - Avenue Léopold Sédar Senghor, Dakar\n\n_AssPharma - l'As dans la gestion de la pharmacie_",
    email: {
      subject: "Rappel de solde crédit - {customer_name}",
      body: `
        <h2>💳 Rappel de Solde Crédit</h2>
        <p>Bonjour <strong>{customer_name}</strong>,</p>
        <p>Nous vous rappelons gentiment que votre compte crédit nécessite une régularisation.</p>
        <h3>📊 Détails du compte :</h3>
        <ul>
          <li><strong>Solde actuel :</strong> {credit_amount} FCFA</li>
          <li><strong>Dernier paiement :</strong> {last_payment_date}</li>
          <li><strong>Limite de crédit :</strong> {credit_limit} FCFA</li>
        </ul>
        <p>Merci de passer à la pharmacie pour régulariser votre situation.</p>
        <hr>
        <p><em>AssPharma - l'As dans la gestion de la pharmacie</em></p>
      `
    }
  },
  system_alert: {
    whatsapp: "⚠️ *Alerte Système AssPharma* ⚠️\n\n{alert_message}\n\n📞 Support : +221 33 823 45 67\n📧 contact@asspharma.sn\n\n_AssPharma - l'As dans la gestion de la pharmacie_",
    email: {
      subject: "Alerte Système AssPharma - {alert_type}",
      body: `
        <h2>⚠️ Alerte Système</h2>
        <p><strong>Type d'alerte :</strong> {alert_type}</p>
        <p><strong>Message :</strong> {alert_message}</p>
        <p><strong>Heure :</strong> {timestamp}</p>
        <h3>📞 Contact Support :</h3>
        <ul>
          <li><strong>Téléphone :</strong> +221 33 823 45 67</li>
          <li><strong>Email :</strong> contact@asspharma.sn</li>
        </ul>
        <hr>
        <p><em>AssPharma - l'As dans la gestion de la pharmacie</em></p>
      `
    }
  }
};

// Fonction pour remplacer les variables dans les templates
function replaceVariables(template: string, data: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] || match;
  });
}

// Fonction d'envoi WhatsApp (simulation)
async function sendWhatsAppMessage(config: NotificationConfig['whatsapp'], phone: string, message: string): Promise<boolean> {
  if (!config.enabled) return false;
  
  try {
    // Simulation d'envoi WhatsApp Business API
    console.log('Sending WhatsApp to:', phone);
    console.log('Message:', message);
    
    // Dans un environnement réel, ici vous feriez l'appel à l'API WhatsApp Business
    /*
    const response = await fetch(`https://graph.facebook.com/v17.0/${config.phoneNumber}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message }
      })
    });
    
    return response.ok;
    */
    
    // Simulation : toujours succès pour la démo
    return true;
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    return false;
  }
}

// Fonction d'envoi Email (simulation)
async function sendEmail(config: NotificationConfig['email'], to: string, subject: string, body: string): Promise<boolean> {
  if (!config.enabled) return false;
  
  try {
    // Simulation d'envoi email via SMTP
    console.log('Sending Email to:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    
    // Dans un environnement réel, ici vous utiliseriez nodemailer ou similar
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: config.smtpHost,
      port: parseInt(config.smtpPort),
      secure: config.smtpPort === '465',
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword
      }
    });
    
    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: to,
      subject: subject,
      html: body
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result.accepted.length > 0;
    */
    
    // Simulation : toujours succès pour la démo
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

// Fonction principale d'envoi de notification
export async function sendNotification(
  config: NotificationConfig,
  notificationData: NotificationData
): Promise<{ whatsapp: boolean; email: boolean }> {
  const template = messageTemplates[notificationData.type];
  const results = { whatsapp: false, email: false };
  
  if (!template) {
    console.error('Template non trouvé pour le type:', notificationData.type);
    return results;
  }
  
  // Envoi WhatsApp
  if (config.whatsapp.enabled && notificationData.recipient.phone) {
    const whatsappMessage = replaceVariables(template.whatsapp, notificationData.data);
    results.whatsapp = await sendWhatsAppMessage(
      config.whatsapp,
      notificationData.recipient.phone,
      whatsappMessage
    );
  }
  
  // Envoi Email
  if (config.email.enabled && notificationData.recipient.email) {
    const emailSubject = replaceVariables(template.email.subject, notificationData.data);
    const emailBody = replaceVariables(template.email.body, notificationData.data);
    results.email = await sendEmail(
      config.email,
      notificationData.recipient.email,
      emailSubject,
      emailBody
    );
  }
  
  return results;
}

// Fonctions utilitaires pour les différents modules
export const NotificationHelpers = {
  // Alerte de stock faible
  async sendStockAlert(config: NotificationConfig, productData: {
    product_name: string;
    current_stock: number;
    minimum_stock: number;
    lot_number: string;
  }) {
    return sendNotification(config, {
      type: 'stock_alert',
      recipient: {
        phone: config.whatsapp.phoneNumber, // Envoyer au pharmacien
        email: config.email.fromEmail,
        name: 'Pharmacien'
      },
      data: productData
    });
  },

  // Notification ordonnance prête
  async sendPrescriptionReady(config: NotificationConfig, customerData: {
    customer_name: string;
    prescription_id: string;
    customer_phone?: string;
    customer_email?: string;
  }) {
    return sendNotification(config, {
      type: 'prescription_ready',
      recipient: {
        phone: customerData.customer_phone,
        email: customerData.customer_email,
        name: customerData.customer_name
      },
      data: customerData
    });
  },

  // Confirmation de livraison
  async sendDeliveryConfirmation(config: NotificationConfig, deliveryData: {
    customer_name: string;
    order_id: string;
    delivery_address: string;
    delivery_time: string;
    total_amount: number;
    customer_phone?: string;
    customer_email?: string;
  }) {
    return sendNotification(config, {
      type: 'delivery_confirmation',
      recipient: {
        phone: deliveryData.customer_phone,
        email: deliveryData.customer_email,
        name: deliveryData.customer_name
      },
      data: deliveryData
    });
  },

  // Rappel de crédit
  async sendCreditReminder(config: NotificationConfig, creditData: {
    customer_name: string;
    credit_amount: number;
    last_payment_date: string;
    credit_limit: number;
    customer_phone?: string;
    customer_email?: string;
  }) {
    return sendNotification(config, {
      type: 'credit_reminder',
      recipient: {
        phone: creditData.customer_phone,
        email: creditData.customer_email,
        name: creditData.customer_name
      },
      data: creditData
    });
  },

  // Alerte système
  async sendSystemAlert(config: NotificationConfig, alertData: {
    alert_type: string;
    alert_message: string;
    timestamp: string;
  }) {
    return sendNotification(config, {
      type: 'system_alert',
      recipient: {
        phone: config.whatsapp.phoneNumber,
        email: config.email.fromEmail,
        name: 'Administrateur'
      },
      data: alertData
    });
  }
};

// Configuration par défaut (à charger depuis la base de données en réalité)
export const defaultNotificationConfig: NotificationConfig = {
  whatsapp: {
    enabled: false,
    phoneNumber: "+221771234567",
    apiToken: ""
  },
  email: {
    enabled: false,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "contact@asspharma.sn",
    fromName: "AssPharma"
  }
};
