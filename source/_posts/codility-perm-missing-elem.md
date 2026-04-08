---
title: "[Codility] PermMissingElem"
date: 2021-05-28T01:19:53.536Z
categories:
  - Algorithm
  - Codility
tags:
  - Kotlin
  - Algorithm
  - Codility
---

## [](#lesson-3-time-complexity-permmissingelem)Lesson 3 - Time Complexity : [PermMissingElem](https://app.codility.com/programmers/lessons/3-time_complexity/perm_missing_elem/)

### [](#kotlin)kotlin

<!-- more -->
> 케이스 하나하나 처리해주기


```kotlin
fun solution(A: IntArray): Int {
    A.sort()

    if (A.isEmpty() || A[0] != 1) return 1
    if (A.last() != A.size + 1) return A.size + 1 

    for (i in 0 until A.size - 1) {
        if (A[i] + 1 != A[i + 1]) return A[i] + 1
    }

    return 0
}
```


다소 무식한 방법이라 할 수 있겠다.

> BooleanArray 사용


```kotlin
fun solution(A: IntArray): Int {
    val B = BooleanArray(A.size + 2)

    for (i in A.indices) {
        B[A[i]] = true
    }

    for (j in 1 until B.size) {
        if (B[j].not()) return j
    }

    return 0
}
```


> 등차수열의 합공식 사용


```kotlin
fun solution(A: IntArray): Int {
    val n = (A.size + 1).toLong()
    val sequence = n * (1 + n) / 2L
    val sum = A.sum().toLong()

    return (sequence - sum).toInt()
}
```


![](https://user-images.githubusercontent.com/39554623/119914574-7513cc80-bf9b-11eb-97c0-f16effd609d0.png)

구글 검색을 해보니 등차수열의 합공식을 이용하여 [멋지게 풀이한 코드](https://medium.com/@ydh0256/codility-lesson-3-1-permmissingelem-e7477d1a180d)가 있어서 참고하였다.

배열 A는 **1 ~ N+1** 까지의 범위를 가진 N개의 원소로 이루어져 있고, 1씩 증가하는 등차수열의 형태를 보여준다. 비어있는 원소 하나를 찾는 문제이므로 등차수열의 합과 배열 A 요소들의 합의 차이가 비어있는 원소의 값이다.

주의할 점은 배열 A가 **0 ~ 100,000** 범위의 크기를 가져서 `Int` 타입으로 계산할 경우 overflow가 발생하므로 `Long` 타입으로 변환해줘야 한다.

위의 모든 코드들은 아래의 결과를 보여준다.

![](https://user-images.githubusercontent.com/39554623/119912976-8fe44200-bf97-11eb-9048-188cc80bb251.png)

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Codility](/tags/Codility/)
