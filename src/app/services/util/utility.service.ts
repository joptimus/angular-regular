import { Injectable } from '@angular/core';
import { ScanDataType } from 'src/app/interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  compareDate(inputDate: string): boolean {
    // Check if the inputDate is valid
    if (inputDate.length !== 8 || isNaN(Number(inputDate))) {
      return false;
    }

    // Extract month, day, and year from the input string
    const month = parseInt(inputDate.substring(0, 2), 10);
    const day = parseInt(inputDate.substring(2, 4), 10);
    const year = parseInt(inputDate.substring(4, 8), 10);

    // Create a Date object from the input string
    const inputDateObj = new Date(year, month - 1, day);

    // Get the current date without time
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Compare the input date with the current date
    if (inputDateObj < currentDate) {
      return false;
    } else {
      return true;
    }
  }

  setServiceImage(level: string) {
    switch (level) {
      case "N":
        return "./assets/nfg.svg";
      case "FF":
        return "./assets/freshfast.svg";
      case "S":
        return "./assets/standard.svg";
      case "C":
        return "./assets/comat.png";
      case "AOG":
        return "./assets/aog.png";
      default:
        console.warn("Unknown service level:", level);
        return "";
    }
  }

  decodeScanData(scanData: string): ScanDataType {
    // Regex patterns to identify QR codes, barcodes, and PDF417
    const datamatrixPattern = /^\d{11}[A-Za-z0-9]{6}[A-Za-z0-9]{5}$/;
    const qrCodePattern = /^[A-Z0-9]{10,}$/i; 
    const barcodePattern = /^\d{12,13}$/; // Example pattern for UPC/EAN barcodes
    const pdf417Pattern = /([A][N][S][I])/;
    const enteredString = /^\d{11}$/;

    if (enteredString.test(scanData)) {
      return ScanDataType.AWBSTRING;
    } else if (barcodePattern.test(scanData)) {
      return ScanDataType.BARCODE;
    } else if (pdf417Pattern.test(scanData)) {
      return ScanDataType.PDF417;
    } else if (datamatrixPattern.test(scanData)) {
      return ScanDataType.DATAMATRIX;
    } else if (qrCodePattern.test(scanData)) {
      return ScanDataType.QR_CODE;
    } else {
      return ScanDataType.UNKNOWN;
    }
  }

  // getAwbFromString(shipmentString: string) {
  //   if (shipmentString.length !== 22) {
  //     throw new Error('Input string must be exactly 22 characters long.');
  //   }

  //   // Extract the numeric part of the awb
  //   const awbPart = shipmentString.substring(0, 11);
  //   const awb = parseInt(awbPart.replace(/\D/g, ''), 10);

  //   // Extract the numeric part of the pieces
  //   const piecesPart = shipmentString.substring(11, 17);
  //   const pieces = parseInt(piecesPart.replace(/\D/g, ''), 10);

  //   // Extract the numeric part of the weight
  //   const weightPart = shipmentString.substring(17, 22);
  //   const weight = parseInt(weightPart.replace(/\D/g, ''), 10);

  //   return awb;
  // }

  getAwbFromString(shipmentString: string) {
    if (shipmentString.length !== 29) {
        throw new Error('Input string must be exactly 29 characters long.');
    }

    // Extract the numeric part of the awb
    const awbPart = shipmentString.substring(0, 11);
    const awb = parseInt(awbPart.replace(/\D/g, ''), 10);

    const lotPart = shipmentString.substring(12,14)
    const lotId = parseInt(lotPart.replace(/\D/g, ''), 10);

    // Extract the numeric part of the pieces
    const pieceId = shipmentString.substring(14, 18);
    // const pieceId = parseInt(piecesPart.replace(/\D/g, ''), 10);

    const sequenceNumberPart = shipmentString.substring(18, 19);
    const sequenceNumber = parseInt(sequenceNumberPart.replace(/\D/g, ''), 10);

    // Extract the numeric part of the weight
    const pieceWeightPart = shipmentString.substring(20, 24);
    const pieceWeight = parseInt(pieceWeightPart.replace(/\D/g, ''), 10);

    const volPart = shipmentString.substring(25, 29);
    const vol = parseInt(volPart.replace(/\D/g, ''), 10);
    // return {
    //     awbPrefixAndNumber: awb,
    //     lotId: lotId,
    //     pieceId: pieceId,
    //     sequenceNumber: sequenceNumber,
    //     pieceWeight: pieceWeight,
    //     vol: vol
    // };

    return awb;
  }
  
}
