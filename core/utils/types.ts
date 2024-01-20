export interface IHttpErrorMeta extends Record<string, any> {
  message?: void;
  uniqueError?: true;
  deliveredQuantityError?: true;
}
