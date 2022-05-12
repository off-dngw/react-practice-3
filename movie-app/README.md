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
