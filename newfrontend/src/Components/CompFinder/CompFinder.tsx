import React, { useEffect, useState } from "react";
import { CompanyCompData } from "../../Company";
import { getCompData } from "../../api";
import CompFinderItem from "../CompFinderItem/CompFinderItem";
import Spinner from "../Spinners/Spinner";

type Props = {
  ticker: string;
  sector: string;
  exchangeValue: string;
};

const CompFinder = ({ ticker, sector, exchangeValue }: Props) => {
  const [companyData, setCompanyData] = useState<string[]>();
  useEffect(() => {
    const getComps = async () => {
      const result = await getCompData(ticker!, sector, exchangeValue);
      setCompanyData(result);
    };
    getComps();
  }, [ticker]);
  return (
    <div className="flex space-x-2 rounded-md shadow-sm m-4" role="group">
      {companyData ? (companyData?.map((ticker) => {
        return <CompFinderItem ticker={ticker} />
      })) : (
        <Spinner />
      ) }
    </div>
  );
};

export default CompFinder;
