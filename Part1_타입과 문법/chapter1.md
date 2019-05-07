# 1. 타입
- 자바스크립트에는 총 7가지의 내장 타입이 있다.
- null, undefined, boolean, number, string, object , symbol
- 값 타입은 typeof 연산자로 알 수 있다.
- null은 false나 다름없는 값이지만 타입은 object인 특별한 존재이다
배열은 object다.
- 값이 없는 변수의 값은 undefined 이다.

---

여기서 문제가 발생하는 선언되지 않는 변수에 대해서도 undefined로 처리 되어진다는 점이다.

ex)
```js
var a = 1;</br>
a; // undefined</br>
b; // ReferenceError</br>
​
typeof a // "undefined"
typeof b // "undefined"
```
​


## 안전가드
여러 스크립트 파일의 변수들이 전역 네임스페이스를 공유한다면 typeof의 안전가드가 있으면 좋다.
* ReferenceError를 나지 않게 미리 전역변수를 체크해 검사해준다.
* 개발자가 다른이의 코드를 복사 붙혀넣기 할때도 이용된다

ex)
```js
function doSometingCool() {
  var helper =
    (typeof FeatureXYZ !== "undefined") ?
    FeatureXYZ :
    function() { //XYZ 기능
    }
 var val = helper();
 //
}
```

* typeof를 이용하지 않고 안전검사를 하는 방법으로서 window객체가 모두의 전역 객체인 점을 이용해 검사하는 것이다 이것은 한계가 존재하므로 추천하지 않는다.