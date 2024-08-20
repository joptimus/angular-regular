import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import SignaturePad from 'signature_pad';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { DataService } from 'src/app/services/local/data.service';
@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {
  @ViewChild('signature-pad') myElement!: ElementRef;

  @ViewChild('signatureCanvas', { static: true }) signatureCanvas: ElementRef<HTMLCanvasElement>;
  signaturePad: SignaturePad;
  
  constructor(
    private route: Router,
    private localData: DataService
  ) { }

  async ngOnInit() {

    const orientation = await ScreenOrientation.orientation()

    console.log('what is orientation:', orientation.type)
    if(Capacitor.isNativePlatform()) {
      const second =await ScreenOrientation.lock({orientation: 'landscape-primary'})
    }

  }
  ngAfterViewInit() {
    const canvas = this.signatureCanvas.nativeElement;
    this.signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
    });

    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas()});
  }

  resizeCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear();
  }

  createCanvas() {
    const wrapper = this.myElement.nativeElement;
    const canvas = wrapper.querySelector("canvas");
    const signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)'
  });
  signaturePad.addEventListener("onresize", () => {
  
    const ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear(); // otherwise isEmpty() might return incorrect value
  });

 // otherwise isEmpty() might return incorrect value
  signaturePad.addEventListener("beginStroke", () => {
    console.log("Signature started");
  }, { once: true });
  }

  backToDeliver() {
    this.route.navigate(['deliver']);
  }

  save() {
    const dataURL = this.signaturePad.toDataURL('image/svg+xml');
    this.localData.signature = dataURL;
    console.log('this.localdata,', this.localData.signature)
    this.localData.reload = true;
    this.backToDeliver();
    
  }

  saveAsSVG() {
    const dataURL = this.signaturePad.toDataURL('image/svg+xml');
    console.log('dataurl', dataURL)
    this.download(dataURL, 'signature.svg');
  }

  download(dataURL: string, filename: string) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.click();
  }
  clearSignature() {
    this.signaturePad.clear();
  }

}
