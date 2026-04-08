---
title: "[Java] 문자열 연결 연산 &quot;+&quot;의 내부 구현"
date: 2021-11-29T00:00:00.000Z
categories:
  - Kotlin
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - BFS
---

### 아래의 코드에서 문자열 연결 연산자 `+`의 내부 구현은 어떻게 될까?

```java
public class StringConcat {
    public static void main(String[] args) {
        String text = "Java";
        text = text + " String";
        System.out.println(text); // Java String
    }
}
```

<!-- more -->
JDK 5 이전에는 String 문자열을 더하면 새로운 String 객체가 생성되고, 기존 객체는 쓰레기가 되어 나중에 GC(Garbage Collection)의 대상이 되었다. 이것이 반복되면 쓰레기가 계속 생성될 것이고 성능적인 문제점을 야기하므로 이펙티브 자바의 아이템 63에서는 **문자열 연결은 느리니 주의하라**라는 내용을 담고 있다.

![](https://user-images.githubusercontent.com/39554623/143585132-463dee44-ab86-41ea-a508-ee1c8a0a6ec4.png)

그런데 JDK 5 이상에서는 String의 문자열 연결 연산을 할 경우, 컴파일할 때 자동으로 해당 연산을 StringBuilder로 변환해준다. 그럼에도 왜 StringBuilder의 `append()` 메서드를 사용하라는 것일까? 그 이유가 궁금하여 블로그와 관련 문서들을 찾아 정리해보았다.

## 클래스 내부를 확인해보자

```java
public class StringConcat {
    public static void main(String[] args) {
        String s1 = "Hello";
        String s2 = "World";
        String s3 = s1 + s2;
        System.out.println(s3);
    }
}
```

위의 클래스 내부를 확인하기 위해 **javap**를 이용하여 자바 클래스 파일을 바이트코드로 역어셈블(disassemble)해보자. 오라클의 공식 문서에서 [javap의 문서](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/javap.html#BEHHDJGA)를 확인할 수 있다.

```console
$ javac StringConcat.java
$ javap -c StringConcat.class
```

### JDK 8

```java
public class StringConcat {
  public StringConcat();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // String Hello
       2: astore_1
       3: ldc           #3                  // String World
       5: astore_2
       6: new           #4                  // class java/lang/StringBuilder
       9: dup
      10: invokespecial #5                  // Method java/lang/StringBuilder."<init>":()V
      13: aload_1
      14: invokevirtual #6                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      17: aload_2
      18: invokevirtual #6                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      21: invokevirtual #7                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      24: astore_3
      25: getstatic     #8                  // Field java/lang/System.out:Ljava/io/PrintStream;
      28: aload_3
      29: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      32: return
}
```

바이트코드를 보면 `ldc`, `astore_1`, `invokevirtual` 등 낯선 단어들이 보이는데, 이는 자바 바이트코드 명령어(instruction)이며 [오라클 문서](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ldc)나 [위키피디아](https://en.wikipedia.org/wiki/List_of_Java_bytecode_instructions)에서 각 명령어의 역할들을 확인할 수 있다. 이해가 잘 안되는 명령어는 두 문서가 서로의 설명을 보완해주니 둘 다 살펴보면 좋을 것 같다.

#### 먼저 main 메서드를 확인해보자

```java
0: ldc           #2                  // String Hello
2: astore_1
3: ldc           #3                  // String World
5: astore_2
```

-   0번 라인에서 상수 "Hello"를 `ldc` 명령어를 통해 오퍼랜드 스택으로 푸시한 다음, 2번 라인에서 `astore_<n>` 명령어를 통해 오퍼랜드 스택 맨 위의 레퍼런스를 지역 변수 `s1`에 저장한다.
    -   **오퍼랜드 스택(operand stack)**은 메서드 내 계산을 위한 작업 공간이다.
    -   **[ldc](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ldc)**는 run-time constant pool의 constant(상수)를 오퍼랜드 스택으로 푸시하는 명령어이다.
    -   **[astore\_<n>](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.astore_n)**은 오퍼랜드 스택의 맨 위에 있는 _objectref_가 팝되고 현재 프레임의 지역 변수 배열에서 인덱스 n의 지역 변수 값이 _objectref_로 설정된다.
    -   이러한 작업은 3번과 5번 라인에서 지역 변수 `s2`에 "World"가 할당되는 것으로 반복된다.

```java
6: new           #4                  // class java/lang/StringBuilder
...
13: aload_1
```

-   6번 라인에서 `StringBuilder` 객체를 생성한 다음 13번 라인에서 `aload_<n>` 명령어를 통해 지역 변수 `s1`에서 "Hello"에 대한 레퍼런스를 불러온다.

```java
14: invokevirtual #6                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
```

-   14번 라인에서 `invokevirtual`을 통해 `append()` 메서드를 호출하여 "Hello"를 `StringBuilder` 객체에 추가한다.

```java
17: aload_2
18: invokevirtual #6                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
21: invokevirtual #7                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
```

-   17, 18번 라인에서도 `s2`에서 "World"에 대한 레퍼런스를 불러온 뒤 `append()` 메서드를 통해 `StringBuilder` 객체에 추가한다.
-   21번 라인에서 `StringBuilder`의 `toString()` 메서드가 호출되는 것을 확인할 수 있다.

정리하자면 `String s3 = s1 + s2;` 코드는 컴파일 타임에 아래의 코드처럼 동작하는 것을 유추해볼 수 있다.

```java
StringBuilder sb = new StringBuilder();
sb.append(s1);
sb.append(s2);
s3 = sb.toString();
```

## 그래서 왜 String 문자열 연결이 느린거지…?

위에서 바이트코드를 통해 본대로 String 클래스의 문자열 연결 연산은 내부적으로 StringBuilder로 변환되어 동작하는 것을 확인했다. 아직까진 StringBuilder 클래스 객채를 생성해서 `append()` 메소드를 사용하는 것과 무슨 차이가 있다는건지 아리송한 부분이 있다.

이럴 땐 직접 테스트를 해보자.

```java
public class Test {
    public static void main(String[] args) {
        Test test = new Test();
        test.testString();         // String : 11.754sec
        test.testStringBuilder();  // StringBuilder : 0.003sec
    }

    public void testString() {
        String result = "";
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < 100000; i++) {
            result += "ABC";
        }
        long endTime = System.currentTimeMillis();
        System.out.println("String : " + (float) (endTime - startTime) / 1000 + "sec");
    }

    public void testStringBuilder() {
        StringBuilder sb = new StringBuilder();
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < 100000; i++) {
            sb.append("ABC");
        }
        String result = sb.toString();
        long endTime = System.currentTimeMillis();
        System.out.println("StringBuilder : " + (float) (endTime - startTime) / 1000 + "sec");
    }
}
```

아래는 String과 StringBuilder를 테스트하는 메소드 각각의 for문 부분의 바이트코드이다.

-   `goto` 명령어 뒤에 있는 숫자의 라인부터 `goto` 라인까지가 for문에 대한 바이트코드이다.

```java
public void testString();
  Code:
    ...
    17: new           #9                  // class java/lang/StringBuilder
    20: dup
    21: invokespecial #10                 // Method java/lang/StringBuilder."<init>":()V
    24: aload_1
    25: invokevirtual #11                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
    28: ldc           #12                 // String ABC
    30: invokevirtual #11                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
    33: invokevirtual #13                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
    36: astore_1
    37: iinc          4, 1
    40: goto          10
    ...
public void testStringBuilder();
  Code:
    ...
    22: aload_1
    23: ldc           #12                 // String ABC
    25: invokevirtual #11                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
    28: pop
    29: iinc          4, 1
    32: goto          15
    ...
```

`append()` 연산 한 번만으로 끝나는 StringBuilder와 달리, String 클래스의 문자열 연결 연산은 **매번 새로운 StringBuilder 객체를 생성**하여 `append()` 연산을 한 뒤에 `toString()` 메서드를 통해 문자열로 변환되는 방식을 취하고 있다.

### JDK 9

String 클래스의 문자열 연결 연산이 StringBuilder로 변환되었던 이전과 달리, Java 9부터는 [StringConcatFactory](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html) 클래스의 `makeConcatWithConstants`라는 메서드를 단일 호출하는 방식으로 변경된 것을 확인할 수 있다.

> Facilitates the creation of optimized String concatenation methods, that can be used to efficiently concatenate a known number of arguments of known types, possibly after type adaptation and partial evaluation of arguments. Typically used as a bootstrap method for `invokedynamic` call sites, to support the string concatenation feature of the Java Programming Language.

```java
public class StringConcat {
  public StringConcat();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // String Hello
       2: astore_1
       3: ldc           #3                  // String World
       5: astore_2
       6: aload_1
       7: aload_2
       8: invokedynamic #4,  0              // InvokeDynamic #0:makeConcatWithConstants:(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
      13: astore_3
      14: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
      17: aload_3
      18: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      21: return
}
```

실제로 JDK 9 환경에서 다시 위의 Test 클래스를 실행했을 때 아래와 같이 기존의 문자열 연결 연산에 비해 빨라진 것을 확인할 수 있었다.

```console
// JDK 8
String : 11.754sec
StringBuilder : 0.003sec

// JDK 9
String : 1.859sec
StringBuilder : 0.005sec
```

## 정리

자바의 문자열 연결 연산에서 흔히 String, StringBuilder, StringBuffer 세 개의 클래스를 비교하게 되는데, **StringBuffer**는 쓰레드 안정성을 위한 `append()` 메서드의 동기화(synchronization)때문에 연산 횟수가 적을 경우 정말 좋지 않은 성능을 보여준다. 그러므로 프로그램이 동기화를 필요로 하는 경우가 아니라면 **StringBuilder**를 사용하는 것이 항상 최고의 성능을 제공한다.

하지만 코드를 작성할 때 성능을 고려하는 것도 중요하지만 편의성과 가독성 또한 고려해야하는 중요한 요소이다. 문자열 연결 연산자 `+`가 편리하고 가독성이 좋다고 느낀다면 문자열 연결 연산이 1000회 미만으로 적게 반복되는 상황에서는 `StringBuilder.append`와 거의 유사하기 때문에 충분히 사용할 수 있다.

물론 본문에서 확인해봤듯이 Java 9부터는 `+`의 내부 구현이 변경되어 이전보다 빠른 성능을 보여주기는 하지만, 1만회 이상만 반복해도 StringBuilder를 사용하는 것보다 1초 이상 느린 성능을 보여주기 때문에 대부분의 문자열 연산에서 StringBuilder를 사용하는 것이 좋다.

## References

-   [https://johngrib.github.io/wiki/jvm-stack/](https://johngrib.github.io/wiki/jvm-stack/)
-   [https://jinseongsoft.tistory.com/369](https://jinseongsoft.tistory.com/369)
-   [https://stackoverflow.com/questions/46512888](https://stackoverflow.com/questions/46512888)

window.ReactionButtonType = 'reaction'; window.ReactionApiUrl = '//june0122.tistory.com/reaction'; window.ReactionReqBody = { entryId: 2 }

공유하기
