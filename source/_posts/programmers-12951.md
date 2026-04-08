---
title: "[프로그래머스] 레벨 2 : JadenCase 문자열 만들기"
date: 2021-07-15T20:40:24.909Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
---

### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/12951)

## [](#소스)소스

<!-- more -->
### [](#kotlin)kotlin

> 나의 풀이


```kotlin
class Solution {
    fun solution(s: String): String {
        val words = s.toLowerCase().toCharArray()

        words[0] = words[0].toUpperCase()

        for (i in 1 until words.size) {
            if (words[i].isLowerCase() && words[i - 1] == &#x27; &#x27;) {
                words[i] = words[i].toUpperCase()
            }
        }

        return String(words)  // words.joinToString("") 사용 가능
    }
}
```


> `capitalize()`


```kotlin
class Solution {
     fun solution(s: String): String {
          return s.toLowerCase().split(" ").map {
                it.capitalize()
            }.joinToString(" ")
    }
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)
