---
title: "[LeetCode] 232. Implement Queue using Stacks"
date: 2021-06-12T00:33:36.343Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

## [](#leetcode-232-implement-queue-using-stacks)[\[LeetCode\] 232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)

### [](#kotlin)Kotlin

<!-- more -->

```kotlin
class MyQueue() {

    /** Initialize your data structure here. */
    val input = Stack<Int>()
    val output = Stack<Int>()

    /** Push element x to the back of queue. */
    fun push(x: Int) {
        input.push(x)
    }

    /** Removes the element from in front of queue and returns that element. */
    fun pop(): Int {
        peek()
        return output.pop()
    }

    /** Get the front element. */
    fun peek(): Int {
        if (output.isEmpty()) {
            while(input.isNotEmpty()) {
                output.push(input.pop())
            }
        }
        return output.peek()
    }

    /** Returns whether the queue is empty. */
    fun empty(): Boolean {
        return input.isEmpty() && output.isEmpty()
    }
}
```


```plaintext
Runtime: 168 ms, faster than 26.03% of Kotlin online submissions for Implement Queue using Stacks.
Memory Usage: 35.4 MB, less than 100.00% of Kotlin online submissions for Implement Queue using Stacks.
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
