---
layout: post
title: "Creando aplicaciones de escritorio con Node-Webkit"
date: 2014-03-21 22:00:00
categories: nodejs node-webkit
---

[Node-Webkit](https://github.com/rogerwang/node-webkit) es una aplicación basada en **Chromium** y **Node.js** que te permite escribir aplicaciones nativas usando las tecnologías web.

Con **Node-Webkit** podés escribir aplicaciones de escritorio usando HTML, CSS, JavaScript, y podes usar módulos de Node.js directamente en el DOM. Dado que las tecnologías web cada vez nos otorgan más control sobre nuestras aplicaciones web, esta la posibilidad de hacer aplicaciones de gran complejidad, que en un pasado cercano solo se hubiese pensado que serian cosas solamente posibles con lenguajes usados para hacer aplicaciones de escritorio.

Pero una desventaja común con aplicaciones webs, es que obviamente, necesitan conexión a internet, pero con Node-Webkit ahora podes usar estas poderosas tecnologías web para hacer aplicaciones de escritorio.

Node-Webkit utiliza un browser basado en **Webkit** que fue extendido para poder controlar su interfaz, así permitiéndonos crear una aplicaciones que verdaderamente parezca nativa. Además podés usar funciones de *Node.js*, incrementando la variedad de funciones que podes utilizar para tu aplicación.


###Creando una aplicación simple

Las aplicaciones de node-webkit se crean similarmente a aplicaciones de Node, donde vas a tener un directorio que contenga los diferentes recursos - como HTML, CSS, JavaScript, imágenes, etc.

En este directorio también se debe ubicar el archivo **package.json**, donde se describen ciertos aspectos de la aplicación, como el HTML por donde la aplicación debe comenzar, nombre y características de la ventana - tamaño, si deberá tener frames, toolbar, entre otras cosas.

El elemento "main" dentro de este archivo indica el primer archivo HTML que la aplicación debería mostrar, como "index.html", que podrá incluir links a las demas paginas de la aplicación, JavaScript y CSS.

{% highlight json %}
{
  "name": "App",
  "main": "index.html",
  "window": {
    "toolbar": false,
    "frame": false,
    "icon": "icon.png",
    "position": "center",
    "width": 560,
    "height": 570,
    "resizable": false
  }
}
{% endhighlight %}

###Usando funciones Node

Podes incluir funciones y módulos de Node facilmente. Al igual que con Node, podes instalar los módulos usando [npm](https://www.npmjs.org).

Luego node-webkit puede incluir cualquier módulo que se encuentre en el directorio `node_modules` dentro de tu aplicación.

Por ejemplo podemos usar markdown:

`npm install markdown`

{% highlight javascript %}
var md = require('markdown').markdown;
document.write(md.toHTML("Hola __Mundo__!"));
{% endhighlight %}

###Distribución de tu aplicación

Distribuir la aplicación es muy simple, solamente necesitas archivar los archivos de tu aplicación en formato ZIP.
(Ejemplos de comandos siguientes basados en linea de comando de Linux o OSX)

`zip -r app.nw *`

Dale al archivo ZIP la extensión de .nw para reconocerlo como aplicación de Node-Webkit, y ahora podés ejecutar esa aplicación con Node-Webkit.

`/bin/node-webkit/nw ~/app.nw`

También podés simplemente decirle a Node-Webkit que abra tu directorio actual:

`/bin/node-webkit/nw .`

Podés también empaquetar Node-Webkit y tu archivo .nw en un ejecutable para el usuario final. Aunque la manera recomendada es distribuir el directorio de tu aplicación junto con Node-Webkit, ya que al ejecutar node-webkit sin opciones o parámetros, buscara un package.json en el mismo directorio, luego simplemente modifica el ejecutable de node-webkit con el nombre que quieras y listo. 

###últimas notas y conclusion

Poder crear aplicaciones de escritorio con las tecnologías web es un verdadero placer gracias a Node-Webkit, también podés combinarlo con Frameworks, personalmente creo que [Angular.js](http://angularjs.org/) es una excelente opción para combinarlo con Node-Webkit.

Podés ver ejemplos de aplicaciones hechas en node-webkit en [el repositorio del mismo](https://github.com/zcbenz/nw-sample-apps).

Para que te des una idea de lo que se puede llegar a hacer con Node-Webkit también considera las siguientes aplicaciones:

El juego [Game Dev Tycoon](http://www.greenheartgames.com) esta hecho con Node-Webkit.

Y el lector de feeds [Sputnik](http://sputnik.szwacz.com/) también.

Finalmente, si te interesa, podes ver un aplicación que cree en Node-Webkit junto a Angular.js, [Starlogger](https://github.com/GGalizzi/starlogger), hecha para el juego [Starbound](http://playstarbound.com).
