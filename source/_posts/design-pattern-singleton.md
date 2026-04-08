---
title: "[디자인 패턴] 싱글턴 패턴(Singleton Pattern)"
date: 2021-08-22T11:18:12.832Z
categories:
  - Design-Pattern
  - Creational-Patterns
tags:
  - Kotlin
  - Design Pattern
  - Creational Patterns
---

객체가 있으면 해당 객체의 인스턴스들을 원하는만큼 생성할 수 있다.

`Cat` 클래스가 있다고 가정해보자.

<!-- more -->

```kotlin
class Cat
```


프로그래머는 다음과 같이 원하는 만큼 인스터스를 생성할 수 있으며, 아무런 문제가 없다.


```kotlin
val firstCat = Cat()
val secondCat = Cat()
val yetAnohterCat = Cat()
```


이러한 행동을 허용하지 않으려면 어떻게 해야할까?

분명히, 처음에 어떤 방식으로든 객체를 생성해야 한다. 하지만 두 번째부터는 **이 객체가 이미 한 번 초기화되었으며, 대신 인스턴스를 반환한다는 것을 인식**해야 한다. 이것이 싱글턴이 되는 주요 아이디어다.

자바와 다른 언어에서는 이 작업이 상당히 복잡하다.

-   생성자를 `private`로 만들고 **객체가 이미 한 번 이상 초기화되었음을 기억**하는 것만으로는 충분하지 않다.
-   두 개의 개별 스레드가 동시에 초기화를 시도하는 **경쟁 상태(race condition)를 방지**하는 작업도 필요하다.
    -   경쟁 상태를 허용해버리면 두 개의 스레드가 동일한 객체의 두 인스턴스에 대한 참조를 가지므로 싱글턴의 전체 개념을 깨뜨릴 것이다.

자바에서 이러한 문제를 해결하려면 다음 중 하나를 수행해야 한다.

-   싱글턴이 처음 액세스할 때가 아니라 애플리케이션이 시작될 때 빠르게 초기화된다는 점을 수락한다.
-   경쟁 조건을 방지하고 성능을 유지하기 위해 특정 코드를 작성한다.
-   이러한 문제들을 이미 해결한 프레임워크를 사용한다.

코틀린은 이를 위해 `object` 예약어를 도입했다. 다음 객체를 보자.


```kotlin
// 중괄호는 필요하지 않지만, 시각적 일관성을 위해 추가하였다.
object MySingleton {}
```


`object`는 하나의 키워드에 선언과 초기화를 결합한 것이다. 이제부터 코드의 어디에서든 `MySingleton`에 접근할 수 있으며, 정확히 하나의 인스턴스만 존재할 것이다.

아직 객체가 아무런 작업을 수행하지 않으므로 호출 횟수를 계산하도록 코드를 추가해보자.


```kotlin
object CounterSingleton {
    private val counter = AtomicInteger(0)

    fun increment() = counter.incrementAndGet()
}
```


스레드 안정성(thread safety)은 테스트하지 않고, 일단 싱글턴을 호출하는 방법을 확인하기 위해 테스트해보자.


```kotlin
for (i in 1..10) {
    println(CounterSingleton.increment())
}
```


이 코드는 1에서 10까지의 숫자를 출력한다. 보다시피, `getInstance()` 메서드가 필요하지 않다.

> `object`는 싱글턴을 생성하는 것 이상의 용도로 사용되는 키워드다.

객체는 생성자를 가질 수 없다.

처음으로 데이터베이스에서 데이터를 로드하거나 네트워크를 통해 데이터를 로드하는 것과 같이 싱글턴에 대한 일종의 초기화 로직을 원하는 경우 `init` 블록을 대신 사용할 수 있다.


```kotlin
object CounterSingleton {

    init {
        println("I was accessed for the first time")
    }

    // 추가 코드는 여기서부터
}
```


또한 Kotlin의 싱글턴은 느리게 초기화된다([참고](https://kotlinlang.org/docs/object-declarations.html#semantic-difference-between-object-expressions-and-declarations) : Object declarations are initialized lazily, when accessed for the first time). 일반 클래스와 마찬가지로 객체는 다른 클래스를 확장하고 인터페이스를 구현할 수 있다.

## [](#references)References

-   Hands-on Design Patterns with Kotlin
-   Kotlin Docs : [Object expressions and declarations](https://kotlinlang.org/docs/object-declarations.html)

#[Kotlin](/tags/Kotlin/)[Design Pattern](/tags/Design-Pattern/)[Creational Patterns](/tags/Creational-Patterns/)
