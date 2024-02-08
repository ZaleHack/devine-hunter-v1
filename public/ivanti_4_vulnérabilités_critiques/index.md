# Evanti : 4 vulnérabilités critiques (CVE-2023-46805, CVE-2024-21887, CVE-2024-21888 et CVE-2024-2189). Exploitation & Correctifs



## Introduction

Le 10 janvier 2024, Ivanti a émis un avis concernant deux vulnérabilités majeures touchant les appareils VPN Connect Secure, CVE-2023-46805 et CVE-2024-21887, permettant une exécution de code à distance non authentifiée. Peu après, des chercheurs ont signalé une exploitation active de ces vulnérabilités remontant à décembre 2023. Le 31 janvier 2024, Ivanti a révélé deux autres vulnérabilités importantes, CVE-2024-21888 et CVE-2024-21893, touchant à la fois Ivanti Connect Secure et Ivanti Policy Secure. Une de ces vulnérabilités, CVE-2024-21893, a également été exploitée en tant que 0-day. Ivanti a rapidement publié des correctifs pour toutes ces failles.

* CVE-2023-46805  :
Une vulnérabilité de contournement de l'authentification dans le composant web d'Ivanti ICS 9.x, 22.x et Ivanti Policy Secure permet à un attaquant distant d'accéder à des ressources restreintes en contournant les vérifications de contrôle.

* CVE-2024-21887  :
Une vulnérabilité d'injection de commandes dans les composants web d'Ivanti Connect Secure (9.x, 22.x) et d'Ivanti Policy Secure (9.x, 22.x) permet à un administrateur authentifié d'envoyer des requêtes spécialement conçues et d'exécuter des commandes arbitraires sur l'appareil.

* CVE-2024-21888  :
A privilege escalation vulnerability in web component of Ivanti Connect Secure (9.x, 22.x) and Ivanti Policy Secure (9.x, 22.x) allows a user to elevate privileges to that of an administrator.

* CVE-2024-21893  :
Une vulnérabilité de falsification de requête côté serveur (SSRF) dans le composant SAML d'Ivanti Connect Secure (9.x, 22.x) et d'Ivanti Policy Secure (9.x, 22.x), ainsi que dans Ivanti Neurons for ZTA, permet à un attaquant d'accéder à certaines ressources restreintes sans authentification


## Détails de l'exploitation

Dans cette partie, nous allons voir comment trouver des services exposés et faire la démonstration d'un exemple d'exploitation réussie.

### Comment trouver des services exposés ?

####	Avec SHODAN

```
http.title:"Ivanti Connect Secure" 
```
Sur shodan , on a plus de 10.000 services exposés.

![Liste des produits Ivanti  sur Shodan](/images/ivanti_shodan.png)

####	Avec HUNTER.HOW

```
product.name="Ivanti Connect Secure" or product.name="Ivanti Policy Secure""
```
Sur Hunter.how , on a plus de 21.000 services exposés.


![Liste des produits Ivanti  sur Hunter.how](/images/ivanti_hunterhow.png)

### Exécution de code arbitraire sans authentification (CVE-2024-21893 + CVE-2024-21887)

La vulnérabilité SSRF (CVE-2024-21893) et la vulnérabilité d'injection de commandes (CVE-2024-21887)  peuvent être combinées ensemble pour obtenir l'exécution de code à distance sans authentification. 

C'est ce que nous allons montrer dans les lignes qui suivent.

####	Détection

Un script est disponible sur github pour détecter et exploiter ces vulnérabilités.
```
https://github.com/Chocapikk/CVE-2024-21887/
```

En prennant en compte  que les services qui sont exposés sur Shodan, on a plus de 240 hosts qui sont toujours vulnérables.


![Liste des produits Ivanti  vulnérables sur Shodan](/images/ivanti_vulns_host_test.png)

![Liste des produits Ivanti  vulnérables sur Shodan](/images/vulns_hosts_number.png)


####	Exploitation

Une exploitation réussie ouvre la possiblité d'exécuter du code arbitraire sur le serveur vulnérable.

![RCE ](/images/ivanti_rce_command.png)

## Correctifs

Ivanti a publié des correctifs pour les vulnérabilités les 31 janvier et 1er février 2024. Il est recommandé d'installer les versions patchées - 9.1R14.4, 9.1R17.2, 9.1R18.3, 22.4R2.2 et 22.5R1.1

Référentiel : 
https://forums.ivanti.com/s/article/Download-Links-Related-to-CVE-2023-46805-and-CVE-2024-21887
