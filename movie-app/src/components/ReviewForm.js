import React, { useState } from "react";
import FileInput from "./FileInput";
// import Rating from "./Rating";
import RatingInput from "./RatingInput";
import "./ReviewForm.css";

function sanitize(type, value) {
  switch (type) {
    case "number":
      return Number(value) || 0;

    default:
      return value;
  }
}

const ReviewForm = () => {
  //   const [title, setTitle] = useState("");
  //   const [rating, setRating] = useState(0);
  //   const [content, setContent] = useState("");
  const [values, setValues] = useState({
    title: "",
    rating: 0,
    content: "",
    imgFile: null,
  });

  const handleChage = (name, value, type) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: sanitize(type, value, type),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    handleChage(name, value, type);
    // setValues((prevValues) => ({
    //   ...prevValues,
    //   [name]: sanitize(type, value),
    // }));
  };

  //   const handleTitleChange = (e) => {
  //     setTitle(e.target.value);
  //   };

  //   const handleRatingChange = (e) => {
  //     setRating(e.target.value);
  //   };

  //   const handleContentChange = (e) => {
  //     setContent(e.target.value);
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    // console.log({ title, rating, content });
  };

  return (
    <form className="ReviewForm" onSubmit={handleSubmit}>
      <FileInput name="imgFile" value={values.imgFile} onChange={handleChage} />
      <input name="title" value={values.title} onChange={handleInputChange} />
      <RatingInput
        name="rating"
        type="number"
        value={values.rating}
        onChange={handleChage}
      />
      <textarea
        name="content"
        value={values.content}
        onChange={handleInputChange}
      />
      <button type="submit">확인</button>
    </form>
  );
};

export default ReviewForm;
