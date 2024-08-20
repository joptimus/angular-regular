import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Parse } from 'aamva-parser';
import { Observable } from 'rxjs';
import { ScanDataType, DLScanData } from 'src/app/interfaces/interfaces';
import { UtilityService } from 'src/app/services/util/utility.service';
import { ModalComponent } from '../components/modal/modal.component';
import { ReceiveComponent } from '../components/receive/receive.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement: ElementRef;
  @ViewChild('screenshotElement') screenshotElement: ElementRef;
  screenshots: string[] = [];
  public folder!: string;
  private scanListenerAdded = false;
  private lastScannedData: string | null = null;
  private activatedRoute = inject(ActivatedRoute);
  private trackingApiUrl = 'https://tracking.cargoapi.swab2b.com/v1/shipments/';
  private allFacilitiesApiUrl = 'https://facilities.cargoapi.swab2b.com/v1/facilities';
  private singleFacilityApiUrl = 'https://facilities.cargoapi.swab2b.com/v1/facilities?airportCodeIATA=';
  scanData: string = '';
  pdfData: string;
  isModalOpen: boolean = false;
  data: any;
  apiAddress: string = '';
  urlToCall: string = '';
  serviceLevel: string = '';
  facilitiesData: any;
  dlData;
  isValidResult: boolean;
  show: boolean = false;
  showPDF417Data: boolean = false;
  rawData: string;
  stream;

  constructor(
    private http: HttpClient,
    private loading: LoadingController,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private utility: UtilityService
  ) {}

  async ngOnInit() {
    this.setupKeyboardListener();
    this.initializeFolder();
    console.log('did ngOnit call again?');
    this.setupScanListener();
    this.test2();
  }

  test2() {
    const str = '5261007096600100011Z0010L0001';
    const result = this.utility.getAwbFromString(str);
    console.log('test result: ', result);
  }

  // ngAfterViewInit() {
  //   console.log('ngAfterViewInit called');
  //   console.log(this.videoElement); // Should not be undefined here
  //   this.startVideoStream();
  // }
  private setupKeyboardListener(): void {
    // if (Capacitor.getPlatform() === 'android') {
    //   Keyboard.addListener('keyboardWillShow', (info) => {
    //     Keyboard.hide();
    //     console.log('keyboard will show with height:', info.keyboardHeight);
    //   });
    // }
  }

  private async initializeFolder(): Promise<void> {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.folder);

    if (this.folder === 'facilities') {
      console.log('matches facilities');
      await this.getFacilityData();
    }
  }

  private setupScanListener(): void {
    if (this.scanListenerAdded) {
      return;
  }
    this.dlData = {};

    // DataWedge.addListener('scan', (event) => {
    //   if (this.lastScannedData === event.data) {
    //     return;  // Skip duplicate events
    //   }

    //   this.lastScannedData = event.data;
    //   console.log('scan event data', event.data);
    //   this.handleScanEvent(event.data, 'scanner');
    // });
  }

  async openScanner() {
    if(Capacitor.isNativePlatform()) {
      const data = await CapacitorBarcodeScanner.scanBarcode({
        hint: 11 || 6,
        cameraDirection: 1,
      });
      console.log(data);
      await this.handleScanEvent(data.ScanResult,'camera');
    } else {
      console.warn('not Native Platform', Capacitor.getPlatform());
    }

  }


  private handleScanEvent(data: string, from): void {
    this.dlData = {};
    this.rawData = data;
    console.log('Where is scan coming from:', from)
    const pattern = this.utility.decodeScanData(data);
    console.log('The scan pattern is: ', pattern);
    this.pdfData = data;
    this.data = data

    switch (pattern) {
      case ScanDataType.AWBSTRING:
        this.fetchData(data);
        this.pdfData = '';
        this.showPDF417Data = true;
        break;
      case ScanDataType.PDF417:
        this.handlePDF417Scan(data);
        break;
      case ScanDataType.QR_CODE:
        const awb = this.utility.getAwbFromString(data);
        this.fetchData(awb);
        break;
      default:
        console.log('no pattern matched');
        this.fetchData(data);
        this.pdfData = '';
        this.showPDF417Data = true;
        break;
    }
  }

  private handlePDF417Scan(data: string): void {
    this.dlData = Parse(data);
    const isValid = this.dlData.expired;
    this.show = true;
    this.rawData = '';

    this.isValidResult = !isValid;
  }

  async openModal(data) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        data: data,
      },
    });

    modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }
  }

  async deliverModal(data) {
    const modal = await this.modalCtrl.create({
      component: ReceiveComponent,
      componentProps: {
        data: data,
      },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
    }
  }

  resetScanData() {
    this.scanData = '';
  }

  private resetData() {
    this.data = '';
    this.serviceLevel = '';
    console.log('reset the data', this.data);
  }

  getData(awb: string): Observable<any> {
    this.apiAddress = `${this.trackingApiUrl}${awb}`;
    return this.http.get<any>(this.apiAddress);
  }

  getFacilitiesData(station?: string): Observable<any> {
    const url = station? `${this.singleFacilityApiUrl}${station}`: this.allFacilitiesApiUrl;
    return this.http.get<any>(url);
  }

  async fetchData(data?) {
    const awb = data || this.scanData;
    await this.presentLoading('Searching');

    this.getData(awb).subscribe(
      (response) => {
        console.log('is there previous data? ', this.data);
        console.log('API Response:', response);
        this.data = response;
        this.serviceLevel = this.utility.setServiceImage(response.serviceLevel.code);

        console.warn('what is this.folder', this.folder);
        if(this.folder === 'status') {

        console.warn('what is this.folder status', this.folder);
          this.openModal(this.data);
        } else {

        console.warn('what is this.folder deliver', this.folder);
          this.deliverModal(this.data);
        }

        this.resetScanData();
        this.dismissLoading();
      },
      (error) => {
        console.error('API Error:', error);
        this.resetScanData();
        this.loading.dismiss();
        this.presentAlert(error);
      }
    );
  }

  async getFacilityData(station?) {
    await this.presentLoading('Loading Facilities...');
    this.getFacilitiesData(station).subscribe(
      async (response) => {
        console.log('Facility API Res:', response);
        const sorted = _.orderBy(response, ['airportCodeIATA'], ['asc']);
        this.facilitiesData = sorted;
        await this.dismissLoading();
      },
      async (err) => {
        console.error('Facility API Error: ', err);
        await this.dismissLoading();
      }
    );
  }

  private async presentLoading(message: string) {
    const loading = await this.loading.create({ message });
    await loading.present();
  }
  private async dismissLoading() {
    const loading = await this.loading.getTop();
    if (loading) {
      await loading.dismiss();
    }
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: msg.status,
      message: msg.error.message,
      buttons: ['Ok'],
    });
    await alert.present();
  }

  testDL() {
    const data: DLScanData = {
      rawData: `@ANSI 636015090002DL00410280ZT03210007DLDCACDCBNONEDCDNONEDBA10232031DCSSMITHDDENDACJAMESDDFNDADSAMUAELDDGNDBD11062023DBB08131976DBC1DAYHAZDAU077 inDAG7830 HIDDEN HOLLOW STDAINORTHLAKEDAJTXDAK762470000DAQ42145201DCF00121301114026257731DCGUSADAZBRODCK10022062600DCLWODDAFDDB07162021DAW350ZTZTAN`,
    };
    const raw =
      '`@ANSI 636015090002DL00410280ZT03210007DLDCACDCBNONEDCDNONEDBA10232031DCSSMITHDDENDACJAMESDDFNDADSAMUAELDDGNDBD11062023DBB08131976DBC1DAYHAZDAU077 inDAG7830 HIDDEN HOLLOW STDAINORTHLAKEDAJTXDAK762470000DAQ42145201DCF00121301114026257731DCGUSADAZBRODCK10022062600DCLWODDAFDDB07162021DAW350ZTZTAN`';
    const data3 = '52614643300';
    const data2 = Parse(raw);
    console.log('what is data2:', data2);
    console.log('what is PDF Data: ', this.pdfData);
    // const dl = this.driversL.transform(this.pdfData);
    // this.pdfData = data;
    // console.log('dl', dl);
    this.handleScanEvent(this.pdfData, 'testDL');
  }

  startVideoStream() {
    const video = this.videoElement.nativeElement;
    video.width = 250;
    

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          this.stream = mediaStream;
          video.srcObject = this.stream;
        })
        .catch((error) => {
          console.log('Something went wrong!', error);
        });
    }
  }

  stopVideoStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null; // Clear the stream variable
    }
  }

  captureScreenshot() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    this.screenshots.push(dataUrl);
  }

  clear() {
    this.screenshots = [];
  }

  startScan() {
    // const i = DataWedge.startScanning()
  }
}
