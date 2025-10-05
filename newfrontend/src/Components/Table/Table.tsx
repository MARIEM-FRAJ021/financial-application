import React from "react";
import { testIncomeStatementData } from "./TestData";

interface Props {
  config: any;
  data: any;
}

const Table = ({ config, data }: Props) => {
  const renderedRows = data.map((company: any) => {
    return (
      <tr key={company.cik}>
        {config.map((val: any) => {
          return (
            <td className="p-4 whitespace-nowrap overflow-hidden">
              {val.render(company)}
            </td>
          );
        })}
      </tr>
    );
  });
  const renderedHeaders = config.map((config: any) => {
    return (
      <th
        className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        key={config.label}
      >
        {config.label}
      </th>
    );
  });
  return (
    <div className="bg-white shadow rounded-lg flex-auto p-4 sm:p-6 xl:p-8 w-full">
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">{renderedHeaders}</thead>
          <tbody>{renderedRows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
