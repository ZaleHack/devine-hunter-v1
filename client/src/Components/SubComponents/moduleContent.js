const moduleContent = {
  AwsS3: {
    title: 'Mauvaise configuration de bucket AWS S3',
    summary:
      'Les buckets Amazon S3 sont des conteneurs de stockage évolutifs et sécurisés accessibles via des URL uniques.',
    goals: [
      'Lire ou télécharger des données sensibles stockées dans le bucket.',
      'Téléverser des fichiers malveillants afin de tester les contrôles d’accès.',
      'Modifier ou supprimer des objets pour évaluer la robustesse des politiques.',
      'Identifier des buckets cachés ou mal nommés liés au programme.',
    ],
    identify: [
      'Inspecter les politiques publiques, authentifiées et d’accès croisé.',
      'Rechercher les buckets exposés via les enregistrements DNS ou les scripts front-end.',
      'Tester les permissions d’énumération et de lecture à l’aide de l’API AWS CLI.',
    ],
    exploit: [
      'Téléverser un fichier de test et vérifier sa disponibilité publique.',
      'Télécharger un jeu de données sensible pour mesurer l’impact potentiel.',
      'Tenter de modifier ou supprimer un objet non critique et surveiller la réaction du service.',
    ],
  },
  AwsCloudfront: {
    title: 'Mauvaise configuration AWS CloudFront',
    summary:
      'AWS CloudFront distribue rapidement sites, vidéos, applications et API dans le monde entier avec une faible latence.',
    goals: [
      'Identifier les distributions utilisant des origines non protégées.',
      'Détecter des en-têtes ou cookies sensibles exposés via le CDN.',
      'Vérifier les comportements de cache pouvant mener à une exfiltration.',
    ],
    identify: [
      'Analyser les réponses HTTP pour repérer les origines, cookies et comportements de cache.',
      'Tester les en-têtes CORS et CSP servis par la distribution.',
      'Évaluer la séparation des environnements (préproduction, production) derrière le CDN.',
    ],
    exploit: [
      'Forcer la mise en cache d’une réponse personnalisée afin de mesurer le risque pour les autres utilisateurs.',
      'Contourner les restrictions géographiques ou d’authentification en utilisant des distributions secondaires.',
    ],
  },
  AwsApiGateway: {
    title: 'Mauvaise configuration AWS API Gateway',
    summary:
      'AWS API Gateway permet de créer, déployer et gérer des API REST pour exposer en toute sécurité des services applicatifs.',
    goals: [
      'Lister les endpoints publics et privés exposés.',
      'Tester la granularité des rôles IAM appliqués aux méthodes.',
      'Détecter les contrôles d’authentification faibles ou mal utilisés.',
    ],
    identify: [
      'Collecter les endpoints via la documentation, les SDK et le trafic réseau.',
      'Analyser les réponses pour repérer les entêtes d’authentification attendus.',
      'Comparer les autorisations réelles avec les politiques IAM déclarées.',
    ],
    exploit: [
      'Appeler des méthodes avec des paramètres inattendus afin de contourner des restrictions.',
      'Vérifier si un jeton temporaire compromis offre un accès prolongé.',
    ],
  },
  AwsElasticBean: {
    title: 'Mauvaise configuration AWS Elastic Beanstalk',
    summary:
      'AWS Elastic Beanstalk gère automatiquement le déploiement, la montée en charge et la supervision des applications web.',
    goals: [
      'Identifier les environnements et versions exposés au public.',
      'Détecter des fichiers de configuration ou journaux accessibles sans contrôle.',
      'Évaluer les règles de pare-feu, de sécurité réseau et de mise à jour.',
    ],
    identify: [
      'Récupérer les URL publiques et vérifier les en-têtes divulguant la pile technologique.',
      'Chercher des fichiers .config ou .ebextensions exposés.',
      'Analyser les politiques IAM associées au rôle de service Elastic Beanstalk.',
    ],
    exploit: [
      'Tester un téléversement de fichier pour valider les protections côté serveur.',
      'Simuler une escalade de privilèges via des scripts de déploiement personnalisés.',
    ],
  },
  AwsEc2: {
    title: 'Mauvaise configuration AWS EC2',
    summary:
      'Une instance AWS EC2 fournit des ressources de calcul évolutives à la demande pour exécuter des services dans le cloud.',
    goals: [
      'Identifier les ports ou services exposés inutilement.',
      'Vérifier la présence de métadonnées accessibles publiquement.',
      'Évaluer la protection des clés SSH et des rôles IAM associés.',
    ],
    identify: [
      'Cartographier les adresses IP et groupes de sécurité ouverts.',
      'Tester l’accès aux métadonnées via http://169.254.169.254/.',
      'Analyser les bannières de service pour détecter des versions vulnérables.',
    ],
    exploit: [
      'Exécuter un scan non destructif pour valider les ports critiques.',
      'Tenter d’obtenir des informations sensibles via l’API des métadonnées.',
    ],
  },
  AwsCognito: {
    title: 'Mauvaise configuration AWS Cognito',
    summary:
      'AWS Cognito fournit l’authentification, l’autorisation et la gestion des utilisateurs pour les applications web et mobiles.',
    goals: [
      'Identifier les flux d’inscription et de connexion peu protégés.',
      'Tester l’intégration avec les fournisseurs d’identité externes.',
      'Détecter des politiques de mots de passe ou MFA insuffisantes.',
    ],
    identify: [
      'Examiner les pools d’utilisateurs, groupes et attributs obligatoires.',
      'Analyser les redirections OAuth2 et les scopes disponibles.',
      'Vérifier la configuration des déclencheurs (lambda) côté serveur.',
    ],
    exploit: [
      'Créer un compte de test pour observer les courriels et validations reçus.',
      'Tester la réutilisation de jetons d’accès ou d’actualisation.',
    ],
  },
  AwsIamSts: {
    title: 'Mauvaise configuration AWS IAM / STS',
    summary:
      'AWS IAM gère les identités et les permissions tandis que STS délivre des identifiants temporaires limitant l’exposition des clés longue durée.',
    goals: [
      'Recenser les utilisateurs, rôles et politiques trop permissifs.',
      'Tester les délégations inter-comptes ou les rôles assumables.',
      'Évaluer la durée de vie et la révocation des jetons STS.',
    ],
    identify: [
      'Analyser les politiques JSON pour repérer les jokers ou actions *.',
      'Lister les rôles assumables publiquement ou par d’autres comptes.',
      'Contrôler la rotation des clés d’accès et des secrets stockés.',
    ],
    exploit: [
      'Assumer un rôle de test et vérifier les ressources réellement accessibles.',
      'Générer des identifiants temporaires et observer les journaux CloudTrail.',
    ],
  },
  AwsSns: {
    title: 'Mauvaise configuration AWS SNS',
    summary:
      'AWS SNS est un service de messagerie géré qui diffuse notifications et alertes vers e-mail, SMS ou intégrations applicatives.',
    goals: [
      'Identifier les topics SNS exposés publiquement.',
      'Tester la capacité à publier ou s’abonner sans contrôle.',
      'Évaluer la diffusion d’informations sensibles via les messages.',
    ],
    identify: [
      'Lister les ARN de topics présents dans le code ou les journaux.',
      'Vérifier les politiques de publication et d’abonnement.',
      'Analyser les protocoles autorisés (HTTP/S, e-mail, Lambda, SQS).',
    ],
    exploit: [
      'Publier un message de test pour confirmer l’accès non autorisé.',
      'S’abonner à un topic sensible et mesurer les données reçues.',
    ],
  },
  AwsExposedDocDb: {
    title: 'Exposition AWS DocumentDB',
    summary:
      'AWS DocumentDB est un service NoSQL géré compatible MongoDB, performant et hautement disponible.',
    goals: [
      'Identifier les instances accessibles depuis Internet.',
      'Tester les configurations TLS et l’authentification activées.',
      'Vérifier l’isolation réseau et les groupes de sécurité associés.',
    ],
    identify: [
      'Cartographier les points de terminaison DocumentDB utilisés par l’application.',
      'Analyser les certificats et exigences d’authentification client.',
      'Rechercher des sauvegardes ou snapshots exposés.',
    ],
    exploit: [
      'Tenter une connexion avec des identifiants faibles ou par défaut.',
      'Vérifier la possibilité de lister ou d’exfiltrer des collections publiques.',
    ],
  },
  AwsRds: {
    title: 'Mauvaise configuration AWS RDS',
    summary:
      'AWS RDS simplifie la gestion des bases relationnelles en automatisant installation, mise à l’échelle et maintenance.',
    goals: [
      'Identifier les instances RDS exposées sur Internet.',
      'Évaluer les politiques de chiffrement et de sauvegarde.',
      'Contrôler les paramètres d’authentification et de rotation des secrets.',
    ],
    identify: [
      'Lister les endpoints RDS via les configurations ou journaux.',
      'Analyser les groupes de sécurité associés aux bases.',
      'Contrôler la présence de comptes par défaut ou partagés.',
    ],
    exploit: [
      'Tenter une connexion réseau pour valider l’ouverture des ports.',
      'Tester une authentification IAM ou par mot de passe faible.',
    ],
  },
  Cors: {
    title: 'Analyse de la configuration CORS',
    summary:
      'CORS contrôle les ressources accessibles à partir d’un FQDN donné. Une mauvaise configuration peut être détournée pour exfiltrer des données.',
    goals: [
      'Exfiltrer des données sensibles depuis le navigateur de la victime.',
      'Identifier les origines autorisées trop larges ou non filtrées.',
    ],
    identify: [
      'Observer la valeur de l’en-tête Access-Control-Allow-Origin et la présence de Access-Control-Allow-Credentials.',
      'Tester les variantes d’Origin pour contourner les listes blanches (sous-domaines, null, protocoles).',
    ],
    exploit: [
      'Construire une page malveillante qui envoie des requêtes authentifiées via JavaScript.',
      'Exécuter des scénarios de fuite de données via iFrame sandbox ou XMLHttpRequest.',
    ],
  },
  CspBypass: {
    title: 'Contournement de Content Security Policy (CSP)',
    summary:
      'Une CSP définit quelles ressources un navigateur peut charger. Une politique laxiste ou mal définie peut être exploitée.',
    goals: [
      'Identifier les directives CSP permissives permettant l’exécution de scripts.',
      'Mettre en évidence des sources externes ou des jokers dangereux.',
    ],
    identify: [
      'Analyser les directives script-src, object-src et default-src.',
      'Tester la présence de `unsafe-inline`, `unsafe-eval` ou de domaines tiers non contrôlés.',
    ],
    exploit: [
      'Construire un payload exploitant une source approuvée pour injecter du script.',
      'Combiner la faille CSP avec un XSS pour démontrer l’impact complet.',
    ],
  },
  CachePoisoning: {
    title: 'Empoisonnement de cache web',
    summary:
      'L’empoisonnement de cache consiste à forcer le cache à stocker et distribuer un contenu malveillant aux utilisateurs.',
    goals: [
      'Produire une réponse malveillante stockée par le cache.',
      'Montrer comment d’autres utilisateurs récupèrent ce contenu.',
    ],
    identify: [
      'Repérer les paramètres ou en-têtes non mis en cache correctement.',
      'Comprendre la logique de clé de cache utilisée par la plateforme.',
    ],
    exploit: [
      'Injecter un payload XSS ou un script de collecte de données dans une réponse mise en cache.',
      'Déclencher des requêtes secondaires pour vérifier la diffusion aux victimes.',
    ],
  },
  CacheDeception: {
    title: 'Cache deception',
    summary:
      'Le Web Cache Deception oblige le cache à stocker du contenu sensible appartenant à un autre utilisateur.',
    goals: [
      'Accéder à des pages censées être privées via le cache.',
      'Mettre en évidence l’impact d’une fuite de données personnelles.',
    ],
    identify: [
      'Tester l’ajout de suffixes statiques (.css, .js) pour forcer la mise en cache.',
      'Observer les en-têtes de contrôle du cache sur les réponses authentifiées.',
    ],
    exploit: [
      'Forcer l’utilisateur ciblé à visiter une URL construite pour être mise en cache.',
      'Récupérer ensuite la réponse afin d’extraire les données sensibles.',
    ],
  },
  EsiInjection: {
    title: 'Injection Edge Side Includes (ESI)',
    summary:
      'ESI assemble dynamiquement des fragments de page au niveau d’un CDN pour accélérer le rendu.',
    goals: [
      'Identifier les balises ESI interprétées côté edge.',
      'Comprendre comment l’assemblage peut divulguer des secrets.',
    ],
    identify: [
      'Rechercher des balises <esi:include> dans le code côté client.',
      'Tester des charges utiles simples pour voir si elles sont résolues par le CDN.',
    ],
    exploit: [
      'Injecter une inclusion visant une ressource interne pour en extraire le contenu.',
      'Démontrer l’accès non autorisé à des informations privilégiées.',
    ],
  },
  HostHeader: {
    title: 'Empoisonnement de l’en-tête Host',
    summary:
      'L’en-tête Host détermine l’application ciblée par une requête HTTP. Une mauvaise gestion peut être détournée.',
    goals: [
      'Détecter les variations de réponse en modifiant Host.',
      'Identifier des scénarios de redirection ou de XSS basés sur cet en-tête.',
    ],
    identify: [
      'Tester des valeurs arbitraires et surveiller les réponses HTTP.',
      'Vérifier les enregistrements d’authentification ou de journalisation générés.',
    ],
    exploit: [
      'Combiner l’en-tête Host manipulé avec des liens envoyés à d’autres utilisateurs.',
      'Démontrer une redirection ouverte ou un accès à une zone administrative.',
    ],
  },
  HopHeaders: {
    title: 'Abus des en-têtes hop-by-hop',
    summary:
      'Ajouter des en-têtes hop-by-hop connus dans “Connection” peut provoquer un comportement inattendu des proxys.',
    goals: [
      'Identifier les en-têtes supprimés ou réécrits par la chaîne de proxy.',
      'Détecter un contournement d’accès ou de filtrage.',
    ],
    identify: [
      'Injecter des en-têtes tels que `X-Forwarded-For`, `X-Original-URL` ou des valeurs Content-Length multiples.',
      'Comparer les réponses côté client et côté serveur pour déceler des différences.',
    ],
    exploit: [
      'Reproduire un scénario où la suppression d’un en-tête contourne un contrôle (WAF, ACL).',
      'Illustrer un accès à une ressource protégée grâce à l’en-tête manipulé.',
    ],
  },
  HttpRequestSmuggling: {
    title: 'HTTP Request Smuggling',
    summary:
      'Le request smuggling désynchronise proxy et serveur en leur faisant interpréter différemment une même requête.',
    goals: [
      'Détecter la présence de combinaisons CL/TE vulnérables.',
      'Construire une requête qui altère le traitement des messages suivants.',
    ],
    identify: [
      'Tester les variantes CL.TE, TE.CL et TE.TE.',
      'Mesurer les délais ou réponses inhabituelles après injection d’une requête ambiguë.',
    ],
    exploit: [
      'Forcer le proxy à livrer du contenu conçu par l’attaquant à une victime.',
      'Contourner l’authentification en plaçant une requête secondaire dans le même flux.',
    ],
  },
  H2cSmuggling: {
    title: 'HTTP/2 vers HTTP/1.1 (H2C) smuggling',
    summary:
      'La rétrogradation d’une requête HTTP/2 en HTTP/1.1 peut être exploitée pour introduire des messages non attendus.',
    goals: [
      'Tester les proxys gérant la conversion HTTP/2 → HTTP/1.1.',
      'Détecter des réponses incohérentes entre front-end et back-end.',
    ],
    identify: [
      'Envoyer des requêtes H2C avec des en-têtes obscurs ou doublons.',
      'Observer les journaux ou délais côté serveur en cas d’échec.',
    ],
    exploit: [
      'Injecter une requête supplémentaire dans le flux downgrader.',
      'Démontrer la possibilité de détourner des requêtes d’autres utilisateurs.',
    ],
  },
  H2cSmugglingTunneling: {
    title: 'Tunnelisation via H2C smuggling',
    summary: 'Documentation complémentaire à ajouter selon les tests effectués.',
    goals: [
      'Mettre en place un canal HTTP/2 persistant pour observer le comportement.',
    ],
    identify: [
      'Analyser la prise en charge des connexions H2C non chiffrées.',
    ],
    exploit: [
      'Évaluer l’ouverture d’un tunnel permettant d’accéder à des services internes.',
    ],
    notes: 'Module fourni comme canevas pour les recherches avancées.',
  },
  IpSpoofing: {
    title: 'Usurpation d’adresse IP',
    summary:
      'Manipuler l’adresse IP perçue par l’application peut contourner des contrôles de sécurité.',
    goals: [
      'Détecter les contrôles basés sur l’adresse IP source.',
      'Identifier les en-têtes utilisés pour journaliser ou filtrer les clients.',
    ],
    identify: [
      'Tester des en-têtes comme `X-Forwarded-For`, `Client-IP`, `True-Client-IP`.',
      'Observer les journaux applicatifs pour vérifier la valeur retenue.',
    ],
    exploit: [
      'Présenter un scénario où l’accès est accordé grâce à une IP simulée.',
      'Démontrer le contournement d’un système de limitation de taux basé sur l’adresse IP.',
    ],
  },
  ManualTestingTemplate: {
    title: 'Modèle de test manuel',
    summary: 'Section vierge à personnaliser selon les besoins du testeur.',
    notes: 'Ajoutez vos propres objectifs, étapes et observations pour conserver une trace structurée.',
  },
  XsltInjection: {
    title: 'Injection XSLT',
    summary:
      'Les transformations XSLT permettent de restructurer des documents XML ; une implémentation non sécurisée peut exécuter du code.',
    goals: [
      'Identifier les points d’entrée acceptant du XML/XSLT.',
      'Tester l’exécution de modèles personnalisés.',
    ],
    identify: [
      'Soumettre un XSLT simple et vérifier le résultat généré.',
      'Déterminer si l’application autorise l’accès au système de fichiers ou aux fonctions réseau.',
    ],
    exploit: [
      'Concevoir un XSLT déclenchant l’exfiltration ou l’exécution de commandes.',
      'Documenter l’impact et les conditions nécessaires.',
    ],
  },
};

export default moduleContent;
