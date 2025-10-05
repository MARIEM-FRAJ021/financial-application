import React, { useState } from "react";
import { CommentGet } from "../../Models/Comment";
import StockCommentListItem from "../StockCommentListItem/StockCommentListItem";
import { v4 as uuidv4 } from "uuid";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  commentList: CommentGet[];
  handleDelete: (id: number) => void;
  isOpen: boolean,
  OnClose: () => void,
  OnOpen: () => void
};

const StockCommentList = ({ commentList, handleDelete, isOpen, OnClose, OnOpen}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? commentList.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === commentList.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!commentList || commentList.length === 0) return <></>;

  return (
    <div className="relative w-full flex justify-center">
      <div className="relative w-[80%] h-80 overflow-hidden rounded-lg flex items-center justify-center">
        {commentList.map((c, index) => (
          <div
            key={uuidv4()}
            className={`absolute w-full h-full flex justify-center items-center p-6 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <StockCommentListItem comment={c} handleDelete={() => handleDelete(c.id)} isOpen={isOpen} OnClose={OnClose} OnOpen={OnOpen} />
          </div>
        ))}

        {commentList.length>1 &&
        <div>
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-2
                     w-10 h-10 flex items-center justify-center
                     bg-white/80 hover:bg-white rounded-full shadow-md
                     transition duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
          <span className="sr-only">Previous</span>
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-2
                     w-10 h-10 flex items-center justify-center
                     bg-white/80 hover:bg-white rounded-full shadow-md
                     transition duration-300"
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
          <span className="sr-only">Next</span>
        </button></div>}
      </div>

      <div className="absolute bottom-3 start-0 end-0 flex justify-center gap-3">
        {commentList.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StockCommentList;
