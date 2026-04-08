---
title: "[LeetCode] 495. Teemo Attacking"
date: 2021-07-15T05:35:23.300Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

### [](#문제-보기)[문제 보기](https://leetcode.com/problems/teemo-attacking/)

## [](#kotlin)Kotlin

<!-- more -->
> 시간 초과 코드


```kotlin
class Solution {
    fun findPoisonedDuration(timeSeries: IntArray, duration: Int): Int {
        val poisonedTimes = mutableSetOf<Int>()
        
        timeSeries.forEach { t ->
            for (i in t until t + duration) {
                poisonedTimes.add(i)
            }
        }
        
        return poisonedTimes.size
    }
}
```


easy 난이도의 문제였기에 간단히 set을 이용하여 중복을 제거하는 식으로 문제를 해결하려 하였으나 시간 초과가 발생하였다. 제약 사항을 보니 아래와 같았다. 입력값의 범위를 보고 문제 접근 방법을 고려할 수 있어야 하는데 연습이 많이 부족하다.

제약 사항

-   1 <= timeSeries.length <= 104
-   0 <= timeSeries\[i\], duration <= 107
-   timeSeries is sorted in **non-decreasing** order.

> 해답


```kotlin
import kotlin.math.min

class Solution {
    fun findPoisonedDuration(timeSeries: IntArray, duration: Int): Int {
        val n = timeSeries.size
        if (n == 0) return 0
        
        var total = 0
        for (i in 0 until n - 1) {
            total += min(timeSeries[i + 1] - timeSeries[i], duration)
        }
        
        return total + duration
    }
}
```


일반적으로 이러한 유형의 문제들은 [입력 값이 정렬되어 있을 경우](https://leetcode.com/problems/insert-interval/) _O(N)_, [그렇지 않을 경우](https://leetcode.com/problems/merge-intervals/) _O(nlogn)_의 시간 복잡도를 가진다.

두 개의 공격 사이의 간격과 duration 중 작은 값을 독에 중독된 시간에 더해나가는 식으로 값을 구할 수 있다.

두 개의 공격 사이의 간격이 duration보다 작다는 것은 중첩되는 구간이 있다는 뜻으로 다음 공격 시간과 현재 공격 시간의 차이(`timeSeries[i + 1] - timeSeries[i]`)만큼만 총 중독 시간에 더한다.

duration이 두 공격 사이 간격보다 클 경우는 중첩 구간이 없다는 뜻이므로 duration 값 그대로를 총 중독 시간에 더한다. 마지막 공격은 비교군에서 제외되므로 총 중독 시간에 따로 duration을 한 번만 더해준다.

#### [](#복잡도-분석)복잡도 분석

-   시간 복잡도 : _O(N)_
-   공간 복잡도 : _O(1)_

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
