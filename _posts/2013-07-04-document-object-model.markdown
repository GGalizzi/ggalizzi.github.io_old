---
title: "El DOM (Document Object Model)"
date: 07/04/2013 14:00:00
layout: post
categories: html javascript webdev
---

Conocer como se estructura el DOM es esencial para cualquier desarrollador web, especialmente cuando pensamos utilizar JavaScript, el lenguaje de programación que nos permite manipular el DOM.

Los Web Browsers generan el árbol DOM al leer el documento presentado, este árbol representa el contenido del HTML como árbol genealógico, cada tag y elemento de la pagina es contenido en un **nodo**, cada nodo tiene un enlace a otros nodos que pueden ser *hijos* (elementos contenidos dentro de el mismo), un *padre* (elemento que lo contiene) o *hermanos* (elementos contenidos bajo el mismo padre).
Por ejemplo si analizamos este HTML:


{% highlight html %}
  <HTML>
      <head>
          <title>Mi documento</title>
      </head>
      <body>
          <h1>Este es mi documento</h1>
          <p>Tiene un párrafo, y palabras con <em> énfasis </em></p>
          <p>O dos párrafos </p>
      </body>
  </HTML>
{% endhighlight %}

Todo el contenido esta dentro del elemento "HTML", este elemento tiene dos hijos, "head" y "body" (que son hermanos), "head" a su vez, tiene un hijo, "title" (este también a su vez tiene un hijo, que es el texto mismo dentro de los tags).
"body" tiene 3 hijos, el *primer hijo* (firstChild), es "h1" y el *ultimo hijo* (lastChild) es uno de los dos "p", el DOM no tiene un enlace directo a hijos del medio, pero si se los puede acceder caminando el DOM, que en este caso seria sencillamente llamar al primer o ultimo hijo y luego llamar al hijo siguiente o anterior, respectivamente, para conseguir el "p" del medio. (mas sobre caminar el DOM luego).
O también se pueden acceder si conocemos exactamente en que posición se encuentra el nodo que necesitamos, a través de la propiedad childNodes, que nos devuelve un arreglo con todos sus hijos.

{% highlight javascript %}
  //Llegamos al mismo nodo de dos maneras diferentes.

  //Caminando el DOM
  document.body.firstChild.nextSibling;

  //Usando childNodes
  document.body.childNodes[1];
{% endhighlight %}

Este "p", a su vez tiene el hijo "em".

Recordemos que cada *nodo* es un objecto, que tiene cantidad de propiedades y métodos para analizar y usarlos de muchas maneras.
[Referencia GECKO del DOM.](https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko)

### Caminando el DOM

Caminar el DOM nos puede servir para encontrar ciertos elementos, como vimos antes.
Por ejemplo, miremos esta función que camina el DOM, y aplica una funcion a cada nodo encontrado:

{% highlight javascript %}
  function caminarDOM(nodo, func) {
      func(node);
      node = node.firstChild;
      //mientras este node tenga un hijo
      while(node) {
          caminarDOM(node, func);
          node = node.nextSibling;
      }
  }
{% endhighlight %}

**Este siguiente parrafo esta desactualizado, JavaScript ahora si otorga una función como esta.**

Esta función nos puede servir, por ejemplo para crear un método para encontrar elementos de una clase en particular, que JavaScript lamentablemente no tiene por defecto, pero que seria muy útil:

{% highlight javascript %}
  function getElementsByClass(className) {
      var resultados = [];
      caminarDOM(document.body, function(node) {
          var a, c = node.className, i;
          if (c) {
              a = c.split(' ');
              for (i = 0; i < a.length; i += 1) {
                  if(a[i] === className) {
                      results.push(node);
                      break;
              }
          }
      }
  }
{% endhighlight %}

(Aunque aclaro que la librería jQuery nos otorga un método como este, y muchas otras cosas para caminar el DOM de manera mas eficiente, rápida y sencilla.)
