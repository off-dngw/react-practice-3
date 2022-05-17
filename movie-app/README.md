#### 버그 1.

    내용 : chrome network tab 3g slow mode (네트워크 쓰로틀링) 사용 시
    더 보기를 누른 후 삭제 버튼을 누르면 목록이 재랜더링이 되고
    삭제했던 아이템이 다시 살아났습니다.

#### 해결 방법

```js
    } else {
      setItems([...items, ...reviews]);
    }

    콜백으로 변경 시 해결
    setItems((prevItems) => [...prevItems, ...reviews])
```

#### 버그 2.

    내용 : chrome network tab 3g slow mode (네트워크 쓰로틀링) 사용 시
    네트워크 지연 상태이다 보니 버튼이 계속 누를 수 가 있으며
    불필요한 request 생기거나 랜더링된 화면에도 중복된 데이터가 쌓였습니다.

#### before

```js
    1. 로딩 중인 상태 값을 하나 추가합니다.
    const [isLoaing, setIsLoding] = useState(false);


    2.
    이 코드에서 네트워크 request 부분만 try, catch, finally 사용

    const handleLoad = async (options) => {
    const { reviews, paging } = await getReviews(options);
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems([...items, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
    setHasNext(paging.hasNext);
    }
```

#### after

```js
const handleLoad = async (options) => {
  let result;
  try {
    setIsLoding(true);
    result = await getReviews(options);
  } catch (error) {
    console.error(error);
    return;
  } finally {
    setIsLoding(false);
  }
  const { paging, reviews } = result;
  if (options.offset === 0) {
    setItems(reviews);
  } else {
    setItems([...items, ...reviews]);
  }
  setOffset(options.offset + reviews.length);
  setHasNext(paging.hasNext);
};
```

#### 버그 3.

    내용 : form 태그 안에서 입력된 값을 확인 하려고 button을 누르면
    새로고침이 되면서 값이 전달이 안되는 경우가 있습니다.
    HTML form 태그의 기본동작은 submit 버튼을 눌렀을 때 입력폼의 값과 함께
    get request를 보내기 때문에 기본동작을 막아줘야 합니다.

#### 해결 방법

```js
const handleSubmit = (e) => {
  e.preventDefault();
  console.log({ title, rating, content });
};
```

#### 버그 4.

    내용 : rating 값이 숫자로 처리가 되지 않는 문제가 있습니다.

#### 해결 방법

```js
function sanitize(type, value) {
  switch (type) {
    case "number":
      return Number(value) || 0;
    default:
      return value;
  }
}
const handleChange = (e) => {
  const { name, value, type } = e.target;

  setValues((prevValues) => ({
    ...prevValues,
    [name]: sanitize(type, value),
  }));
};
```

#### 커스텀 훅 으로 코드 정리해보기

[커스텀훅 코드](./src/hooks/useAsync.js)

- App.js / ReviewForm.js 부분에 비동기 처리 로직인 try, catch, finally 코드가 중복이 있으므로 정리해봅니다.

#### Before

```js
const [isLoading, setIsLoading] = useState(false);
const [loadingError, setLoadingError] = useState(null);

const handleLoad = async (options) => {
  let result;
  try {
    setLoadingError(null);
    setIsLoading(true);
    result = await getReviews(options);
  } catch (error) {
    setLoadingError(error);
    return;
  } finally {
    setIsLoading(false);
  }

  const { paging, reviews } = result;
  if (options.offset === 0) {
    setItems(reviews);
  } else {
    setItems((prevItems) => [...prevItems, ...reviews]);
  }
  setOffset(options.offset + options.limit);
  setHasNext(paging.hasNext);
};
```

#### After

```js
  const [isLoading, lodingError, getReviewsAsync] = useAsync(getReviews)


  const handleLoad = async (options) => {
    let result await getReviewsAsync(options)
    if(!result) return;


    const { paging, reviews } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + options.limit);
    setHasNext(paging.hasNext);
  };


```

#### 경고처리

    - 내용 : React Hook useEffect has a missing dependency : 'handleLoad'. either include it or remove dependency array react-hooks/exhaustive-deps
    - useEffect hooks 에서 handle dependency가 빠져있습니다. react-hooks/exhaustive-deps 규칙을 어겼다는 경고

#### 해결 방법

1. useEffect에 dependency list에 handleLoad 함수를 추가를 시켰더니 무한루프가 발생하고 새로운 경고메세지가 나왔습니다.
   함수를 dependency list에 추가했을 경우 자주 발생한다고 합니다.

#### before

```js
useEffect(() => {
  handleLoad({ order, offset: 0, limit: LIMIT });
}, [order]);
```

#### after

```js
useEffect(() => {
  handleLoad({ order, offset: 0, limit: LIMIT });
}, [order, handleLoad]);
```

2. The 'handleLoad' function makes the depencencies of useEffect Hook change on every render
   To fix this, wrap the definition of 'handleLoad' in its own useCallback() Hook
   - handleLoad가 depencencies로 추가가 되었는데 렌더링 할 때 마다 매번 바뀌니까 useCallback을 사용하라는 경고

#### 해결 방법

```js
const handleLoad = useCallback (async (options) => {
    let result await getReviewsAsync(options)
    if(!result) return;


    const { paging, reviews } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + options.limit);
    setHasNext(paging.hasNext);
  }, []);
```

3. 무한루프는 해결이 되었으나 새로운 경고가 발생.

- React Hook useCallback has a missing depencency : 'getReviewAsync'. Either include it or remove the dependency array react-hooks/exhaustive-deps
- useCallback 함수에 dependency list에 getReviewAsync가 빠져있다는 경고입니다.

#### 해결방법

```js
const handleLoad = useCallback (async (options) => {
    let result await getReviewsAsync(options)
    if(!result) return;


    const { paging, reviews } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + options.limit);
    setHasNext(paging.hasNext);
  }, [getReviewsAsync]);
```

- useCallback 함수에 dependencylist에 getReviewsAsync 를 추가를 합니다.
- 하지만 getReviewsAsync 이 함수도 매번 새로 만드는건 아닌지 확인을 해봅시다.

```js
const wrappedFunction = async (...args) => {
  try {
    setError(null);
    setPending(true);
    return await asnyFunction(...args);
  } catch (error) {
    setError(error);
  } finally {
    setPending(false);
  }
};
```

- 이 함수도 매번 새로 만들고 있으니 useCallback을 사용해야합니다.

```js
const wrappedFunction = useCallback(
  async (...args) => {
    try {
      setError(null);
      setPending(true);
      return await asnyFunction(...args);
    } catch (error) {
      setError(error);
    } finally {
      setPending(false);
    }
  },
  [asnyFunction]
);
```

- setError와 setPending은 react에서 제공하는 setter 함수이기 때문에 dependency list에 추가 할 필요가 없습니다.
- asnyFunction을 참조하고 있습니다. asnyFunction이 바뀌면 wrappedFunction도 새로 만들어야 하기 때문에
  asnyFunction을 dependency list에 추가 하면 됩니다.
