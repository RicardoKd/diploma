export interface IUserPopularCategoriesRangeStats {
  username: string;
  income: {
    month: string;
    quarter: string;
    year: string;
  };
  spend: {
    month: string;
    quarter: string;
    year: string;
  };
}
