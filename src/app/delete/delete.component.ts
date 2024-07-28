import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TasinmazService } from '../services/tasinmaz.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  @Input() tasinmazId: number;
  @Output() tasinmazDeleted = new EventEmitter<number>();

  constructor(private tasinmazService: TasinmazService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  confirmDelete(): void {
     
      this.tasinmazService.deleteTasinmaz(this.tasinmazId).subscribe(() => {
        this.alertifyService.success('Tasinmaz başarıyla silindi');
        this.tasinmazDeleted.emit(this.tasinmazId);
      });
    
  }
  
}
