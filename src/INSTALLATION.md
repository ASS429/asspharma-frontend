# AssPharma - Installation et Configuration

## 🚀 Installation des dépendances

Votre application AssPharma est maintenant configurée avec un système d'authentification complet. Vous devez installer les dépendances Supabase :

```bash
npm install @supabase/supabase-js
```

## 🔧 Configuration Supabase

### 1. Fonction SQL automatique

Votre fonction `handle_new_user_pharma()` est déjà configurée dans Supabase et sera automatiquement appelée lors de chaque inscription.

### 2. Vérification des politiques RLS

Assurez-vous que vos politiques RLS (Row Level Security) sont activées sur toutes les tables :

```sql
-- Exemple pour la table produits
CREATE POLICY "Accès produits par pharmacie"
ON produits
FOR ALL
USING (pharmacy_id = requesting_profile());

-- Répétez pour toutes les tables : ventes, clients, stock, etc.
```

### 3. Configuration des notifications (optionnel)

Si vous souhaitez utiliser les notifications WhatsApp et Email, vous devrez :

1. Configurer votre serveur SMTP
2. Configurer l'API WhatsApp Business
3. Ajouter les clés API dans vos variables d'environnement Supabase

## 📱 Fonctionnalités d'authentification

### ✅ Page d'inscription
- Formulaire en 2 étapes
- Création automatique de la pharmacie
- Validation des données
- Messages d'erreur en français

### ✅ Page de connexion
- Connexion sécurisée
- Récupération de mot de passe
- Redirection automatique

### ✅ Multi-tenant
- Chaque utilisateur ne voit que ses données
- Isolation complète par pharmacie
- Sécurité RLS activée

### ✅ Interface utilisateur
- Design moderne vert et blanc
- Responsive
- Messages de succès/erreur
- Loading states

## 🔐 Sécurité

L'application utilise :
- **Supabase Auth** pour l'authentification
- **RLS (Row Level Security)** pour l'isolation des données
- **Politiques automatiques** via la fonction `requesting_profile()`
- **Validation côté client et serveur**

## 🎯 Première utilisation

1. Accédez à votre application
2. Cliquez sur "Créer un compte"
3. Remplissez le formulaire d'inscription
4. Votre pharmacie sera automatiquement créée
5. Vous serez connecté et redirigé vers le tableau de bord

## 📞 Support

En cas de problème :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez les logs Supabase
3. Assurez-vous que la fonction SQL est bien déployée

## 🔄 Prochaines étapes suggérées

Maintenant que l'authentification est fonctionnelle, vous pouvez :

- **Configurer les notifications** : WhatsApp et Email
- **Ajouter des données de test** : produits, clients, etc.
- **Personnaliser le design** : logo, couleurs spécifiques
- **Configurer les rapports** : exports PDF, analytics
- **Intégrer l'API DPM** : pour la conformité réglementaire

Votre application AssPharma est maintenant prête pour la production ! 🎉
