---
title: "[BOJ] BFS (Breadth First Search)"
date: 2021-07-01T14:23:18.153Z
categories:
  - Algorithm
  - BOJ
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - 바킹독
  - BFS
---

## [](#설명)설명

> ### [](#다차원-배열에서-각-칸을-방문할-때-너비를-우선으로-방문하는-알고리즘)다차원 배열에서 각 칸을 방문할 때 너비를 우선으로 방문하는 알고리즘

<!-- more -->
1.  시작하는 칸을 큐에 넣고 방문했다는 표시를 남김
2.  큐에서 원소를 꺼내어 그 칸에 상하좌우로 인접한 칸에 대해 `3번`을 진행
3.  해당 칸을 이전에 방문했다면 아무것도 하지 않고, 처음으로 방문했다면 방문했다는 표시를 남기고 해당 칸을 큐에 삽입
4.  큐가 빌 때까지 `2번`을 반복

모든 칸이 큐에 1번씩 들어가므로 시간복잡도는 칸이 N개일 때 O(N)

#### [](#bfs-구현-시-자주하는-실수)BFS 구현 시 자주하는 실수

1.  시작점을 큐에 넣긴하는데 정작 방문했다는 표시를 남기지 않은 채로 진행하는 경우
2.  큐에 넣을 때 해당 칸에 방문했다는 표시를 남기지 않고 큐에서 빼낼 때 남기는 경우
3.  nx, ny가 배열 바깥으로 벗어났는지에 대한 루틴을 아예 빼먹었거나, 아니면 이상하게 구현을 한 상황

## [](#예시-및-응용)예시 및 응용

### [](#예시-flood-fill)예시 : Flood Fill

> [BOJ 1926, 그림](https://www.acmicpc.net/problem/1926)


```kotlin
import java.util.*
import kotlin.math.max

fun main() = with(Scanner(System.`in`)) {
    val (n, m) = Pair(nextInt(), nextInt())
    val (dx, dy) = intArrayOf(1, 0, -1, 0) to intArrayOf(0, 1, 0, -1) // 상하좌우 네 방향을 의미
    val paper = Array(n) { IntArray(m) }
    val visitMap = Array(n) { BooleanArray(m) } // 해당 칸을 방문했는지 여부를 저장
    var max = 0 // 그림의 최댓값
    var num = 0 // 그림의 개수

    for (i in paper.indices) {
        for (j in paper[i].indices) {
            paper[i][j] = nextInt()
        }
    }

    for (i in paper.indices) {
        for (j in paper[i].indices) {
            if (paper[i][j] == 0 || visitMap[i][j]) continue

            val queue: Queue<Pair<Int, Int>> = LinkedList()
            var area = 0

            num += 1
            visitMap[i][j] = true
            queue.offer(i to j)

            while (queue.isNotEmpty()) {
                area += 1

                val cur = queue.poll()

                for (dir in 0 until 4) { // 상하좌우 칸을 탐색
                    val nx = cur.first + dx[dir]
                    val ny = cur.second + dy[dir] // nx, ny에 dir에서 정한 방향의 인접한 칸의 좌표가 들어감

                    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue // 범위 밖일 경우 넘어감
                    if (visitMap[nx][ny]|| paper[nx][ny] != 1) continue // 이미 방문한 칸이거나 색칠된 칸이 아닐 경우

                    visitMap[nx][ny] = true // (nx, ny)를 방문했다고 명시
                    queue.offer(nx to ny)
                }
            }
            max = max(max, area)
        }
    }
    println("$num\n$max")
}
```


### [](#응용-1-거리-측정)응용 1 : 거리 측정

> [BOJ 2178번, 미로 탐색](https://www.acmicpc.net/problem/2178)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val (n, m) = nextInt() to nextInt()
    val (dx, dy) = intArrayOf(1, 0, -1, 0) to intArrayOf(0, 1, 0, -1)
    val maze = Array(n) { IntArray(m) }
    val dist = Array(n) { IntArray(m) { -1 } }

    for (i in 0 until n) { // 각각의 수들은 &#x27;붙어서&#x27; 입력으로 주어진다.
        val line = next()
        for (j in 0 until m) {
            maze[i][j] = line[j] - &#x27;0&#x27;
        }
    }

    val queue: Queue<Pair<Int, Int>> = LinkedList()
    queue.offer(0 to 0)
    dist[0][0] = 0

    while (queue.isNotEmpty()) {
        val (curX, curY) = queue.poll()

        for (dir in 0 until 4) {
            val nx = curX + dx[dir]
            val ny = curY + dy[dir]

            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue
            if (dist[nx][ny] >= 0 || maze[nx][ny] != 1) continue

            dist[nx][ny] = dist[curX][curY] + 1
            queue.offer(nx to ny)
        }
    }

    print(dist[n - 1][m - 1] + 1) // 지나는 칸 수를 출력이므로 + 1
}
```


### [](#응용-2-시작점이-여러-개일-때)응용 2 : 시작점이 여러 개일 때

> [BOJ 7576번, 토마토](https://www.acmicpc.net/problem/7576)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    var date = 0
    val (m, n) = nextInt() to nextInt()
    val (dx, dy) = intArrayOf(1, 0, -1, 0) to intArrayOf(0, 1, 0, -1)
    val box = Array(n) { IntArray(m) }
    val vis = Array(n) { BooleanArray(m) { false } }

    for (i in 0 until n) {
        for (j in 0 until m) {
            box[i][j] = nextInt()
        }
    }

    val queue: Queue<Pair<Int, Int>> = LinkedList()

    for (i in 0 until n) {
        for (j in 0 until m) {
            if (box[i][j] == 1) {
                queue.offer(i to j)
                vis[i][j] = true
            }
        }
    }

    val temp = mutableListOf<Pair<Int, Int>>()

    while (queue.isNotEmpty()) {
        for (rottenNum in 0 until queue.size) {
            val (curX, curY) = queue.poll()

            for (dir in 0 until 4) {
                val (nx, ny) = curX + dx[dir] to curY + dy[dir]

                if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue
                if (box[nx][ny] == 1 || box[nx][ny] == -1 || vis[nx][ny]) continue

                vis[nx][ny] = true
                box[nx][ny] = 1
                temp.add(nx to ny)
            }
        }

        temp.forEach {
            queue.offer(it)
        }

        temp.clear()

        date += 1
    }

    for (i in 0 until n) {
        for (j in 0 until m) {
            if (box[i][j] == 0) date = 0
        }
    }

    print(date - 1)
}
```


```kotlin
import java.util.*
import kotlin.math.max

fun main() = with(Scanner(System.`in`)) {
    var date = 0
    val (m, n) = nextInt() to nextInt()
    val (dx, dy) = intArrayOf(1, 0, -1, 0) to intArrayOf(0, 1, 0, -1)
    val box = Array(n) { IntArray(m) }
    val dist = Array(n) { IntArray(m) } // 익은 토마토가 들어있거나 토마토가 없는 칸은 값이 0
    val queue: Queue<Pair<Int, Int>> = LinkedList()

    for (i in 0 until n) {
        for (j in 0 until m) {
            box[i][j] = nextInt()
            when (box[i][j]) {
                1 -> queue.offer(i to j) // 익은 토마토, 즉 거리가 0인 칸을 큐에 넣음
                0 -> dist[i][j] = -1 // 익지 않은 토마토의 dist값을 -1로 설정
            }
        }
    }

    while (queue.isNotEmpty()) {
        val (curX, curY) = queue.poll()

        for (dir in 0 until 4) {
            val (nx, ny) = curX + dx[dir] to curY + dy[dir]

            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue
            if (dist[nx][ny] >= 0) continue

            dist[nx][ny] = dist[curX][curY] + 1
            queue.offer(nx to ny)
        }
    }

    for (i in 0 until n) {
        for (j in 0 until m) {
            if (dist[i][j] == -1) { // 익지 않은 토마토가 있다면 -1 출력
                print(-1)
                return
            }

            date = max(date, dist[i][j])
        }
    }

    print(date)
}
```


### [](#응용-3-시작점이-두-종류일-때)응용 3 : 시작점이 두 종류일 때

> [BOJ 4179번, 불!](https://www.acmicpc.net/problem/4179)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val (row, col) = nextInt() to nextInt()
    val (dx, dy) = intArrayOf(1, 0, -1, 0) to intArrayOf(0, 1, 0, -1)
    val maze = Array(row) { CharArray(col) }
    val fireDist = Array(row) { IntArray(col) { -1 } } // 불의 전파 시간
    val jihoonDist = Array(row) { IntArray(col) { -1 } } // 지훈이의 이동 시간
    val fireQueue: Queue<Pair<Int, Int>> = LinkedList()
    val jihoonQueue: Queue<Pair<Int, Int>> = LinkedList()

    for (i in 0 until row) {
        val line = next()
        for (j in 0 until col) {
            maze[i][j] = line[j]

            if (maze[i][j] == &#x27;F&#x27;) {
                fireQueue.offer(i to j)
                fireDist[i][j] = 0
            }
            if (maze[i][j] == &#x27;J&#x27;) {
                jihoonQueue.offer(i to j)
                jihoonDist[i][j] = 0
            }
        }
    }

    // 불에 대한 BFS
    while (fireQueue.isNotEmpty()) {
        val (curX, curY) = fireQueue.poll()

        for (dir in 0 until 4) {
            val (nx, ny) = curX + dx[dir] to curY + dy[dir]

            if (nx < 0 || nx >= row || ny < 0 || ny >= col) continue
            if (fireDist[nx][ny] >= 0 || maze[nx][ny] == &#x27;#&#x27;) continue

            fireDist[nx][ny] = fireDist[curX][curY] + 1
            fireQueue.offer(nx to ny)
        }
    }

    // 지훈이에 대한 BFS
    while (jihoonQueue.isNotEmpty()) {
        val (curX, curY) = jihoonQueue.poll()

        for (dir in 0 until 4) {
            val (nx, ny) = curX + dx[dir] to curY + dy[dir]

            // 범위를 벗어난 것은 탈출에 성공했다는 의미. 큐에 거리 순으로 들어가므로 최초에 탈출한 시간을 출력하면 됨.
            if (nx < 0 || nx >= row || ny < 0 || ny >= col) {
                println(jihoonDist[curX][curY] + 1)
                return
            }

            if (jihoonDist[nx][ny] >= 0 || maze[nx][ny] == &#x27;#&#x27;) continue
            if (fireDist[nx][ny] != -1 && fireDist[nx][ny] <= jihoonDist[curX][curY] + 1) continue
            // 불의 전파 시간을 조건에 추가. 지훈이 도착한 시간과 동시에, 혹은 더 빨리 불이 도착하는 자리로는 갈 수 없음.

            jihoonDist[nx][ny] = jihoonDist[curX][curY] + 1
            jihoonQueue.offer(nx to ny)
        }
    }
    print("IMPOSSIBLE")
}
```


> `fireDist[nx][ny] != -1` 조건이 필요한 이유를 설명해주는 input 케이스


```plaintext
3 4
###F
.J#.
###.
```


> continue를 사용하지 않고 조건을 만족할 떄 로직을 실행


```kotlin
...

if (jihoonDist[nx][ny] == -1 && maze[nx][ny] != &#x27;#&#x27;) {
    if (fireDist[nx][ny] == -1 || fireDist[nx][ny] > jihoonDist[curX][curY] + 1) {
        jihoonDist[nx][ny] = jihoonDist[curX][curY] + 1
        jihoonQueue.offer(nx to ny)
    }
}
...
```


> maze 초기화 시 forEachIndeded 사용하는 방법


```kotlin
for (i in 0 until row) {
        next().forEachIndexed { j, char ->
            maze[i][j] = char
            ...
        }
    }
```


이렇게 시작점이 두 종류인 문제를 해결할 수 있게 되었다. 하지만 시작점이 두 종류인 문제에 관해서 생각해야 할 점이 추가로 존재한다. 본 문제는 지훈이의 이동은 불의 전파에 영향을 받지만 불의 전파는 지훈이의 이동에 영향을 받지 않아서 불만 먼저 전파를 쭉 시키는게 가능했다. 그러나 시작점이 A, B 두 종류가 있고, A의 전파에 B가 영향을 주고 B의 전파에도 A가 영향을 준다고 가정해본다면 어느 하나를 먼저 끝까지 전파시키는게 불가능하다. (예를 들어, 불과 소방수 내지는 불과 물이 전파되는 문제여서 둘이 만나면 뭔가 상호작용이 발생하는 케이스)

위의 케이스를 다루는 문제가 바로 [BOJ 18809번, Gaaaaaaaaaarden](https://www.acmicpc.net/problem/18809) 문제이다. 아쉽게도 이 문제는 **백트래킹 기법**을 추가로 알고 있어야 해결이 가능하기 때문에 당장 풀어볼 수는 없지만, 두 종류의 BFS에서 BFS를 돌 때 어느 하나가 독립적이지 않고 서로에게 영향을 준다면 위의 방법으로는 해결할 수 없다는 것을 꼭 이해해야 한다. 그런 상황에서는 시간 순으로 A와 B를 동시에 진행시켜야 한다.

### [](#응용-4-1차원에서의-bfs)응용 4 : 1차원에서의 BFS

> [BOJ 1697번, 숨바꼭질](https://www.acmicpc.net/problem/1697)


```kotlin
import java.util.*

fun main() = with(Scanner(System.`in`)) {
    val (n, k) = nextInt() to nextInt()
    val line = Array(100001) { -1 }
    val queue: Queue<Int> = LinkedList()

    line[n] = 0
    queue.offer(n)

    while (queue.isNotEmpty()) {
        val current = queue.poll()
        val dx = intArrayOf(1, -1, current)

        for (dir in dx.indices) {
            val next = current + dx[dir]

            if (next < 0 || next > 100000) continue
            if (line[next] != -1) continue

            line[next] = line[current] + 1
            queue.offer(next)
        }
    }

    print(line[k])
}
```


## [](#references)References

[\[바킹독의 실전 알고리즘\] 0x09강 - BFS](https://youtu.be/ftOmGdm95XI)

#[Kotlin](/tags/Kotlin/)[Algorithm](/tags/Algorithm/)[BOJ](/tags/BOJ/)[바킹독](/tags/%EB%B0%94%ED%82%B9%EB%8F%85/)[BFS](/tags/BFS/)
