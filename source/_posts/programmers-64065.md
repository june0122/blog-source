---
title: "[프로그래머스] 레벨 2 : 튜플"
date: 2021-06-25T04:39:51.406Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
  - 정렬
---


{% raw %}
### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/64065)

<!-- more -->
## [](#소스)소스

### [](#kotlin)kotlin

> 나의 풀이


```kotlin
class Solution {
    fun solution(s: String): IntArray {
        val set = mutableSetOf<Int>()
        val elements = s.replace("{{", "").replace("}}", "").split("},{")
        val arr = elements.map { it.split(",") }.sortedBy { it.size }

        arr.forEach {
            it.forEach { 
                set.add(it.toInt())
            }
        }

        return set.toIntArray()
    }
}
```


> `fold(…)` 사용


```kotlin
class Solution {
    fun solution(s: String): IntArray {
        return s.split("},{")
            .map { it.replace("[^0-9,]".toRegex(), "").split(",").map { it.toInt() } }
            .sortedBy { it.size }
            .fold(setOf<Int>()) { acc, list -> acc.union(list) }
            .toIntArray()
    }
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)[정렬](/tags/%EC%A0%95%EB%A0%AC/)
{% endraw %}

