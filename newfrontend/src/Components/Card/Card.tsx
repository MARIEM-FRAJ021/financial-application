import React, { JSX, SyntheticEvent } from "react";
import "./Card.css";
import { CompanySearch } from "../../Company";
import AddPortfolio from "../Portfolio/AddPortfolio";
import { Link } from "react-router-dom";
interface Props {
  id: string;
  searchResult: CompanySearch;
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const Card: React.FC<Props> = ({
  id,
  searchResult,
  onPortfolioCreate,
}: Props): JSX.Element => {
  return (
    <div
      className="flex flex-col items-center justify-between w-full p-6 bg-slate-100 rounded-lg md:flex-row"
      key={id}
      id={id}
    >
      <Link
        to={`/company/${searchResult.symbol}/company-profile`}
        className="font-bold text-center text-veryDarkViolet md:text-left"
      >
        {`${searchResult.name} (${searchResult.symbol})`}{" "}
      </Link>
      <p className="ml-1">({searchResult.currency})</p>
      <p className="font-bold text-veryDarkBlue ml-1">
        {searchResult.exchangeFullName} - {searchResult.exchange}
      </p>
      <AddPortfolio
        onPortfolioCreate={onPortfolioCreate}
        symbol={searchResult.symbol}
      />
    </div>
  );
};

export default Card;
