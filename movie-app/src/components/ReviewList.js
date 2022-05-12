import React from "react";
import "./ReviewList.css";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

function ReviewListItem({ item, ondelete }) {
  const handleDeleteClick = () => ondelete(item.id);
  return (
    <div className="ReviewListItem">
      <img className="ReviewListItem-img" src={item.imgUrl} alt={item.title} />
      <div>
        <h1>{item.title}</h1>
        <p>{item.rating}</p>
        <p>{formatDate(item.createdAt)}</p>
        <p>{item.content}</p>
        <button onClick={handleDeleteClick}>삭제하기</button>
      </div>
    </div>
  );
}

const ReviewList = ({ items, ondelete }) => {
  return (
    <ul>
      {items.map((el) => {
        return (
          <li key={el.id}>
            <ReviewListItem item={el} ondelete={ondelete} />
          </li>
        );
      })}
    </ul>
  );
};

export default ReviewList;
