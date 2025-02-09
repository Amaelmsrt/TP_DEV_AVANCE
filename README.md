# TP Développement Avancé

Etudiant : Amaël Maserati

Adresse du dépôt git : https://github.com/Amaelmsrt/TP_DEV_AVANCE

## Lancement du projet

Pour lancer le projet, veuillez tout d'abord entrer dans le répertoire suivant :

```bash
cd realtime-elo-ranker
```

Si besoin, faire la commande suivante pour installer les dépendances :

```bash
pnpm install
```

Veillez à bien suivre l'ordre du lancement des clients.

### Lancement du serveur

Pour lancer le serveur, veuillez exécuter la commande suivante :

```bash
pnpm run apps:server:dev
```

### Lancement du client

Pour lancer le client, veuillez exécuter la commande suivante :

```bash
pnpm run apps:client:dev
```

## Les fonctionnalités implémentées

Tous les besoins demandés dans le sujet ont été mis en place.

### Créer un serveur HTTP en utilisant NestJS

Tout d'abord, il a fallu commencer par créer un dossier dans le répertoire `apps` pour y mettre le serveur.

Voici la manière dont a été agencée l'arborescence du serveur :

```
realtime-elo-ranker-server
├── dist (dossier généré par le serveur)
├── src (dossier contenant le code source)
│   ├── api (dossier contenant les routes de l'API)
│   │   ├── match (dossier contenant les routes pour les matchs)
│   │   ├── player (dossier contenant les routes pour les joueurs)
│   │   ├── ranking (dossier contenant les routes pour le classement)
│   ├── test (dossier contenant les tests e2e et d'intégration)
```

Chaque route de l'API a été créée dans un module dédié, dont les routes sont définies dans un controller.

### Créer un service de type Singleton pour stocker des données du classement en cache

Pour stocker les données du classement en cache, j'ai utilisé le module `@nestjs/common`. J'ai créé un service `RankingService`, ainsi qu'un `RankingCacheService`. Ce dernier est un singleton qui permet de stocker les données du classement. Ainsi, le `RankingService` peut récupérer les données du classement en utilisant le `RankingCacheService` en tant qu'attribut.

### Créer un service pour écrire et lire les données des joueurs en base de données

Pour créer un service pour écrire et lire les données des joueurs en base de données, il a fallu commencer par créer une entité `Player` respectant la structure vue sur la documentation Swagger. Ensuite, j'ai créé un DTO pour la création des joueurs et un autre pour la mise à jour des joueurs. J'ai ensuite créé un service `PlayerService` qui permet de récupérer les joueurs en base de données. Pour finir, j'ai créé un repository `PlayerRepository` qui permet de faire des requêtes en base de données.

### Ajouter la logique métier pour mettre à jour le classement des joueurs

Pour mettre à jour le classement des joueurs, j'ai tout d'abord dû mettre en place un service et un controller pour les matchs. Dans ces derniers, des requêtes sont faites à l'API permettant de publier à partir de DTO (un pour les résultats d'un match et un pour le match publié) les résultats des matchs obtenus grâce à plusieurs calculs effectués, et d'avoir alors le nouvel elo de chaque joueur. Ensuite, j'ai fait une méthode dans `PlayerSerice` qui permet de metter à jour un jouer. Pour finir, j'ai créé un service et un controller pour le Ranking. Le service `RankingService` permet d'obtenir le classement des joueurs, et possède une méthode qui appelle la méthode de mise à jour du joueur dans son service, et qui change alors le classement d'un joueur. Le controller `RankingController` permet de récupérer le classement des joueurs.

### Ajouter un EventEmitter pour émettre des notifications en temps réel

Pour ajouter un EventEmitter pour émettre des notifications en temps réel, j'ai implémenté dans `RankingController` un sse (Server-Sent Events) utilisant un EventEmitter2. Ainsi, j'ai créé des évènements qui permettent de notifier les clients lorsqu'un joueur est ajouté, ou lorsqu'un match a été publié et que le classement des joueurs a été mis à jour. J'ai ensuite appelé les évènements dans les méthodes du `PlayerService`.

### L'implémentation de l'API décrite par le Swagger fourni

Pour implémenter l'API décrite par le Swagger fourni, j'ai alors mis en place des fonctions qui représentent les routes dans chaque controller. Les controllers vont alors appeler les services pour effectuer les actions demandées.

### Tester l'application avec des tests unitaires et des tests d'intégration

J'ai mis en place les tests unitaires dans les fichiers **.controller.spec.ts**. Pour les lancer, veuillez vous rendre dans le répertoire `realtime-elo-ranker-server` et exécuter la commande suivante :

```bash
pnpm test
```

J'ai ensuite mis en place quelques tests d'intégration et e2e dans le dossier `test` du serveur. Pour les lancer, veuillez exécuter la commande suivante dans le répertoire `realtime-elo-ranker-server` :

```bash
pnpm test:integration
pnpm test:e2e
```