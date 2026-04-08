---
title: "[디자인 패턴] 추상 팩토리 패턴(Abstract Factory Pattern)"
date: 2021-09-06T12:42:56.254Z
categories:
  - Design-Pattern
  - Creational-Patterns
tags:
  - Design Pattern
  - Creational Patterns
---

추상 팩토리 패턴은 매우 복잡하고 기괴한 패턴으로 오해 받지만 실제로는 매우 간단합니다. 팩토리 메서드 패턴을 이해했다면 금세 이해하게 될 것인데, **추상 팩토리는 팩토리들의 팩토리**이기 때문입니다. 팩토리가 다른 클래스를 생성할 수 있는 함수 또는 클래스이고, 추상 팩토리는 팩토리를 생성하는 클래스입니다.

위의 설명을 이해하였더라도 여전히 추상 팩토리 패턴의 사용법이 무엇인지 궁금해 할 것입니다. 실제로 추상 팩토리의 주요 용도는 프레임워크, 특히 스프링 프레임워크가 될 것입니다. 이 프레임워크는 추상 팩토리 개념을 사용하여 어노테이션과 XML 파일에서 컴포넌트를 생성합니다. 그러나 프레임워크를 직접 만드는 것은 꽤 지루할 수 있으므로 이 패턴이 매우 유용한 또 다른 예시인 전략 게임을 살펴보겠습니다.

<!-- more -->
## [](#추상-팩토리-예시)추상 팩토리 예시

예시로 들 전략 게임은 건물과 유닛으로 구성됩니다. 모든 건물이 공유하는 것을 선언하는 것으로 시작합시다.


```kotlin
interface Building<in UnitType, out ProducedUnit> 
        where UnitType : Enum<*>, ProducedUnit : Unit {
    fun build(type: UnitType) : ProducedUnit
}
```


모든 건물은 `build()` 함수를 구현해야 합니다. 여기서 코틀린의 제네릭이 사용되는데 이에 대해 조금 논의해 보겠습니다.

### [](#코틀린의-제네릭-소개)코틀린의 제네릭 소개

제네릭은 타입 간의 관계를 지정하는 방법입니다. 또는 타입의 추상화라고도 할 수 있습니다. 이 설명들이 제네릭을 이해하는데 도움이 되지 않았다면 다음 예시를 살펴보겠습니다.


```kotlin
val listOfStrings = mutableListOf("a", "b", "c")
```


이 코드는 단순히 문자열 리스트를 생성합니다. 그러나 실제로 무엇을 의미할까요? 다음 코드를 봅시다.


```kotlin
listOfStrings.add(1)
```


이 코드는 컴파일되지 않습니다. `mutableListOf()` 함수는 제네릭을 사용하기 때문입니다.


```kotlin
public fun <T> mutableListOf(vararg elements: T): MutableList<T>
```


리스트를 생성하는데 어떤 타입을 사용하든, 해당 타입만 넣을 수 있습니다. 한편으로는 데이터 구조나 알고리즘을 일반화할 수 있기 때문에 훌륭한 언어 기능입니다. 보유하고 있는 타입에 관계없이 여전히 동일한 방식으로 작동합니다.

반면에 우리는 여전히 타입 안정성을 가지고 있습니다. 앞의 코드에서 `listOfStrings.first()` 함수는 문자열만 반환하도록 보장됩니다.

제네릭에 관해선, 코틀린은 자바와 유사하지만 약간 다른 접근 방식을 사용합니다.

다른 예시를 봅시다.

`Box`라는 클래스를 생성합니다.


```kotlin
class Box<T> { 
    private var inside: T? = null 
 
    fun put(t: T) { 
        inside = t 
    }    
    fun get(): T? = inside 
}
```


이 박스의 좋은 점은 제네릭을 사용하여 고양이와 같이 무엇이든 넣을 수 있다는 것입니다.

박스의 인스턴스를 만들 때 담을 수 있는 항목을 지정합니다.


```kotlin
val box = Box<Cat>()
```


컴파일 타임에 제네릭은 올바른 타입의 객체만을 보유하고 있는지 확인합니다.


```kotlin
box.put(Cat()) // This will work 
val cat = box.get() // This will always return a Cat, because that&#x27;s what our box holds 
box.put("Cat") // This won&#x27;t work, String is not a Cat
```


알다시피 자바는 와일드카드 `<? extends T>`와 `<? super T>`를 사용하여 읽기 전용 및 쓰기 전용 타입을 지정합니다.

코틀린은 `in`, `out`, `where`의 개념을 사용합니다.

`in`으로 표시된 타입은 매개변수로 사용할 수 있지만 반환 값으로 사용할 수 없습니다. 이것을 공변성(covariance)이라고도 합니다. 사실, 이는 `ProducedUnit` 또는 이로부터 상속된 항목을 반환할 수 있지만 계층 구조에서 `ProducedUnit` 위에 있는 항목은 반환할 수 없음을 의미합니다.

`out`으로 표시된 타입은 매개변수가 아닌 반환 값으로만 사용할 수 있습니다. 이것은 반공변성(contravariance)이라고 합니다.

또한 `where` 키워드를 사용하여 타입에 제약을 도입할 수 있습니다. 이 경우 첫 번째 타입은 `Type` 인터페이스를 구현하고 두 번째 타입은 `Unit` 인터페이스를 구현해야 합니다.

타입 자체의 이름인 `UnitType`과 `ProducedUnit`은 `T`와 `P` 같이 원하는 모든 것이 될 수 있습니다. 하지만 명확성을 위해 더 자세한 이름을 사용하겠습니다.

### [](#다시-예시로-돌아와서)다시 예시로 돌아와서

HQ는 다른 건물을 생산할 수 있는 특수 건물입니다. 이것은 지금까지 지어진 모든 건물을 추적합니다. 같은 타입의 건물을 두 번 이상 지을 수 있습니다.


```kotlin
class HQ {
    val buildings = mutableListOf<Building<*, Unit>>()

    fun buildBarracks(): Barracks {
        val b = Barracks()
        buildings.add(b)
        return b
    }

    fun buildVehicleFactory(): VehicleFactory {
        val vf = VehicleFactory()
        buildings.add(vf)
        return vf
    }
}
```


> 참고 : 제네릭과 관련하여 `*`은 star projection이라고 하며, 이것은 해당 타입에 대해 아무것도 모른다는 것을 의미합니다. 자바의 Raw Type과 유사하지만 type safe합니다.

다른 모든 건물은 유닛을 생산합니다. 유닛은 보병(infantry) 또는 장갑차(armored vehicle)일 수 있습니다.


```kotlin
interface Unit 

interface Vehicle : Unit

interface Infantry : Unit
```


보병은 소총병 또는 로켓병이 될 수 있습니다.


```kotlin
class Rifleman : Infantry

class RocketSoldier : Infantry

enum class InfantryUnits {
    RIFLEMEN,
    ROCKET_SOLDIER
}
```


차량은 탱크 또는 장갑차(armored personnel carriers, APCs)입니다.


```kotlin
class APC : Vehicle

class Tank : Vehicle

enum class VehicleUnits {
    APC,
    TANK
}
```


막사(barracks)는 보병을 생산하는 건물입니다.


```kotlin
class Barracks : Building<InfantryUnits, Infantry> {
    override fun build(type: InfantryUnits): Infantry {
        return when (type) {
            RIFLEMEN -> Rifleman()
            ROCKET_SOLDIER -> RocketSoldier()
        }
    }
}
```


> 참고 : 위의 `when` 블록에는 `else`가 필요하지 않습니다. 위 예시에서 `enum`을 사용하고 코틀린은 `enum`의 `when` 키워드를 철저하게 확인하기 때문입니다.

자동차 공장은 다양한 타입의 장갑차를 생산하는 건물입니다.


```kotlin
class VehicleFactory : Building<VehicleUnits, Vehicle> {
    override fun build(type: VehicleUnits) = when (type) {
        APC -> APC()
        TANK -> Tank()
    }
}
```


이제 다른 유닛을 만들 수 있습니다.


```kotlin
val hq = HQ()
val barracks1 = hq.buildBarracks()
val barracks2 = hq.buildBarracks()
val vehicleFactory1 = hq.buildVehicleFactory()
```


이제 유닛을 생산하는 단계로 넘어갑니다.


```kotlin
val units = listOf(
        barracks1.build(InfantryUnits.RIFLEMEN),
        barracks2.build(InfantryUnits.ROCKET_SOLDIER),
        barracks2.build(InfantryUnits.ROCKET_SOLDIER),
        vehicleFactory1.build(VehicleUnits.TANK),
        vehicleFactory1.build(VehicleUnits.APC),
        vehicleFactory1.build(VehicleUnits.APC)
)
```


우리는 이미 표준 라이브러리에서 `listOf()` 함수를 보았습니다. 그것은 위 예시에서 건물이 생산하는 다른 유닛의 읽기 전용 목록을 생성합니다. 이 리스트를 iterate하고 그것이 실제로 우리가 필요로 하는 유닛인지 확인할 수 있습니다.

### [](#개선하기)개선하기

`VehicleFactory`와 `Barracks` 클래스를 갖는 것이 너무 번거롭다고 주장하는 사람이 있을 수 있습니다.

`buildBarracks()`의 이전 구현 대신 다음의 구현을 사용할 수 잇습니다.


```kotlin
fun buildBarracks(): Building<InfantryUnits, Infantry> {
    val b = object : Building<InfantryUnits, Infantry> {
        override fun build(type: InfantryUnits): Infantry {
            return when (type) {
                InfantryUnits.RIFLEMEN -> Rifleman()
                InfantryUnits.ROCKET_SOLDIER -> RocketSoldier()
            }
        }
    }
    buildings.add(b)
    return b
}
```


우리는 이미 `object` 키워드의 두 가지 다른 사용법을 보았습니다. 한 번은 싱글톤 패턴에서, 다른 한 번은 팩토리 메서드 패턴에서입닌다. 다음은 이를 사용할 수 있는 세 번째 방법으로, 즉석에서 익명 클래스를 만드는 것입니다. 결국 `Barracks`는 `InfantryUnitType`이 주어지면 보병을 생산하는 건물입니다.

논리가 간단하다면 선언을 조금 더 줄일 수 있습니다.


```kotlin
fun buildVehicleFactory(): Building<VehicleUnits, Vehicle> {
    val vf = object : Building<VehicleUnits, Vehicle> {
        override fun build(type: VehicleUnits) = when (type) {
            VehicleUnits.APC -> APC()
            VehicleUnits.TANK -> Tank()
        }
    }
    buildings.add(vf)

    return vf
}
```


본문의 시작 부분에서 추상 팩토리가 여러 관련 팩토리를 결합한다고 말했습니다. 그렇다면 우리의 경우 모든 공장의 공통점은 무엇일까요? 그것들은 모두 건물이며 유닛을 생산한다는 것입니다.

이 원칙을 염두에 두시면 다양한 경우에 적용할 수 있습니다. 전략 게임에 익숙하다면 일반적으로 두 개의 다른 진영이 있습니다. 각각의 다른 구조와 유닛을 가질 수 있으며, 이를 달성하기 위해 필요한 만큼 이 패턴을 반복할 수 있습니다.

이제 고양이와 개라는 두 개의 다른 진영이 있고, 탱크와 로켓병은 이 진영들만의 특수 유닛이라고 가정해 보겠습니다. 대신 개는 중전차와 척탄병을 가지고 있습니다. 이 시스템에서 어떤 변화가 필요할까요?

첫째, `HQ`는 인터페이스가 됩니다.


```kotlin
interface HQ {
    fun buildBarracks(): Building<InfantryUnits, Infantry>
    fun buildVehicleFactory(): Building<VehicleUnits, Vehicle>
}
```


`HQ`였던 것이 이제 `CatHQ`가 됩니다.


```kotlin
class CatHQ : HQ { 
// Remember to add override to your methods
}
```


그리고 `DogHQ`는 동일한 단계를 반복해야 하지만 다른 구성 논리를 사용합니다.

큰 변경 사항을 수용할 수 있는 이러한 기능은 일부 사용 사례에서 추상 팩토리를 매우 강력하게 만드는 것입니다.

## [](#references)References

-   Hands-on Design Patterns with Kotlin

#[Design Pattern](/tags/Design-Pattern/)[Creational Patterns](/tags/Creational-Patterns/)
