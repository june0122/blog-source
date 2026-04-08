---
title: "[LeetCode] 1. Two Sum"
date: 2021-06-13T11:49:45.395Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

## [](#leetcode-1-two-sum)[\[LeetCode\] 1. Two Sum](https://leetcode.com/problems/two-sum/)

### [](#kotlin)Kotlin

<!-- more -->
> ### [](#brute-force)Brute Force


```kotlin
class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        var twoNum = 0 to 0
        
        for (i in nums.indices) {
            for (j in i + 1 until nums.size) {
                if (nums[i] + nums[j] == target) twoNum = i to j
            }
        }
        
        return intArrayOf(twoNum.first, twoNum.second)
    }
}
```


```plaintext
232 ms	36.5 MB
```


```kotlin
class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        for (i in nums.indices) {
            for (j in i + 1 until nums.size) {
                if (nums[i] + nums[j] == target) return intArrayOf(i, j)
            }
        }
        throw IllegalArgumentException("No two sum solution")
    }
}
```


```plaintext
236 ms	36.8 MB	
```


#### [](#시간-복잡도-onsup2sup)시간 복잡도 : O(n2)

#### [](#공간-복잡도-o1)공간 복잡도 : O(1)

> ### [](#two-pass-hash-table)Two-pass Hash Table


```kotlin
class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        val hashmap = HashMap<Int, Int>()
        
        nums.forEachIndexed { index, value ->
            hashmap[value] = index
        }
        
        nums.forEachIndexed { index, value ->
            val complement = target - value
            if (hashmap.containsKey(complement) && hashmap.getValue(complement) != index) {
                return intArrayOf(index, hashmap.getValue(complement))
            }
        }
        throw IllegalArgumentException("No two sum solution")
    }
}
```


```plaintext
204 ms	37.4 MB
```


#### [](#시간-복잡도-on)시간 복잡도 : O(n)

n개의 요소들을 가지고 있는 리스트를 2번 순회하지만, HashMap을 사용하여 look up time을 O(1)으로 줄였기 때문에 결과적으론 O(n)이다.

#### [](#공간-복잡도-on)공간 복잡도 : O(n)

HashMap 사용으로 n개의 요소들을 저장하기 때문에 추가적인 공간이 필요하다.

> ### [](#one-pass-hash-table)One-pass Hash Table


```kotlin
class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        val hashmap = HashMap<Int, Int>()
        
        nums.forEachIndexed { index, value ->
            val complement = target - value
            if (hashmap.containsKey(complement)) {
                return intArrayOf(hashmap.getValue(complement), index)
            }
            hashmap[value] = index
        }
        throw IllegalArgumentException("No two sum solution")
    }
}
```


```plaintext
188 ms	37.9 MB
```


#### [](#시간-복잡도-on-2)시간 복잡도 : O(n)

n개의 원소들을 가진 리스트를 딱 한 번만 순회하고, HashMap에서의 look up time은 오직 O(1)만 소모하므로 시간 복잡도는 O(n)이다.

#### [](#공간-복잡도-on-2)공간 복잡도 : O(n)

Two-pass Hash Table 방법과 마찬가지로 HashMap 사용으로 n개의 요소들을 저장하기 때문에 추가적인 공간이 필요하다.

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
