---
title: "[Java] jenv로 자바 버전 쉽게 변경하기"
date: 2021-12-19T00:00:00.000Z
categories:
  - Terminology
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - BFS
---

## java -version과 javac -version이 다르게 표시될 때

터미널에서 `java -version`과 `javac -version`을 실행했을 때 Java(JDK)의 버전이 다르게 표시되는 경우가 있다.

<!-- more -->
개인적으론 특정 버전 설치와 변경이 편리한 **jenv**를 이용하는 두 번째 방법을 개인적으로 추천한다.

## 방법 1

먼저 `/usr/libexec/java_home -V`을 실행하면 다음과 같이 출력이 된다.

```console
Matching Java Virtual Machines (3):
    15.0.2 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 15" /Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home
    1.8.0_311 (x86_64) "Oracle Corporation" - "Java SE 8" /Library/Java/JavaVirtualMachines/jdk1.8.0_311.jdk/Contents/Home
    1.8.0_292 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 8" /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home
```

위에서 기본으로 설정하고 싶은 버전을 선택하면

```console
$ export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_292`
```

을 사용하거나, 다음과 같이 메이저 버전을 지정할 수 있다.

```console
$ export JAVA_HOME=`/usr/libexec/java_home -v 1.8`
```

그런 다음 `java -version`을 실행하면 다음과 같은 결과를 볼 수 있다.

```console
openjdk version "1.8.0_292"
OpenJDK Runtime Environment (AdoptOpenJDK)(build 1.8.0_292-b10)
OpenJDK 64-Bit Server VM (AdoptOpenJDK)(build 25.292-b10, mixed mode)
```

터미널의 init file에 `export JAVA_HOME…` 행을 추가한다.

```console
$ export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
```

`.zshrc` 파일을 업데이트해줘야 한다.

```console
$ nano ~/.zshrc

// 파일의 마지막 줄에 작성 후 변경사항 저장
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8.0)
```

`CTRL + X`를 통해 에디터를 나가고, `Y`키를 눌러 변경사항을 저장한다.

```console
$ source ~/.zshrc
$ echo $JAVA_HOME
$ java -version
```

만약 이렇게 했는데도 `java -version`과 `javac -version`이 일치하지 않는다면

```console
$ cd /Library/Java/JavaVirtualMachines
```

위 경로로 가서 `ls`를 실행하여 모든 파일의 리스트를 확인한다.

그러면 적용하고자 했던 자바 버전의 폴더 이외에 다른 폴더들이 있을텐데 지우고자 하는 폴더가 jdk1.8.0\_20.jdk이라면 `sudo rm -rf jdk1.8.0_20.jdk`을 통해 해당 폴더를 삭제한다.

이제 `java -version`과 `javac -version`의 결과가 일치할 것이다.

## 방법 2

### openjdk 최신 버전 설치

```console
$ brew install --cask adoptopenjdk
```

### 특정 버전 설치 방법

#### 1\. 아래의 링크 혹은 테이블에서 원하는 버전 확인

[https://github.com/AdoptOpenJDK/homebrew-openjdk](https://github.com/AdoptOpenJDK/homebrew-openjdk)

| Java Version | JDK | JRE |
| --- | --- | --- |
| Latest OpenJDK with Hotspot JVM | `adoptopenjdk` | `adoptopenjdk-jre` |
| Latest OpenJDK with OpenJ9 JVM | `adoptopenjdk-openj9` | `adoptopenjdk-openj9-jre` |
| OpenJDK8 with Hotspot JVM | `adoptopenjdk8` | `adoptopenjdk8-jre` |
| OpenJDK8 with OpenJ9 JVM | `adoptopenjdk8-openj9` | `adoptopenjdk8-openj9-jre` |
| OpenJDK9 with Hotspot JVM | `adoptopenjdk9` | n/a |
| OpenJDK10 with Hotspot JVM | `adoptopenjdk10` | n/a |
| OpenJDK11 with Hotspot JVM | `adoptopenjdk11` | `adoptopenjdk11-jre` |
| OpenJDK11 with OpenJ9 JVM | `adoptopenjdk11-openj9` | `adoptopenjdk11-openj9-jre` |
| OpenJDK12 with Hotspot JVM | `adoptopenjdk12` | `adoptopenjdk12-jre` |
| OpenJDK12 with OpenJ9 JVM | `adoptopenjdk12-openj9` | `adoptopenjdk12-openj9-jre` |
| OpenJDK13 with Hotspot JVM | `adoptopenjdk13` | `adoptopenjdk13-jre` |
| OpenJDK13 with OpenJ9 JVM | `adoptopenjdk13-openj9` | `adoptopenjdk13-openj9-jre` |
| OpenJDK14 with Hotspot JVM | `adoptopenjdk14` | `adoptopenjdk14-jre` |
| OpenJDK14 with OpenJ9 JVM | `adoptopenjdk14-openj9` | `adoptopenjdk14-openj9-jre` |
| OpenJDK15 with Hotspot JVM | `adoptopenjdk15` | `adoptopenjdk15-jre` |
| OpenJDK15 with OpenJ9 JVM | `adoptopenjdk15-openj9` | `adoptopenjdk15-openj9-jre` |
| OpenJDK16 with Hotspot JVM | `adoptopenjdk16` | `adoptopenjdk16-jre` |
| OpenJDK16 with OpenJ9 JVM | `adoptopenjdk16-openj9` | `adoptopenjdk16-openj9-jre` |

#### 2\. 저장소 연결

```console
$ brew tap AdoptOpenJDK/openjdk
```

#### 3\. 특정 버전 설치

```console
$ brew install --cask adoptopenjdk15
```

#### 4\. 설치 확인

```console
$ ls -ll /Library/Java/JavaVirtualMachines
total 0
drwxr-xr-x  3 root  wheel  96  1 22  2021 adoptopenjdk-15.jdk
drwxr-xr-x  3 root  wheel  96  4 21  2021 adoptopenjdk-8.jdk
drwxr-xr-x@ 3 june  admin  96 11 27 18:14 adoptopenjdk-9.jdk
drwxr-xr-x  3 root  wheel  96 11 26 07:39 jdk1.8.0_311.jdk
```

### jenv로 자바 버전 변경을 쉽게 하기

#### 1\. jenv 설치

```console
$ brew install jenv
```

#### 2\. jenv 설정

```console
// jenv 설정 zshrc 에 추가
$ echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
$ echo 'eval "$(jenv init -)"' >> ~/.zshrc

// zshrc에 설정 적용
$ source ~/.zshrc
```

#### 3\. jenv에 설치한 자바 버전 추가

```console
$ jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home
openjdk64-15.0.2 added
15.0.2 added
15.0 added
```

#### 4\. jenv에 추가되었는지 확인

```console
// 현재 사용 중인 버전에 * 표시가 추가됨
$ jenv versions               
  system
  1.8
  1.8.0.292
  15
  15.0
  15.0.2
* openjdk64-1.8.0.292
  openjdk64-15.0.2 (set by /Users/june/.jenv/version)
```

#### 5\. 자바 버전 변경

```console
$ jenv global openjdk64-15.0.2
```

#### 6\. 버전이 정상적으로 적용된 것을 확인

```console
$ java -version
openjdk version "15.0.2" 2021-01-19
OpenJDK Runtime Environment AdoptOpenJDK (build 15.0.2+7)
OpenJDK 64-Bit Server VM AdoptOpenJDK (build 15.0.2+7, mixed mode, sharing)
```

### ※ 참고

#### 특정 자바 버전 설치 경로 확인

```console
$ /usr/libexec/java_home -v 15
/Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home
```

#### 설치한 자바 목록과 설치 경로 확인

```console
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (2):
    15.0.2 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 15" /Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home
    1.8.0_292 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 8" /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
```

## References

-   [https://stackoverflow.com/a/24657630/12364882](https://stackoverflow.com/a/24657630/12364882)
-   [https://superuser.com/a/1603852](https://superuser.com/a/1603852)
-   [https://co-de.tistory.com/11](https://co-de.tistory.com/11)
