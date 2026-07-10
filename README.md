# Eco-Stock Front-End

## Présentation

Eco-Stock est une application web développée avec **Angular** permettant de gérer les entrepôts et les produits d'une entreprise. Elle communique avec une API REST développée avec Django afin de réaliser les opérations de gestion de stock.

L'application permet de :

* Se connecter à l'application.
* Consulter la liste des entrepôts.
* Ajouter, modifier et supprimer un entrepôt.
* Consulter les produits.
* Filtrer les produits par entrepôt.
* Ajouter, modifier et supprimer un produit.
* Consulter les détails d'un produit.
* Transférer un produit d'un entrepôt vers un autre.
* Accéder à une interface sécurisée grâce à l'authentification JWT.

---

# Technologies utilisées

* Angular 20
* TypeScript
* Bootstrap 5
* Angular Router
* HttpClient
* RxJS
* JWT Authentication
* HTML5
* CSS3

---

# Installation

## 1. Cloner le projet

```bash
git clone https://github.com/Aissata-Sow788/Brief_API_Front-End_Eco-Stock_Angular.git

cd Brief_API_Front-End_Eco-Stock_Angular
```

---

## 2. Installer les dépendances

```bash
npm install
```

---

## 3. Lancer le projet

```bash
ng serve
```

L'application sera accessible à l'adresse :

```text
http://localhost:4200
```

---

# Fonctionnalités

## Authentification

* Connexion avec JWT.
* Protection des routes grâce à un **Auth Guard**.
* Déconnexion.

---

## Gestion des entrepôts

* Afficher la liste des entrepôts.
* Ajouter un entrepôt.
* Modifier un entrepôt.
* Supprimer un entrepôt.

---

## Gestion des produits

* Afficher tous les produits.
* Filtrer les produits par entrepôt.
* Ajouter un produit.
* Modifier un produit.
* Supprimer un produit.
* Consulter les détails d'un produit.

---

## Transfert de produits

L'utilisateur peut transférer un produit vers un autre entrepôt.

Avant le transfert, l'application :

* récupère les informations du produit ;
* vérifie les données saisies ;
* envoie la demande à l'API ;
* affiche un message de succès ou d'erreur.

---

# Navigation de l'application

| Route                | Description            | Protection |
| -------------------- | ---------------------- | ---------- |
| `/`                  | Connexion              | ❌          |
| `/entrepot`          | Liste des entrepôts    | ✅          |
| `/warehouseform`     | Ajouter un entrepôt    | ✅          |
| `/warehouseform/:id` | Modifier un entrepôt   | ✅          |
| `/products`          | Liste des produits     | ✅          |
| `/products/:id`      | Produits d'un entrepôt | ✅          |
| `/produitform`       | Ajouter un produit     | ✅          |
| `/produitform/:id`   | Modifier un produit    | ✅          |
| `/productdetail/:id` | Détails d'un produit   | ✅          |
| `/transfer/:id`      | Transfert d'un produit | ✅          |

Toutes les routes sont protégées par un **Auth Guard**, sauf la page de connexion.

---

# Structure du projet

```text
src/
│
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   └── login/
│   │   │
│   │   ├── warehouses/
│   │   │   ├── warehouselist/
│   │   │   └── warehouseform/
│   │   │
│   │   └── products/
│   │       ├── productlist/
│   │       ├── productdetail/
│   │       ├── productfilter/
│   │       ├── productform/
│   │       └── producttransfer/
│   │
│   ├── layout/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   └── main-layout/
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── assets/
└── environments/
```

---

# Communication avec l'API

Le frontend communique avec l'API Django via le service **HttpClient**.

Principaux appels :

| Méthode | Endpoint                       | Description            |
| ------- | ------------------------------ | ---------------------- |
| POST    | `/api/token/`                  | Authentification       |
| GET     | `/api/entrepot/`             | Liste des entrepôts    |
| POST    | `/api/entrepot/`             | Ajouter un entrepôt    |
| PUT     | `/api/entrepot/{id}/`        | Modifier un entrepôt   |
| DELETE  | `/api/entrepot/{id}/`        | Supprimer un entrepôt  |
| GET     | `/api/produits/`               | Liste des produits     |
| POST    | `/api/produits/`               | Ajouter un produit     |
| PUT     | `/api/produits/{id}/`          | Modifier un produit    |
| DELETE  | `/api/produits/{id}/`          | Supprimer un produit   |
| POST    | `/api/produits/{id}/transfer/` | Transfert d'un produit |

---

# Flux métier du transfert

```text
Utilisateur
      │
      ▼
Sélection du produit
      │
      ▼
Choix de l'entrepôt de destination
      │
      ▼
Validation du formulaire
      │
      ▼
Envoi de la requête à l'API
      │
      ▼
Traitement par le serveur
      │
 ┌────┴────┐
 │         │
Succès   Échec
 │         │
 ▼         ▼
Message   Message
de succès d'erreur
```

---

# Captures d'écran

Vous pouvez ajouter ici des captures d'écran de :

* La page de connexion.
* La liste des entrepôts.
* La liste des produits.
* Le formulaire d'ajout d'un produit.
* La page de détail d'un produit.
* La page de transfert d'un produit.

---

# Auteur

**Aissata Sow**

Développeuse Web & Mobile
