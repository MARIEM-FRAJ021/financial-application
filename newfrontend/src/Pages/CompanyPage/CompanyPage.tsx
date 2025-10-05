import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CompanyProfile } from "../../Company";
import { getCompanyProfile } from "../../api";
import Sidebar from "../../Components/Sidebar/Sidebar";
import CompanyDashboard from "../../Components/CompanyDashboard/CompanyDashboard";
import Tile from "../../Components/Tile/Tile";
import Spinner from "../../Components/Spinners/Spinner";
import CompFinder from "../../Components/CompFinder/CompFinder";

type Props = {};

const CompanyPage = (props: Props) => {

  let { ticker } = useParams();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [activeSidebarItem, setActiveSideBarItem] = useState<number>(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    const getProfileInit = async () => {
      const result = await getCompanyProfile(ticker!);
      if (result?.data?.length) {
        setCompany(result.data[0]);
      } else {
        setCompany(null);
      }
    };
    getProfileInit();
  }, [ticker]);

  const previewLength = 200;
  return (
    <>
      {company ? (
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
          <Sidebar />
          <CompanyDashboard ticker={ticker!}>
            <Tile title="Company Name" subTitle={company.companyName} />
            <Tile
              title="Exchange"
              subTitle={company.exchange?.toString() ?? ""}
            />
            <Tile
              title="Change Percentage"
              subTitle={
                company.changePercentage != null
                  ? company.changePercentage.toFixed(2) + "%"
                  : ""
              }
            />
            <Tile title="Price" subTitle={"$" + company.price.toString()} />
            <CompFinder
              ticker={company.symbol}
              exchangeValue={company.exchange}
              sector={company.sector}
            />
            <div className="bg-white shadow rounded p-4 mb-4 w-full">
              <p className="text-gray-900 font-medium break-words">
                {company.description
                  ? descriptionExpanded
                    ? company.description
                    : `${company.description.slice(0, previewLength)}${
                        company.description.length > previewLength ? "..." : ""
                      }`
                  : "No description available."}
              </p>
              {company.description&& company.description.length > previewLength && (
                <button
                  className="mt-2 text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  {descriptionExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </CompanyDashboard>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default CompanyPage;
