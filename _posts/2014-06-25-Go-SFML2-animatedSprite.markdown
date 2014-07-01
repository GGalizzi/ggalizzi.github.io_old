---
layout: post
title: "Creando sprites animados en SFML2 con Go"
date: 2014-06-25 16:00:00
categories: golang sfml2 gamedev
---

Cuento mi progreso creando un paquete de Go para crear fácilmente sprites animados usando SFML2.

El paquete de Go que uso para SFML es [el de krepa098 en bitbucket](https://bitbucket.org/krepa098/gosfml2), ya que parece ser el mas activo.

El paquete hasta el momento crea tres estructuras nuevas: `frame`, `animation` y `animatedSprite`.

##Estructura frame

Esta estructura es sencilla, simplemente tiene dos campos.

{% highlight go %}type frame struct {
	canIdle bool
	rect    sf.IntRect
}
{% endhighlight %}

+ canIdle: Si el frame es utilizado en el estado idle.

+ rect: El rectangulo dentro del spritesheet que utilizaremos, donde se encuentra el sprite que corresponde. Utilizamos [IntRect de SFML para esto.](http://www.sfml-dev.org/documentation/2.0/classsf_1_1Rect.php)

Cree esta estructura para que cada frame sepa si puede ser utilizado como parte de una animación idle (osea, cuando el personaje esta "quieto") que se suele usar animaciones de respiración o algo interesante para que quede mas real o simplemente mejor.

###Métodos de frame

frame tiene un solo método, que es el que usamos para crear un frame.

{% highlight go %}
func MakeFrame(rect sf.IntRect, canIdle bool) frame {

	return frame{canIdle, rect}
}
{% endhighlight %}

##Estructura animation

Con esta estructura definimos lo siguiente:

+ sheet: Es la textura (imagen) que corresponde a la planilla de sprites a utilizar para este objeto/personaje.

+ frames: un frameSet es un nuevo tipo que defini, que es un `map[string][]frame`, y en el se pueden ingresar varios sets de animaciones, por ejemplo, un grupo de frames para cuando el personaje camina a la izquierda, otro cuando corre a la izquierda, otro para movimientos hacia la derecha, etc.

+ lastSetPlayed: Acá simplemente guardamos cual fue el ultimo set que se reprodujo, para poder usar la animación idle correspondiente.

+ fps: Y con esto la animación sabe a que velocidad debe ser actualizada, osea, cada cuantos segundos se cambiara al frame que sigue en la animación.


{% highlight go %}type animation struct {
	sheet *sf.Texture

	frames        frameSet
	lastSetPlayed string

	fps uint
}
{% endhighlight %}

Entonces, con esta estructura podemos definir como un sheet de sprites funciona, dándole nombres a cada animación dentro del mismo.

###Métodos de animation

animation tiene su constructor y un método para asignarle frameSets.
{% highlight go%}
func NewAnimation(texture *sf.Texture, fps uint) *animation {
	a := new(animation)
	a.sheet = texture

	a.fps = fps
	a.frames = make(map[string][]frame)
	return a
}
func (a *animation) CreateFrameSet(key string, frames ...frame) {
	for _, f := range frames {
		a.frames[key] = append(a.frames[key], f)
	}
}
{% endhighlight %}

##Estructura animatedSprite

Esta es la principal estructura, obviamente va a incluir un puntero a un `animation`, y además, a través de [embedding](http://golang.org/doc/effective_go.html#embedding), va a utilizar las mismas funciones que un sf.Sprite.

También va a saber si la animación se debería reproducir en su estado idle, cual es el frame actual, el ultimo frameSet reproducido, y en que momento se realizo el ultimo update de frame.

{% highlight go %}type animatedSprite struct {
	anim *animation

	IsIdle       bool
	currentFrame uint

	lastFrameSetPlayed string
	lastUpdate         time.Time

	*sf.Sprite
}
{% endhighlight %}

lastFrameSetPlayed, como se ve, simplemente guarda la `key` del mapa utilizado.

###Métodos de animatedSprite

Además del constructor, tenemos los siguientes métodos.

`Move`, simplemente ejecuta el método base `sf.Sprite.Move` y una vez que el sprite se movió, lo ponemos en estado idle.

{% highlight go %}func (as *animatedSprite) Move(vector sf.Vector2f) {
	as.Sprite.Move(vector)
	as.IsIdle = true
}

{% endhighlight %}

`PlaySet` es el que vamos a utilizar cuando nuestro personaje realize una acción que requiere de una animación.

Este se encarga también de indicar que el sprite no esta en estado `isIdle`, osea, cuando nuestro personaje haga una acción, llamaremos a `PlaySet` para que empiece la animación, después el personaje se mueve, y cuando deje de moverse, estará en `isIdle`.

{% highlight go %}func (as *animatedSprite) PlaySet(set []sf.IntRect) {
  as.update(set)
  as.IsIdle = false
}
{% endhighlight %}

`update` es el método principal, donde va a actualizar al siguiente frame (o volver al primero).

{% highlight go %}func (as *animatedSprite) update(set []sf.IntRect) {
	//Verifica que no nos pasemos de la maxima cantidad de frames que tiene un set.
	if len(set) > int(as.currentFrame) {
		currentRect := set[as.currentFrame]
		as.SetTextureRect(currentRect)
		//Verificamos que sea tiempo de actualizar el frame.
		if as.isTimeToUpdate() {
			as.currentFrame++
			as.lastUpdate = time.Now()
		}
		return
	}
	as.currentFrame = 0
}
{% endhighlight %}

`Stop` es el que va a utilizar los frames que se han indicado como `canIdle` y del set que se reprodujo ultimo.

{% highlight go %}func (as *animatedSprite) Stop() {
	if as.isTimeToUpdate() {
		var sli []sf.IntRect
		for _, f := range as.anim.frames[as.anim.lastSetPlayed] {
			if f.canIdle {
				sli = append(sli, f.rect)
			}
		}
		as.update(sli)
	}
}
{% endhighlight %}

`isTimeToUpdate` usa la función `time.Since` de Go, para comparar el tiempo que paso desde la ultima actualización de frames, y verificamos que sea mayor a los FPS deseados.

{% highlight go %}func (as *animatedSprite) isTimeToUpdate() bool {
	return time.Since(as.lastUpdate) > time.Second/time.Duration(as.anim.fps)
}
{% endhighlight %}

`AnimationSet` se va a utilizar junto a `PlaySet` para enviar las `sf.IntRect` que contienen los `frame`s indicados por `key`.

{% highlight go %}func (as *animatedSprite) AnimationSet(key string) []sf.IntRect {
	as.anim.lastSetPlayed = key
	var rectSet []sf.IntRect
	for _, v := range as.anim.frames[key] {
		rectSet = append(rectSet, v.rect)
	}
	return rectSet
}
{% endhighlight %}

###Y por ahora eso es todo.

Seguramente habrá muchas cosas de corregir, agregar y modificar a lo largo que siga trabajando en este paquete, y que me ire dando cuenta mientras lo utilice para alguno de mis proyectos.

En el siguiente articulo voy a mostrar un pequeño demo de esto.

Si queres comentar sobre esto, o cualquier cosa, hablame [por twitter](http://twitter.com/GuilleGalizzi).
