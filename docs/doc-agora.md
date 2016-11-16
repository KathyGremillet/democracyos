#DemocracyOS Agora
*Attention : cette version est un dérivé de la version principale de DemocracyOS qui découle des retours que nous avons eu sur dernières les plateformes que nous avons mis en place. Nous ne savons pas encore quelles fonctionnalités seront reprises à terme dans la version principale. Pour aller sur la master https://github.com/democracy-os-fr/democracyos/*


Cette version comprend :

###UX DESIGN

Quelques petits changements pour rendre le tout un peu plus "sleak".

- Page d'accueil `MULTI-FORUM`dont le texte d'intro est modifiable en allant dans `/lib/layout/includes/intro.jade`
![page accueil](https://participez.nanterre.fr/sites/default/files/screenshot-consultation.openlaw.fr%202016-09-02%2011-38-54.png)
- Refonte du module de commentaire / arguments
![commentaires](https://participez.nanterre.fr/sites/default/files/comments%20new%20UX.png)
- Ajout d'un footer modifiable en allant dans `/lib/footer/footer.jade`
![commentaires](https://participez.nanterre.fr/sites/default/files/footer.png)

À noter la possibilité de changer la police de caractère principale grace aux variables de configuration suivantes :

**JSON**

```
{
  ...
  "fontFamily": "'Montserrat', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  "fontFamilyLink": "https://fonts.googleapis.com/css?family=Montserrat:400,700",
  ...
}
```
**ENV**

```
export FONT_FAMILY="'Montserrat', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif"
export FONT_FAMILY_LINK="https://fonts.googleapis.com/css?family=Montserrat:400,700"
```

###Contributions collectives / ALIAS de commentaire

La possibilité de saisir un alias lors de l'ajout d'une contribution / commentaire sur un débat, ainsi qu'un nombre de participants.

À noter que le nom de l'utilisateur ayant saisi le commentaire est quand même affiché pour éviter les confusions.

###Contributions / commentaires

Nous avons remplacé la prise en charge du Markdown dans les commentaires par un éditeur visuel HTML : Medium Editor

Note : en cas de migration de votre application (Markdown vers HTML), une routine est disponible à l'adresse suivante

**<votre application>/upd/comments-md-to-html**

Elle fera la transformation de tous les commentaires en HTML.

##L'upload de photos de profil sur amazon S3

Pour l'instant limitée aux photos de profil, l'envoi d'image est desormais possible si un compte Amazon S3 et un bucket sont précisés gràce aux variables de configuration suivantes :

**JSON**

```
{
  ...
  "uploader": "amazon",
  "amazon": {
    "username": "AAKJHFKJQFLKQLKBFKQBFJH",
    "password": "8663iuHFKGHQKquhfkjdhsf553djhgfkjs",
    "bucket": "my-bucket-name"
  },
  ...
}
```

**ENV**

```
export UPLOADER="amazon"
export AMAZON_USERNAME="AAKJHFKJQFLKQLKBFKQBFJH"
export AMAZON_PASSWORD="8663iuHFKGHQKquhfkjdhsf553djhgfkjs"
export AMAZON_BUCKET="my-bucket-name"
```
*Note : Les valeurs présentes sont des valeurs d'exemple qui doivent être remplacés par vos identifiants.*

*Note : Amazon peut mettre quelques heures à rendre un bucket disponible après sa création. Dans ce cas, vous risquez de tomber sur l'erreur suivante*

`Could not get Signed URL`

###Login google APP

De la manière que le login Facebook, il est maintenant possible de s'incrire et de se connecter avec les services de Google

**JSON**

```
{
  ...
  "googleSignin": true,
  "auth": {
    "google": {
      "clientId": "1234567890-ffdge455gfzghh7735vjfs556.apps.googleusercontent.com",
      "clientSecret": "ks-sfqfq325hkjkj67fkqjsbf"
    }
  },
  ...
}
```

**ENV**

```
export GOOGLE_SIGNIN=true
export AUTH_GOOGLE_CLIENT_ID="1234567890-ffdge455gfzghh7735vjfs556.apps.googleusercontent.com"
export AUTH_GOOGLE_CLIENT_SECRET="ks-sfqfq325hkjkj67fkqjsbf"
```
*Note : Les valeurs présentes sont des valeurs d'exemple qui doivent être remplacés par vos identifiants.*

###Catégories - icônes

Les icônes SVG ont été remplacés par une sélection d'icône [FontAwesome](http://fontawesome.io/).

La liste des types d'icônes disponibles n'est pas encore configurable via une variable ou une page d'administration mais elle est facilement modifiable dans le code de l'application.

###Notifications par mail

Les patrons des messages envoyés ont été mis à jour en se basant sur les recommandations de [Mailgun](https://www.mailgun.com/) (format email alert).

De plus, nous avons ajoutés un nouveau type de notification réservé aux administrateurs qui permet de recevoir un message à chaque fois qu'un commentaire est publié sur la plateforme.

Note : le code gérant l'envoi des emails n'est pas intégré à DemocracyOS et est disponible dans un repo https://github.com/democracy-os-fr/notifier/tree/alt/agora.

###Gestion de Utlisateurs - informations complémentaires

Les informations suivantes sont maintenant disponibles lors de la création d'un compte utilisateur :
![inscription](https://participez.nanterre.fr/sites/default/files/incription%20dos.png)

####Age

Tranches d'age basées sur les catégories de l'INSEE (14 valeurs).

Les libellés sont néanmoins éditable dans les fichiers de langue de l'application.

Clé : settings.age.xx

Pour activer cette option, il faut utliser la variable de configuration suivante

**JSON**

```
{
  ...
  "userAge": true,
  ...
}
```

**ENV**

```
export USER_AGE=true
```

####Quartier

Sélection de son lieu de résidence / travail à l'aide d'un menu déroulant

Cette option et les valeurs associées sont configurables dans le module de lle détaillé plus bas dans ce document.

####Activité

Sélection (multiple) de son(ses) actvité(s) à l'aide case à cocher

Cette option et les valeurs associées sont configurables dans le module de ee détaillé plus bas dans ce document.

**Note : Ces informations ont principalement destinées à l'extraction de données et la création de statistiques.**

**Note : Ces informations ne sont pas obligatoire (lorsqu'elles sont activées) mais un message d'avertissement sera affiché pour rappeler à l'utilisateur de compléter son profil si il ne l'a pas fait.**

###Administration

Pour rappel, l'interface d'administration n'est accessible que les utlisateurs dont l'adresse mail est présente dans la variable de configuration ``STAFF``

###Administration - LISTE DES UTILISATEURS

Mise à disposition d'une page pour lister et rechercher les utilisateurs inscrits.
![liste utilisateurs](https://participez.nanterre.fr/sites/default/files/user%20list.png)

De plus cette liste permet de :

- rendre un utilisateur inactif pour l'empècher de se connecter de nouveau à l'application (de cette manière, ses contributions sont conservées en base de données)
- affecter un ou plusieurs rôle(s) à un utilisateur (voir la partie sur les règles plus loin dans ce document)

###Administration - création de FORUM / CONCERTATION

Le fonctionnement du mode multiforum à été revu :

- il n'est plus possible (pour l'instant) pour utilisateur standard de créer son propre forum et de l'administrer
- les administrateurs ont par contre accès à une nouvelle page permettant de lister, créer, modifier et supprimer les forums / concertations

*Note : la gestion multiforum est une fonctionnalité en cours de développement à la fois sur la version principale et sur la notre. Il est donc possible que des changements majeurs soient opérés dans le futur.*

N'hesitez pas à nous contacter en cas de problèmes ou d'interogations sur les migrations possibles entre les différentes versions et mises à jour.

###Administration - Edition des DEBATS / TOPICS

Il maintenant possible de :

- déplacer un débat dans un autre forum / concertation
- de prévisualiser un débat avant sa publication

###Administration - EXPORT des CONTRIBUTIONS

Sur la page d'adminsatration des débats (liste), il est maintenant possible d'exporter l'ensemble des commentaires / contributions de la plateforme.

Des variables de configuration sont disponibles pour modifier le format du fichier exporté

**JSON**

```
{
  ...
  "csv": {
    "separator": ";",
    "charset": "windows-1252"
  }
  ...
}
```

**ENV**

```
export CSV_SEPARATOR=";"
export CSV_CHARSET="windows-1252"
```

*Note : Pour le moment, il n'est pas possible de filtrer le contenu exporté.*

*Note : si votre export est destiné à être ouvert et traité par Microsoft Excel, nous vous conseillons d'utiliser le format cité en exemple ci-dessus*

###Administration - Gestion des règles

Mise à disposition d'une page permettant de saisir des règles / configurations directement via l'application (sans redémarrage serveur nécessaire)

Pour activer cette option, il faut utliser la variable de configuration suivante

**JSON**

```
{
  ...
  "rules": ["role","location","activity"],
  ...
}
```

**ENV**

```
export RULES="role,location,activity"
```
où chaque valeur indique un type de règle qui sera activé

(la valeur vide, [ ] en JSON et "" en format ENV, désactive complétement le module)

Les différents types de règle disponibles sont les suivants :

####Rôles (role)

Les rôles peuvent être associés à tous les utilisateurs (mais uniquement par les administrateurs) via la liste des utilisateurs. Ils s'affichent ensuite sous forme de badge à coté du nom de l'utilisateur dans les flux de commentaire des débats.

Le format du champ Valeur (contenu de la rêgle) est le suivant

```
{
  "label": {
    "default": "manager",
    "fr": "chef",
    "en": "manager"
  },
  "color": {
    "background": "#ff0000",
    "text": "#fff"
  }
}
```
####Location / Quartier (location)

Affiché sous la forme d'une liste déroulante dans les formulaires concernant les utilisateurs (inscription, profil, liste)

Le format du champ Valeur (contenu de la règle) est le suivant

```
{
    "label": {
        "fr": "La Boule Champs-Pierreux",
        "default": "Quartier 3"
    }
}
```

####Activité (activity)

Affiché sous la forme d'une liste de case à cocher dans les formulaires concernant les utilisateurs (inscription, profil, liste).

Le format du champ Valeur (contenu de la règle) est le suivant

```
{
    "label": {
        "default": "work",
        "fr": "Je travaille à Paris",
        "en": "I work in Paris"
    },
    "icon": {
        "class": "fa fa-suitcase",
        "color": "inherit"
    }
}
```

*Note : les icônes doivent être sélectionnés dans la collection [FontAwesome](http://fontawesome.io/).*
