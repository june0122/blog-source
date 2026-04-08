---
title: "[LeetCode] 2. Add Two Numbers"
date: 2021-06-15T04:59:28.587Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

## [](#leetcode-2-add-two-numbers)[\[LeetCode\] 2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)

### [](#kotlin)Kotlin

<!-- more -->
> ### [](#자리올림smallcarrysmall-이용)자리올림(carry) 이용


```kotlin
class Solution {
    fun ListNode.value() = this?.`val` ?: 0
    
    fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {
        var (list1, list2) = l1 to l2
        var head = ListNode(0)
        var cur = head
        var carry = 0
        
        while (list1 != null || list2 != null || carry > 0) {
            val x = list1?.value() ?: 0
            val y = list2?.value() ?: 0
            val sum = (x + y + carry) % 10
            carry = (x + y + carry) / 10
            cur?.next = ListNode(sum)
            cur = cur.next
            if (list1 != null) list1 = list1.next
            if (list2 != null) list2 = list2.next
        }
        return head.next
    }
}
```


```plaintext
Runtime: 240 ms, faster than 18.40% of Kotlin online submissions for Add Two Numbers.
Memory Usage: 43.6 MB, less than 11.74% of Kotlin online submissions for Add Two Numbers.
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
