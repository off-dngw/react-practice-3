// import React, { useEffect, useState } from "react";
// import { deleteReview, getReviews, updateReview } from "../api";
// import ReviewForm from "./ReviewForm";
// import ReviewList from "./ReviewList";
// // import mockItems from "../mock.json";
// import { createReview } from "../api";

// const LIMIT = 6;

// const App = () => {
//   const [items, setItems] = useState([]);
//   const [order, setOrder] = useState("createdAt");
//   const [offset, setOffset] = useState(0);
//   const [hasNext, setHasNext] = useState(false);
//   const [isLoaing, setIsLoding] = useState(false);
//   const [loadingError, setLoadingError] = useState(null);

//   const sortedItems = items.sort((a, b) => b[order] - a[order]);

//   const handleNewestClick = () => setOrder("createdAt");
//   const handleBestCLick = () => setOrder("rating");

//   const handleDelete = async (id) => {
//     const result = await deleteReview(id);
//     if (!result) return;
//     // const nextItems = items.filter((el) => el.id !== id);
//     // setItems(nextItems);
//     // 비동기로 사용할거라 콜백으로 사용
//     setItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const handleLoad = async (options) => {
//     let result;
//     try {
//       setIsLoding(true);
//       setLoadingError(null);
//       result = await getReviews(options);
//     } catch (error) {
//       setLoadingError(error);
//       return;
//     } finally {
//       setIsLoding(false);
//     }
//     const { paging, reviews } = result;
//     if (options.offset === 0) {
//       setItems(reviews);
//     } else {
//       setItems([...items, ...reviews]);
//     }
//     setOffset(options.offset + reviews.length);
//     setHasNext(paging.hasNext);
//   };

//   const handleLoadMore = () => {
//     handleLoad({ order, offset, limit: LIMIT });
//   };

//   const handleCreateSuccess = (review) => {
//     setItems((prevItems) => [review, ...prevItems]);
//   };

//   const handleUpdateSuccess = (review) => {
//     setItems((prevItems) => {
//       const splitIdx = prevItems.findIndex((item) => item.id === review.id);
//       return [
//         ...prevItems.slice(0, splitIdx),
//         review,
//         ...prevItems.slice(splitIdx + 1),
//       ];
//     });
//   };
//   useEffect(() => {
//     handleLoad({ order, offset: 0, limit: LIMIT });
//   }, [order]);
//   return (
//     <div>
//       <div>
//         <button onClick={handleNewestClick}>최신순</button>
//         <button onClick={handleBestCLick}>베스트</button>
//       </div>
//       <ReviewForm
//         onSubmit={createReview}
//         onSubmitSuccess={handleCreateSuccess}
//       />
//       <ReviewList
//         items={sortedItems}
//         ondelete={handleDelete}
//         onUpdate={updateReview}
//         onUpdateSuccess={handleUpdateSuccess}
//       />
//       {
//         // 데이터가 있을 때만 버튼 보여주는 부분
//         hasNext && (
//           <button disabled={isLoaing} onClick={handleLoadMore}>
//             더 보기
//           </button>
//         )
//       }
//       {/* 옵셔널 체이닝 (Optional Chaining) */}
//       {loadingError?.message && <span>{loadingError.message}</span>}
//     </div>
//   );
// };

// export default App;
import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { createReview, deleteReview, getReviews, updateReview } from "../api";

const LIMIT = 6;

function App() {
  const [order, setOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [items, setItems] = useState([]);
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");

  const handleBestClick = () => setOrder("rating");

  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (!result) return;

    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

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

  const handleLoadMore = async () => {
    await handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClick}>베스트순</button>
      </div>
      <ReviewForm
        onSubmit={createReview}
        onSubmitSuccess={handleCreateSuccess}
      />
      <ReviewList
        items={sortedItems}
        onDelete={handleDelete}
        onUpdate={updateReview}
        onUpdateSuccess={handleUpdateSuccess}
      />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;
