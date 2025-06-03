/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DepartmentRequest {
  departmentId?: number;
  departmentName: string;
}

export interface DepartmentResponse {
  departmentId?: number;
  departmentName?: string;
}

export interface JobTitleRequest {
  jobId?: number;
  title: string;

  /** @format float */
  minSalary?: number;

  /** @format float */
  maxSalary?: number;
}

export interface JobTitleResponse {
  jobId?: number;
  title?: string;

  /** @format float */
  minSalary?: number;

  /** @format float */
  maxSalary?: number;
}

export interface EmployeeRequest {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;

  /** @format date */
  hireDate: string;

  /** @format float */
  salary?: number;
  managerId?: number;
  jobId?: number;
  departmentId?: number;
  employeeHistory?: EmployeeHistoryRequestFromEmployee[];
  employeeDocuments?: EmployeeDocumentRequestFromEmployee[];
}

export interface EmployeeResponse {
  employeeId?: number;
  empNo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;

  /** @format date */
  hireDate?: string;

  /** @format float */
  salary?: number;
  managerId?: number;
  jobId?: number;
  departmentId?: number;
  employeeHistory?: EmployeeHistoryResponse[];
  employeeDocuments?: EmployeeDocumentResponse[];
}

export interface EmployeeHistoryRequest {
  historyId?: number;
  employeeId: number;

  /** @format date */
  startDate: string;

  /** @format date */
  endDate?: string;
  jobId: number;
  departmentId: number;
}

export interface EmployeeHistoryRequestFromEmployee {
  /** @format date */
  startDate: string;

  /** @format date */
  endDate?: string;
  jobId: number;
  departmentId: number;
}

export interface EmployeeHistoryResponse {
  historyId?: number;
  employeeId?: number;

  /** @format date */
  startDate?: string;

  /** @format date */
  endDate?: string;
  jobId?: number;
  departmentId?: number;
}

export interface EmployeeDocumentRequest {
  documentId?: number;
  employeeId: number;
  documentName: string;

  /** @format binary */
  documentContent: File;
}

export interface EmployeeDocumentRequestFromEmployee {
  documentName: string;

  /** @format binary */
  documentContent: File;
}

export interface EmployeeDocumentResponse {
  documentId?: number;
  employeeId?: number;
  documentName?: string;
  documentType?: string;

  /** @format binary */
  documentContent?: File;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Employee Management API
 * @version 1.0.0
 * @baseUrl http://localhost:8080/api
 *
 * API for managing employees, departments, job titles, employee history, and documents.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  department = {
    /**
     * No description
     *
     * @name DepartmentList
     * @summary Get all departments
     * @request GET:/department
     */
    departmentList: (params: RequestParams = {}) =>
      this.request<DepartmentResponse[], any>({
        path: `/department`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentCreate
     * @summary Create a new department
     * @request POST:/department
     */
    departmentCreate: (data: DepartmentRequest, params: RequestParams = {}) =>
      this.request<DepartmentResponse, any>({
        path: `/department`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentDetail
     * @summary Get department by ID
     * @request GET:/department/{id}
     */
    departmentDetail: (id: number, params: RequestParams = {}) =>
      this.request<DepartmentResponse, any>({
        path: `/department/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentUpdate
     * @summary Update department by ID
     * @request PUT:/department/{id}
     */
    departmentUpdate: (id: number, data: DepartmentResponse, params: RequestParams = {}) =>
      this.request<DepartmentResponse, any>({
        path: `/department/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentDelete
     * @summary Delete department by ID
     * @request DELETE:/department/{id}
     */
    departmentDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/department/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  jobtitle = {
    /**
     * No description
     *
     * @name JobtitleList
     * @summary Get all job titles
     * @request GET:/jobtitle
     */
    jobtitleList: (params: RequestParams = {}) =>
      this.request<JobTitleResponse[], any>({
        path: `/jobtitle`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name JobtitleCreate
     * @summary Create a new job title
     * @request POST:/jobtitle
     */
    jobtitleCreate: (data: JobTitleRequest, params: RequestParams = {}) =>
      this.request<JobTitleResponse, any>({
        path: `/jobtitle`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name JobtitleDetail
     * @summary Get job title by ID
     * @request GET:/jobtitle/{id}
     */
    jobtitleDetail: (id: number, params: RequestParams = {}) =>
      this.request<JobTitleResponse, any>({
        path: `/jobtitle/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name JobtitleUpdate
     * @summary Update job title by ID
     * @request PUT:/jobtitle/{id}
     */
    jobtitleUpdate: (id: number, data: JobTitleResponse, params: RequestParams = {}) =>
      this.request<JobTitleResponse, any>({
        path: `/jobtitle/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name JobtitleDelete
     * @summary Delete job title by ID
     * @request DELETE:/jobtitle/{id}
     */
    jobtitleDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/jobtitle/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  employee = {
    /**
     * No description
     *
     * @name EmployeeList
     * @summary Get all employees
     * @request GET:/employee
     */
    employeeList: (params: RequestParams = {}) =>
      this.request<EmployeeResponse[], any>({
        path: `/employee`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name EmployeeCreate
     * @summary Create a new employee
     * @request POST:/employee
     */
    employeeCreate: (data: EmployeeRequest, params: RequestParams = {}) =>
      this.request<EmployeeResponse, any>({
        path: `/employee`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name MultipartCreate
     * @summary Create a new employee with multipart/form-data
     * @request POST:/employee/multipart
     */
    multipartCreate: (
      data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        hireDate?: string;
        jobId?: number;
        salary?: number;
        departmentId?: number;
        startDate?: string;
        managerId?: number;
        documentType?: string;
        documents?: File[];
      },
      params: RequestParams = {},
    ) =>
      this.request<EmployeeResponse, any>({
        path: `/employee/multipart`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name EmployeeDetail
     * @summary Get employee by ID
     * @request GET:/employee/{id}
     */
    employeeDetail: (id: number, params: RequestParams = {}) =>
      this.request<EmployeeResponse, any>({
        path: `/employee/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name EmployeeUpdate
     * @summary Update employee by ID
     * @request PUT:/employee/{id}
     */
    employeeUpdate: (id: number, data: EmployeeResponse, params: RequestParams = {}) =>
      this.request<EmployeeResponse, any>({
        path: `/employee/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name EmployeeDelete
     * @summary Delete employee by ID
     * @request DELETE:/employee/{id}
     */
    employeeDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/employee/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @name DocumentsList
     * @summary Get all employee documents
     * @request GET:/employee/documents
     */
    documentsList: (params: RequestParams = {}) =>
      this.request<EmployeeDocumentResponse[], any>({
        path: `/employee/documents`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DocumentsCreate
     * @summary Upload a new employee document
     * @request POST:/employee/documents
     */
    documentsCreate: (data: EmployeeDocumentRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/employee/documents`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DocumentsDetail
     * @summary Get employee document by ID
     * @request GET:/employee/documents/{id}
     */
    documentsDetail: (id: number, params: RequestParams = {}) =>
      this.request<EmployeeDocumentResponse, any>({
        path: `/employee/documents/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DocumentsUpdate
     * @summary Update employee document by ID
     * @request PUT:/employee/documents/{id}
     */
    documentsUpdate: (id: number, data: EmployeeDocumentResponse, params: RequestParams = {}) =>
      this.request<EmployeeDocumentResponse, any>({
        path: `/employee/documents/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DocumentsDelete
     * @summary Delete employee document by ID
     * @request DELETE:/employee/documents/{id}
     */
    documentsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/employee/documents/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @name HistoryList
     * @summary Get all employee history
     * @request GET:/employee/history
     */
    historyList: (params: RequestParams = {}) =>
      this.request<EmployeeHistoryResponse[], any>({
        path: `/employee/history`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HistoryCreate
     * @summary Create a new employee history record
     * @request POST:/employee/history
     */
    historyCreate: (data: EmployeeHistoryRequest, params: RequestParams = {}) =>
      this.request<EmployeeHistoryResponse, any>({
        path: `/employee/history`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HistoryDetail
     * @summary Get employee history by ID
     * @request GET:/employee/history/{id}
     */
    historyDetail: (id: number, params: RequestParams = {}) =>
      this.request<EmployeeHistoryResponse, any>({
        path: `/employee/history/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HistoryUpdate
     * @summary Update employee history by ID
     * @request PUT:/employee/history/{id}
     */
    historyUpdate: (id: number, data: EmployeeHistoryResponse, params: RequestParams = {}) =>
      this.request<EmployeeHistoryResponse, any>({
        path: `/employee/history/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HistoryDelete
     * @summary Delete employee history by ID
     * @request DELETE:/employee/history/{id}
     */
    historyDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/employee/history/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
}
