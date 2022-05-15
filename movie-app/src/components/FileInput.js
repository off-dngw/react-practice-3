import React, { useRef, useEffect, useState } from "react";

const FileInput = ({ name, value, onChange, initialPreview }) => {
  const [preview, setPreview] = useState(initialPreview);
  const inputRef = useRef();
  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  //   useEffect(() => {
  //     if (inputRef.current) {
  //       console.log(inputRef);
  //     }
  //   }, []);

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) {
      return;
    }
    inputNode.value = "";
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;

    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);

    //사이드 이펙트 정리 코드
    return () => {
      setPreview(initialPreview);
      // obejct 해제해주는 코드
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, initialPreview]);

  return (
    <div>
      <img src={preview} alt="이미지 미리보기" />
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        ref={inputRef}
      />
      {value && <button onClick={handleClearClick}>X</button>}
    </div>
  );
};

export default FileInput;
