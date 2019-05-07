# 3. 네이티브
: 네이티브는 특정 환경에 종속되지않은 ECMAScript 내장객체를 의미합니다.

---
## 3.1 내부 [[Class]]

typeof가 'object'인 값에는 [[Class]]라는 내부 프로퍼티가 붙는다. 이를 보기위해서는 Object.prototype.toString()라는 메서드를 이용하면 된다.

## 3.2 래퍼 박싱하기

원시 값에는 프로퍼티나 메서드가 없으므로 .length .toString()으로 접근하려면 원시값을 객체 래퍼로 감싸줘야 한다. 하지만 자바스크립트는 알아서 객체로 박싱해주는 기능이 있으므로 굳이 new String(), new Number()을 이용해 코딩하기 보다는 원시값을 사용하면 된다.

* 만약 수동으로 원시값을 박싱한다면 Object를 이용하길 권장한다.

## 3.3 언박싱

객체 래퍼의 원시 값은 valueOf() 메서드로 추출할 수 있다.

---
## 3.4 네이티브, 나는 생성자다.
생성자는 가급적 쓰지 않는 편이 좋다 그 이유를 아래에 설명한다.

3.4.1 Array()
Array 생성자에는 특별한 형식이 있는데 인자로 숫자를 하나만 받으면 그 숫자를 원소로 하는 배열을 생성하는게 아니라 배열의 크기를 미리 정하는 기능이다.

* 이는 받은 값을 length 값으로 만들어 넣고 안의 슬롯들은 빈 슬롯 상태로 둔다.
* Array(3)의 상태를 출력하면 [ undefined x 3 ] 이 출력되는데 이는 [undefined, undefined, undefined] 와는 차이가 있다. 앞의 경우는 빈 슬롯으로 값이 없는 반면 뒤에 경우는 각각 undefined 값을 원소로 채우고 있다.
* 실제 undefined를 원소를 가진 생성자를 만드려면 Array.apply(null, {length: 3})을 사용해야한다.
* apply는 앞의 인자는 객체 바인딩, 두번째 인자는 인자의 배열로 이루어져 있다.
* 반드시 빈슬롯을 가진 배열을 만드는 짓은 삼가하자.

3.4.2 Object(), Function(), and RegExp()

이 생성자도 분명한 의도를 가지지 않는한 사용하지말자

```js
var c = new Object();
c.foo = "bar";
c; // { foo : "bar" }

var d = { foo: "bar" };
d; // { foo : "bar" }

var e = new Function( "a", "return a * 2;" );
var f = function(a) { return a * 2; }
function g(a) { return a * 2};

var h = new RegExp( "^a*b+", "g" );
var i = /^a*b+/g;
```
1. new Object() 같은 폼은 사용할 일이없다.
2. Function 생성자는 인자나 내용을 동적으로 정의해야하는 아주 드문 경우에 사용된다.
3. 정규표현식은 리터럴 형식으로 정의할 것을 적극 권장한다.

3.4.3 Date() and Error()

이 두가지 생성자는 리터럴 형식이 없으므로 다른 네이티브에 비해 유용하다.
* date 객체 값은 new Date()로 생성한다. 이 생성자는 날짜/시각을 인자로 받는다.
* 정적 도우미 함수 Date.now()를 사용하기 권장한다.
* Error()는 현재의 실행 스택 콘텍스트를 포착하여 객체에 담는 것이다.
* error 객체는 보통 throw 연산자와 함께 사용한다.
```js
funtion foo(x) {
    if (!x) {
        throw new Error("x를 안 주셨어요!");
    }
    // ...
}
```

3.4.4 Symbol()
: 충돌 염려 없이 객체 프로퍼티로 사용가능한, 특별한 '유일 값'이다.
* symbol을 직접 정의할때 new를 붙히면 에러가 나는 유일한 생성자이다.
* 심벌은 객체가 아니라 단순한 스칼라 원시 값이다.
* 심벌은 전용 프로퍼티는 아니지만 전용 혹은 특별한 프로퍼티로 사용한다.

3.4.5 네이티브 프로토타입

내장 네이티브 생성자는 각자의 .prototype 객체를 가진다.
* 프로토타입을 사용할때 #을 이용해 축약한다.
* String#indexOf() 문자열에서 특정 문자의 위치를 검색
* String#charAt() 문자열에서 특정 위치의 문자를 반환
* String#substr(), String#substring(), and String#slice() 문자열의 일부를 새로운 문자열로 추출
* String#toUpperCase() and String#to:owerCase() 대/소문자로 변환된 새로운 문자열 생성
* String#trim() 앞/뒤의 공란이 제거된 새로운 문자열 생성

프로토타입 위임 덕분에 모든 문자열이 이 메서드들을 같이 쓸 수 있다.

네이티브 프로토타입은 변경 할 수 있지만 바람직하지 않은 발상이다.