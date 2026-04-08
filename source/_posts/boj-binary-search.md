---
title: "[BOJ] 이분 탐색 (Binary Search)"
date: 2021-07-29T06:55:07.463Z
categories:
  - Algorithm
  - BOJ
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - 바킹독
  - Binary Search
---

## [](#설명)설명

**정렬되어 있는 배열**에서 특정 데이터를 찾기 위해 모든 데이터를 순차적으로 확인하는 대신 **탐색 범위를 절반**으로 줄여가며 찾는 탐색 방법

<!-- more -->
-   선형 탐색 : _O(N)_
-   이분 탐색 : _O(logN)_

## [](#구현)구현

### [](#boj-1920-수-찾기)[BOJ 1920, 수 찾기](https://www.acmicpc.net/problem/1920)

-   M개의 수에 대해 **선형 탐색**을 한다면 시간복잡도는 _O(NM)_
-   미리 배열 A를 정렬해둔 다음 **이분 탐색**을 수행하면 시간복잡도는 _O(NlogN + MlogN)_
    -   _NlogN_은 정렬에 필요한 시간복잡도, _MlogN_은 이분탐색에 필요한 시간복잡도

> 이분 탐색 직접 구현


```kotlin
import java.util.Scanner

var n = 0
var m = 0
lateinit var a: IntArray
lateinit var b: IntArray

fun main() {
    init()
    a.sort()
    b.forEach {
        println(binarySearch(it))
    }
}

fun binarySearch(target: Int): Int {
    var st = 0 // start
    var en = n - 1 // end

    while (st <= en) {
        val mid = (st + en) / 2
        when {
            a[mid] < target -> st = mid + 1
            a[mid] > target -> en = mid - 1
            else -> return 1
        }
    }
    return 0
}

fun init() = with(Scanner(System.`in`)) {
    n = nextInt()
    a = IntArray(n)
    for (i in 0 until n) {
        a[i] = nextInt()
    }
    m = nextInt()
    b = IntArray(m)
    for (i in 0 until m) {
        b[i] = nextInt()
    }
}
```


> kotlin.collections의 `binarySearch` 사용

-   JVM을 기반으로 하는 코틀린에서의 컬렉션은 자바에서 제공하는 클래스들을 그대로 사용한다.


```kotlin
b.forEach {
    if (a.binarySearch(it) >= 0) println(1)
    else println(0)
}
```


> `contains` 사용


```kotlin
b.forEach {
    if (a.contains(it)) println(1)
    else println(0)
}
```


BOJ를 기준으로 `binarySearch`를 이용한 풀이는 **2164ms**, `contains`는 **4940ms** 시간이 소요되었다.

kotlin.collections의 `contains` 함수의 내부 구현은 다음과 같다.


```kotlin
public operator fun IntArray.contains(element: Int): Boolean {
    return indexOf(element) >= 0
}

public fun IntArray.indexOf(element: Int): Int {
    for (index in indices) {
        if (element == this[index]) {
            return index
        }
    }
    return -1
}
```


내부적으로 `indexOf` 함수를 사용하여 모든 인덱스를 순회하는 형태로 구현되어 있으며, _O(N)_ 시간복잡도를 가진다.

그에 반해 `binarySearch`의 경우 _O(logN)_의 시간복잡도를 가지므로 더 좋은 성능을 보여준다.

다음 코드는 java.util.Arrays의 `binarySearch` 코드이다.


```java
public static int binarySearch(int[] a, int fromIndex, int toIndex, int key) {
    rangeCheck(a.length, fromIndex, toIndex);
    return binarySearch0(a, fromIndex, toIndex, key);
}
private static int binarySearch0(int[] a, int fromIndex, int toIndex, int key) {
    int low = fromIndex;
    int high = toIndex - 1;
    while(low <= high) {
        int mid = low + high >>> 1;
        int midVal = a[mid];
        if (midVal < key) {
            low = mid + 1;
        } else {
            if (midVal <= key) {
                return mid;
            }
            high = mid - 1;
        }
    }
    return -(low + 1);
}
```


### [](#boj-10816-숫자-카드2)[BOJ 10816, 숫자 카드2](https://www.acmicpc.net/problem/10816)

-   삽입하는 수가 주어질 때, 오름차순 순서가 유지되는 제일 왼쪽 인덱스와 제일 오른쪽의 인덱스의 차이가 해당 배열에서 그 수의 등장 횟수가 되는 성질을 이용
    -   `start` ~ `end`의 범위가 `0` ~ `a.size`인 것에 유의
    -   while의 조건문이 `start <= end`가 아니라 `start < end`

> `Scanner`를 통한 입력 받기 (시간 초과)


```kotlin
import java.util.Scanner

var n = 0
var m = 0
lateinit var a : IntArray
lateinit var b : IntArray

fun main() {
    init()
    a.sort()
    b.forEach {
        print("${upperBound(it) - lowerBound(it)} ")
    }
}

fun lowerBound(target: Int): Int {
    var st = 0
    var en = a.size

    while (st < en) {
        val mid = (st + en) / 2
        if (a[mid] >= target) en = mid
        else st = mid + 1
    }
    return st
}

fun upperBound(target: Int): Int {
    var st = 0
    var en = a.size

    while (st < en) {
        val mid = (st + en) / 2
        if (a[mid] > target) en = mid
        else st = mid + 1
    }
    return st
}

fun init() = with(Scanner(System.`in`)) {
    n = nextInt()
    a = IntArray(n + 1)
    for (i in 0 until n) {
        a[i] = nextInt()
    }
    m = nextInt()
    b = IntArray(m)
    for (i in 0 until m) {
        b[i] = nextInt()
    }
}
```


> `readLine()`을 통한 입력 받기 (통과)

-   가독성이 좋아 Scanner를 통해 입력을 받는 방식을 BOJ에서 자주 사용하지만 다른 입력 방식들에 비해 느리기 때문에 시간 초과가 발생할 경우 `readLine()`을 이용하는 방법 등을 사용한다.


```kotlin
lateinit var a: IntArray

fun main() {
    readLine()
    a = readLine()!!.split(" ").map { it.toInt() }.sorted().toIntArray()
    readLine()
    print(readLine()!!.split(" ").map { it.toInt() }.map { upperBound(it) - lowerBound(it) }.joinToString(" "))
}

fun lowerBound(target: Int): Int {
    var st = 0
    var en = a.size

    while (st < en) {
        val mid = (st + en) / 2
        if (a[mid] >= target) en = mid
        else st = mid + 1
    }
    return st
}

fun upperBound(target: Int): Int {
    var st = 0
    var en = a.size

    while (st < en) {
        val mid = (st + en) / 2
        if (a[mid] > target) en = mid
        else st = mid + 1
    }
    return st
}
```


### [](#주의사항)주의사항

1.  이분 탐색을 하고자 한다면 주어진 배열은 정렬되어 있어야 한다.
2.  무한 루프에 빠지지 않게 mid 값을 정해야 한다.

## [](#연습-문제)연습 문제

### [](#boj-18870-좌표-압축)[BOJ 18870, 좌표 압축](https://www.acmicpc.net/problem/18870)

-   중복을 제외하고 자신보다 작은 수가 몇 개 있는지를 물어보는 문제

> 이분 탐색 - lowerBound 사용


```kotlin
lateinit var list: List<Int>

fun main() {
    init()
    val sb = StringBuilder()
    val sorted = list.distinct().sorted()
    for (i in list.indices) {
        sb.append(lowerBound(sorted, list[i])).append(" ")
    }
}

fun lowerBound(list: List<Int>, target: Int): Int {
    var st = 0
    var en = list.lastIndex

    while (st < en) {
        val mid = (st + en) / 2
        if (list[mid] >= target) en = mid
        else st = mid + 1
    }

    return st
}

fun init() {
    readLine()
    list = readLine()!!.split(" ").map { it.toInt() }
}
```


> HashMap 사용


```kotlin
lateinit var list: List<Int>

fun main() {
    init()
    val sorted = list.sorted()
    val map = HashMap<Int, Int>()
    var idx = 0
    for (i in sorted) {
        if (!map.containsKey(i)) map[i] = idx++
    }

    val sb = StringBuilder()
    for (i in list) {
        sb.append(map[i]).append(" ")
    }
    println(sb)
}

fun init() {
    readLine()
    list = readLine()!!.split(" ").map { it.toInt() }
}
```


![](https://user-images.githubusercontent.com/39554623/127417010-9ed6f9f1-ee89-4e7f-ba94-af8ef79df344.png) ![](https://user-images.githubusercontent.com/39554623/127417011-3364002f-9ba4-44db-88c0-1a901ad623d1.png)

-   문제의 예제인 좌표 \[2, 4, -10, 4, -9\]을 위와 같은 알고리즘으로 압축하면 \[2, 3, 0, 3, 1\]이 되는데 위 그림 처럼 압축된 점들도 같은 동일선 상 안에 놓이게 된다.
-   이렇게 범위가 매우 넓은 좌표의 경우에 좌표를 인덱싱해서 처리 할 경우 손쉽게 처리 할 수 있게 된다.
-   [좌표 압축 알고리즘에 대한 설명](https://codingdog.tistory.com/entry/%EC%A2%8C%ED%91%9C-%EC%95%95%EC%B6%95-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EB%B2%94%EC%9C%84%EA%B0%80-%ED%81%B4-%EB%95%8C-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B3%B5%EA%B0%84%EC%9D%84-%EC%A4%84%EC%9D%BC%EA%B9%8C%EC%9A%94)

### [](#boj-2295-세-수의-합)[BOJ 2295, 세 수의 합](https://www.acmicpc.net/problem/2295)

`a[i] + a[j] + a[k] = a[l]`을 만족하는 `a[l]` 중에서 최댓값을 구하기

1.  _O(N4)_ 풀이 : i, j, k, l에 대한 4중 for문
2.  _O(N3logN)_ 풀이 : i, j, k에 대한 3중 for문을 돌리고, 배열 a 안에 `a[i] + a[j] + a[k]`가 있는지 이분 탐색
3.  _O(N2logN)_ 풀이
    -   미리 a에서 두 원소의 합을 다 묶어놓은 배열 two 생성
    -   `two[m] + a[k] = a[l]`
    -   k, l에 대한 2중 for문을 돌리고 `a[l] - a[k]`가 배열 two 안에 있는지 이분 탐색
    -   two의 길이는 N2인데 log(N2)은 2logN 이어서 _O(N2log(N2))_ = _O(N2 \* 2logN)_ = _O(N2logN)_


```kotlin
import java.util.Scanner

var n = 0
val list = mutableListOf<Int>()
val two = mutableListOf<Int>()

fun main() {
    init()
    
    list.sort()
    for (i in 0 until n) {
        for (j in i until n) {
            two.add(list[i] + list[j])
        }
    }
    two.sort()
    for (i in n - 1 downTo 0) {
        for (j in 0 until i) {
            if (two.binarySearch(list[i] - list[j]) >= 0) {
                println(list[i])
                return
            }
        }
    }
}

fun init() = with(Scanner(System.`in`)) {
    n = nextInt()
    repeat(n) { list.add(nextInt()) }
}
```


**2개의 값을 묶은 후 어느 한쪽의 값을 이분탐색으로 찾아서 시간복잡도를 낮추는 아이디어**는 이분탐색 관련 응용문제에서 핵심적으로 많이 나오므로 여러 문제들을 풀어보며 익숙해질 필요가 있다.

## [](#parametric-search-small매개-변수-탐색small)Parametric Search (매개 변수 탐색)

> 조건을 만족하는 최소∙최대값을 구하는 문제**(최적화 문제)**를 **결정 문제**로 변환해 이분 탐색을 수행하는 방법

parametric search는 꽤 어려운 난이도를 가지고 있다. 애초에 문제가 parametric search인 것을 눈치채기가 어렵고, DP나 그리디 등의 유형과 결합을 해서 나오는 경우도 빈번하다.

### [](#boj-1654-세-수의-합)[BOJ 1654, 세 수의 합](https://www.acmicpc.net/problem/1654)

-   \[최적화 문제\] : N개를 만들 수 있는 랜선의 **최대** 길이
-   \[결정 문제\] : 랜선의 길이가 X일 때 랜선이 **N개 이상인가 아닌가?**

이 문제의 상황은 N개를 만들 수 있는 랜선의 최대 길이를 구하는 최적화 문제이다. 이걸 결정 문제로 바꾸면 반대로 우리가 구해야 하는 답이 인자로 들어가고, 조건의 참/거짓 여부를 판단하는 문제로 만들 수 있다.

![](https://user-images.githubusercontent.com/39554623/127440178-acf4a192-1ba7-4f08-99ab-f005e29decfc.png)

랜선의 길이가 줄어들수록 개수가 많아지므로 간단하게 그래프를 그려보면 랜선의 길이가 x축에 놓이고 개수가 y축에 놓인다. 그리고 그래프는 x가 커질수록 y가 감소하는 형태이다. 그래프에서 답은 표시한 지점으로, 개수가 N개 이상인 지점들 중에서 가장 길이가 긴 곳이다. 이 답을 기점으로 왼쪽은 개수가 N 이상이고 오른쪽은 N 미만이다. 랜선의 길이는 최소 1, 최대 231\-1인데, 우리는 여기서 이분탐색으로 답을 빠르게 찾아낼 수 있다.

![](https://user-images.githubusercontent.com/39554623/127440347-093188d8-a06c-405b-9305-322e8da02d3c.png)

이렇게 st, mid, en을 놓고 범위를 줄여가며 답을 찾는다. 최대 길이를 구해야하는 문제에서 랜선의 길이가 X일 때 조건을 만족하는지 확인하는 문제로 변환해서 풀이를 해낼 수 있다.

이 문제의 경우, 랜선의 길이를 X로 두고나면 조각의 개수를 구하는건 _O(N)_이고 랜선의 길이로 가능한 범위는 231이어서 시간복잡도는 _O(log(231N))_ = _O(31N)_

![](https://user-images.githubusercontent.com/39554623/127440224-353dd38a-022c-44fb-b3c4-00334f5eab30.png)

여기서 주의해야하는건, 지금처럼 이분탐색을 수행할 변수를 가지고 함수를 세웠을 때 그 함수가 감소함수거나 증가함수여야 한다. 만약 위의 그래프처럼 함수가 감소 혹은 증가함수 형태가 아니라 뒤죽박죽이면 이분탐색 자체가 불가능하다. 그래서 parametric search를 할 때에는 최적화 문제를 결정 문제로 바꿀 수 있는지 생각하고 그 결정 문제로 얻어낸 함수가 감소 혹은 증가함수인지를 따져봐야 한다. 문제에서 최소 혹은 최대 얘기가 있고 범위가 무지막지하게 크거나, 시간복잡도에서 값 하나를 로그로 어떻게 잘 떨구면 될 것 같을 때 parametric search 풀이가 가능하지는 않을까 고민을 해볼 필요가 있다.


```kotlin
import java.util.Scanner

var k = 0
var n = 0
lateinit var arr: IntArray

fun main() {
    init()

    var st: Long = 1
    var en = Int.MAX_VALUE.toLong() // 2^31 - 1
    while (st < en) {
        val mid = (st + en + 1) / 2
        if (solve(mid)) st = mid
        else en = mid - 1
    }
    println(st)
}

fun solve(x: Long): Boolean { // 결정 문제
    var cur = 0L
    for (i in 0 until k) cur += arr[i] / x
    return cur >= n
}

fun init() = with(Scanner(System.`in`)) {
    k = nextInt()
    n = nextInt()
    arr = IntArray(k)
    for (i in 0 until k) {
        arr[i] = nextInt()
    }
}
```


`mid = (st + en + 1) / 2`로 둬야 무한 루프에 빠지지 않는다. `mid = (st + en) / 2`로 두면 st와 en이 1 차이날 때 st가 계속 값이 똑같아버릴 수 있다.

## [](#reference)Reference

-   [\[바킹독의 실전 알고리즘\] 0x13강 - BFS](https://youtu.be/3TkaOKHxHnI)
-   [https://jungguji.github.io/2020/12/15/백준-18870번-좌표-압축/](https://jungguji.github.io/2020/12/15/%EB%B0%B1%EC%A4%80-18870%EB%B2%88-%EC%A2%8C%ED%91%9C-%EC%95%95%EC%B6%95/)

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[BOJ](/tags/BOJ/)[바킹독](/tags/%EB%B0%94%ED%82%B9%EB%8F%85/)[Binary Search](/tags/Binary-Search/)
