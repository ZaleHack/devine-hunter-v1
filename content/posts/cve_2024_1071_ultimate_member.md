---
title : 'CVE-2024-1071 ou la vulnérabilité du plugin Ultimate Member qui met en danger pontentiellement plus de 200.000 sites Wordpress -  Exploitation & Correctifs'
date : 2024-03-06T10:00:08Z
draft : false
images: [/images/ultimate_member_plugin_sqli.png]
featuredImage : '/images/ultimate_member_plugin_sqli.png'
featuredImagePreview : '/images/ultimate_member_plugin_sqli.png'
---

## Introduction

Le plugin WordPress Ultimate Member comptant plus de 200 000 installations actives présente une vulnérabilité critique d'injection SQL. 
Cette faille critique, identifiée sous le nom de CVE-2024-1071, présente un score CVSS de gravité élevée de 9.8, soulignant le risque grave qu'elle représente pour les sites web utilisant ce plugin largement utilisé.

La liste des versions vulnérables :

* Les versions du plugin Ultimate Member comprises entre 2.1.3 et 2.8.2 sont vulnérables.

## Détails technique

Ultimate Member est un plugin d'adhésion WordPress qui comprend de nombreuses fonctionnalités et fonctions premium. L'une de ces fonctionnalités est le répertoire des membres, qui répertorie les utilisateurs sur le site web.

Malheureusement, une implémentation non sécurisée de la fonctionnalité de requête des utilisateurs du plugin permet l'injection SQL. L'examen du code révèle que le plugin utilise la fonction ajax_get_members() dans la classe Member_Directory_Meta pour interroger les utilisateurs WordPress afin de les répertorier, où l'ordre peut être spécifié avec le paramètre 'sorting'.

```
$order = 'ASC';
$sortby = ! empty( $_POST['sorting'] ) ? sanitize_text_field($_POST['sorting'] ) : $directory_data['sortby'];
```
Bien que la fonction sanitize_text_field() soit utilisée, elle ne protège pas contre l'injection SQL

```
$user_ids = $wpdb->get_col(
    "SELECT SQL_CALC_FOUND_ROWS DISTINCT u.ID
    {$this->select}
    FROM {$wpdb->users} AS u
    {$sql_join}
    WHERE 1=1 {$sql_where}
    {$this->having}
    {$this->sql_order}
    {$this->sql_limit}"
);
```

L'instruction ORDER BY est ajoutée à la requête sans utiliser la fonction wpdb prepare() de WordPress. La fonction prepare() permet de paramétrer et d'échapper la requête SQL pour une exécution sécurisée dans WordPress, offrant ainsi une protection contre les attaques par injection SQL.

Étant donné que l'injection SQL basée sur Union n'est pas possible en raison de la structure de la requête, un attaquant devrait utiliser la méthode Time-Based pour extraire des informations de la base de données. Cela signifie qu'ils devraient utiliser des instructions SQL CASE avec la commande SLEEP() tout en observant le temps de réponse de chaque requête pour voler des informations à partir de la base de données. Il s'agit d'une méthode complexe, mais souvent réussie avec des outils comme SQLMAP ou GHAURI.

NB : 
La vulnérabilité n'affecte que les utilisateurs ayant activé l'option « Enable custom table for usermeta» dans les paramètres du plugin, car le plugin charge seulement la classe Member_Directory_Meta dans cette configuration.

```
$search_in_table = $this->options()->get( 'member_directory_own_table' );
 
if ( ! empty( $search_in_table ) ) {
    $this->classes['member_directory'] = new um\core\Member_Directory_Meta();
}
```

![Enable custom table for usermeta ](/images/enable_custom_table_for_usermeta.png)


## Détails de l'exploitation

Dans cette partie, nous allons voir comment trouver des services exposés et faire la démonstration d'un exemple d'exploitation réussie.

### Comment trouver des services exposés ?

####	Avec HUNTER.HOW

```
web.body="/wp-content/plugins/ultimate-member"
```
Sur Hunter.how , on a plus de 148.000 services exposés.

![Liste Ultimate Member Hunter.How](/images/hunter_how_ultimate_member.jpeg)

####	Avec FOFA

```
body="/wp-content/plugins/ultimate-member"
```
Sur Fofa.com , on a plus de 199.000 services exposés.


![Liste Ultimate Member Fofa.com ](/images/fofa_ultimate_member.jpeg)

### Démonstration

Dans cette vidéo, nous allons faire la démonstration d'un exemple d'exploitation réussie.


{{< youtube id="TnxR2recc4Q" autoplay="true" yt_start="12" yt_end="24">}}

## Correctifs

Ultimate Member a publié un correctif dans la version 2.8.3. Si votre site web utilise ce plugin, il est fortement recommandé de le mettre à jour immédiatement vers la dernière version. https://wordpress.org/plugins/ultimate-member/