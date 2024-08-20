import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent  implements OnInit {
  data;
  totalPieces;
  name: string;
  
  constructor(
    private modalCtrl: ModalController,
    private route: Router
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.totalPieces = this.sumPieces(this.data.lineInformations);
  }

  sumPieces(items): number {
    return items.reduce((total, item) => total + item.pieces, 0);
  }

  confirm() {

    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
