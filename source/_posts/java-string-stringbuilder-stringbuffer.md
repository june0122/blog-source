---
title: "[Java] String, StringBuilder, StringBuffer의 차이점"
date: 2021-12-17T00:00:00.000Z
categories:
  - Kotlin
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - BFS
---

Java를 공부하다보면 String은 불변(immutable) 객체라는 이야기를 많이 듣게 된다.

```java
String text = "Java";
text = text + " String";
System.out.println(text); // Java String
```

<!-- more -->
아니 위 코드처럼 String 값이 잘만 변하는데 무슨 말이야! 라고 생각될 수 있지만 **Java의 String 객체는 변하지 않는다.** 객체가 불변일 경우 멀티 쓰레드 환경에서 값이 변경될 일이 없이 때문에 자연스럽게 Thread safe하게 된다. JDK 5 이전에는 String 문자열을 더하면 새로운 String 객체가 생성되고, 기존 객체는 쓰레기가 되어 나중에 GC(Garbage Collection)의 대상이 되었다. 이것이 반복되면 쓰레기가 계속 생성될 것이고 성능적인 문제점을 야기한다. (String 클래스의 문자열 연결 연산의 내부 구현에 대해 자세히 알고 싶으면 [이걸](https://github.com/june0122/java_study/blob/master/Internal%20implemetation%20of%20String%20concatenation.md) 참고하자)

![](https://user-images.githubusercontent.com/39554623/143585132-463dee44-ab86-41ea-a508-ee1c8a0a6ec4.png)

이러한 String 클래스의 단점을 보완하기 위해 나온 클래스가 바로 **StringBuffer**와 **StringBuilder**다. 두 클래스에서 제공하는 메소드는 동일하다. StringBuffer와 StringBuilder는 문자열을 더해도 새로운 객체를 생성하지 않는다. 두 클래스는 `append()` 메소드를 가장 많이 사용하며, 매개 변수로 모든 기본 자료형과 참조 자료형을 포함한다.

> StringBuilder 예시

```java
StringBuilder sb = new StringBuilder();
sb.append("Java");
sb.append(" String");
System.out.println(sb); // Java String
```

> Method chaining이 가능한 `append()`

참고로 `append()` 메소드를 수행하면 해당 StringBuilder 객체, 즉 자신을 리턴하므로 다음과 같이 [Method chaining](https://en.wikipedia.org/wiki/Method_chaining)을 사용할 수 있다.

```java
StringBuilder sb = new StringBuilder();
sb.append("Java").append(" String");
```

StringBuilder와 StringBuffer 클래스의 중요한 차이점은 바로 **동기화(synchronization)**의 유무이다. StringBuilder는 동기화를 지원하지 않기에 Thread safe하지 않은 반면, StringBuffer는 동기화를 지원하기에 Thread safe한 특성을 지니고 있다. 결과적으로 동기화를 고려하지 않는 StringBuilder가 StringBuffer보다 싱글 쓰레드 환경에서 더 빠른 속도를 보여주게 된다.

String, StringBuilder, StringBuffer 클래스의 성능 차이는 [javapapers 블로그](https://javapapers.com/java/java-string-vs-stringbuilder-vs-stringbuffer-concatenation-performance-micro-benchmark/)와 아래 이미지에 잘 정리되어 있으니 참고하자. 해당 블로그에 따로 언급은 하지 않았지만 JDK 7 환경에서 벤치마크를 진행한 것으로 보여진다. ([String.concat과 String 클래스의 문자열 연결 연산 + 의 차이점](https://stackoverflow.com/questions/47605))

![](https://user-images.githubusercontent.com/39554623/143666690-3c63f017-0c35-4596-985a-2d618b4a7300.png)

### 정리

|  | String | StringBuilder | StringBuffer |
| --- | :---: | :---: | :---: |
| 불변성(Immutability) | O | X | X |
| 쓰레드 안전성(Thread safety) | O | X | O |
| 동기화(Synchronization) | O | X | O |

## References

-   [https://stackoverflow.com/questions/47605](https://stackoverflow.com/questions/47605)
-   [https://javapapers.com/java/java-string-vs-stringbuilder-vs-stringbuffer-concatenation-performance-micro-benchmark/](https://javapapers.com/java/java-string-vs-stringbuilder-vs-stringbuffer-concatenation-performance-micro-benchmark/)
