---
title: "[프로그래머스] 레벨 2 : 행렬 테두리 회전하기"
date: 2021-07-11T12:08:10.465Z
categories:
  - Algorithm
  - Programmers
tags:
  - Kotlin
  - Algorithm
  - Programmers
  - 완전 탐색
---

### [](#문제-보기)[문제 보기](https://programmers.co.kr/learn/courses/30/lessons/77485)

`2021 Dev-Matching: 웹 백엔드 개발자(상반기)`, `완전 탐색`

<!-- more -->
## [](#소스)소스

### [](#kotlin)kotlin

> 연결 리스트 이용


```kotlin
import java.util.LinkedList

class Solution {
    fun solution(rows: Int, columns: Int, queries: Array<IntArray>): IntArray {
        if (queries.size == 1) return intArrayOf(1)
        
        var answer = mutableListOf<Int>()
        val board = Array(rows) { i -> IntArray(columns) { j -> (i * columns) + j + 1 } }

        queries.forEach {
            val list = LinkedList<Pair<Int, Int>>()
            val values = mutableListOf<Int>()
            
            val (row1, col1) = it[0] - 1 to it[1] - 1
            val (row2, col2) = it[2] - 1 to it[3] - 1
            var (tempRow, tempCol) = row1 to col1

            while (tempCol < col2) {
                list.add(tempRow to tempCol)
                values.add(board[tempRow][tempCol])
                tempCol += 1
            }

            while (tempRow < row2) {
                list.add(tempRow to tempCol)
                values.add(board[tempRow][tempCol])
                tempRow += 1
            }

            while (tempCol > col1) {
                list.add(tempRow to tempCol)
                values.add(board[tempRow][tempCol])
                tempCol -= 1
            }

            while (tempRow > row1) {
                list.add(tempRow to tempCol)
                values.add(board[tempRow][tempCol])
                tempRow -= 1
            }

            list.add(list.removeAt(0))

            var cnt = 0
            list.forEach { pos ->
                board[pos.first][pos.second] = values[cnt]
                cnt += 1
            }
            
            answer.add(values.min()!!)
        }

        return answer.toIntArray()
    }
}
```


첫 시도에는 연결 리스트를 이용하는 방법으로 풀이하였지만 코드의 복잡도만 올라가는데다 효율성도 그리 좋지 못하여 아래와 같이 배열만을 이용하는 방법으로 풀이하였다.

> 배열만 이용


```kotlin
import kotlin.math.min

class Solution {
    fun solution(rows: Int, columns: Int, queries: Array<IntArray>): IntArray {
        var answer = intArrayOf()
        val board = Array(rows) { i -> IntArray(columns) { j -> (columns * i) + j + 1 } }
        
        queries.forEach {
            val (r1, c1) = it[0] - 1 to it[1] - 1
            val (r2, c2) = it[2] - 1 to it[3] - 1
            val a1 = IntArray(c2 - c1) { i -> board[r1][c1 + i] }
            val a2 = IntArray(r2 - r1) { i -> board[r1 + i][c2] }
            val a3 = IntArray(c2 - c1) { i -> board[r2][c1 + 1 + i] }
            val a4 = IntArray(r2 - r1) { i -> board[r1 + 1 + i][c1] }
            var min = rows * columns
            
            a1.forEachIndexed { i, v ->
                board[r1][c1 + i + 1] = v
                min = min(min, v)
            }
            a2.forEachIndexed { i, v ->
                board[r1 + i + 1][c2] = v
                min = min(min, v)
            }
            a3.forEachIndexed { i, v ->
                board[r2][c1 + i] = v
                min = min(min, v)
            }
            a4.forEachIndexed { i, v ->
                board[r1 + i][c1] = v
                min = min(min, v)
            }
            answer += min
        }     
        return answer
    }
}
```


#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[Programmers](/tags/Programmers/)[완전 탐색](/tags/%EC%99%84%EC%A0%84-%ED%83%90%EC%83%89/)
