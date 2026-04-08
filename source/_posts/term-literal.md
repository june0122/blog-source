---
title: "[프로그래밍 용어] 리터럴(literal)과 상수(constant)란?"
date: 2021-08-03T19:40:58.501Z
categories:
  - Terminology
tags:
  - Terminology
---

코틀린에서 "[람다 표현식과 익명 함수](https://kotlinlang.org/docs/lambdas.html#lambda-expressions-and-anonymous-functions)는 **함수 리터럴(function literals)**이다"라는 설명을 보면서 리터럴이 정확히 무엇인지 정확히 이해하고 있지 않은 것 같아 개념을 글로 정리하게 되었다.

위키백과에서 리터럴(literal)은 소스 코드의 **고정된 값**을 표현하는 용어라 설명한다.

<!-- more -->
> In computer science, a literal is a notation for representing a fixed value in source code.

`고정된 값`이라는 표현 때문에 우리가 흔히 사용하던 상수(constant)의 개념과 혼란이 왔는데, 실제로 구글에 _literal vs constant_에 대한 검색 결과가 많이 존재하는 것을 보아 이 용어들이 헷갈리는 건 나뿐만이 아니었나 보다. 위키백과에서 상수에 대해선 실행 중에 프로그램에 의해 **변경되어선 안되는 값**이라 설명한다.

> In computer programming, a constant is a value that should not be altered by the program during normal execution.

리터럴은 고정된 값, 상수는 변경되어선 안되는 값이라니 위키백과의 설명만 봐서는 이 용어들에 대해 감을 잡기가 어려웠기에 스택오버플로우의 답변을 살펴보았다.

## [](#설명-1)설명 1

### [](#리터럴)리터럴

-   `"hey"` (a string)
-   `false` (a boolean)
-   `3.14` (a real number)
-   `[1,2,3]` (a list of numbers)
-   `(x) => x*x` (a function)
-   `/^1?$|^(11+?)\1+$/` (a RegExp)

### [](#리터럴이-아닌-것)리터럴이 아닌 것

-   `std::cout` (an identifier)
-   `foo = 0;` (a statement)
-   `1 + 2` (an expression)

  

가장 많은 채택을 받은 답변이지만 뭔가 모호하다. 다른 답변들을 살펴보자.

## [](#설명-2)설명 2

-   기본적으로 상수는 값을 변경할 수 없는 변수이다.
-   리터럴은 고정값을 나타내는 표기법이다. 이 값은 문자열, 숫자 등이 될 수 있다.
-   리터럴은 변수에 할당될 수 있다.


```javascript
var a = 10;
var name = "Simba";
const pi = 3.14;
```


`a`와 `name`은 변수이고, `pi`는 상수다. `10`, `"Simba"`, `3.14`는 리터럴이다.

  

```java
int y = 2; // 2는 리터럴이지만, y는 아니다.
int z = y + 4; // y랑 z는 리터럴이 아니지만 4는 리터럴이다.
int a = 1 + 2; // 1 + 2 는 리터럴이 아니지만 (표현식이다), 1과 2 각각은 리터럴이다.
```

  

이제 리터럴이 무엇인지 감이 올 것 같지만 좀 더 보충해보자.

## [](#설명-3)설명 3


```c
const DRINKING_AGE = 21;
const VOTING_AGE = 18;
```


위의 코드에서 `18`과 `21`은 리터럴이다. 리터럴은 `if(age > 18)` 또는 `if(age < 21)`과 같이 프로그램의 모든 영역에서 사용될 수 있다. 하지만 상수를 이용하면 `if(age > VOTING_AGE)`와 같이 코드를 더 이해하기 쉽게 만들 수 있다.

프로그래밍을 하면서 _매직 넘버를 사용하지 마라_ 와 같은 말을 들어봤을 것이다. 상수를 사용하면 프로그래머가 각 리터럴이 무엇인지, 어떠한 의미를 지녔는지를 일일이 기억하고 유추할 필요가 없어진다. 비즈니스 요구 사항에 따라 상수를 변경해야 하는 경우(예를 들어, 향후 음주 연령을 20세로 낮추는 경우) 프로그램에 변경 사항을 적용하는 것이 훨씬 쉬워진다. 프로그램 전체에서 리터럴을 사용했다면 변경하기도 어렵고 일부 인스턴스는 수정이 누락될 위험도 있다.

## [](#결론)결론

스택오버플로우 등을 검색하여 리터럴과 상수의 차이점이 무엇인지 정리하였다. 이제 리터럴이 무엇인지 이해하였는데 코틀린 등의 언어에서 이야기하는 함수 리터럴의 정의는 무엇인지 알아볼 필요가 있다고 생각한다. 함수 리터럴에 대해선 아래의 글들을 참고하여 정리할 예정이다.

-   [Kotlin Programmer Dictionary: Function Type vs Function literal vs Lambda expression vs Anonymous function](https://blog.kotlin-academy.com/kotlin-programmer-dictionary-function-type-vs-function-literal-vs-lambda-expression-vs-anonymous-edc97e8873e)
-   [Kotlin의 Extension은 어떻게 동작하는가 part 3](https://medium.com/til-kotlin-ko/kotlin%EC%9D%98-extension%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94%EA%B0%80-part-3-587cc37e7337)

## [](#references)References

-   Wikipedia - [Literal](https://en.wikipedia.org/wiki/Literal_\(computer_programming\))
-   MDN - [Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#literals)
-   stackoverflow - [Confusion between constants and literals?](https://stackoverflow.com/a/62239386)
-   stackoverflow - [What does the word “literal” mean?](https://stackoverflow.com/questions/485119/what-does-the-word-literal-mean)
-   stackoverflow - [What is the difference between literals and non-literals …](https://stackoverflow.com/a/48411723)
-   [Constant vs. Literal](https://www.diffen.com/difference/Constant_vs_Literal)

#[Terminology](/tags/Terminology/)
