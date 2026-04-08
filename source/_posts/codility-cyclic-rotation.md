---
title: "[Codility] CyclicRotation"
date: 2021-05-21T07:03:11.744Z
categories:
  - Algorithm
  - Codility
tags:
  - Kotlin
  - Algorithm
  - Codility
---

## [](#lesson-2-arrays-cyclicrotation)Lesson 2 - Arrays : [CyclicRotation](https://app.codility.com/programmers/lessons/2-arrays/cyclic_rotation/)

## [](#소스)소스

<!-- more -->
### [](#kotlin)kotlin

> 배열 인덱스 활용


```kotlin
fun solution(A: IntArray, K: Int): IntArray {
    val rotatedArray = IntArray(A.size)

    for (i in A.indices) {
        val index = (i + K) % A.size
        rotatedArray[index] = A[i]
    }

    return rotatedArray
}
```


> Dequeue 덱 활용


```kotlin
import java.util.*

fun solution(A: IntArray, K: Int): IntArray {
    val dequeue = ArrayDeque<Int>()
    val rotation = when(A.size) {
        0 -> 0
        else -> K % A.size
    }

    dequeue.addAll(A.toList())
    repeat(rotation) { dequeue.addFirst(dequeue.removeLast()) }

    return dequeue.toIntArray()
}
```


IntArray A의 크기가 0인 경우 `java.lang.ArithmeticException: / by zero`이 발생하므로 A가 0인 경우 회전하지 않도록 값을 0으로 설정해줘야 한다.

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Codility](/tags/Codility/)
