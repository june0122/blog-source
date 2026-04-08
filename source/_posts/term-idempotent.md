---
title: "[프로그래밍 용어] 멱등성(idempotent)이란?"
date: 2021-08-04T22:19:57.846Z
categories:
  - Terminology
tags:
  - Terminology
  - Idempotent
  - RESTful
---

전산학이나 수학에서 사용하는 용어로 **연산을 여러 번 적용하더라도 결과가 달라지지 않는 성질**, **연산을 여러 번 반복하여도 한 번만 수행된 것과 같은 성질**을 의미한다. 함수 `f(x)`를 예를 들면 다음과 같은 등식이 성립된다. 즉 메서드가 여러 번 실행되어도, 결과는 같으므로 **안전하게 사용**할 수 있는 성질이기도 하다.


```plaintext
f(f(x)) = f(x)
```

<!-- more -->

등식으로만 처음 보면 감이 오지 않을 수 있는데 절대값을 구하기 위해 사용하는 `abs()` 함수가 바로 멱등성을 가지고 있다. 모든 `x`에 대해 `abs(abs(x)) = abs(x)`이기 대문이다.

수학적 정의에서 `x`가 객체의 상태를 나타내고, `f`가 해당 객체를 변경할 수 있는 연산이라는 점을 고려해보자. 예를 들어, [파이썬의 set](https://docs.python.org/2/library/stdtypes.html#set)이 있고, 이것의 `discard` 메서드는 set에서 요소를 제거하고, 요소가 존재하지 않으면 아무 작업도 수행하지 않는다. 그러므로


```python
my_set.discard(x)
```


는 동일한 작업을 두 번 수행하는 것과 정확히 동일한 효과가 있다. (참고로 `array.pop()`은 멱등적이지 않다)


```python
my_set.discard(x)
my_set.discard(x)
```


멱등 연산은 작업 수행 요청이 최소 한 번 발생하도록 보장되지만 두 번 이상 발생할 수도 있는 **네트워크 프로토콜 설계에 자주 사용**된다. 작업이 멱등적이면 작업을 두 번 이상 수행해도 결과는 한 번만 수행된 것과 동일하기 때문에 문제가 없기 때문이다.

멱등은 **RESTful** 웹 서비스의 맥락에서 많이 언급된다. REST는 HTTP를 최대한 활용하여 프로그램에 웹 콘텐츠에 대한 액세스 권한을 부여하고, 일반적으로 HTTP 요청 및 응답 내에서 원격 프로시저 호출 스타일 서비스를 터널링하는 SOAP 기반 웹 서비스와 대조적으로 설정된다.

REST는 웹 애플리케이션을 **리소스**(예: Twitter 사용자 또는 Flickr 이미지)로 구성한 다음 `POST`, `PUT`, `GET` 및 `DELETE`의 HTTP 메서드를 사용하여 해당 리소스를 생성, 업데이트, 읽기 및 삭제한다. 이중 `POST`를 제외한 나머지 HTTP 메서드를 사용하는 API(`GET`, `PUT`, `DELETE`)들이 멱등성이 유지되어야 한다.

멱등성은 REST에서 중요한 역할을 한다. REST 리소스 표현을 `GET`하고(예: Flickr에서 jpeg 이미지 가져오기) 작업이 실패하면 작업이 성공할 때까지 `GET`을 계속해서 반복할 수 있다. 웹 서비스의 경우 이미지를 몇 번 가져왔는지는 중요하지 않다. 마찬가지로 RESTful 웹 서비스를 사용하여 Twitter 계정 정보를 업데이트하는 경우 웹 서비스에서 확인을 받기 위해 필요한 만큼 새 정보를 `PUT` 할 수 있다. 천 번 `PUT` 하는 것은 한 번 `PUT` 하는 것과 같다. 마찬가지로 REST 리소스를 천 번 `DELETE`하는 것은 한 번 `DELETE`하는 것과 같다. 따라서 멱등성을 사용하면 통신 오류에 탄력적인 웹 서비스를 훨씬 쉽게 구성할 수 있다.

## [](#references)References

-   Stackoverflow : [What is an idempotent operation?](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation)
-   NHN Cloud Meetup! : [지속 가능한 소프트웨어를 위한 코딩 방법](https://meetup.toast.com/posts/218)
-   Wikipedia : [Idempotence](https://en.wikipedia.org/wiki/Idempotence)

#[Terminology](/tags/Terminology/)[Idempotent](/tags/Idempotent/)[RESTful](/tags/RESTful/)
