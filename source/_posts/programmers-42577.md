---
title: "[프로그래머스] 레벨 2 : 전화번호 목록"
date: 2021-07-12T06:54:19.456Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
  - 해시
  - Java
---

### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/42577)

`해시`

<!-- more -->
## [](#소스)소스

### [](#java)java

> 정확성 테스트 통과, 효율성 테스트 실패 코드


```java
import java.util.Arrays;
import java.util.Comparator;

class Solution {
    public boolean solution(String[] phone_book) {
        boolean answer = true;
        Arrays.sort(phone_book, Comparator.comparing(String::length));
        
        for (int i = 0; i < phone_book.length; i++) {
            for (int j = i + 1; j < phone_book.length; j++) {
                if (phone_book[i].equals(phone_book[j].substring(0, phone_book[i].length()))) {
                    answer = false;
                    break;
                }
            }
        }
        
        return answer;
    }
}
```


> Hash 사용

**해시**를 사용해야 효율성 통과를 할 수 있다.


```java
import java.util.HashMap;
import java.util.Arrays;
import java.util.Collections;

class Solution {
    public boolean solution(String[] phone_book) {
        Arrays.sort(phone_book, Collections.reverseOrder());
        HashMap<String, Integer> hashMap = new HashMap<>();

        for (String s : phone_book) {
            if (hashMap.get(s) != null) {
                return false;
            }

            for (int i = 0; i < s.length(); i++) {
                hashMap.put(s.substring(0, i), 0);
            }
        }

        return true;
    }
}
```


```java
import java.util.HashMap;

class Solution {
    public boolean solution(String[] phone_book) {
        HashMap<String, Integer> hashMap = new HashMap<>();
        for (String s : phone_book) hashMap.put(s, 0);
        for (String s : phone_book) {
            for (int i = 1; i < s.length(); i++) {
                if (hashMap.containsKey(s.substring(0, i))) return false;
            }
        }

        return true;
    }
}
```


### [](#kotlin)kotlin


```kotlin
fun solution(phone_book: Array<String>): Boolean {
    val hashMap = HashMap<String, Int>()
    phone_book.forEach { hashMap[it] = 0 }
    phone_book.forEach {
        for (i in 1 until it.length) {
            if (hashMap.containsKey(it.substring(0, i))) return false
        }
    }

    return true
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)[해시](/tags/%ED%95%B4%EC%8B%9C/)[Java](/tags/Java/)
