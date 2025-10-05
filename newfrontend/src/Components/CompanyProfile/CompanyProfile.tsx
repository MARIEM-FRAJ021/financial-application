import React, { useEffect, useState } from "react";
import { CompanyKeyMetrics } from "../../Company";
import { useOutletContext } from "react-router";
import { getKeyMetrics } from "../../api";
import RatioList from "../RatioList.tsx/RatioList";
import Spinner from "../Spinners/Spinner";
import { formatLargeNonMonetaryNumber, formatRatio } from "../../Helpers/NumberFormatting";
import StockComment from "../StockComment/StockComment";

type Props = {};

const tableConfig = [
  {
    label: "Market Cap",
    render: (company: CompanyKeyMetrics) => formatLargeNonMonetaryNumber(company.marketCapTTM),
    subTitle: "Total value of all a company's shares of stock",
  },
  {
    label: "Current Ratio",
    render: (company: CompanyKeyMetrics) => formatRatio(company.currentRatioTTM),
    subTitle: "Measures the companies ability to pay short term debt obligations",
  },
  {
    label: "Return On Equity",
    render: (company: CompanyKeyMetrics) => formatRatio(company.roeTTM),
    subTitle: "Return on equity is the measure of a company's net income divided by its shareholder's equity",
  },
  {
    label: "Return On Assets",
    render: (company: CompanyKeyMetrics) => formatRatio(company.returnOnTangibleAssetsTTM),
    subTitle: "Return on assets is the measure of how effective a company is using its assets",
  },
  {
    label: "Free Cashflow Per Share",
    render: (company: CompanyKeyMetrics) => formatRatio(company.freeCashFlowPerShareTTM),
    subTitle: "Return on assets is the measure of how effective a company is using its assets",
  },
  {
    label: "Book Value Per Share TTM",
    render: (company: CompanyKeyMetrics) => formatRatio(company.bookValuePerShareTTM),
    subTitle: "Book value per share indicates a firm's net asset value (total assets - total liabilities) on per share basis",
  },
  {
    label: "Divdend Yield TTM",
    render: (company: CompanyKeyMetrics) => formatRatio(company.dividendYieldTTM),
    subTitle: "Shows how much a company pays each year relative to stock price",
  },
  {
    label: "Capex Per Share TTM",
    render: (company: CompanyKeyMetrics) => formatRatio(company.capexPerShareTTM),
    subTitle: "Capex is used by a company to acquire, upgrade, and maintain physical assets",
  },
  {
    label: "Graham Number",
    render: (company: CompanyKeyMetrics) => formatRatio(company.grahamNumberTTM),
    subTitle: "This is the upper bound of the price range that a defensive investor should pay for a stock",
  },
  {
    label: "PE Ratio",
    render: (company: CompanyKeyMetrics) => formatRatio(company.peRatioTTM),
    subTitle: "This is the upper bound of the price range that a defensive investor should pay for a stock",
  },
];

const CompanyProfile = (props: Props) => {
  const ticker = useOutletContext<string>();
  const [companyData, setCompanyData] = useState<CompanyKeyMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompanyKeyRatios = async () => {
      setLoading(true);
      try {
        const result = await getKeyMetrics(ticker!);
        if (result?.data?.length) {
          setCompanyData(result.data[0]);
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
    getCompanyKeyRatios();
  }, [ticker]);

  return (
    <>
      {loading && <Spinner />}
      {companyData && <RatioList config={tableConfig} data={companyData} />}
      <StockComment stockSymbol={ticker} />
    </>
  );
};

export default CompanyProfile;
