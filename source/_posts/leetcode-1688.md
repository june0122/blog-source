---
title: "[LeetCode] 1688. Count of Matches in Tournament"
date: 2021-07-15T19:06:59.124Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
  - Simulation
---

### [](#문제-보기)[문제 보기](https://leetcode.com/problems/count-of-matches-in-tournament/)

## [](#kotlin)Kotlin

<!-- more -->

```kotlin
class Solution {
    fun numberOfMatches(n: Int): Int {
        var remains = n
        var cnt = 0
        
        while (remains > 1) {
            if (remains % 2 == 0) {
                cnt += remains / 2
                remains /= 2
            } else {
                cnt += (remains - 1) / 2
                remains = (remains - 1) / 2 + 1
            }
        }
        
        return cnt
    }
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)[Simulation](/tags/Simulation/)
