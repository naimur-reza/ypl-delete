export interface SearchParams {
  [key: string]: string | string[] | undefined;
  destination?: string;
  intake?: string;
  country?: string;
  status?: string;
  page?: string;
  limit?: string;
  search?: string;
}

export * from "./intake";
