---
title: "[디자인 패턴] 팩토리 메서드 패턴(Factory Method Pattern)"
date: 2021-08-27T12:54:38.150Z
categories:
  - Design-Pattern
  - Creational-Patterns
tags:
  - Design Pattern
  - Creational Patterns
---

팩토리 메서드는 객체를 생성하는 것에 관한 것이다. 그런데 왜 객체를 생성하는 방법이 필요한 것일까? 이건 생성자가 하는 일이 아니었을까라고 생각이 들 수 있다.

생성자에는 고유한 한계가 있다.

<!-- more -->
## [](#factory-method)Factory Method

예를 들어 다음과 같은 클래스 선언이 있다고 가정해보자.


```kotlin
class Cat {
    val name = "Cat"
}
```


클래스의 인스턴스를 반환하는 함수를 작성한다면 대부분 아래와 같이 작성할 것이다.


```kotlin
fun catFactory() : Cat {
    return Cat()
}
```


```kotlin
val c = catFactory()
println(c.name) // 실제로 "Cat"을 출력한다.
```


이제 제공한 인자를 기반으로 이 메서드가 두 객체 중 하나를 생성할 수 있을까?


```kotlin
class Dog {
    val name = "Dog"
}
```


인스턴스화할 두 가지 유형의 객체 중에서 선택하려면 인자만 전달하면 된다.


```kotlin
fun animalFactory(animalType: String) : Cat {
    return Cat()
}
```


항상 `Cat`을 반환할 수는 없으니, 반환할 공통된 인터페이스를 만들어야 한다.


```kotlin
interface Animal {
    val name : String
}
```


이제 남은 건 `when`을 사용하여 일치하는 클래스의 인스턴스를 반환하는 것이다.


```kotlin
return when(animalType.lowercase()) {
    "cat" -> Cat()
    "dog" -> Dog()
    else -> throw RuntimeException("Unknown animal $animalType")
}
```


팩토리 메서드의 핵심은 다음과 같다.

-   값을 가져온다.
-   공통 인터페이스를 구현하는 객체 중 하나를 반환한다.

이 패턴은 구성에서 객체를 생성할 때 매우 유용하다.

동물 병원에서 다음 내용이 포함된 텍스트 파일을 가져왔다고 가정해보자.


```plaintext
dog, dog, cat, dog, cat, cat
```


이제 각 동물에 대한 빈 프로필을 만들어보자.


```kotlin
val animalTypes = listOf("dog", "dog", "cat", "dog", "cat", "cat")
    
for (t in animalTypes) {
    val c = animalFactory(t)
    println(c.name)
}
```


팩토리 메소드에 상태가 필요하지 않다면 함수로 남겨둘 수 있다.

하지만 각 동물에 순차적으로 고유한 식별자를 할당하려면 어떻게 해야 할까?


```kotlin
interface Animal {
   val id : Int
   // Same as before
}

class Cat(override val id: Int) : Animal { 
    // Same as before
}

class Dog(override val id: Int) : Animal {
    // Same as before
}
```


생성자 내부의 값을 재정의할 수 있게 변경하였다.

이제 Factory를 함수가 아닌 적절한 클래스로 변경하자.


```kotlin
class AnimalFactory {
    var counter = 0

    fun createAnimal(animalType: String) : Animal {
        return when(animalType.trim.lowercase()) {
            "cat" -> Cat(++counter)
            "dog" -> Dog(++counter)
            else -> throw RuntimeException("Unknown animal $animalType")
        }
    }
}
```


이제 초기화를 해야 한다.


```kotlin
val factory = AnimalFactory()
for (t in animalTypes) {
    val c = factory.createAnimal(t)
    println("${c.id} - ${c.name}")
}
```


> 최종 코드


```kotlin
interface Animal {
    val id : Int
    val name : String
}

class Cat(override val id: Int) : Animal {
    override val name = "Cat"
}

class Dog(override val id: Int) : Animal {
    override val name = "Dog"
}

class AnimalFactory {
    var counter = 0

    fun createAnimal(animalType: String) : Animal {
        return when(animalType.trim().lowercase()) {
            "cat" -> Cat(++counter)
            "dog" -> Dog(++counter)
            else -> throw RuntimeException("Unknown animal $animalType")
        }
    }
}

fun main() {
    val animalTypes = listOf("dog", "dog", "cat", "dog", "cat", "cat")

    val factory = AnimalFactory()
    for (t in animalTypes) {
        val c = factory.createAnimal(t)
        println("${c.id} - ${c.name}")
    }
}
```


코드를 실행하면 다음과 같은 결과값이 나온다.


```plaintext
1 - Dog
2 - Dog
3 - Cat
4 - Dog
5 - Cat
6 - Cat
```


이것은 아주 간단한 예시이다. 객체(이 경우, `Animal`)에 대한 공통 인터페이스를 제공한 다음 몇 가지 인자를 기반으로 인스턴스화할 구체적인 클래스를 결정하였는데, 추가적으로 다른 품종을 지원한다면 어떻게 해야 할까?


```kotlin
val animalTypes = listOf("dog" to "bulldog", 
                         "dog" to "beagle", 
                         "cat" to "persian", 
                         "dog" to "poodle", 
                         "cat" to "russian blue", 
                         "cat" to "siamese")
```


실제 객체 인스턴스화를 다른 팩토리에 위임할 수 있다.


```kotlin
class AnimalFactory {
    var counter = 0
    private val dogFactory = DogFactory()
    private val catFactory = CatFactory()

    fun createAnimal(animalType: String, animalBreed: String) : Animal {
        return when(animalType.trim().lowercase()) {
            "cat" -> catFactory.createCat(animalBreed, ++counter)
            "dog" -> dogFactory.createDog(animalBreed, ++counter)
            else -> throw RuntimeException("Unknown animal $animalType")
        }
    }
}
```


팩토리는 같은 패턴을 다시 반복한다.


```kotlin
class DogFactory {
    fun createDog(breed: String, id: Int) = when(breed.trim().lowercase()) {
        "beagle" -> Beagle(id)
        "bulldog" -> Bulldog(id)
        else -> throw RuntimeException("Unknown dog breed $breed")
    }
}

class CatFactory {
    fun createCat(breed: String, id: Int) = when(breed.trim().lowercase()) {
        "persian" -> Persian(id)
        "russian blue" -> RussianBlue(id)
        "siamese" -> Siamese(id)
        else -> throw RuntimeException("Unknown cat breed $breed")
    }
}
```


비글(Beagle), 불독(Bulldog), 캣팩토리(CatFactory) 및 모든 다른 고양이 품종을 직접 구현하여 이 예를 이해했는지 확인할 수 있다.

마지막으로 주목해야 할 점은 이제 한 쌍의 인수로 AnimalFactory를 호출하는 방법이다.


```kotlin
for ((type, breed) in animalTypes) {
    val c = factory.createAnimal(type, breed)
    println(c.name)
}
```


> 최종 코드


```kotlin
interface Animal {
    val id: Int
    val name: String
}

class Beagle(override val id: Int) : Animal {
    override val name = "Beagle"
}

class Bulldog(override val id: Int) : Animal {
    override val name = "Bulldog"
}

class Poodle(override val id: Int) : Animal {
    override val name = "Poodle"
}

class Persian(override val id: Int) : Animal {
    override val name = "Persian"
}

class RussianBlue(override val id: Int) : Animal {
    override val name = "RussianBlue"
}

class Siamese(override val id: Int) : Animal {
    override val name = "Siamese"
}

class DogFactory {
    fun createDog(breed: String, id: Int) = when (breed.trim().lowercase()) {
        "beagle" -> Beagle(id)
        "bulldog" -> Bulldog(id)
        "poodle" -> Poodle(id)
        else -> throw RuntimeException("Unknown dog breed $breed")
    }
}

class CatFactory {
    fun createCat(breed: String, id: Int) = when (breed.trim().lowercase()) {
        "persian" -> Persian(id)
        "russian blue" -> RussianBlue(id)
        "siamese" -> Siamese(id)
        else -> throw RuntimeException("Unknown cat breed $breed")
    }
}

class AnimalFactory {
    var counter = 0
    private val dogFactory = DogFactory()
    private val catFactory = CatFactory()

    fun createAnimal(animalType: String, animalBreed: String): Animal {
        return when (animalType.trim().lowercase()) {
            "cat" -> catFactory.createCat(animalBreed, ++counter)
            "dog" -> dogFactory.createDog(animalBreed, ++counter)
            else -> throw RuntimeException("Unknown animal $animalType")
        }
    }
}

fun main() {
    val animalTypes = listOf(
        "dog" to "bulldog",
        "dog" to "beagle",
        "cat" to "persian",
        "dog" to "poodle",
        "cat" to "russian blue",
        "cat" to "siamese"
    )

    val factory = AnimalFactory()
    for ((type, breed) in animalTypes) {
        val c = factory.createAnimal(type, breed)
        println("${c.id} - ${c.name}")
    }
}
```


```plaintext
1 - Bulldog
2 - Beagle
3 - Persian
4 - Poodle
5 - RussianBlue
6 - Siamese
```


## [](#정적-팩토리-메서드smallstatic-factory-methodsmall)정적 팩토리 메서드(Static Factory Method)

정적 팩토리 메서드는 죠슈아 블로크의 저서 _Effective Java_로 널리 알려졌다. 이해를 돕기 위해 자바 표준 라이브러리의 `valueOf()` 메서드의 예시를 보자.


```java
Long l1 = new Long("1")
Long l2 = Long.valueOf("1")
```


생성자와 `valueOf()` 메서드 모두 `String`을 입력으로 받고 `Long`을 출력으로 생성한다.

그렇다면 정적 팩토리 메서드가 생성자보다 때때로 나은 이유는 무엇일까?

### [](#정적-팩토리-메서드의-장점들)정적 팩토리 메서드의 장점들

다음은 생성자에 비해 정적 팩토리 메서드가 가지는 장점들이다.

-   생성자에 대해 더 나은 이름으로 내용을 유추할 수 있게 해준다.
-   일반적으로 생성자에서 예외를 기대하지 않는 반면에, 일반 메서드의 예외는 완전히 유효하다.
-   생성자가 빠를 것으로 기대한다.

하지만 이것들은 심리적인 이점이지, 정적 팩토리 메서드는 몇 가지 기술적 이점을 가지고 있다.

#### [](#캐싱smallcachingsmall)캐싱(Caching)

정적 팩토리 메서드는 캐싱을 제공한다. 매번 값에 대해 새로운 인스턴스를 반환하는 대신, `valueOf()`는 이 값이 이미 파싱되었는지 여부를 캐시 내에서 확인한다. 만약 이미 파싱되었다면 캐시된 인스턴스를 반환한다. 동일한 값으로 정적 팩토리 메서드를 반복적으로 호출하면 항상 생성자를 사용하는 것보다 garbage가 덜 생성될 수 있다.

#### [](#subclassing)Subclassing

생성자를 호출할 때, 우리는 항상 지정한 클래스를 인스턴스화한다. 반면에, 정적 팩토리 메서드를 호출하면 클래스의 인스턴스나 그 하위 클래스 중 하나가 생성될 수 있다.

### [](#코틀린에서의-정적-팩토리-메서드)코틀린에서의 정적 팩토리 메서드

자바에서 정적 팩토리 메서드는 `static`으로 선언된다. 하지만 코틀린에선 `static` 키워드가 없다. 대신 클래스의 인스턴스에 속하지 않는 메서드는 `companion object` 내부에 선언될 수 있다.


```kotlin
class NumberMaster {
    companion object {
        fun valueOf(hopefullyNumber: String) : Long {
            return hopefullyNumber.toLong()
        }
    }
}
```


companion object의 호출에는 클래스의 인스턴스화가 필요하지 않다.


```kotlin
println(NumberMaster.valueOf("123")) // 123 출력
```


더욱이 companion object는 자바와 달리 클래스의 인스턴스에서 호출할 수 없다.


```kotlin
println(NumberMaster().valueOf("123")) // 컴파일 되지 않음
```


## [](#references)References

-   Hands-on Design Patterns with Kotlin

#[Design Pattern](/tags/Design-Pattern/)[Creational Patterns](/tags/Creational-Patterns/)
