---
title: "Meaning of &#039;emit&#039; in Android Jetpack Compose"
date: 2021-09-02T14:25:12.689Z
categories:
  - Android
  - Compose
tags:
  - Android
  - Kotlin
  - Jetpack
  - Compose
---

Android Jetpack Compose의 공식 문서에서는 `emit`이라는 단어가 빈번히 등장합니다. `emit`은 _방출하다, 내보내다_라는 의미를 지니고 있는데 컴포저블에서 내보낸 UI를 누가 처리하는지, 애초에 내보낸다는 표현을 왜 쓰게 되었는지에 대해 명확한 설명이 없어 궁금증을 자아냅니다.

그래서 stackoverflow에 [What is the exact meaning of ‘emit’ in Android Jetpack Compose?](https://stackoverflow.com/questions/68798924/what-is-the-exact-meaning-of-emit-in-android-jetpack-compose/68825083#68825083)라는 질문을 올렸고 `Composables.kt` 내부의 소스 코드에 그에 대한 답이 있다는 것을 알게 되었습니다.

<!-- more -->
아래는 제 질문과 그에 대한 답변입니다.

## [](#question)Question

The word emit is often used in Jetpack Compose’s documentation or codelabs, as follows:

> The function doesn’t return anything. Compose functions that “emit” UI do not need to return anything, because they describe the desired screen state instead of constructing UI widgets.

What is the exact meaning of emit in Android Jetpack Compose?

Who handles the UI emitted by the Compose function? Does the Compose framework detect and process the emitted UI?

Is there documentation with information on how and by whom the emitted UI is handled?

## [](#answer-by-epicpandaforce)Answer by [EpicPandaForce](https://stackoverflow.com/a/68825083/12364882)

“Emit” means that Compose inserts a new group into the current composition.

See the [source code](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/runtime/runtime/src/commonMain/kotlin/androidx/compose/runtime/Composables.kt;l=245?q=applier%20compose&start=21):


```kotlin
@Suppress("NONREADONLY_CALL_IN_READONLY_COMPOSABLE", "UnnecessaryLambdaCreation")
@Composable inline fun <T : Any, reified E : Applier<*>> ReusableComposeNode(
    noinline factory: () -> T,
    update: @DisallowComposableCalls Updater<T>.() -> Unit
) {
    if (currentComposer.applier !is E) invalidApplier()
    currentComposer.startReusableNode()   // <--- EMITTING THE NODE
    if (currentComposer.inserting) {
        currentComposer.createNode { factory() }
    } else {
        currentComposer.useNode()
    }
    currentComposer.disableReusing()
    Updater<T>(currentComposer).update()
    currentComposer.enableReusing()
    currentComposer.endNode()
}
```


#[Android](/tags/Android/)[Kotlin](/tags/Kotlin/)[Jetpack](/tags/Jetpack/)[Compose](/tags/Compose/)
