function foo() {
    try {
        throw 42;
    }
    finally {
        console.log("Hello");
    }
    console.log("실행될 리 없지");
}

console.log(foo());