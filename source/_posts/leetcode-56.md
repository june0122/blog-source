---
title: "[LeetCode] 56. Merge Intervals"
date: 2021-07-15T07:41:39.958Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

### [](#문제-보기)[문제 보기](https://leetcode.com/problems/merge-intervals/)

## [](#kotlin)Kotlin

<!-- more -->

```kotlin
import kotlin.math.max

class Solution {
    fun merge(intervals: Array<IntArray>): Array<IntArray> {
        intervals.sortWith(compareBy { it[0] })
        val merged = mutableListOf<IntArray>()
        
        for (interval in intervals) {
            if (merged.isEmpty() || merged.last()[1] < interval[0]) {
                merged.add(interval)
            } else {
                merged.last()[1] = max(merged.last()[1], interval[1])
            }
        }
        
        return merged.toTypedArray()
    }
}
```


#### [](#복잡도-분석)복잡도 분석

-   시간 복잡도 : _O(nlogn)_
    -   정렬로 인한 시간복잡도
    -   `java.util.Collections.sort()`의 [API 문서](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#sort\(java.util.List\))에 정렬 알고리즘으로 개선된 합병정렬(a modified mergesort)을 사용하고 시간 복잡도는 _O(nlogn)_으로 명시되어 있다.
-   공간 복잡도 : _O(n)_

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
