---
title: "[프로그래머스] 레벨 2 : H-Index"
date: 2021-06-25T04:46:25.569Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
  - 정렬
---

### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/42747)

`정렬`

<!-- more -->
## [](#소스)소스

### [](#kotlin)kotlin

> 나의 풀이


```kotlin
class Solution {
    fun solution(citations: IntArray): Int {
        var h = 0
        var count = 0
        val citedList = mutableListOf<Int>()
        val uncitedList = mutableListOf<Int>()

        citations.sort()

        while (count <= citations.size) {
            citations.forEach {
                if (it >= count) citedList.add(it)
                else uncitedList.add(it)

                if (citedList.size >= count && uncitedList.size <= count) h = count
            }
            count += 1
            citedList.clear()
            uncitedList.clear()
        }
        return h
    }
}
```


> 다른 사람의 풀이


```kotlin
import kotlin.math.min

class Solution {
    fun solution(citations: IntArray) = citations.sortedDescending().mapIndexed { idx, item -> min(idx + 1, item) }.max()
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)[정렬](/tags/%EC%A0%95%EB%A0%AC/)
