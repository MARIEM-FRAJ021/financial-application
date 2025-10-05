import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

type Props = {
  ticker: string;
};

const CompFinderItem = ({ ticker }: Props) => {
  
  return (
    <div className="flex space-x-2">
      <Link
        reloadDocument
        to= {`/company/${ticker}/company-profile`}
        className="
          px-5 py-2.5 font-bold rounded text-white bg-lightGreen
          hover:opacity-80 transition duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
        "
      >
        {ticker}
      </Link>
    </div>
  );
};

export default CompFinderItem;
