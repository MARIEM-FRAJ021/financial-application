import React from "react";
import { TestDataCompany } from "../Table/TestData";
import { rename } from "fs";

interface Props {
config : any,
data: any

};

const data = TestDataCompany[0];

type Company = typeof data;

const RatioList = ({config, data}: Props) => {
  const renderedCells = config.map((row: any) => {
    return (
      <li className="py-3 sm:py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">{row.label} </p>
            <p className="text-sm text-gray-500 truncate">
              <a
                href="/cdn-cgi/l/email-protection"
                className="__cf_email__"
                data-cfemail="17727a767e7b57607e7973646372653974787a"
              >
                {row.subTitle && row.subTitle}
              </a>
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900">
            {row.render(data)}
          </div>
        </div>
      </li>
    );
  });
  return (
    <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
      <ul className="divide-y divide-gray-200">{renderedCells}</ul>
    </div>
  );
};
export default RatioList;
