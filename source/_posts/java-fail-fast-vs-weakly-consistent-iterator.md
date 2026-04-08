---
title: "[Java] fail-fast vs weakly consistent iterator"
date: 2021-12-20T00:00:00.000Z
categories:
  - Kotlin
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - BFS
---

자바 컬렉션 프레임워크에서 Map 인터페이스와 관련된 내용을 찾다보면 fail-fast와 fail-safe iterator에 대한 내용이 자주 보인다.

이 주제는 Concurrency(동시성)과 관련이 있는데, Map의 대표적인 구현 클래스인 HashMap의 요소를 for-each문 내부에서 변경할 경우 `ConcurrentModificationException`을 던지는 것을 한번쯤은 경험해봤을 것이다. 이 예외를 처음 경험한게 코딩테스트 도중이었기에 적잖이 당황했던 기억이 있기에 이번 기회에 정리하고자 한다.

<!-- more -->
#### HashMap에서의 `ConcurrentModificationException` 예시

```java
private HashMap<String, String> map;

// 특정 카테고리를 제외한 모든 요소 삭제
public void clear(String category) {
    map.entrySet().forEach(e -> {
        if (e.getValue().equals(category)) return;
        map.remove(e.getKey());
    });
}
```

```console
Exception in thread "main" java.util.ConcurrentModificationException
    at java.util.HashMap$EntrySet.forEach(HashMap.java:1049)
    at HashMapSample.clear(HashMapSample.java:24)
    at HashMapSample.main(HashMapSample.java:10)
```

하나 이상의 스레드가 컬렉션을 반복하는 사이에 하나의 스레드가 컬렉션의 구조를 변경(요소를 추가, 삭제 또는 업데이트)하는 것을 Concurrent Modification이라 한다. 그런데 왜 맵의 요소를 변경하는 것에 대해 예외를 가지는 것일까?

## 1\. Fail Fast Iterator

[HashMap의 javadoc](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/util/HashMap.html)을 보면 다음과 같은 설명이 있다.

> The iterators returned by all of this class's "collection view methods" are **_fail-fast_**: if the map is structurally modified at any time after the iterator is created, in any way except through the iterator's own remove method, the iterator will throw a [ConcurrentModificationException](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/util/ConcurrentModificationException.html). Thus, in the face of concurrent modification, the iterator fails quickly and cleanly, rather than risking arbitrary, non-deterministic behavior at an undetermined time in the future.

HashMap 클래스의 모든 collection view 메서드에서 리턴된 iterators는 fail-fast라고 설명하고 있다.

Collection view에 대한 설명은 [Map 인터페이스의 javadoc](https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html)과 JCF의 View에 대해 설명한 [블로그](https://softwarecave.org/2014/03/19/views-in-java-collections-framework/)를 통해 더 자세히 알아볼 수 있다.

iterator가 생성된 후에 map이 구조적으로 변경되면, iterator의 자체 remove 메서드를 사용하는 경우를 제외하고는 iterator가 ConcurrentModificationException을 던진다는 것이다. 따라서 iterator는 Concurrent Modification에 대해 미래의 불확실한 시간에 의도치 않은 동작의 위험을 감수하기보다는 빠르고 깔끔하게 실패 처리를 할 수 있다.

### fail-fast iterator는 내부 구조가 변경된 것을 어떻게 알 수 있는 것일까?

Iterator는 내부 구조를 직접 읽는데, 컬렉션을 순회하는 동안 내부 구조를 변경해서는 안된다. 이것을 보장하기 위해 내부 플래그로 `modCount`를 사용한다. Iterator는 다음 값을 얻을 때마다(`hasNext()`와 `next()` 메서드 사용) `modCount` 플래그를 확인한다. 구조적으로 변경이 있을 때마다 플래그의 값을 변경하여 iterator가 ConcurrentModificationException을 던질 수 있도록 한다.

그럼 실제 HashMap의 내부 구현을 통해 확인해보자.

### HashMap 클래스 내부 구현

```java
/* ---------------- Public operations -------------- */

public V remove(Object key) {
    Node<K,V> e;
    return (e = removeNode(hash(key), key, null, false, true)) == null ?
        null : e.value;
}

final Node<K,V> removeNode(int hash, Object key, Object value,
                           boolean matchValue, boolean movable) {
    Node<K,V>[] tab; Node<K,V> p; int n, index;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (p = tab[index = (n - 1) & hash]) != null) {
        Node<K,V> node = null, e; K k; V v;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            node = p;
        else if ((e = p.next) != null) {
            if (p instanceof TreeNode)
                node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
            else {
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key ||
                         (key != null && key.equals(k)))) {
                        node = e;
                        break;
                    }
                    p = e;
                } while ((e = e.next) != null);
            }
        }
        if (node != null && (!matchValue || (v = node.value) == value ||
                             (value != null && value.equals(v)))) {
            if (node instanceof TreeNode)
                ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
            else if (node == p)
                tab[index] = node.next;
            else
                p.next = node.next;
            ++modCount;
            --size;
            afterNodeRemoval(node);
            return node;
        }
    }
    return null;
}
```

`removeNode(…)` 메서드의 맨 아랫 부분이 조건문을 보면 실제로 삭제가 발생할 때 `++modCount`를 통해 변경된 횟수를 늘리고 있다.

```java
/* ---------------- Public operations -------------- */

...

public Set<Map.Entry<K,V>> entrySet() {
    Set<Map.Entry<K,V>> es;
    return (es = entrySet) == null ? (entrySet = new EntrySet()) : es;
}

final class EntrySet extends AbstractSet<Map.Entry<K,V>> {
    public final int size()                 { return size; }
    public final void clear()               { HashMap.this.clear(); }
    public final Iterator<Map.Entry<K,V>> iterator() {
        return new EntryIterator();
    }
    ...
}

...

/* ------------------------------------------------------------ */
// iterators

final class EntryIterator extends HashIterator
    implements Iterator<Map.Entry<K,V>> {
    public final Map.Entry<K,V> next() { return nextNode(); }
}

...

abstract class HashIterator {
    Node<K,V> next;        // next entry to return
    Node<K,V> current;     // current entry
    int expectedModCount;  // for fast-fail
    int index;             // current slot
    HashIterator() {
        expectedModCount = modCount;
        Node<K,V>[] t = table;
        current = next = null;
        index = 0;
        if (t != null && size > 0) { // advance to first entry
            do {} while (index < t.length && (next = t[index++]) == null);
        }
    }

    ...

    final Node<K,V> nextNode() {
        Node<K,V>[] t;
        Node<K,V> e = next;
        if (modCount != expectedModCount)
            throw new ConcurrentModificationException();
        if (e == null)
            throw new NoSuchElementException();
        if ((next = (current = e).next) == null && (t = table) != null) {
            do {} while (index < t.length && (next = t[index++]) == null);
        }
        return e;
    }

    ...
}
```

`entrySet()` 메서드를 통해 반환되는 EntrySet의 `iterator()` 메서드는 EntryIterator를 반환하고, EntryIterator가 상속받은 HashIterator는 _fail-fast_를 위해 생성자에서 Map(여기서는 HashMap)의 modCount를 expectedModCount 변수에 저장하고 있다.

EntryIterator의 `next()` 메서드는 부모 클래스인 HashIterator의 `nextNode()` 메서드를 호출하는데 그 안에서 객체 생성 당시의 modCount(expectedModCount)와 현재 Map(여기서는 HashMap)의 modCount를 비교해서 값이 다르면 ConcurrentModificationException을 던지고 있는 것을 확인할 수 있다.

문제가 발생(할 가능성이 보이면)하면 후속 작업을 거치지 않고 바로 fail 처리(예외 던지기)를 해버리는 점에서 fail fast iterator라고 불리는 것 같다.

### 문제 해결

다시 ConcurrentModificationException이 발생한 문제의 코드를 보며 내부적으로 어떻게 동작했을지 순차적으로 살펴보자.

```java
private HashMap<String, String> map;

public void clear(String category) {
    map.entrySet().forEach(e -> {
        if (e.getValue().equals(category)) return;
        map.remove(e.getKey());
    });
}
```

1.  `map.entrySet()` 메서드가 호출되고, EntrySet 타입을 반환받는다.
2.  `forEach(…)`에서 반복문을 돌리기 위해 EntrySet의 `iterator()` 메서드가 호출됨에 따라 EntryIterator를 반환받는다.
3.  EntryIterator의 부모인 HashIterator의 생성자에서는 fail-fast를 위해 현재 Map의 modCount를 expectedModCount 변수에 저장한다.
4.  `forEach(…)` 메서드 안에서는 `iterator.hasNext()`가 호출되고 true를 반환함에 따라 `iterator.next()` 메서드가 호출되고, 그 반환값은 it이라는 변수에 저장된다.
5.  조건문에 따라 Map의 `remove()` 메서드가 호출되고 그에 따라 Map의 modCount가 1 증가한다.
6.  또 다시 `iterator.hasNext()`가 호출되고 true를 반환함에 따라 `iterator.next()` 메서드를 호출한다.
7.  `iterator.next()`에서는 HashIterator의 `nextNode()` 메서드가 호출되고, 객체 생성 당시의 modCount(expectedModCount)와 현재 Map의 modCount가 다르기 때문에 ConcurrentModificationException을 던진다.

이 문제를 해결하기 위해서는 `map.remove(Object key)` 메서드가 아닌 `iterator.remove()` 메서드를 사용해야 한다.

```java
abstract class HashIterator {
    ...
    public final void remove() {
        Node<K,V> p = current;
        if (p == null)
            throw new IllegalStateException();
        if (modCount != expectedModCount)
            throw new ConcurrentModificationException();
        current = null;
        K key = p.key;
        removeNode(hash(key), key, null, false, false);
        expectedModCount = modCount;
    }
}
```

`iterator.remove()` 메서드 안에서도 실제로 `removeNode(…)` 메서드가 호출되지만(`map.remove(Object key)`에서도 호출함), expectedModCount를 현재 modCount로 갱신하는 것이 큰 차이점이다.

따라서 아래와 같이 `iterator.remove()` 메서드를 사용하면 ConcurrentModificationException 문제를 해결할 수 있다.

```java
public void clearWithIterator(String category) {
    Iterator<Map.Entry<String, String>> iterator = map.entrySet().iterator();

    while (iterator.hasNext()) {
        Map.Entry<String, String> entry = iterator.next();
        if (!entry.getValue().equals(category)) iterator.remove();
    }
}
```

## 2\. Fail Safe Iterator (Non Fail Fast Iterator)

### fail-safe는 자바에서 사용되지 않는 용어?!

fail-fast iterators의 반대 개념으로 많은 글들이 fail-safe iterators라는 용어를 사용하지만 정작 자바 공식 문서에는 iterator를 설명하는데 fail-safe라는 용어를 사용하지는 않는다. 대신 `java.util.concurrent` 패키지에 대한 [javadoc](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/util/concurrent/package-summary.html)을 보면 **weakly consistent(약하게 일관된)**이라는 용어를 사용한다.

> Most concurrent Collection implementations (including most Queues) also differ from the usual java.util conventions in that their Iterators and Spliterators provide weakly consistent rather than fast-fail [traversal](https://stackoverflow.com/questions/16327461/what-is-the-difference-between-iteration-and-traversing).

weakly consistent와 fail-safe 용어의 오용에 대한 글은 stackoverflow의 글들을 참고해보자.

-   [https://stackoverflow.com/a/38341921/12364882](https://stackoverflow.com/a/38341921/12364882)
-   [https://stackoverflow.com/a/17377698/12364882](https://stackoverflow.com/a/17377698/12364882)

### weakly consistent iterator ≠ fail safe iterator

구글에 weakly consistent iterator와 fail safe iterator에 대해 검색해보면 둘을 동일한 개념으로 설명하고 있는 글들이 많이 존재한다. 자바 문서에서 fail-safe라는 용어를 사용하지는 않지만 둘은 엄연히 다른 개념이므로 차이점을 정리하고자 한다.

우선 weakly consistent와 fail safe는 **둘 다 `ConcurrentModificationException`을 던지지 않는다는 공통점**을 가지고 있다. 이로인해 둘이 같은 개념이라는 혼동을 불러일으키는 것 같다.

-   `fail safe iterator` 메커니즘은 컬렉션 내부 자료구조의 **복사본**을 만들고 이를 사용하여 요소들 위를 iterate한다. 이렇게 하면 기본 자료구조가 변경되는 경우 ConcurrentModificationException가 던져지는 것을 방지할 수 있다. 물론 전체 배열을 복사하는 오버헤드가 존재한다.
    
    -   CopyOnWriteArrayList가 fail safe iterator를 사용한 구현 중 하나이며 생성자 코드를 보면 쉽게 확인할 수 있다.
        
        ```java
        public CopyOnWriteArrayList(Collection<? extends E> c) {
            Object[] elements;
            if (c.getClass() == CopyOnWriteArrayList.class)
                elements = ((CopyOnWriteArrayList<?>)c).getArray();
            else {
                elements = c.toArray();
                if (elements.getClass() != Object[].class)
                    elements = Arrays.copyOf(elements, elements.length, Object[].class);
            }
            setArray(elements);
        }
        ```
        
-   `weakly consistent iterator` : [Compare and Swap](http://tutorials.jenkov.com/java-concurrency/compare-and-swap.html)에 의존하는 컬렉션에는 weakly consistent iterator가 있으며, 이 iterator는 생성된 이후 [Backing Collection](https://stackoverflow.com/questions/10636528)에 적용된 변경 사항을 모두는 아니지만 일부를 반영한다. 예를 들어, iterator가 도달하기 전에 컬렉션의 요소가 수정되거나 제거된 경우 이러한 변경 사항은 확실히 반영하지만, 삽입에 대한 보장은 없다.
    

키워드를 정리하자면 fail-safe는 copy를 이용한 매커니즘이고 weakly consistent는 Compare and Swap를 이용한 매커니즘이라는 것이다.

weakly consistent iterator 매커니즘을 사용하는 대표적인 클래스인 ConcurrentHashMap의 동기화 처리 방식에서 Compare and Swap이 사용되는 것을 자세히 보고 싶다면 [이 글](https://pplenty.tistory.com/17)을 참고하자. 본문에서는 HashMap과 `remove()` 메서드와 달리 ConcurrentHashMap의 `remove()` 메서드에선 왜 ConcurrentModificationException이 발생하지 않는 것인지 내부 구현을 확인해본다.

### ConcurrentHashMap 클래스 내부 구현

ConcurrentHashMap은 Collection view를 반환하는 메서드(`entrySet()`, `keySet()`, `values()` 등)의 `iterator()` 메서드가 생성하는 iterator가 있다.

```java
static final class EntryIterator<K,V> extends BaseIterator<K,V>
    implements Iterator<Map.Entry<K,V>> {
    EntryIterator(Node<K,V>[] tab, int index, int size, int limit,
                  ConcurrentHashMap<K,V> map) {
        super(tab, index, size, limit, map);
    }

    public final Map.Entry<K,V> next() {
        Node<K,V> p;
        if ((p = next) == null)
            throw new NoSuchElementException();
        K k = p.key;
        V v = p.val;
        lastReturned = p;
        advance();
        return new MapEntry<K,V>(k, v, map);
    }
}
```

ConcurrentHashMap의 `entrySet()` 메서드의 반환 타입인 EntrySetView의 `iterator()` 메서드의 반환타입인 EntryIterator의 `next()` 메서드를 보면 ConcurrentModificationException을 던지지 않는다. 즉, fail-fast iterator와 달리 새로운 요소가 추가/삭제되어도 모든 요소를 끝까지 순회하는 것이다.

ConcurrentHashMap에서 요소가 추가/삭제되더라도 ConcurrentModificationException을 던지지 않는 이유는 ConcurrentHashMap은 추가/삭제 메서드에 synchronized 키워드를 사용하여 락을 잡은 후 다른 쓰레드에서 접근하지 못하도록 하기에 동시성으로부터 안전하기 때문이다.

```java
public V remove(Object key) {
    return replaceNode(key, null, null);
}

final V replaceNode(Object key, V value, Object cv) {
    int hash = spread(key.hashCode());
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh;
        if (tab == null || (n = tab.length) == 0 ||
            (f = tabAt(tab, i = (n - 1) & hash)) == null)
            break;
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        else {
            V oldVal = null;
            boolean validated = false;
            synchronized (f) { // synchronized 블록을 이용하여 lock 설정
                ... 
            }
            if (validated) {
                if (oldVal != null) {
                    if (value == null)
                        addCount(-1L, -1);
                    return oldVal;
                }
                break;
            }
        }
    }
    return null;
}
```

즉, weakly consistent iterator는 요소가 추가/삭제 되더라도 ConcurrentModificationException을 던지지 않고 모든 요소를 순회할 수 있으며 동시성 이슈로부터도 안전하다.

#### weakly consistent가 내포하고 있는 의미

-   [weakly consistent 용어의 해설](https://stackoverflow.com/questions/28915215)

## 정리

fail-fast iterator 매커니즘은 iterator가 생성된 후 구조가 변경되면 바로 ConcurrentModificationException을 던지고 작업을 중단한다.

-   예시 : HashMap, LinkedHashMap, ArrayList, Vector

weakly consistent iterator 매커니즘은 iterator가 생성된 후 구조가 변경되어도 ConcurrentModificationException을 던지지 않고 끝까지 작업을 진행한다.

-   예시 : ConcurrentHashMap
-   주의 : CopyOnWriteArrayList는 weakly consistent가 아닌 fail safe이다.

## References

-   [https://perfectacle.github.io/2021/08/14/fail-fast-iterator/](https://perfectacle.github.io/2021/08/14/fail-fast-iterator/)
-   [https://stackoverflow.com/a/20142664/12364882](https://stackoverflow.com/a/20142664/12364882)
-   [https://pplenty.tistory.com/17](https://pplenty.tistory.com/17)
-   JAVA HUNGRY : [Fail Fast Vs Fail Safe Iterator In Java](https://javahungry.blogspot.com/2014/04/fail-fast-iterator-vs-fail-safe-iterator-difference-with-example-in-java.html)
    -   해당 링크와 몇몇 자료들에선 fail-safe iterator가 카피를 만들어서 동작한다고 설명하며 fail-safe iterator의 대표적 클래스로 ConcurrentHashMap을 예시로 드는데, ConcurrentHashMap의 iterator는 위에서 함께 내부 코드를 확인했듯 카피를 기반으로 동작하지 않으므로 잘못된 설명이다.
    -   fail-safe iterator 용어의 문제점을 설명하는 [stackoverflow의 답변](https://stackoverflow.com/a/38341921/12364882)에서 이에 대해 잘 설명해주고 있다.
