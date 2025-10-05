import React, { useEffect, useState } from "react";
import { CompanyBalanceSheet } from "../../Company";
import { useOutletContext } from "react-router";
import { getBalanceSheet } from "../../api";
import RatioList from "../RatioList.tsx/RatioList";
import Spinner from "../Spinners/Spinner";
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormatting";

type Props = {};

const config = [
  { label: <div className="font-bold">Total Assets</div>, render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.totalAssets) },
  { label: "Current Assets", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.totalCurrentAssets) },
  { label: "Total Cash", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.cashAndCashEquivalents) },
  { label: "Property & equipment", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.propertyPlantEquipmentNet) },
  { label: "Intangible Assets", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.intangibleAssets) },
  { label: "Long Term Debt", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.longTermDebt) },
  { label: "Total Debt", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.otherCurrentLiabilities) },
  { label: <div className="font-bold">Total Liabilities</div>, render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.totalLiabilities) },
  { label: "Current Liabilities", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.totalCurrentLiabilities) },
  { label: "Long-Term Debt", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.longTermDebt) },
  { label: "Long-Term Income Taxes", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.otherLiabilities) },
  { label: "Stakeholder's Equity", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.totalStockholdersEquity) },
  { label: "Retained Earnings", render: (company: CompanyBalanceSheet) => formatLargeMonetaryNumber(company.retainedEarnings) },
];

const BalanceSheet = (props: Props) => {
  const ticker = useOutletContext<string>();
  const [companyData, setCompanyData] = useState<CompanyBalanceSheet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompanyData = async () => {
      setLoading(true);
      try {
        const value = await getBalanceSheet(ticker!);
        if (value?.data?.length) {
          setCompanyData(value.data[0]);
        } else {
          setCompanyData(null);
        }
      } catch (error) {
        console.error(error);
        setCompanyData(null);
      } finally {
        setLoading(false);
      }
    };
    getCompanyData();
  }, [ticker]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : companyData ? (
        <RatioList config={config} data={companyData} />
      ) : (
        <>No balance sheet data available.</>
      )}
    </>
  );
};

export default BalanceSheet;
