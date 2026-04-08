---
title: "CMP 의존성 선언 방식 — libs.versions.toml vs compose accessor"
date: 2026-03-27
categories:
  - Kotlin Multiplatform
tags:
  - KMP
  - Compose Multiplatform
  - Gradle
  - troubleshooting
---

> **요약**
> Compose Multiplatform(CMP) 프로젝트에서 `libs.compose.material3`로 의존성을 선언했더니 IDE에서 `import androidx.compose.material3.Card`를 인식하지 못했다. 빌드는 성공하는데 IDE만 빨간 줄 — 원인과 해결을 정리한다.

## TL;DR

```
문제:  직접 지정한 버전(1.11.0-alpha02)이
       CMP 플러그인 버전(1.10.0)과 불일치
       → iOS용 artifact가 해당 버전에 존재하지 않음
       → commonMain 의존성 해석 실패
       → IDE에서 모든 Compose import 인식 불가

해결:  compose.material3 accessor 사용
       → 플러그인이 자기 버전에 맞는 타겟별 좌표를 자동 매핑
       → 모든 타겟에서 해석 성공
```


<!-- more -->

## 증상

- `./gradlew :androidApp:assembleDebug` → **BUILD SUCCESSFUL**
- 하지만 IDE에서 `import androidx.compose.material3.*` → **Unresolved reference**
- Gradle 로그에 `KMP Dependencies Resolution Failure` 경고 다수 발생

```
e: ❌ KMP Dependencies Resolution Failure
Source set 'commonMain' couldn't resolve dependencies for all target platforms
Couldn't resolve dependency 'org.jetbrains.compose.material3:material3' in 'commonMain'
```

## 원인 분석

### Compose Multiplatform 라이브러리의 실체

`org.jetbrains.compose.material3:material3`는 **실제 코드가 들어있는 라이브러리가 아니다.** 각 KMP 타겟(Android, iOS, JVM 등)별로 존재하는 플랫폼 전용 artifact로 연결해주는 메타데이터 역할을 한다.

```
org.jetbrains.compose.material3:material3  (메타 라이브러리)
    │
    ├── Android → androidx.compose.material3:material3:x.x.x
    ├── iOS     → 내부 iOS 전용 빌드 artifact
    ├── JVM     → 내부 Desktop 전용 빌드 artifact
    └── ...
```

> **핵심**
> 이 매핑은 **CMP 플러그인 버전에 의해 결정**된다. CMP 1.10.0 플러그인은 1.10.0에 맞는 내부 artifact 좌표를 알고 있다.

### 버전 불일치가 만든 문제

`gradle/libs.versions.toml`에서 material3를 다음과 같이 선언했다:

```toml
compose-material3 = { module = "org.jetbrains.compose.material3:material3", version = "1.11.0-alpha02" }
```

CMP 플러그인은 **1.10.0**인데, material3만 **1.11.0-alpha02**를 직접 지정한 상황이다.

```
CMP 플러그인 버전: 1.10.0
material3 지정 버전: 1.11.0-alpha02

이 버전의 artifact 존재 여부:
  ✅ Android용 (Maven Central에 존재)
  ✅ JVM용 (Maven Central에 존재)
  ❌ iOS용 (존재하지 않음!)
```

### KMP commonMain의 의존성 해석 규칙

> **KMP 의존성 해석 규칙**
> KMP에서 `commonMain`에 선언된 의존성은 **프로젝트에 선언된 모든 타겟에서 해석 가능**해야 한다.

```kotlin
kotlin {
    androidLibrary { ... }
    iosX64()          // ← 이 타겟에서도 해석 가능해야 함
    iosArm64()        // ← 이 타겟에서도
    iosSimulatorArm64()
    jvm()

    sourceSets {
        commonMain.dependencies {
            // 여기 선언된 의존성은 위 5개 타겟 모두에서 해석되어야 함
            implementation(libs.compose.material3)  // ← iOS에서 실패!
        }
    }
}
```

Android 빌드만 실행하면 Android 타겟용 artifact가 있으니 빌드는 성공한다. 하지만 IDE는 `commonMain`의 의존성 해석 결과를 사용하므로, 하나의 타겟이라도 실패하면 **IDE에서 해당 의존성의 모든 import가 인식 불가**가 된다.

```
Gradle 빌드 (:androidApp:assembleDebug)
  → Android 타겟만 컴파일
  → material3 Android artifact 존재
  → ✅ BUILD SUCCESSFUL

IDE 인덱싱 (commonMain)
  → 모든 타겟에서 의존성 해석 시도
  → iOS용 artifact 없음
  → ❌ Resolution Failure
  → import androidx.compose.material3.* 빨간 줄
```

## 해결: compose accessor 사용

### Before (직접 좌표 지정)

```kotlin
// build.gradle.kts
commonMain.dependencies {
    implementation(libs.compose.material3)
    // → "org.jetbrains.compose.material3:material3:1.11.0-alpha02"
    // → Gradle이 Maven에서 이 정확한 좌표를 찾음
    // → iOS용 없으면 실패
}
```

### After (플러그인 accessor 사용)

```kotlin
// build.gradle.kts
@Suppress("DEPRECATION")
commonMain.dependencies {
    implementation(compose.material3)
    // → 플러그인이 타겟별로 다른 좌표를 매핑:
    //   Android: "androidx.compose.material3:material3:1.4.0-alpha02"
    //   iOS:     "...material3-iosarm64:1.10.0-dev1855"
    //   JVM:     "...material3-jvm:1.10.0-dev1855"
}
```

`composeMultiplatform` 플러그인은 **자기 버전(1.10.0)에 맞는 내부 좌표 매핑 테이블**을 가지고 있다. `compose.material3`를 호출하면 현재 빌드 중인 타겟에 맞는 실제 artifact 좌표를 반환한다.

### `@Suppress("DEPRECATION")`이 필요한 이유

> **deprecated이지만 사용해야 하는 이유**
> CMP 1.10.0에서 `compose.runtime`, `compose.material3` 등의 accessor가 deprecated로 표시되었다. "직접 좌표를 지정하라"는 의미인데, 실제로는 위에서 본 것처럼 직접 지정하면 타겟별 artifact 매핑 문제가 생길 수 있다. deprecated 경고를 억제하고 accessor를 계속 사용하는 것이 현 시점에서 가장 안정적이다.

## 적용 범위

Compose 의존성을 사용하는 **모든 KMP 모듈**에서 동일하게 변경했다:

| 모듈 | 변경 대상 |
|------|----------|
| `:app` | runtime, foundation, material3, ui, components.resources |
| `:core:ui` | runtime, foundation, material3, ui, components.resources |
| `:core:data` | runtime |
| `:feature:plan` | runtime, foundation, material3, materialIconsExtended, ui |
| `:shared` | runtime, foundation, material3, components.resources |

## 핵심 정리

> **교훈**
> CMP 라이브러리는 플러그인 버전과 강하게 결합되어 있다. 개별 라이브러리만 다른 버전으로 올리면 타겟별 artifact 정합성이 깨진다. **버전을 올리려면 CMP 플러그인 자체를 올려야 한다.**

---

이 문제는 [AGP 9.0 마이그레이션 — KMP 프로젝트 구조 재설계](/2026/03/27/agp9-kmp-migration/) 작업 중 발견되었다.
