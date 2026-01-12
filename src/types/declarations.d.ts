declare module "*.css";
declare module "summernote/dist/*";

interface JQuery {
  summernote(options?: any): JQuery;
  summernote(method: string, ...args: any[]): any;
}
