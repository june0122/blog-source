---
title: "[LeetCode] 225. Implement Stack using Queues"
date: 2021-06-12T00:33:36.306Z
categories:
  - Algorithm
  - LeetCode
tags:
  - Kotlin
  - Algorithm
  - LeetCode
---

## [](#leetcode-225-implement-stack-using-queues)[\[LeetCode\] 225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)

### [](#kotlin)Kotlin

<!-- more -->
> Queue 1개 사용


```kotlin
class MyStack() {

    /** Initialize your data structure here. */
    val q1: Queue<Int> = LinkedList<Int>()

    /** Push element x onto stack. */
    fun push(x: Int) {
        val size = q1.size
        q1.offer(x)
        for (i in 0 until size) {
            q1.offer(q1.poll())
        }
    }

    /** Removes the element on top of the stack and returns that element. */
    fun pop(): Int {
        return q1.poll()
    }

    /** Get the top element. */
    fun top(): Int {
        return q1.peek()
    }

    /** Returns whether the stack is empty. */
    fun empty(): Boolean {
        return q1.isEmpty()
    }

}
```


> Queue 2개 사용


```kotlin
class MyStack() {

    /** Initialize your data structure here. */
    val q1: Queue<Int> = LinkedList<Int>()
    val q2: Queue<Int> = LinkedList<Int>()

    /** Push element x onto stack. */
    fun push(x: Int) {
        q1.add(x);
        while (!q2.isEmpty())
            q1.add(q2.poll());
        while (!q1.isEmpty())
            q2.add(q1.poll());
    }

    /** Removes the element on top of the stack and returns that element. */
    fun pop(): Int {
        return q2.poll()
    }

    /** Get the top element. */
    fun top(): Int {
        return q2.peek()
    }

    /** Returns whether the stack is empty. */
    fun empty(): Boolean {
        return q1.isEmpty() && q2.isEmpty()
    }

}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[LeetCode](/tags/LeetCode/)
