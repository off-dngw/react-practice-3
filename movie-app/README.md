#### 버그 1.

    내용 : chrome network tab 3g slow mode (네트워크 쓰로틀링) 사용 시
    더 보기를 누른 후 삭제 버튼을 누르면 목록이 재랜더링이 되고
    삭제했던 아이템이 다시 살아났습니다.
    } else {
      setItems([...items, ...reviews]);
    }

    콜백으로 변경 시 해결
    setItems((prevItems) => [...prevItems, ...reviews])

#### 버그 2.

    내용 : chrome network tab 3g slow mode (네트워크 쓰로틀링) 사용 시
    네트워크 지연 상태이다 보니 버튼이 계속 누를 수 가 있으며
    불필요한 request 생기거나 랜더링된 화면에도 중복된 데이터가 쌓였습니다.

    해결 방법

    1. 로딩 중인 상태 값을 하나 추가합니다.
    const [isLoaing, setIsLoding] = useState(false);


    2.
    이 코드에서 네트워크 request 부분만 try, catch, finally 사용

    - 변경 전
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

    - 변경 후
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

#### 버그 3.

    내용 : form 태그 안에서 입력된 값을 확인 하려고 button을 누르면
    새로고침이 되면서 값이 전달이 안되는 경우가 있습니다.
    HTML forn 태그의 기본동작은 submit 버튼을 눌렀을 때 입력폼의 값과 함께
    get request를 보내기 때문에 기본동작을 막아줘야 합니다.

    해결
     const handleSubmit = (e) => {
        e.preventDefault();
      console.log({ title, rating, content });
    };

#### 버그 4.

    내용 : rating 값이 숫자로 처리가 되지 않는 문제가 있습니다.

    해결

```
  function sanitize(type, value) {
    switch (type) {
     case 'number':
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

- App.js / ReviewForm.js 부분에 비동기 처리 로직인 try, catch, finally 코드가 중복이 있으므로 정리해봅니다.

#### Before

```App.js

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

```
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
