import React, { useState } from "react";

const BlogForm = ({ postInfo }) => {
  const [title, setTitle] = useState(""); //title 선언 및 업데이트 함수
  const [content, setContent] = useState(""); //content 선언 및 업데이트 함수

  const submit = (e) => {
    alert("title : " + title + "\ncontent : " + content);
    console.log("title : " + title + "\ncontent : " + content);
    postInfo({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={submit}>
      <h1>간단한 글 등록</h1>
      <div>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} //value 변할 때 함수 호출후 변한 값 넣어주기
        />
      </div>
      <div>
        <label>본문</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        <button type="submit">작성</button>
      </div>
    </form>
  );
};

export default BlogForm;
