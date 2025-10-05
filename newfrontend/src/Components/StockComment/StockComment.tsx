import React, { useEffect, useState } from "react";
import {
  CommentDeleteAPI,
  CommentGetAPI,
  CommentPostAPI,
} from "../../Services/CommentService";
import { toast } from "react-toastify";
import { StockCommentForm } from "../StockCommentForm/StockCommentForm";
import { CommentGet } from "../../Models/Comment";
import Spinner from "../Spinners/Spinner";
import StockCommentList from "../StockCommentList/StockCommentList";
import { error } from "console";
import { setupAxios } from "../../Services/PortfolioService";

type Props = {
  stockSymbol: string;
};
type CommentFormInputs = {
  title: string;
  content: string;
};
const StockComment = ({ stockSymbol }: Props) => {
  const [comments, setComment] = useState<CommentGet[] | null>(null);
  const [loading, setLoading] = useState<boolean>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    handleCommentGet();
    setupAxios();
  }, []);
  
  const handleDelete = (id: number) => {
    CommentDeleteAPI(id)
      .then((res) => {
        if (res) {
          setIsOpen(false);
          toast.success("Comment successfully deleted !");
          handleCommentGet();
        }
      })
      .catch((error) => toast.warning(error));
  };

  const handleComment = (e: CommentFormInputs) => {
    CommentPostAPI(e.title, e.content, stockSymbol)
      .then((res) => {
        if (res) {
          toast.success("Comment created successfully!");
          handleCommentGet();
        }
      })
      .catch((e) => toast.warning(e.message));
  };

  const handleCommentGet = () => {
    setLoading(true);
    CommentGetAPI(stockSymbol).then((res) => {
      setLoading(false);
      setComment(res?.data!);
    });
  };
  return (
    <div className="flex flex-col w-full">
      {loading ? (
        <Spinner />
      ) : (
        <StockCommentList
          commentList={comments!}
          handleDelete={handleDelete}
          isOpen={isOpen}
          OnClose={() => setIsOpen(false)}
          OnOpen={() => setIsOpen(true)}
        />
      )}
      <StockCommentForm handleComment={handleComment} symbol={stockSymbol} />
    </div>
  );
};

export default StockComment;
