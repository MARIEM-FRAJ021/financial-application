import React, { useState } from "react";
import { CommentGet } from "../../Models/Comment";
import { Trash2 } from "lucide-react";
import ConfirmDeletePopup from "../DeleteComment/DeleteComment";
import { UserProfile } from "../../Models/User";

type Props = {
  comment: CommentGet;
  handleDelete: (id: number) => void;
  isOpen: boolean;
  OnClose: () => void;
  OnOpen: () => void;
};

const StockCommentListItem = ({
  comment,
  handleDelete,
  isOpen,
  OnClose,
  OnOpen,
}: Props) => {
    const [userName, setUserName] = useState<string>(JSON.parse(localStorage.getItem("user")!).userName);
  return (
    <div className="relative grid grid-cols-1 gap-4 ml-4 p-4 mb-8 w-1/2 border rounded-lg bg-white shadow-lg">
      <div className="relative flex gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between">
            <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
              {comment.title}
            </p>
          </div>
          <p className="text-dark text-sm">@{comment.createdBy}</p>
        </div>
      </div>
      <p className="-mt-4 text-gray-500">{comment.content}</p>
      {userName === comment.createdBy &&
      <button
        onClick={OnOpen}
        className="absolute bottom-2 right-2 p-2 rounded-full hover:bg-red-100 transition"
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </button>
      }
      <ConfirmDeletePopup
        isOpen={isOpen}
        onConfirm={() => handleDelete(comment.id)}
        onClose={OnClose}
        id={comment.id}
      />
    </div>
  );
};

export default StockCommentListItem;
