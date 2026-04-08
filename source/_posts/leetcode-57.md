---
title: "[LeetCode] 57. Insert Interval"
date: 2021-07-15T17:48:33.691Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

### [](#문제-보기)[문제 보기](https://leetcode.com/problems/insert-interval/)

## [](#kotlin)Kotlin

<!-- more -->
> _O(nlogn)_ 시간 복잡도 해결법


```kotlin
import kotlin.math.max

class Solution {
    fun insert(intervals: Array<IntArray>, newInterval: IntArray): Array<IntArray> {
        val new = intervals + newInterval
        new.sortWith(compareBy {it[0]})
        
        val arr = mutableListOf<IntArray>()

        for (interval in new) {
            if (arr.isEmpty() || arr.last()[1] < interval[0]) {
                arr.add(interval)
            } else {
                arr.last()[1] = max(arr.last()[1], interval[1])
            }
        }
        
        return arr.toTypedArray()
    }
}
```


> _O(n)_ 시간 복잡도 해결법


```kotlin
import kotlin.math.*

class Solution {
    fun insert(intervals: Array<IntArray>, newInterval: IntArray): Array<IntArray> {
        val merged = mutableListOf<IntArray>()
        var i = 0
        
        for (interval in intervals) {
            if (interval[1] >= newInterval[0]) break
            merged.add(interval)
            i++
        }
        
        while (i < intervals.size && intervals[i][0] <= newInterval[1]){
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i++
        }   
        
        merged.add(newInterval)
    
        while (i < intervals.size){
            merged.add(intervals[i])
            i++
        }        
        
        return merged.toTypedArray()
    }
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
