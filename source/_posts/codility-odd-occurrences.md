---
title: "[Codility] OddOccurrencesInArray"
date: 2021-05-24T06:14:27.966Z
categories:
  - Algorithm
  - Codility
tags:
  - Kotlin
  - Algorithm
  - Codility
---

## [](#lesson-2-arrays-oddoccurrencesinarray)Lesson 2 - Arrays : [OddOccurrencesInArray](https://app.codility.com/programmers/lessons/2-arrays/odd_occurrences_in_array/)

### [](#kotlin)kotlin

<!-- more -->
> 첫 시도


```kotlin
fun solution(A: IntArray): Int {
    return A.groupBy { it }.filter { it.value.size % 2 == 1 }.map { it.key }.first()
}
```


날먹 시도 실패 😩

![](https://user-images.githubusercontent.com/39554623/119300036-07198d80-bc9b-11eb-8fe0-3c9c837ef015.png)

> 두 번째 시도 : HashMap 이용


```kotlin
fun solution(A: IntArray): Int {
    val hashMap = HashMap<Int, Int>()

    A.forEach {
        hashMap[it] = hashMap.getOrDefault(it, 0) + 1
    }

    hashMap.keys.forEach {
        if (hashMap.getValue(it) % 2 == 1) return it
    }

    return -1
}
```


![](https://user-images.githubusercontent.com/39554623/119299593-27951800-bc9a-11eb-92a9-150c587edccc.png)

> 번외 : `step`을 이용한 비교


```kotlin
fun solution(A: IntArray): Int {
    if (A.size == 1) return A[0]

    A.sort()

    for (i in A.indices step 2) {
        if (i + 1 == A.size) return A[i]
        if (A[i] != A[i + 1]) return A[i]
    }

    return -1
}
```


![](https://user-images.githubusercontent.com/39554623/119301003-b5720280-bc9c-11eb-824c-637478b6acfe.png)

> `xor` 연산 이용


```kotlin
fun solution(A: IntArray): Int {
    var result = 0

    A.forEach {
        result = result xor it
    }

    return result
}
```


여러 방법으로 시도해도 효율성 테스트의 마지막 케이스가 실패했기에 검색을 해보니 비트 연산자를 활용하는 방법이 있었다!

`xor` 연산은 숫자가 같으면 0, 숫자가 다르면 1을 반환하기 때문에 중복되지 않은 요소를 찾아내는데 유용하다.

![](https://user-images.githubusercontent.com/39554623/119304589-6cbd4800-bca2-11eb-9764-563b75397646.png)

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Codility](/tags/Codility/)
