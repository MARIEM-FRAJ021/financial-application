import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

type Props = {
  symbol: string;
  handleComment: (e: CommentFormInputs) => void;
};

type CommentFormInputs = {
  title: string;
  content: string;
};

const validation = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(280, "Title must not exceed 280 characters"),

  content: Yup.string()
    .required("Content is required")
    .min(5, "Content must be at least 10 characters")
    .max(280, "Content must not exceed 280 characters"),
});

export const StockCommentForm = ({ handleComment, symbol }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormInputs>({ resolver: yupResolver(validation) });
  return (
    <form className="mt-4 ml-1  w-[90%]" onSubmit={handleSubmit(handleComment)}>
      <input
        type="text"
        id="title"
        placeholder="Title"
        className="w-full p-4 text-lg text-gray-900 placeholder-gray-400 
                 border  rounded-lg shadow-sm
                 focus:outline-none focus:ring-2 focus:border-blue-600
               dark:text-black dark:placeholder-gray-400
                 dark:focus:ring-blue-600 dark:focus:border-blue-600"        {...register("title")}
      />
      {errors.title ? <p className="text-red-600 italic text-sm mt-1">{errors.title.message}</p> : ""}
      <div className="py-2 mb-1 rounded-lg rounded-t-lg ">
        <label htmlFor="comment" className="sr-only">
          Your comment
        </label>
        <textarea
          id="comment"
          rows={6}
          className="w-full p-4 text-lg text-gray-900 placeholder-gray-400 
                 border  rounded-lg shadow-sm
                 focus:outline-none focus:ring-2 focus:border-blue-600
                 dark:text-black dark:placeholder-gray-400
                 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                 
          placeholder="Write a comment..."
          {...register("content")}
        ></textarea>
      </div>
      {errors.title ? <p className ="text-red-600 italic text-sm mt-1">{errors.content?.message}</p> : ""}

      <button
        type="submit"
        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-lightGreen rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
      >
        Post comment
      </button>
    </form>
  );
};
