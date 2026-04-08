---
title: "[Codility] FrogJmp"
date: 2021-05-28T01:19:59.609Z
categories:
  - Algorithm
  - Codility
tags:
  - Kotlin
  - Algorithm
  - Codility
---

## [](#lesson-3-time-complexity-frogjmp)Lesson 3 - Time Complexity : [FrogJmp](https://app.codility.com/programmers/lessons/3-time_complexity/frog_jmp/)

### [](#kotlin)kotlin

<!-- more -->
> `ceil()` 사용


```kotlin
import kotlin.math.*

fun solution(X: Int, Y: Int, D: Int): Int {
    return ceil((Y - X) / D.toDouble()).toInt()
}
```


> `ceil()` 사용하지 않고 풀기


```kotlin
fun solution(X: Int, Y: Int, D: Int): Int {
    if (X == Y) return 0

    val quotient = (Y - X) / D 
    
    if (X + D * quotient < Y) return quotient + 1
    else return quotient

    return -1
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Codility](/tags/Codility/)
