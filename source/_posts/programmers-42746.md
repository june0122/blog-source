---
title: "[프로그래머스] 레벨 2 : 가장 큰 수"
date: 2021-07-13T09:59:37.645Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
  - 정렬
---

### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/42746)

`정렬`

<!-- more -->
## [](#소스)소스

### [](#kotlin)kotlin


```kotlin
class Solution {
    fun solution(numbers: IntArray): String {
        var answer = ""
        var tempArray = numbers.map { it.toString() }.toTypedArray()
        
        tempArray.sortWith(Comparator<String> { a, b ->
            when {
                a.length == b.length -> b.compareTo(a)
                else -> (b + a).compareTo(a + b)
            }
        })
        
        if (tempArray[0] == "0") {
            answer = "0"
            return answer
        }
        
        tempArray.forEach {
            answer += it
        }

        return answer
    }
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)[정렬](/tags/%EC%A0%95%EB%A0%AC/)
