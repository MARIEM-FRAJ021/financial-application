import React, { useEffect, useState } from "react";
import { CompanyIncomeStatement } from "../../Company";
import { useOutletContext } from "react-router";
import { getIncomeStatement } from "../../api";
import Table from "../Table/Table";
import Spinner from "../Spinners/Spinner";
import { formatLargeMonetaryNumber, formatRatio } from "../../Helpers/NumberFormatting";

type Props = {};

const configs = [
  { label: "Date", render: (company: CompanyIncomeStatement) => company.date },
  { label: "Revenue", render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.revenue) },
  { label: "Cost Of Revenue", render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.costOfRevenue) },
  { label: "Depreciation", render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.depreciationAndAmortization) },
  { label: "Operating Income", render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.operatingIncome) },
  { label: "Income Before Taxes", render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.incomeBeforeTax) },
  { label: "Net Income", render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.netIncome) },
  { label: "Net Income Ratio", render: (company: CompanyIncomeStatement) => formatRatio(company.netIncomeRatio) },
  { label: "Earnings Per Share", render: (company: CompanyIncomeStatement) => formatRatio(company.eps) },
];

const IncomeStatement = (props: Props) => {
  const ticker = useOutletContext<string>();
  const [incomeStatement, setIncomeStatement] = useState<CompanyIncomeStatement[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRatios = async () => {
      setLoading(true);
      try {
        const result = await getIncomeStatement(ticker!);
        if (result?.data?.length) {
          setIncomeStatement(result.data);
        } else {
          setIncomeStatement([]);
        }
      } catch (error) {
        console.error(error);
        setIncomeStatement([]);
      } finally {
        setLoading(false);
      }
    };
    getRatios();
  }, [ticker]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : incomeStatement?.length ? (
        <Table config={configs} data={incomeStatement} />
      ) : (
        <p>No income statement data available.</p>
      )}
    </>
  );
};

export default IncomeStatement;
