---
title: "AGP 9.0 마이그레이션 — KMP 프로젝트 구조 재설계"
date: 2026-03-27
categories:
  - Kotlin Multiplatform
tags:
  - Android
  - KMP
  - AGP
  - Gradle
  - migration
---

> **요약**
> Kotlin Multiplatform + Compose Multiplatform 프로젝트를 AGP 8.7.3에서 9.0.0으로 마이그레이션하면서 겪은 과정과 핵심 변경점을 정리한다.


<!-- more -->

## 배경

기존 Dayflow 프로젝트는 AI를 통해 명세를 작성하고 한 번에 코드를 생성한 결과물이었다. 기술 스택이나 구조에 대한 이해 없이 만들어진 코드라 유지보수가 어려웠고, 다음과 같은 방향으로 재구성하기로 결정했다:

1. AGP 9.0으로 업그레이드
2. 로컬 저장소를 SQLDelight에서 Room (KMP)으로 전환
3. 불필요한 모듈을 삭제하고 간단한 피쳐(Plan CRUD)부터 점진적으로 확장

## 버전 변경 요약

| 항목 | Before | After |
|------|--------|-------|
| Android Gradle Plugin | 8.7.3 | **9.0.0** |
| Kotlin | 2.1.0 | **2.3.20-Beta1** |
| Gradle | 8.9 | **9.1.0** |
| Compose Multiplatform | 1.7.1 | **1.10.0** |
| compileSdk / targetSdk | 35 / 34 | **36 / 36** |
| 로컬 DB | SQLDelight 2.0.2 | **Room 2.8.4 (KMP)** |
| KSP | 2.1.0-1.0.29 | **2.3.6** |

---

## 핵심 변경 1: 앱 모듈 분리

### AGP 9.0의 강제 규칙

AGP 9.0에서 가장 큰 변화는 다음 한 줄로 요약된다:

> **⚠️ 호환성 파괴**
> `com.android.application`과 `kotlin.multiplatform`을 같은 모듈에 적용할 수 없다.

기존에는 하나의 `:app` 모듈에 두 플러그인을 함께 적용해서 APK 생성과 KMP 공유 코드를 모두 관리했다. AGP 9.0부터는 이를 분리해야 한다.

### Before (AGP 8.x)

```kotlin
// :app/build.gradle.kts — 하나의 모듈이 모든 역할
plugins {
    id("com.android.application")   // APK 생성
    id("org.jetbrains.kotlin.multiplatform")  // KMP 공유 코드
}
```

하나의 `:app` 모듈 안에 `MainActivity.kt`, `AndroidManifest.xml` (Android 진입점)과 `DayflowApp.kt` (Compose 루트), `MainViewController.kt` (iOS 진입점)이 모두 공존했다.

### After (AGP 9.0)

```
:androidApp  ← 순수 Android 앱 (APK 생성만)
:app         ← KMP 공유 라이브러리 (Compose UI, 네비게이션, DI)
```

**`:androidApp`** — 순수 Android 모듈. 3개 파일만 존재한다:

```kotlin
// androidApp/build.gradle.kts
plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
}

kotlin {
    dependencies {
        implementation(projects.app)
        implementation(libs.androidx.activity.compose)
        implementation(libs.koin.android)
    }
}
```

```kotlin
// MainActivity.kt — setContent 한 줄이 핵심
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { DayflowApp() }  // KMP 모듈의 Composable 호출
    }
}
```

**`:app`** — KMP 공유 라이브러리. 모든 Compose UI, 네비게이션, DI 그래프가 여기에 있다:

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidMultiplatformLibrary)  // ← 새 플러그인
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
}
```

### 왜 분리를 강제했는가?

두 플러그인의 관심사가 근본적으로 다르기 때문이다:

- `com.android.application`: APK 패키징, signing, ProGuard/R8, build variants(debug/release, productFlavors), resource/manifest merging
- `kotlin.multiplatform`: 여러 타겟 컴파일, expect/actual, iOS framework 생성, source set 계층(commonMain/androidMain/iosMain)

AGP 8.x에서 이 둘이 한 모듈에 공존하면서 발생한 문제들:

1. **Build Variant 충돌** — KMP는 단일 소스셋을 기대하는데, Android application은 variant별로 분기한다. 내부 변환 레이어가 복잡해지고 엣지 케이스에서 빌드가 깨졌다.
2. **빌드 성능 저하** — APK 변경 시 KMP 전체 타겟이 재평가되고, iOS를 안 쓰더라도 관련 task가 configure 단계에서 실행됐다.
3. **ClassCastException** — AGP와 KGP가 서로의 내부 타입을 캐스팅하면서 런타임 충돌이 발생했다. (실제로 이번 마이그레이션 중에도 `KotlinMultiplatformAndroidCompilationImpl cannot be cast to KotlinJvmAndroidCompilation` 에러를 경험했다.)

> **💡 핵심 원리**
> 분리하면 각 플러그인이 자기 역할에만 집중하고, 빌드 캐시도 독립적으로 동작한다. 빌드 시스템 레벨의 **단일 책임 원칙**이다.

---

## 핵심 변경 2: 새 KMP 라이브러리 플러그인

### 플러그인 교체

KMP 라이브러리 모듈(`core/*`, `feature/*`)에서 기존 `com.android.library`가 새 플러그인으로 대체된다:

```
com.android.library                    → (삭제)
com.android.kotlin.multiplatform.library → (신규)
```

```kotlin
// Before (AGP 8.x)
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.multiplatform")
}

// After (AGP 9.0)
plugins {
    alias(libs.plugins.kotlinMultiplatform)          // kotlin.multiplatform
    alias(libs.plugins.androidMultiplatformLibrary)  // com.android.kotlin.multiplatform.library
}
```

### Android 설정 DSL 변경

별도의 `android {}` 최상위 블록이 사라지고, `kotlin { androidLibrary {} }` 안으로 통합된다:

```kotlin
// Before (AGP 8.x)
kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_11)
        }
    }
    iosArm64()
    jvm()
}

android {                           // ← 별도 최상위 블록
    namespace = "com.dayflow.core.ui"
    compileSdk = 35
    defaultConfig {
        minSdk = 26                 // ← defaultConfig 안에 중첩
    }
}
```

```kotlin
// After (AGP 9.0)
kotlin {
    androidLibrary {                // ← kotlin {} 안으로 통합
        namespace = "com.dayflow.core.ui"
        compileSdk = 36
        minSdk = 26                 // ← 직접 접근 (defaultConfig 없음)
    }
    iosArm64()
    jvm()
}
// ❌ android {} 최상위 블록 없음
```

### Single Variant 제한

> **⚠️ 제약사항**
> 새 플러그인은 **단일 빌드 변형**만 지원한다. KMP 모듈 내에서 Product Flavor나 Build Type을 설정할 수 없다. `debugImplementation` 대신 `androidRuntimeClasspath`를 사용해야 한다.

### 리소스 활성화

Android 리소스 사용이 기본 비활성화다. 필요한 경우 명시적으로 활성화해야 한다:

```kotlin
kotlin {
    androidLibrary {
        androidResources {
            enable = true
        }
    }
}
```

---

## 핵심 변경 3: SQLDelight → Room KMP

MVP 단계에서 로컬 전용이므로 Room KMP(2.8.4)로 전환했다.

### Room KMP 설정

```kotlin
// core/data/build.gradle.kts
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidMultiplatformLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
}

room {
    schemaDirectory("$projectDir/schemas")
}

// Room KSP — 타겟별로 추가해야 함
dependencies {
    add("kspAndroid", libs.room.compiler)
    add("kspIosX64", libs.room.compiler)
    add("kspIosArm64", libs.room.compiler)
    add("kspIosSimulatorArm64", libs.room.compiler)
    add("kspJvm", libs.room.compiler)
}
```

### Entity / DAO / Database

`commonMain`에 작성하면 모든 플랫폼에서 공유된다:

```kotlin
// PlanEntity.kt
@Entity(tableName = "plan")
data class PlanEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val startDate: String,    // ISO-8601 date
    val endDate: String?,
    val createdAt: Long,
    val updatedAt: Long,
)

// PlanDao.kt
@Dao
interface PlanDao {
    @Query("SELECT * FROM plan ORDER BY startDate ASC")
    fun observeAll(): Flow<List<PlanEntity>>

    @Upsert
    suspend fun upsert(plan: PlanEntity)

    @Query("DELETE FROM plan WHERE id = :id")
    suspend fun deleteById(id: String)
}

// DayflowDatabase.kt
@Database(entities = [PlanEntity::class], version = 1)
abstract class DayflowDatabase : RoomDatabase() {
    abstract fun planDao(): PlanDao
}
```

### 플랫폼별 Database 생성

Room의 `RoomDatabase.Builder`는 플랫폼별로 다르게 생성해야 한다. Koin 모듈로 분리했다:

```kotlin
// androidMain — AndroidDatabaseModule.kt
val androidDatabaseModule = module {
    single<DayflowDatabase> {
        val context = androidContext()
        Room.databaseBuilder<DayflowDatabase>(
            context = context,
            name = context.getDatabasePath("dayflow.db").absolutePath,
        )
            .setDriver(BundledSQLiteDriver())
            .setQueryCoroutineContext(Dispatchers.IO)
            .build()
    }
}

// iosMain — IosDatabaseModule.kt
val iosDatabaseModule = module {
    single<DayflowDatabase> {
        Room.databaseBuilder<DayflowDatabase>(
            name = NSHomeDirectory() + "/Documents/dayflow.db",
        )
            .setDriver(BundledSQLiteDriver())
            .setQueryCoroutineContext(Dispatchers.IO)
            .build()
    }
}
```

---

## 마이그레이션 중 겪은 삽질들

### 1. Compose Multiplatform 플러그인과 새 KMP 라이브러리 플러그인의 호환성

처음에는 `org.jetbrains.compose` 플러그인 없이 Compose 의존성을 직접 추가하는 방식을 시도했다. Material Icons 등 일부 라이브러리의 Maven 좌표가 달라서 해결이 어려웠다.

> **✅ 결론**
> `composeMultiplatform` 플러그인을 그대로 사용하되, version catalog로 직접 의존성을 지정하는 하이브리드 방식이 가장 안정적이었다. 플러그인의 `compose.*` accessor는 deprecated지만 `compose.materialIconsExtended`처럼 직접 좌표를 찾기 어려운 경우 유용하다.
>
> 이 문제는 CMP 의존성 선언 방식 - libs.versions.toml vs compose accessor에서 더 자세히 다룬다.

### 2. Convention Plugin에서 `androidLibrary {}` 호출 불가

`androidLibrary {}`는 `com.android.kotlin.multiplatform.library` 플러그인이 런타임에 추가하는 확장 함수다. Convention plugin 컴파일 시점에는 이 함수가 존재하지 않는다.

> **✅ 결론**
> Convention plugin은 플러그인 적용과 공통 의존성 정도만 담당하고, `kotlin { androidLibrary {} }` 같은 플러그인 특화 DSL은 각 모듈의 `build.gradle.kts`에서 직접 작성한다.

### 3. AGP 9.0 내장 Kotlin으로 인한 플러그인 충돌

AGP 9.0은 Kotlin을 내장하고 있어서, `com.android.library` + `kotlin.multiplatform` 조합 시 `kotlin` 확장이 두 번 등록되면서 `Cannot add extension with name 'kotlin'` 에러가 발생했다.

> **✅ 결론**
> KMP 라이브러리 모듈에서는 반드시 `com.android.kotlin.multiplatform.library`를 사용해야 한다. `com.android.library`는 더 이상 `kotlin.multiplatform`과 호환되지 않는다.

### 4. `compilerOptions { jvmTarget }` deprecated

`androidLibrary {}` 블록 안의 `compilerOptions`는 deprecated다. 제거하면 정상 동작한다.

### 5. KSP 버전 체계 변경

KSP 2.3부터 Kotlin 버전과 분리된 독립 버전 체계를 사용한다. 기존 `2.1.0-1.0.29` 같은 형식 대신 `2.3.6`처럼 단독 버전을 사용한다.

---

## 최종 프로젝트 구조

```
dayflow/
├── androidApp/              ★ NEW — 순수 Android 앱 (APK)
│   ├── build.gradle.kts        com.android.application
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── MainActivity.kt
│       └── DayflowApplication.kt
│
├── app/                     ★ CHANGED → KMP 공유 라이브러리
│   ├── build.gradle.kts        kotlinMultiplatform + androidMultiplatformLibrary
│   └── src/
│       ├── commonMain/            DayflowApp.kt, AppDiGraph.kt
│       └── iosMain/               MainViewController.kt
│
├── core/
│   ├── domain/              Plan 모델 + PlanRepository 인터페이스
│   ├── data/                ★ SQLDelight → Room 2.8.4 (KMP)
│   │   └── src/
│   │       ├── commonMain/        PlanEntity, PlanDao, DayflowDatabase
│   │       ├── androidMain/       AndroidDatabaseModule (Koin)
│   │       └── iosMain/           IosDatabaseModule (Koin)
│   └── ui/                  DayflowTheme
│
├── feature/
│   └── plan/                Plan CRUD (리스트 + 달력 뷰)
│       └── src/commonMain/
│           ├── PlanListScreen.kt
│           ├── PlanCalendarView.kt
│           ├── CreatePlanScreen.kt
│           ├── PlanListViewModel.kt
│           ├── CreatePlanViewModel.kt
│           └── di/PlanModule.kt
│
├── server/                  유지 (Ktor backend)
└── shared/                  유지 (SQLDelight offline sync)
```

## 마이그레이션 체크리스트

### 필수 변경

- [x] 앱 모듈을 `androidApp` (순수 Android) + `app` (KMP 라이브러리)으로 분리
- [x] `com.android.library` → `com.android.kotlin.multiplatform.library`로 교체
- [x] `androidTarget {}` → `androidLibrary {}` DSL 변경
- [x] `android {}` 최상위 블록 제거 → `kotlin { androidLibrary {} }` 안으로 통합
- [x] `defaultConfig.minSdk` → `minSdk` 직접 접근
- [x] `kotlin.android` 플러그인 제거 (AGP 9.0 내장)
- [x] Gradle 9.1.0 이상으로 업그레이드

### 주의사항

> **⚠️ 알아두기**
> - Single Variant 제한 — debug/release 분기 불가, `debugImplementation` → `androidRuntimeClasspath`
> - `androidResources { enable = true }` 명시 필요 (기본 비활성화)
> - `compilerOptions { jvmTarget }` deprecated — 제거
> - Android Studio Quartz (2025.4.1) 이상 필요
> - CMP `compose.*` accessor deprecated — version catalog 직접 지정 권장
> - material3 좌표: `org.jetbrains.compose.material3:material3` (그룹명 주의)
> - KSP 2.3+는 독립 버전 체계 사용

## 참고 자료

- [Updating multiplatform projects with Android apps to use AGP 9 — Kotlin Docs](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html)
- [Update your Kotlin projects for AGP 9 — JetBrains Blog](https://blog.jetbrains.com/kotlin/2026/01/update-your-projects-for-agp9/)
- [MovingBuildTypesToNewLibraryAgp9 — zsmb13 GitHub](https://github.com/zsmb13/MovingBuildTypesToNewLibraryAgp9)
- [Set up the Android Gradle Library Plugin for KMP — Android Developers](https://developer.android.com/kotlin/multiplatform/plugin)
