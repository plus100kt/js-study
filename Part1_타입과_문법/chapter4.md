# 4. 강제변환
강제변환의 좋고 나쁨을 충분히 이해하고 자신의 프로그램에 적절한지 판단할 수 있는 역량을 갖추어야한다.

## 4.1 값변환
어떤 값을 다른 값으로 바꾸는 과정이 명시적이면 타입 캐스팅, 암시적이면 강제변환이라고 한다. 타입캐스팅의 경우 정적언어에서 컴파일 시점에, 강제변환은 동적 타입언에서 런타임 시점에 발생한다. 이때 타입변환은 명시적 강제변환이라고 명칭되기도한다.

명시적 강제변환은 코드를 봤을때 의도적으로 타입변환을 일으키는 사실이 명백한 반면 암시적 강제변환은 다른 작업 도중 불분명한 부수 효과로부터 발생한다.
```js
var a = 42;
var b = a + ""; // 암시적 강제변환
var c = String( a ); // 명시적 강제변환
```

## 4.2 추상연산
어떻게 값이 문자열, 숫자, 불리언 등의 타입이 되는지 변환규칙을 알아보자

**4.2.1 ToString**

문자열이 아닌값 -> 문자열로 변환해주는 로직이다. 배열은 기본적으로 재정의된 toString()이 있다. 문자열 변환시 모든 원소 값이 콤마(,)로 분리된 형태로 이어진다.

**JSON 문자열화**

JSON은 JSON.stringify() 유틸리티를 이용하여 문자열화 할수있다.
* 문자열화 과정중 인자가 undefined, 함수, 심벌 값이면 자동으로 누락시키며 만약 배열에 포함되어 있으면 null로 바꾼다. 만약 객체 프로퍼티에 있으면 지워버린다.
* 부적절한 JSON값이나 직렬화하기 곤란한 객체 값을 문자열화하려면 toJSON() 메서드를 따로 정의해야한다.
* 이때 toJSON은 문자열화하기 적당한 JSON 안전값으로 바꾸는 것이지 문자열로 바꾸는 것이 아니다! 실제 문자열화는 JSON.stringify()가 담당한다.
```js
var o = { };

var a = {
    b: 42,
    c: o,
    d: function() {}
};

// 'a'를 환형 참조 객체로 만든다.
o.e = a;

// 환형 참조 객체는 JSON 문자열화 시 에러가 난다
// JSON.stringify(a);

// JSON 값으로 직렬화하는 함수를 따로 정의한다.
a.toJSON = function() {
    // 직렬화에 프로퍼티 'b'만 포함시킨다.
    return { b: this.b };
}

JSON.stringify( a ); // "{"b": 42}"
```

* JSON.stringify()의 세번째 인자는 들여쓰기해주는 스페이스 개수이다.

**4.2.2 ToNumber**
* true는 1, false는 0, undefined는 NaN, null은 0으로 바뀐다.
* 반환이 실패하면 결과는 NaN이 된다.
* 동등한 원시 값으로ㅠ 바꾸기 위해 ToPrimitive 추상 연산 과정에서 해당 객체가 valueOf() 메서드를 구현 했는지 확인한다. valueOf()를 쓸 수 있고 반환 값이 원시 값이면 그대로 강제변환하되, 그렇지 않을경우 toString()을 이용하여 강제 변환한다.
* 어찌해도 원시값으로 변환할 수 없을때는 typeError 오류를 던진다.

**4.2.3 ToBoolean**

다른 언어와 달리 숫자와 불리언은 독립적 관계로서 서로 다르다. 자바스크립트의 모든 값들을 불리언으로 변환할때 나타나는 유형은 둘중 하나이다.
1. 불리언으로 강제변환하면 false가 되는 값
2. 1번을 제외한 나머지(명백한 true깂)

이때 불리언으로 변환시 false가 되는 몇안되는 경우를 알면 좋다
* undefined, null, false, +0, -0, NaN, "" 이 경우들이 falsy한 값이다.
* falsy한 값을 감싼 객체는 모두 true이다.

하지만 위의 경우와 다르게 falsy 객체라는게 존재하는데 불리언으로 강제변환할 시 false가 되는 객체가 있다.
* document.all과 같은 코드는 예전 방식의 비표준이지만 많이 사용되어 왔기에 falsy하게 만들어 사용을 억제한다.

## 4.3 명시적 강제변환
분명하고 확실한 타입변환이다.

**4.3.1 문자열 <-> 숫자**

보통 String()과 Number() 함수를 이용해 강제변환하는 경우가 대다수 이지만, toString()과 + 단항 연산자를 이용해 명시적 강제변환을 하기도 한다.
```js
var a = 42;
var b = a.toString(); // String(a);

var c = "3.14";
var d = +c; // Number(c);

b; // "42"
c; // 3.14
```

날짜 -> 숫자
* +단항 연산자를 이용해 변경한다.
```js
var timstamp = +new Date();
```
* 강제변환을 하지 않아도 타임스탬프를 얻는 방법이 있는데 이 방법이 더 권장할만하다
```js
var timestamp = Date.now();
```

**4.3.2 명시적 강제변환: 숫자 형태의 문자열 파싱**

문자열로부터 숫자 값의 파싱은 비 숫자형 문자가 있더라도 숫자 같지 않은 문자를 만나면 멈추기에 사용할 수 있지만, 강제변환은 비 숫자형 문자를 허용하지 않기에 NaN을 반환합니다.

하지만 파싱은 강제변환과 목적이 다르기에 대안이 될 수 없다.
* 파싱하는법 parseInt(문자열) => 숫자형문자만 출력

**4.3.3 명시적 강제변환: *->불리언**

비불리언 -> 불리언 강제변환은 Boolean()과 !!을 사용한다.

# 4.4 암시적 변환
암시적 변환은 부수 효과가 명확하지 않기에 유해하고 위험하다고 취급되어지지만 중요한 부분으로부터 주의를 분산시키고 코드를 잡동사니로 채우는 불필요한 구현을 줄이기위해 사용된다.

**4.4.2 암시적 강제변환: 문자열 <-> 숫자**

+연산자는 '숫자의 덧셈, 문자열 접합' 두 가지 목적으로 오버로드된다.
```js
var a = "42";
var b = "0";

var c = 42;
var d = 0;

a + b; // "420"
c + d; // 42
```

이 원리를 이용해 숫자 + ""로 숫자를 문자열로 만들 수 있는데 상세한 내용은 복잡하니 안 적을려고한다.

이처럼 문자열에서 숫자도 강제변환 가능한데 문자열 뒤에 - 0을 붙히면 변환 가능하다.
``` js
var a = 42; // 42
a = a + ""; // "42"

var b = "3.14"; // "3.14"
b = b - 0; // 3.14
```

**4.4.3 불리언 -> 숫자**

Onlyone() 은 세 인자중 하나만 true인지 아닌지 판단하는 함수인데 이를 논리적으로 처리하기 보다는 숫자로 변환해 더하는 방식이 더 합리적이다.

4.4.4 * -> 불리언
1. if () 문의 조건 표현식
2. for ( ; ; ) 에서 두 번째 조건 표현식
3. while() 및 do~while() 루프의 조건 표현식
4. ? : 삼항 연산 시 첫번째 조건의 표현식
5. || 및 && 의 좌측 피연산자

**4.4.5 &&와 || 연산자**

이것은 논리 연산자라 표현하기 보다는 선택 연산자로 보는 것이 이해하기 더 쉽다, 그 이유는 이 연산자들의 결과값이 반드시 불리언 타입이 아니라 어느 한쪽 값으로 귀결되기 때문이다

```js
var a = 42;
var b = "abc";
var c = null;

a || b; // 42
a && b; // "abc"

c || b; // "abc"
c && b; // null
```
둘의 작동 방식을 살펴보면 우선 첫번째 피연산자 (a, c)의 불리언 값을 평가한다. 피연산자가 비 불리언 타입이면 먼저 ToBoolean로 강제변환후 값을 평가한다.
* || 연산자는 그 결과가 true면 첫 번째 피연산자(a, c) 값을, false면 두 번째 피연산자(b) 값을 반환하다.
* && 연산자는 true면 두 번째 피연산자(b)의 값을, false면 첫번째 피연산자(a,c)의 값을 반환한다.

이를 쉽게 정리해 코드를 풀어 쓰면
``` js
a || b;
a ? a : b;

a && b;
a ? b : a;
```
이를 이용해 코드 압축도 가능하다 예를 들어 if (a) {foo();} 로 작성하기 보다는 a && foo() 처럼 처리하면 코드를 더 압축할 수 있다.

**4.4.6 심벌의 강제 변환**

강제 변환하지 않는 편이 좋다.

## 4.5 느슨한/엄격한 동등비교

느슨한 동등비교는 ==를 엄격한 동등비교는 ===를 사용한다. 이때 많은 이들은 "==는 값의 동등함을 ===는 값과 타입 모두의 동등함을 비교한다"라고 하는데 이는 사실이 아니라 아래가 진짜 정의다.
>동등함의 비교 시 ==는 강제변환을 허용하지만, ===는 강제변환을 허용하지 않는다.

**4.5.1 비교 성능**

위의 정의를 정리하면 강제변환이 필요하다면 느슨한 동등 연산자(==)를 필요없다면 엄격한 동등연산자(===)를 사용한다.

**4.5.2 추상 동등 비교** 

== 연산자 로직에는 가능한 타입별 조합마다 강제변환을 어떻게 수행하는지 그 방법이 적혀 있다. 첫째항부터 살펴보면 비교할 두 값이 같은 타입이면 간단히 대조하고 두 객체가 정확히 똑같은 값에 대한 레퍼런스일 경우에만 동등하다 이때 강제 변환은 일어나지 않는다.

하지만,  두 값의 타입이 다르면 암시적 강제변환 방법이 있다.

**비교하기: * -> 불리언**

어떤 값을 true/false와 직접 비교하려고 하면 --의 숨겨진 강제변환 함정에 빠지게 된다.
```js
var a = "42";
var b = true;
a == b; // false
```
이 오류를 자세히 살펴보기 위해 규칙을 살펴보면
1. Type(x)이 불리언이면 ToNumber(x) == y의 비교 결과를 반환한다.
2. Type(y)이 불리언이면 x == ToNumber(y)의 비교 결과를 반환한다.

위의 규칙에 의해 : true는 1로 강제변환되어 1 == 42가 되어 false가 됩고 true가 아니라 false 더라도 마찬가지입니다. 이는 "42"가 true도 false가 아닌 모순이 생기므로 == true 혹은 == false와 같은 코드는 사용하지말자

**비교하기: null -> undefined**
1. x가 null이고 y가 undefined면 true를 반환한다.
2. x가 undefined이고 y가 null면 true를 반환한다.

위츼 규칙에 따라 둘을 동등 비교할 시 상호 간의 암시적인 강제변환이 일어나므로 true를 반환한다.

**비교하기: 객체 -> 비객체**
1. Type(x)가 String 또는 Number이고 Type(y)가 객체라면, x == ToPrimitive(y)의 비교 결과를 반환한다.
2. Type(x)가 Object이고 Type(y)가 String 또는 Number라면, ToPrimitive(x) == y의 비교결과를 반환한다.

단, 객체 래퍼가 없는경우 박싱이 불가능하므로 위와같이 비교시 무조건 false가 반환됩니다.
```js
var a = "abc";
var b - Object(a);
a === b;  // false
a == b; // true

var c = null;
var d = Object(a);
a == b; // false
// c = undefined 일때도 false가 출력된다
```

**4.5.3 희귀사례**

이부분은 다음에 정리하자.....

강제변환이 심한문제가 되는 부분 7가지
```js
"0" == false // true
false == 0; // true
false == ""; // true
false == []; // true
"" == 0; // true
"" == []; // true
0 == []; // true
```
위의 경우는 모두 사용할 가능성이 적은 문장이므로 강제변환에 의한 부작용을 심하게 걱정하지말자

하지만 혹여나의 경우를 방지하기위해

1. 피연산자가 true/false일 가능성이 있으면 '절대로' == 연산자를 쓰지 말자.
2. 피연산자가 [], "", 0이 될 가능성이 있으면 가급적 == 연산자는 쓰지 말자.

## 추상관계 비교
a < b 와 같은 비교 과정에 있어서 알고리즘을 이해하고 사용하는 것이 필요하다.
* 이 알고리즘은 먼저 두 피연산자에 대해 ToPrimitive 강제변환을 이용한다. 
* 문자열이 아닌 경우는 ToNumber을 이용해 숫자값으로 만들어준다.
* 문자열일경우 단순 어휘(알파벳 순서로) 비교를한다
```js
var a = ["42"];
var b = ["043"];
a < b; // false
```
두배열은 문자열이기에 단순어휘 비교를 전행하는데 알파뱃 순서로 크기를 비교한다 ( 우선 앞의 "4" 뒤 "0" 부터 조사하는데 처음부터 실패한다.)

```js
var a = { b: 42 };
var b = { b: 43 };

a < b; // false
a == b; // false
a > b; // false

a <= b; // true
a >= b; // ture
```
* 위의 3가지 비교를 통해 ToPrimitive로 변환이 되지않는 [object Object]의 경우는 비교를 할 수 없다.
* 하지만 아래의 2가지 경우는 모두 false이어야 하는데 true이다
* <= 의 의미가 '같거나 더 작은'의 의미가 아니라 '더 크지 않은경우' 즉 !(a > b)를 의미하기 때문이다.
* 그러므로 위와 같은 비교를 할경우 미리 명시적으로 강제변환을 해두는 것이 좋다.