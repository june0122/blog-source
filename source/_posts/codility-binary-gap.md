---
title: "[Codility] BinaryGap"
date: 2021-05-19T00:41:13.157Z
categories:
  - Algorithm
  - Codility
tags:
  - Kotlin
  - Algorithm
  - Codility
---

## [](#lesson-1-iterations-binarygap)Lesson 1 - Iterations : [BinaryGap](https://app.codility.com/programmers/lessons/1-iterations/binary_gap/)

### [](#kotlin)kotlin

<!-- more -->
> 이진수 변환 직접 구현


```kotlin
import kotlin.math.max

fun solution(N: Int): Int {
    var answer = 0
    var temp = ""
    var quotient = N
    var remainder: Int

    while (quotient >= 1) {
        remainder = quotient % 2
        quotient /= 2
        temp += remainder.toString()
    }

    val binary = temp.reversed()
    val oneIndexList = mutableListOf<Int>()

    binary.forEachIndexed { index, c ->
        if (c == &#x27;1&#x27;) {
            oneIndexList.add(index)
        }
    }
    
    var gap: Int

    for (i in 0 until oneIndexList.size - 1) {
        gap = oneIndexList[i+1] - oneIndexList[i] - 1
        answer = max(gap, answer)
    }

    return answer
}
```


1.  이진수 변환을 직접 구현
2.  이진수 문자열에서 `1`이 위치한 인덱스들을 값으로 가지는 리스트 생성
3.  `1`이 위치한 인접한 인덱스끼리 빼고, 추가적으로 1을 더 빼면 gap의 크기가 나옴

> `Int.toString(radix: Int)` 사용하여 이진수 변환


```kotlin
fun solution(N: Int): Int {
    val binary = N.toString(2)

    val zeroList = binary.split("1").toMutableList()

    if (binary.last() != &#x27;1&#x27;) {
        zeroList.removeAt(zeroList.size - 1)
    }

    return zeroList.map { it.length }.max() ?: 0
}
```


1.  `Int.toString(radix: Int)` 사용하여 이진수 변환을 매우 간단하게 할 수 있다.
2.  `1`을 구분자 delimniter로 이진수 문자열을 **split** 하여 연결된 `0`들을 값으로 가진 리스트를 생성
3.  만약 이진수의 끝자리가 `1`이 아닐 경우엔 마지막 연결된 `0`들은 gap으로 인정되지 않으므로 리스트에서 삭제한다.
4.  `Iterable<T>.map(transform: (T) -> R)`을 통해 리스트 원소의 길이를 기준으로 리스트를 생성한 후 가장 큰 값을 `max()`를 이용해 리턴한다.

대부분의 코딩 사이트는 **kotlin 1.4**를 지원하지 않는데 1.4 기준으로는 아래처럼 사용해야하거나 사용할 수 있다.

-   `removeAt(zeroList.size - 1)` -> `zeroList.removeLast()`
-   `max()` -> `maxOrNull()`

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Codility](/tags/Codility/)
