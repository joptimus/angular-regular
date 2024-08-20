export interface DLScanData {
    // Define the structure based on the PDF417 data standard
    rawData: string;
  }
  
  export interface DriversLicense {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    licenseNumber: string;
    issueDate: string;
    expirationDate: string;
    address: string;
    secondAddress?:string;
    city: string;
    state: string;
    postalCode: string;
    version: string;
  }
  
  export enum ScanDataType {
    QR_CODE = "QR_CODE",
    BARCODE = "BARCODE",
    PDF417 = "PDF417",
    DATAMATRIX = "DATAMATRIX",
    AWBSTRING = "AWBSTRING",
    UNKNOWN = "UNKNOWN"
}