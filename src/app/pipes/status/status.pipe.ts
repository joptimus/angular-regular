import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe',
  standalone: true
})
export class StatusPipe implements PipeTransform {

  private descriptions: { [key: string]: string } = {
    DRFT: 'Draft',
    BKD: 'Booked',
    SCRN: 'Screened',
    TRK: 'Truck',
    RCS: 'Ready for Carriage',
    DEP: 'Departed',
    XFOH: 'Transfer On Hand',
    ARR: 'Arrived',
    RCF: 'Received at Facility',
    DLV: 'Delivered',
    TFD: 'Transfer to OAL',
    XOAL: 'XOAL',
    MSNG: 'Missing',
    TRC: 'Escalated',
    LOST: 'Lost',
    CXLD: 'Cancelled',
    VOID: 'Void'
  };

  transform(value: string): string {
    return this.descriptions[value] || 'Unknown Code';
  }

}
