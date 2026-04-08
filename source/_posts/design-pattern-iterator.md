---
title: "[디자인 패턴] 반복자 패턴 (Iterator Pattern) with 코틀린"
date: 2022-01-20T00:00:00.000Z
categories:
  - Design-Pattern
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - BFS
---

> 내부 표현부를 노출하지 않고 어떤 객체 집합에 속한 원소들을 순차적으로 접근할 수 있는 방법을 제공하는 패턴

> 반복자 패턴의 아이디어는 객체가 데이터를 저장하는 방법과 이 데이터를 순회하는 방법을 분리하는 것이다. (집합 객체 단순화)

<!-- more -->
## 구조

![](https://user-images.githubusercontent.com/39554623/150173513-e38f86e0-5482-4d09-9ae7-b2679cc3969b.png)

-   **Iterator**: 원소를 접근하고 순회하는 데 필요한 인터페이스를 제공한다.
-   **ConcreteIterator**: Iterator에 정의된 인터페이스를 구현하는 클래스로, 순회 과정 중 집합 객체 내에서 현재 위치를 기억한다.
-   **Aggregate**: Iterator 객체를 생성하는 인터페이스를 정의한다. (Aggreate는 '집합'이라는 뜻을 가지고 있음)
-   **ConcreteAggregate**: 해당하는 ConcreteIterator의 인스턴스를 반환하는 Iterator 생성 인터페이스를 구현한다.

## 결과

1.  집합 객체의 다양한 순회 방법을 제공한다.
    -   구조가 복잡한 집합 객체는 다양한 방법으로 순회할 수 있다. 즉, 새로운 순회 방법을 Iterator 서브클래스로 정의하여 기존 순회 방법을 다른 순회 알고리즘 인스턴스로 완전히 교체하는 것이다.
2.  Iterator는 Aggregate 클래스의 인터페이스를 단순화한다.
    -   Iterator의 순회 인터페이스는 Aggregate 클래스에 정의한 자신과 비슷한 인터페이스들을 없애서 Aggregate 인터페이스를 단순화 할 수 있다.
3.  집합 객체에 따라 하나 이상의 순회 방법이 제공될 수 있다.
    -   각 Iterator마다 자신의 순회 상태가 있으므로 하나의 집합 객체를 여러 번 순회시킬 수 있다.

## 관련 패턴

-   반복자 패턴은 복합체(컴포지트, composite) 패턴과 같이 재귀적 구조가 있을 때 자주 사용한다.
-   다양한 반복자를 사용해서 적당한 Iterator 서브클래스를 얻으려면 팩토리 메서드 패턴을 사용할 수 있다.
-   메멘토 패턴도 반복자 패턴과 함께 자주 사용하는데, 이때 반복자 자신이 반복한 결과를 저장하기 위해서 메멘토를 사용한다.

## 예제 코드

> 전체 코드 : [https://github.com/june0122/DesignPatternKotlin/tree/master/src/behavioral/iterator](https://github.com/june0122/DesignPatternKotlin/tree/master/src/behavioral/iterator)

보병(InfantryUnit)으로 구성된 분대(Squad)가 있다.

```kotlin
// 보병 유닛
interface InfantryUnit

// 분대
class Squad(val infantryUnits: MutableList<InfantryUnit> = mutableListOf()) {
}
```

각 분대는 지휘관이 필요하다. 각 분대의 지휘관으로 보병 유닛인 병장(Sergeant)을 추가한다.

어디까지나 예제이므로 병장이 이름도 없이 즉시 생성되는 점은 가볍게 넘어가자.

```kotlin
// 병장
class Sergeant: InfantryUnit

class Squad(val infantryUnits: MutableList<InfantryUnit> = mutableListOf()) {
    val commander = Sergeant()
}
```

소대(Platoon)는 분대의 집합이며 중위(Lieutenant)가 지휘관이다.

```kotlin
// 중위
class Lieutenant: InfantryUnit

// 소대
class Platoon(val squads: MutableList<Squad> = mutableListOf()) {
    val commander = Lieutenant()
}
```

이제 소대가 어떠한 유닛들로 구성되어 있는지 알 수 있도록 기능을 추가해보자. 소대 구성원들을 계급 순으로 출력할 수 있도록 할 것이다.

```kotlin
val rangers = Squad(josh, ewan, tom)
val deltaForce = Squad(sam, eric, william)
val blackHawk = Platoon(rangers, deltaForce)

for (u in blackHawk) {
    println(u)
}

// Lieutenant, Sergeant, Josh, Ewan, Tom, ...
```

그런데 위와 같은 코드를 작성하면 For-loop range must have an 'iterator()' method라는 에러 문구를 IDE가 띄워준다.

![](https://user-images.githubusercontent.com/39554623/150164172-5f3ab9d1-ab18-439f-9d1f-3492fa5c35f5.png)

단순히 원시 타입으로 이루어진 배열 `Array<Int>`와 같은 데이터 구조는 간단하게 순회할 수 있지만 예시의 Platoon과 같이 좀 더 복잡한 데이터 구조의 경우에는 어떻게 처리 해야할까?

위에서 작성한 Platoon 클래스는 `iterator()` 메서드가 필요로 하다. 특별한 메서드이므로 `operator` 키워드를 사용할 것이다.

```kotlin
operator fun iterator() = ...
```

해당 메서드가 반환하는 것은 `Iterator<T>`를 구현하는 익명 객체다.

```kotlin
... = object: Iterator<InfantryUnit> {
    override fun hasNext(): Boolean {
        // 반복할 개체가 더 있는가?
    }

    override fun next(): InfantryUnit {
        // 다음 InfantryUnit 반환
    }
}
```

반복자 패턴의 아이디어는 객체가 데이터를 저장하는 방법과 이 데이터를 순회하는 방법을 분리하는 것이다.

예제 코드에서의 데이터는 트리 같은 것인데, 트리는 DFS, BFS 두 가지 방법으로 순회할 수 있다. 하지만 모든 요소들을 순회할 때 정말로 위와 같은 방법을 생각해야 할까? 예제에서는 저장과 순회, 이 두 가지 관심사를 분리할 것이다. 모든 요소를 순회하려면 두 개의 메서드를 구현해야 한다. 하나는 다음 요소를 가져오는 것이고, 다른 하나는 루프가 멈출 때를 알려주는 것이다.

Sqaud 클래스에 이 객체를 구현해보자. Platoon도 로직은 비슷하지만 좀 더 수학적인 연산을 필요로 한다.

먼저 반복자(iterator)를 위한 상태가 필요하다. 이는 마지막 요소가 반환되었음을 기억해준다.

```kotlin
operator fun iterator() = object : Iterator<InfantryUnit> {
    var i = 0
    // 추가 코드 작성
}
```

다음으로 멈출 시점을 알려줘야 한다. 본문의 예제에서는 분대의 모든 유닛의 수와 지휘관인 병장을 합친 수와 같다.

```kotlin
override fun hasNext(): Boolean {
    return i < infantryUnits.size + 1 // sergeant가 있으므로 +1
}
```

마지막으로 반환할 유닛을 알아야 한다. 만약 첫 번째 호출이라면 지휘관인 병장(sergeant)를 반환할 것이고, 그 다음부턴 분대의 멤버들을 반환할 것이다.

```kotlin
override fun next(): InfantryUnit =
    when (i) {
        0 -> commander
        else -> infantryUnits[i - 1]
    }.also { i++ } // 다음 유닛을 반환하는 동시에 카운터를 증가시킨다. 이를 위해 also {}를 사용한다.
```

이것은 이 패턴의 용도 중 하나일 뿐이다.

동일한 객체에 둘 이상의 반복자가 있을 수도 있다. 예를 들어, 요소를 역순으로 검토하는 분대의 두 번째 반복자를 가질 수 있다.

```kotlin
// 반복자를 반환하는 단순한 메서드이기 때문에 operator 키워드를 붙이지 않는다.
fun reverseIterator() = object : Iterator<InfantryUnit> {
    var i = 0

    override fun hasNext(): Boolean {
        return i < infantryUnits.size + 1 // sergeant가 있으므로 +1
    }

    // next() 메서드만 변경해주면 된다.
    override fun next(): InfantryUnit =
        when (i) {
            infantryUnits.size -> commander
            else -> infantryUnits[infantryUnits.size - i - 1]
        }.also { i++ }
}
```

```kotlin
for (u in deltaForce.reverseIterator()) {
    println(u)
}
```

함수의 매개변수로 반복자를 받는 것도 유용할 수 있다. 이 함수는 반복자를 제공하는 모든 것을 반복한다.

```kotlin
fun <T> printAll(iter: Iterator<T>) {
    while (iter.hasNext()) {
        println(iter.next())
    }
}
```

```kotlin
// 이렇게 하면 분대원 전체를 두 번 인쇄하는데, 한 번은 일반으로, 한 번은 역순으로 인쇄한다.
printAll(rangers.iterator())
printAll(rangers.reverseIterator())
```

반복자를 제공하는 Platoon 클래스는 다음과 같이 작성할 수 있다.

```kotlin
class Platoon(val squads: MutableList<Squad> = mutableListOf()) {
    val commander = Lieutenant()

    constructor(vararg squads: Squad) : this(mutableListOf()) {
        for (s in squads) {
            this.squads.add(s)
        }
    }

    operator fun iterator() = object : Iterator<InfantryUnit> {
        var i = 0
        var j = 0
        var count = 0

        override fun hasNext(): Boolean {
            return count < squads.sumOf { it.infantryUnits.size } + squads.size + 1 // squad 내부의 보병수 + (병장 * squad 수) + 중위
        }

        override fun next(): InfantryUnit =
            when (i) {
                0 -> commander
                else -> {
                    when (j) {
                        0 -> squads[i - 1].commander
                        else -> squads[i - 1].infantryUnits[j - 1]
                    }.also { j++ }
                }
            }.also {
                if (i == 0 || j > squads[i - 1].infantryUnits.size) {
                    i++
                    j = 0
                }
                count++
            }
    }
}
```

```kotlin
val eric = Sniper("Eric")
val william = Sniper("William")
...

val rangers = Squad(josh, ewan, tom)
val deltaForce = Squad(sam, eric, william)
val blackHawk = Platoon(rangers, deltaForce)

for (u in blackHawk) {
    println(u)
}
```

```console
Lieutenant
Sergeant
Rifleman: Josh
Rifleman: Ewan
Sniper: Tom
Sergeant
Rifleman: Sam
Sniper: Eric
Sniper: William
```

## References

1.  GoF의 디자인 패턴(개정판). 챕터 5. 340쪽
2.  Hands-on Design Patterns with Kotlin
