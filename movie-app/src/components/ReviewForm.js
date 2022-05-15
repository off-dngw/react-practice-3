import React, { useState } from "react";
import FileInput from "./FileInput";
// import Rating from "./Rating";
import RatingInput from "./RatingInput";
import "./ReviewForm.css";

const INITIAL_VALUES = {
  title: "",
  rating: 0,
  content: "",
  imgFile: null,
};

function sanitize(type, value) {
  switch (type) {
    case "number":
      return Number(value) || 0;

    default:
      return value;
  }
}

const ReviewForm = ({
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmitSuccess,
  onSubmit,
  onCancel,
}) => {
  //   const [title, setTitle] = useState("");
  //   const [rating, setRating] = useState(0);
  //   const [content, setContent] = useState("");
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("rating", values.rating);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);

    let result;
    try {
      setSubmittingError(null);
      setIsSubmitting(true);
      result = await onSubmit(formData);
    } catch (error) {
      setSubmittingError(error);
      return;
    } finally {
      setIsSubmitting(false);
    }
    const { review } = result;
    setValues(INITIAL_VALUES);
    onSubmitSuccess(review);
    // console.log(values);
    // console.log({ title, rating, content });
  };

  return (
    <form className="ReviewForm" onSubmit={handleSubmit}>
      <FileInput
        name="imgFile"
        value={values.imgFile}
        onChange={handleChage}
        initialPreview={initialPreview}
      />
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
      {onCancel && <button onClick={onCancel}>취소</button>}
      <button type="submit" disabled={isSubmitting}>
        확인
      </button>
      {submittingError?.message && <div>{submittingError.message}</div>}
    </form>
  );
};

export default ReviewForm;
