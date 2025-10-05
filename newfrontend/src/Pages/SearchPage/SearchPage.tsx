import React, { JSX, SyntheticEvent, useState, useEffect, useRef } from "react";
import CardList from "../../Components/CardList/CardList";
import Search from "../../Components/Search/Search";
import { CompanySearch } from "../../Company";
import { searchCompanies } from "../../api";
import ListPortfolio from "../../Components/ListPortfolio/ListPortfolio";
import { PortfolioGet } from "../../Models/Portfolio";
import {
  portfolioAddAPI,
  PortfolioDeleteAPI,
  PortfolioGetAPI,
  setupAxios,
} from "../../Services/PortfolioService";
import { toast } from "react-toastify";

type Props = {};

const SearchPage = (props: Props) => {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>(
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  useEffect(() => {}, [searchResult]);

  useEffect(() => {
    setupAxios();
    getPortfolio();
  }, []);

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await searchCompanies(search);
    if (typeof result === "string") {
      setServerError(result);
    } else if (Array.isArray(result)) {
      setSearchResult(result);
    }
  };
  const getPortfolio = () => {
    PortfolioGetAPI()
      .then((res) => {
        if (res?.data) {
          setPortfolioValues(res?.data);
        }
      })
      .catch((error) => {
        setPortfolioValues(null);
      });
  };
  const onPortfolioCreate = (e: any) => {
    e.preventDefault();
    if (portfolioValues!.length === 5) {
      return toast.warning("Cannot add more than 5 elements !");
    }
    portfolioAddAPI(e.target[0].value)
      .then((res) => {
        if (res) {
          toast.success("Stock added to portfolio !");
          getPortfolio();
        }
      })
      .catch((e) => toast.warning("Could not add stock to portfolio !"));
  };

  const onPortfolioDelete = (e: any) => {
    e.preventDefault();
    PortfolioDeleteAPI(e.target[0].value)
      .then((res) => {
        if (res) {
          toast.success("Stock deleted successfully");
          getPortfolio();
        }
      })
      .catch((e) => {
        toast.warning("An error occured00");
      });
  };
  return (
    <div className="App">
      <Search
        onSearchSubmit={onSearchSubmit}
        search={search}
        handleSearchChange={handleSearchChange}
      />
      <ListPortfolio
        portfolioValues={portfolioValues!}
        onPortfolioDelete={onPortfolioDelete}
      />
      <CardList
        searchResults={searchResult}
        onPortfolioCreate={onPortfolioCreate}
      />
      {serverError && <div>Unable to connect to API</div>}
    </div>
  );
};

export default SearchPage;
