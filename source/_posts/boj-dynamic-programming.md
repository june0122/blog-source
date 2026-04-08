---
title: "[BOJ] 다이나믹 프로그래밍 (Dynamic Programming, DP)"
date: 2021-06-29T16:23:11.214Z
categories:
  - Algorithm
  - BOJ
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - DP
  - 바킹독
---

> 여러 개의 하위 문제를 먼저 푼 후 그 결과를 쌓아올려 주어진 문제를 해결하는 알고리즘

### [](#dp를-푸는-과정)DP를 푸는 과정

<!-- more -->
1.  테이블 정의하기
2.  점화식 찾기
3.  초기값 정하기

## [](#연습-문제)연습 문제

### [](#boj-1463-1로-만들기)[BOJ 1463 : 1로 만들기](https://www.acmicpc.net/problem/1463)

> DP


```kotlin
import java.util.*
import kotlin.math.*

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()
    val d = IntArray(n + 1)

    for (i in 2..n) {
        d[i] = d[i - 1] + 1
        if (i % 2 == 0) d[i] = min(d[i], d[i / 2] + 1)
        if (i % 3 == 0) d[i] = min(d[i], d[i / 3] + 1)
    }

    println(d[n])
}
```


> BFS


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()

    val queue: Queue<Int> = LinkedList()
    val dist = IntArray(n + 1)
    val dx = intArrayOf(1, 2, 3)

    dist[1] = 0
    queue.offer(1)

    while (queue.isNotEmpty()) {
        val cur = queue.poll()

        for (dir in dx.indices) {
            val next = when (dir) {
                0 -> cur + dx[0]
                else -> cur * dx[dir]
            }

            if (next > n) continue
            if (dist[next] != 0) continue

            dist[next] = dist[cur] + 1
            queue.offer(next)
        }
    }
    println(dist[n])
}
```


### [](#boj-9095-1-2-3-더하기)[BOJ 9095 : 1, 2, 3 더하기](https://www.acmicpc.net/problem/9095)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val t = nextInt()
    val d = IntArray(11)

    d[1] = 1
    d[2] = 2
    d[3] = 4

    for (i in 4 until 11) {
        d[i] = d[i - 1] + d[i - 2] + d[i - 3]
    }

    repeat(t) { println(d[nextInt()]) }
} 
```


### [](#boj-2579-계단-오르기)[BOJ 2579 : 계단 오르기](https://www.acmicpc.net/problem/2579)

> 2차원 배열 이용


```kotlin
import java.util.*
import kotlin.math.max

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()
    val s = IntArray(n + 1)
    val d = Array(n + 1) { IntArray(3) }

    for (i in 1..n) s[i] = nextInt()

    if (n == 1) {
        println(s[1])
        return@with
    }

    d[1][1] = s[1]
    d[1][2] = 0
    d[2][1] = s[2]
    d[2][2] = s[1] + s[2]

    for (i in 3..n) {
        d[i][1] = max(d[i - 2][1], d[i - 2][2]) + s[i]
        d[i][2] = d[i - 1][1] + s[i]
    }

    println(max(d[n][1], d[n][2]))
}
```


`D[i][j]` = 현재까지 `j`개의 계단을 연속해서 밟고 `i`번째 계단까지 올라섰을 때 점수 합의 최댓값, 단 `i`번째 계단은 반드시 밟아야 함

이렇게 2차원 배열을 선언한 이유는 지금까지 몇 개의 계단을 밟았는지에 대한 정보가 추가로 있어야 점화식을 세울 때 계단을 오르는 규칙을 고려할 수 있기 때문이다. 그리고 i번째 계단은 반드시 밟아야 한다는 조건이 있어야 점화식을 이끌어낼 수 있다. 이 2차원 배열에서 `j`는 어떤 값을 가지냐 보면 `i`번째 계단을 반드시 밟아야 한다는 조건이 있어서 `j = 1` 혹은 `2`이다. 연속된 세 개의 계단을 모두 밟아서는 안된다는 조건으로 인해 `j`가 `3` 이상일 수는 없다.

> 1차원 배열 이용


```kotlin
import java.util.*
import kotlin.math.max

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()
    val s = IntArray(300)
    val d = IntArray(300)

    for (i in 0 until n) s[i] = nextInt()

    d[0] = s[0]
    d[1] = max(s[0] + s[1], s[1])
    d[2] = max(s[0] + s[2], s[1] + s[2])

    for (i in 3 until n) {
        d[i] = max(d[i - 2] + s[i], d[i - 3] + s[i - 1] + s[i])
    }

    println(d[n - 1])
}
```


### [](#boj-1149-rgb거리)[BOJ 1149 : RGB거리](https://www.acmicpc.net/problem/1149)


```kotlin
import java.util.*
import kotlin.math.min

data class RGB(var red: Int, var green: Int, var blue: Int)

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()
    val colors = Array(n + 1) { RGB(0, 0, 0) }
    val d = Array(n + 1) { IntArray(3) }

    for (i in 0 until n) {
        colors[i].red = nextInt()
        colors[i].green = nextInt()
        colors[i].blue = nextInt()
    }

    d[0][0] = colors[0].red
    d[0][1] = colors[0].green
    d[0][2] = colors[0].blue

    for (i in 1 until n) {
        d[i][0] = min(d[i-1][1], d[i-1][2]) + colors[i].red
        d[i][1] = min(d[i-1][0], d[i-1][2]) + colors[i].green
        d[i][2] = min(d[i-1][0], d[i-1][1]) + colors[i].blue
    }

    println(minOf(d[n - 1][0], d[n - 1][1], d[n - 1][2]))
}
```


### [](#boj-11726-2n-타일링)[BOJ 11726 : 2×n 타일링](https://www.acmicpc.net/problem/11726)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()
    val d = IntArray(n + 3)
    val mod = 10007

    d[1] = 1
    d[2] = 2

    for (i in 3..n) d[i] = (d[i - 1] + d[i - 2]) % mod

    println(d[n])
}
```


### [](#boj-11659-구간-합-구하기-4)[BOJ 11659 : 구간 합 구하기 4](https://www.acmicpc.net/problem/11659)

> Prefix Sum 기법

Prefix Sum은 시작 위치부터 현재 위치까지의 원소 합을 저장하는 배열이다.

부분 합(partial sum) 또는 누적 합(cumulative sum)이라고도 한다.

| Number | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Prefix sum | 1 | 3 | 6 | 10 | 15 |

Prefix sum은 누적 합을 미리 구하는 전처리 과정을 통해 구간 합(range sum)을 빠르게 구할 때 사용된다.

-   prefix sum : `0 ~ b` 까지의 누적합 (반드시 첫번 째 원소를 포함하는 구간)
-   range sum : `a ~ b` 까지의 구간 합

#### [](#시간-복잡도)시간 복잡도

-   전처리 단계
    -   1차원 : O(n)
    -   2차원 : O(n\*m)
-   계산 : O(1)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val (n, m) = nextInt() to nextInt()
    val d = IntArray(n + 1)
    val a = IntArray(n + 1)

    d[0] = 0
    for (i in 1..n) {
        a[i] = nextInt()
        d[i] = d[i - 1] + a[i]
    }

    repeat(m) {
        val (i, j) = nextInt() to nextInt()
        println(d[j] - d[i - 1])
    }
}
```


```plaintext
// O(n^2)
D[i] = A[i] + A[2] + … + A[i]

// O(n)
D[i] = D[i-1] + A[i]

// O(1)
A[i] + A[i+1] + … + A[j]
= (A[1] + A[2] + … + A[j]) - (A[1] + A[2] + … + A[i-1])
= D[j] - D[i-1] 
```


## [](#경로-추적)경로 추적

### [](#boj-12852-1로-만들기-2)[BOJ 12852 : 1로 만들기 2](https://www.acmicpc.net/problem/12852)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val n = nextInt()
    val d = IntArray(n + 1)
    val pre = IntArray(n + 1)

    d[1] = 0

    for (i in 2..n) {
        d[i] = d[i - 1] + 1
        pre[i] = i - 1

        if (i % 2 == 0 && d[i] > d[i / 2] + 1) {
            d[i] = d[i / 2] + 1
            pre[i] = i / 2
        }

        if (i % 3 == 0 && d[i] > d[i / 3] + 1) {
            d[i] = d[i / 3] + 1
            pre[i] = i / 3
        }
    }

    println(d[n])

    var cur = n
    while (true) {
        print("$cur ")
        if (cur == 1) break
        cur = pre[cur]
    }
}
```


-   위 문제를 BFS로 경로 복원 문제 풀이도 가능하다.

## [](#참고)참고

-   바킹독의 실전 알고리즘 - [https://www.youtube.com/watch?v=5leTtB3PQu0](https://www.youtube.com/watch?v=5leTtB3PQu0)
-   Prefix sum - [https://gamedevlog.tistory.com/68](https://gamedevlog.tistory.com/68)

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[BOJ](/tags/BOJ/)[DP](/tags/DP/)[바킹독](/tags/%EB%B0%94%ED%82%B9%EB%8F%85/)
