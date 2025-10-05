import React from "react";
import { ClipLoader } from "react-spinners";

type Props = {
  isLoading?: boolean;
};

const Spinner = ({ isLoading = true }: Props) => {
  return (
    <div id="loading-spinner">
      <div className="flex items-center justify-center  py-2">
        <ClipLoader
          color="#36d7b7"
          loading={isLoading}
          size={35}
          aria-label="Loading Spinner"
          data-test="loader"
        />
      </div>
    </div>
  );
};

export default Spinner;
