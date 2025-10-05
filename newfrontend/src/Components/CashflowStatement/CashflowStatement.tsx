import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { CompanyCashFlow } from "../../Company";
import { getCashFlowStatement } from "../../api";
import Table from "../Table/Table";
import Spinner from "../Spinners/Spinner";
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormatting";

type Props = {};

const config = [
  { label: "Date", render: (company: CompanyCashFlow) => company.date },
  { label: "Operating Cashflow", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.operatingCashFlow) },
  { label: "Investing Cashflow", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.netCashUsedForInvestingActivites) },
  { label: "Financing Cashflow", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.netCashUsedProvidedByFinancingActivities) },
  { label: "Cash At End of Period", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.cashAtEndOfPeriod) },
  { label: "CapEX", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.capitalExpenditure) },
  { label: "Issuance Of Stock", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.commonStockIssued) },
  { label: "Free Cash Flow", render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.freeCashFlow) },
];

const CashflowStatement = (props: Props) => {
  const ticker = useOutletContext<string>();
  const [cashFlowData, setCashFlowData] = useState<CompanyCashFlow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCashFlow = async () => {
      setLoading(true);
      try {
        const result = await getCashFlowStatement(ticker);
        if (result?.data?.length) {
          setCashFlowData(result.data);
        } else {
          setCashFlowData([]);
        }
      } catch (error) {
        console.error(error);
        setCashFlowData([]);
      } finally {
        setLoading(false);
      }
    };
    getCashFlow();
  }, [ticker]);

  if (loading) return <Spinner />;

  return cashFlowData?.length ? (
    <Table config={config} data={cashFlowData} />
  ) : (
    <p>No cashflow data available.</p>
  );
};

export default CashflowStatement;
