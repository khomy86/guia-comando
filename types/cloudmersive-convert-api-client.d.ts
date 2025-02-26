declare module 'cloudmersive-convert-api-client' {
  const ApiClient: {
    instance: {
      authentications: {
        [key: string]: {
          apiKey: string;
          apiKeyPrefix?: string;
        };
      };
    };
  };

  class ConvertDocumentApi {
    convertDocumentAutodetectToPdf(
      inputFile: any,
      callback: (error: any, data: any, response: any) => void
    ): void;
  }

  const _default: {
    ApiClient: typeof ApiClient;
    ConvertDocumentApi: typeof ConvertDocumentApi;
  };

  export default _default;
} 