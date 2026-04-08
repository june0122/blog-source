---
title: "[프로그래머스] 레벨 2 : 카펫"
date: 2021-06-26T11:28:54.482Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
  - 완전탐색
---

### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/42842)

`완전탐색`

<!-- more -->
## [](#소스)소스

### [](#kotlin)kotlin

> 첫 시도


```kotlin
class Solution {
    fun solution(brown: Int, yellow: Int): IntArray {
        val total = brown + yellow
        
        for (i in 3 .. (total / 2)) {
            for (j in 3 .. (total / 2)) {
                if (i >= j && i * j == total && checkBrown(i to j, brown)) return intArrayOf(i, j)
            }
        }
        
        return intArrayOf()
    }
    
    fun checkBrown(pair: Pair<Int, Int>, brown: Int) = (pair.first * 2) + (pair.second * 2) - 4 == brown
}
```


`(가로 * 2) + (세로 * 2) - 4 = brown`

테두리의 갈색 격자의 개수는 가로와 세로를 각각 2를 곱해주고 모서리 부분에서 중복되는 4만큼을 빼서 구할 수 있는 것을 이용하였다.

이렇게 하면 간단하게 구현할 수 있지만 시간 복잡도적인 측면에서 효율적이진 못한 코드라 개선이 필요해보인다.


```kotlin
테스트 1 〉	통과 (0.71ms, 54.8MB)
테스트 2 〉	통과 (1.04ms, 55.1MB)
테스트 3 〉	통과 (229.05ms, 54.4MB)
테스트 4 〉	통과 (30.27ms, 55.2MB)
테스트 5 〉	통과 (28.67ms, 54.5MB)
테스트 6 〉	통과 (152.95ms, 54.7MB)
테스트 7 〉	통과 (688.13ms, 54.2MB)
테스트 8 〉	통과 (239.40ms, 54.4MB)
테스트 9 〉	통과 (379.53ms, 55MB)
테스트 10 〉	통과 (400.44ms, 55.5MB)
테스트 11 〉	통과 (0.65ms, 55.4MB)
테스트 12 〉	통과 (0.66ms, 55.8MB)
테스트 13 〉	통과 (1.30ms, 55MB)
```


> 근의 공식 활용


```kotlin
import kotlin.math.*

class Solution {
    fun solution(brown: Int, yellow: Int): IntArray {
        val D = ((brown + 4) / 2).toDouble().pow(2.0) - 4 * (brown + yellow)
        val width = ((brown + 4) / 2 + sqrt(D)) / 2
        val height = ((brown + 4) / 2 - sqrt(D)) / 2

        return intArrayOf(width.toInt(), height.toInt())
    }
}
```


1.  먼저 문제의 지문에서 아래 두 개의 식을 구할 수 있다.

![](https://user-images.githubusercontent.com/39554623/123511666-9a404b80-d6bd-11eb-99c8-20393430d471.png)

2.  그 다음 계산의 편의성을 위해 아래와 같이 `A`와 `B`로 치환시킨다.

![](https://user-images.githubusercontent.com/39554623/123511670-a0cec300-d6bd-11eb-8ba7-03f931e5403b.png)

3.  치환한 값을 대입시키면 아래와 같은 이차 방정식을 구할 수 있다.

![](https://user-images.githubusercontent.com/39554623/123511672-a75d3a80-d6bd-11eb-9968-1bd1a87322b9.png)

4.  근의 공식을 이용하면 가로와 세로의 크기를 구할 수 있다. 근의 공식은 다음과 같다.

![](https://user-images.githubusercontent.com/39554623/123511675-ad531b80-d6bd-11eb-835d-335a687c8714.png)

5.  가로가 세로보다 크거나 같으므로 가로인 `w`에 sqrt(D)를 더하고 세로인 `h`에서는 빼면 값을 구할 수 있다.

![](https://user-images.githubusercontent.com/39554623/123511680-b348fc80-d6bd-11eb-9c14-4cc2bb606850.png)


```kotlin
테스트 1 〉	통과 (0.05ms, 55.3MB)
테스트 2 〉	통과 (0.04ms, 55.4MB)
테스트 3 〉	통과 (0.04ms, 54.6MB)
테스트 4 〉	통과 (0.05ms, 55MB)
테스트 5 〉	통과 (0.05ms, 55.1MB)
테스트 6 〉	통과 (0.07ms, 54.9MB)
테스트 7 〉	통과 (0.06ms, 54.6MB)
테스트 8 〉	통과 (0.04ms, 54.8MB)
테스트 9 〉	통과 (0.06ms, 54.6MB)
테스트 10 〉	통과 (0.05ms, 55.3MB)
테스트 11 〉	통과 (0.04ms, 54.7MB)
테스트 12 〉	통과 (0.05ms, 55MB)
테스트 13 〉	통과 (0.04ms, 54.5MB)
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)[완전탐색](/tags/%EC%99%84%EC%A0%84%ED%83%90%EC%83%89/)
