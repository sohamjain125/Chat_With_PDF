declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    info?: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: string;
      ModDate?: string;
    };
    metadata?: any;
    version?: string;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export = pdf;
}
