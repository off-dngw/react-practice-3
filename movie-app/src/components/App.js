import React, { useEffect, useState } from "react";
import { getReviews } from "../api";
import ReviewList from "./ReviewList";
// import mockItems from "../mock.json";

const LIMIT = 6;

const App = () => {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoaing, setIsLoding] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");
  const handleBestCLick = () => setOrder("rating");

  const handleDelete = (id) => {
    const nextItems = items.filter((el) => el.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoding(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
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

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);
  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestCLick}>베스트</button>
      </div>
      <ReviewList items={sortedItems} ondelete={handleDelete} />
      {
        // 데이터가 있을 때만 버튼 보여주는 부분
        hasNext && (
          <button disabled={isLoaing} onClick={handleLoadMore}>
            더 보기
          </button>
        )
      }
      {/* 옵셔널 체이닝 (Optional Chaining) */}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
};

export default App;
