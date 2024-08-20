import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { DataService } from 'src/app/services/local/data.service';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-deliver',
  templateUrl: './deliver.page.html',
  styleUrls: ['./deliver.page.scss'],
})
export class DeliverPage implements OnInit {
  @ViewChild('signaturePad') myElement!: ElementRef;
  @ViewChild('signatureCanvas', { static: true })
  signatureCanvas: ElementRef<HTMLCanvasElement>;
  signaturePad: SignaturePad;
  driversLicense = {};
  rawData: string;
  firstName = '';
  lastName = '';
  driverId = '';
  isDlValid: boolean = false;
  todaysDate: string;
  todaysTime: string;
  showSigned: boolean = false;
  isModalOpen = false;
  signature: any;
  imageUrl: string = '';

  constructor(
    private route: Router, 
    private localData: DataService,
    private ngZone: NgZone,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.localData.reload === true) {
      this.showSigned = true;
    }
    this.signature = this.localData.signature;

    // DataWedge.addListener('scan', (event) => {
    //   this.ngZone.run(() => {
    //     console.log('scan event data', event.data);
    //     this.driversLicense = {};
    //     this.rawData = event.data;
  
    //     this.driversLicense = Parse(event.data);
    //     this.engage(this.driversLicense);
    //     console.log(this.driversLicense);
    //   });
     
    // });
  }

  ngAfterViewInit() {
    this.signature = this.localData.signature;
    if (this.localData.reload === true) {
      this.showSigned = true;
      console.log('afterView', this.signature);
      console.log('afterView show signed', this.showSigned);
    }
  }
  ionViewWillEnter() {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({ orientation: 'portrait' });
    }

    if (this.localData.reload === true) {
      this.showSigned = true;
    }
    this.imageUrl = this.localData.signature;
    console.log('ionViewWillEnter show signed', this.showSigned);
    console.log('this.sig', this.signature);
  }

  createCanvas() {
    const canvas = this.myElement.nativeElement;
    const signaturePad = new SignaturePad(canvas, {
      minWidth: 5,
      maxWidth: 10,
      penColor: 'rgb(66, 133, 244)',
    });
    signaturePad.addEventListener(
      'beginStroke',
      () => {
        console.log('Signature started');
      },
      { once: true }
    );
  }

  async engage(data) {
    if(data.expired) {
      await this.presentAlert();
    } else {
      console.log('engage ', data);
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.driverId = data.driversLicenseId;
      this.todaysDate = this.getTodayDate();
      this.todaysTime = this.getCurrentTime();
      this.rawData = '';
    }

  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  willPresent() {}

  getTodayDate(): string {
    const today = new Date();

    const month = today.getMonth() + 1; // getMonth() returns month from 0-11
    const day = today.getDate();

    // Format the month and day to ensure two digits
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${formattedMonth}/${formattedDay}`;
  }
  getCurrentTime(): string {
    const today = new Date();

    const hours = today.getHours();
    const minutes = today.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZoneAbbr = this.getTimeZoneAbbreviation(timeZone);

    return `${formattedHours}:${formattedMinutes} ${timeZoneAbbr}`;
  }
  getTimeZoneAbbreviation(timeZone: string): string {
    // Create a DateTimeFormat object with the desired time zone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    });

    // Get the time zone abbreviation
    const parts = formatter.formatToParts(new Date());
    const timeZoneName = parts.find((part) => part.type === 'timeZoneName');
    return timeZoneName ? timeZoneName.value : 'UTC';
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Expired ID',
      message: 'The scanned ID is expired or invalid.  Please try again.',
      buttons: ['Ok'],
    });

    await alert.present();
  }

  goToSign() {
    this.route.navigate(['signature']);
  }

  backHome() {
    this.rawData = '';
    this.showSigned = false;
    this.localData.reload = false;
    this.localData.signature = '';
    this.route.navigate(['']);
  }

}
