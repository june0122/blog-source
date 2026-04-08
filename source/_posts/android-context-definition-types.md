---
title: "[Android] Context의 정의와 종류, 예시"
date: 2022-04-15T14:41:48.000Z
categories:
  - Android
  - Guide
tags:
  - Kotlin
  - Algorithm
  - BOJ
  - BFS
---

안드로이드 개발에서 `Context`는 `Context.getString(…)`을 통해 _strings.xml_의 문자열 리소스를 가져올 때나 View와 관련된 작업을 별도의 클래스나 함수로 분리하기 위해 파라미터로 Context를 넘기는 등 애플리케이션 내에서 매우 광범위하게 사용된다.

광범위하게 사용된다는 말은 라이프 사이클을 고려해야 된다는 것과 이어질 수 있는데, `Context`는 잘못 사용하면 **애플리케이션의 메모리 누수**를 발생시킬 수 있으므로 매우 주의해야 한다! Context가 필요한데 이것을 어디에서 땡겨와야할지 고민하다가 잘못된 Context를 참조하는 경우가 발생할 수 있는데, 이 글을 통해 Context의 개념에 대해 정의하고 내가 개발하면서 어떤 Context를 참조해야할지 고민되었던 코드를 예시로 정리하고자 한다.

<!-- more -->
## Context의 정의

먼저 안드로이드 공식 문서의 [Context](https://developer.android.com/reference/kotlin/android/content/Context)의 정의를 살펴보고 가자.

```kotlin
abstract class Context
```

> Interface to global information about an application environment. This is an abstract class whose implementation is provided by the Android system. It allows access to application-specific resources and classes, as well as up-calls for application-level operations such as launching activities, broadcasting and receiving intents, etc.

> 애플리케이션 환경의 전역 정보에 대한 인터페이스. 안드로이드 시스템에서 구현을 제공하는 추상 클래스이다. 이를 통해 애플리케이션 특화 리소스 및 클래스에 대한 액세스할 수 있을 뿐만 아니라 액티비티 시작, 브로드캐스팅 및 인텐트 수신과 같은 애플리케이션 수준 작업에 대한 호출을 허용한다.

간단히 번역해봐도 정의가 확 와닿는 느낌은 아니다 [stackoverflow](https://stackoverflow.com/a/3572553/12364882)에서 설명하는 context의 정의를 살펴보자.

> the context of the current state of the application/object.

> 애플리케이션 또는 객체의 현재 상태에 대한 맥락(context)

Context는 **애플리케이션과 액티비티에 대한 정보를 얻기 위해 사용**하는 것이라고 이해해두자.

## Context의 종류

![](https://user-images.githubusercontent.com/39554623/163524765-23a06e4b-b01a-4158-a3d2-a04ff7d21eba.png)

#### 1\. Application Context(애플리케이션 컨텍스트)

Application Context는 싱글턴 인스턴스이며 액티비티에서 `getApplicationContext()`를 통해 접근할 수 있다. 이 Context는 애플리케이션의 라이프 사이클과 연결되어 있으며, Application Context는 현재의 Context와 분리된 라이프 사이클을 가진 Context가 필요할 때나 액티비티의 범위를 넘어서 Context를 전달할 때 사용한다.

#### 2\. Activity Context(액티비티 컨텍스트)

Activity Context는 액티비티에서 사용 가능하며, 이 Context는 액티비티의 라이프 사이클과 연결되어 있다. 액티비티의 범위 내에서 Context를 전달하거나, 라이프 사이클이 현재의 Context에 attach된 Context가 필요할 때 Activity Context를 사용할 수 있다.

## Context 관련 메서드들

-   `View.getContext()`
    -   현재 실행되고 있는 View의 context를 리턴하는데 보통은 현재 활성화된 액티비티의 context가 된다.
-   `Activity.getApplicationContext()`
    -   애플리케이션의 context가 리턴된다.
    -   현재 액티비티의 context 뿐만 아니라 애플리케이션의 라이프 사이클에 해당하는 context가 사용된다.
-   `ContextWrapper.getBaseContext()`
    -   자신의 Context가 아닌 다른 Context에 접근하려 할 때 사용한다.
    -   ContextWrapper는 getBaseContext()를 경유해서 Context를 참조할 수 있다.
-   `this`
    -   `Context`를 상속하는 `Application`, `Activity`, `Service`, `IntentService`와 같은 클래스들 내부에서 context를 참조할 때 사용할 수 있다.

## getContext() & requireContext()

```java
/* Fragment.java */

// Host this fragment is attached to.
FragmentHostCallback<?> mHost;

@Nullable
public Context getContext() {
    return mHost == null ? null : mHost.getContext();
}

@NonNull
public final Context requireContext() {
    Context context = getContext();
    if (context == null) {
        throw new IllegalStateException("Fragment " + this + " not attached to a context.");
    }
    return context;
}
```

#### getContext()

[FragmentHostCallback](https://developer.android.com/reference/androidx/fragment/app/FragmentHostCallback.html)의 정의를 보면 `mHost`는 현재 프래그먼트가 attach되어있는 Activity와 연관된 코드로 보여지는데 `getContext()`는 `@Nullable` 어노테이션이 붙어있는 메서드로 attach되어있는 Activity, 즉 `mHost`가 null일 경우에 `getContext()`도 null을 반환한다.

#### requireContext()

안드로이드에서 메서드 이름이 _require…_ 로 시작할 때, 그 메서드는 non-null 처리가 된 메서드일 확률이 높다.

`requireContext()`의 정의를 보면 실제로 `@NonNull` 어노테이션이 붙어있고, `getContext()`에서 반환된 context가 null인 경우 `IllegalStateException`를 던진다. 따라서 `requireContext()`를 사용하면 **Context가 null이 아님을 보장**할 수 있다.

## Context 사용 예시

실제로 프로젝트를 진행하면서 `Context`를 참조하는 코드들을 약간 간략화하여 소개하고자 한다. 다음 코드는 영상들을 보여주는 RecyclerView의 ViewHolder 클래스에서 조회수를 보여주는 TextView의 내용을 설정하는 코드다.

### 액티비티나 프래그먼트 이외의 클래스 내부에서의 Context 참조

```kotlin
class VideoViewHolder(private val binding: ItemVideoBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(videoInfo: VideoInfo) = with(binding) {
        tvViewCount.text = "조회수 ${videoInfo.viewCount}회" // Do not concatenate text... 경고 발생
        ...
    }
}
```

RecyclerView의 ViewHolder 클래스 내부에서 `TextView.setText(…)`를 할 때, 다음과 같이 작성하면 _Do not concatenate text displayed with setText. Use resource string with placeholders._ 라는 경고가 뜨기에 [`Context.getString(…)`을 이용한 방법](https://june0122.github.io/2021/05/18/android-memo-text-concatenatation/)을 사용해야 한다. 그런데 Activity나 Fragment 클래스 내부도 아닌 ViewHolder 클래스 내부에서 Context를 어떻게 참조할 수 있을까?

정답은 `View.getContext()`를 이용하는 것이다. View로부터 context를 받아올 수 있는데 [ViewHolder 클래스](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.ViewHolder)는 생성자의 파라미터로 `itemView`를 넘겨받아 내부의 필드로 가지고 있다. `View` 타입인 `itemView`로부터 `getContext()`를 이용하여 `Context`를 받아오는 것이다.

```kotlin
class VideoViewHolder(private val binding: ItemVideoBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(videoInfo: VideoInfo) = with(binding) {
        tvViewCount.text = itemView.context.getString(R.string.view_count, videoInfo.viewCount) // itemView를 통해 context 접근
        ...
    }
}
```

### 외부의 함수에서 Context 참조

유틸 함수들이 정의된 _Extensions.kt_ 파일 내부에 영상이 업로드 후 얼마나 경과되었는지를 문자열로 반환해주는 확장 함수 `timeAgo(…)`를 살펴보자.

별개의 파일로 정의된 유틸 함수들은 파라미터로 넘겨 받는 방법으로 `Context`를 참조할 수 있다. 참고로 ViewHolder 클래스 내부에서 `itemView.context`로도 context를 얻을 수 있지만 ViewBinding을 사용하는 아래의 코드에서는 `binding.root.context`를 통해서도 context를 얻을 수 있다.

```kotlin
class VideoViewHolder(private val binding: ItemVideoBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(videoInfo: VideoInfo) = with(binding) {
        ...   
        tvElapsedTime.text = videoInfo.publishedAt.timeAgo(binding.root.context) // itemView 대신 bind.root도 사용 가능
    }
}

// Extensions.kt
fun String.timeAgo(context: Context): String { // Context를 파라미터로 넘겨주자.
    ...
    val diff = now - time

    return when {
        diff < MINUTE_MILLIS -> context.getString(R.string.moments_ago)
        ...
        else -> context.getString(R.string.years_ago, diff / YEAR_MILLIS)
    }
}
```

### 외부의 클래스에서 Context 참조 : getContext() & requireContext()

위에서 정리한 `getContext()`와 `requireContext()`를 사용하는 실제 예시가 되겠다.

#### getContext() 사용

`getContext()`는 null을 반환할 수 있기 때문에 코틀린에서 그냥 `context`를 클래스에 넘겨줘버리면 파리미터의 타입을 `Context?`로 nullable하게 변경하라는 에러가 발생한다.

![](https://user-images.githubusercontent.com/39554623/163517912-75511dc0-b348-4dc9-b605-82a119460552.png)

그렇기 때문에 `context`를 넘겨줄려면 아래의 코드처럼 작성해야 한다.

```kotlin
class HomeFragment : Fragment() {

    override fun onCreateView(…): View { … }

    override fun onViewCreated(…) { … }

    private fun configureSmoothScroller(position: Int) {
        val smoothScroller = CenterSmoothScroller(context)
        ...
    }
}

class CenterSmoothScroller(context: Context?) : LinearSmoothScroller(context) {
    override fun calculateDtToFit(…): Int { … }
    ...
}
```

#### requireContext() 사용

`requireContext()`는 null을 반환하지 않는 메서드이기 때문에 파라미터의 타입을 `Context?`로 변경하지 않아도 된다.

```kotlin
class HomeFragment : Fragment() {

    override fun onCreateView(…): View { … }

    override fun onViewCreated(…) { … }

    private fun configureSmoothScroller(position: Int) {
        val smoothScroller = CenterSmoothScroller(requireContext())
        ...
    }
}

class CenterSmoothScroller(context: Context) : LinearSmoothScroller(context) {
    override fun calculateDtToFit(…): Int { … }
    ...
}
```

## 정리

-   Context의 정의 : 애플리케이션 또는 객체의 현재 상태에 대한 맥락, 애플리케이션과 액티비티에 대한 정보를 얻기 위해 사용
-   Context의 종류
    -   Application Context(애플리케이션 컨텍스트)
    -   Activity Context(액티비티 컨텍스트)
-   getContext() & requireContext()
    -   getContext(): attach되어있는 Activity가 null일 경우에 null을 반환
    -   requireContext(): 반환하는 Context가 null이 아님을 보장

## References

-   Android Docs : [https://developer.android.com/reference/kotlin/android/content/Context](https://developer.android.com/reference/kotlin/android/content/Context)
-   MindOrks : [https://blog.mindorks.com/understanding-context-in-android-application-330913e32514](https://blog.mindorks.com/understanding-context-in-android-application-330913e32514)
-   Stackoverflow : [https://stackoverflow.com/questions/3572463/what-is-context-on-android](https://stackoverflow.com/questions/3572463/what-is-context-on-android)
-   [https://shinjekim.github.io/android/2019/11/01/Android-context%EB%9E%80/](https://shinjekim.github.io/android/2019/11/01/Android-context%EB%9E%80/)
-   [https://4z7l.github.io/2020/11/22/android-getcontext-requirecontext.html](https://4z7l.github.io/2020/11/22/android-getcontext-requirecontext.html)
