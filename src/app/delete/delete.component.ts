import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TasinmazService } from '../services/tasinmaz.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  @Input() tasinmazId: number;
  @Output() tasinmazDeleted = new EventEmitter<number>();

  constructor(private tasinmazService: TasinmazService) { }

  ngOnInit() {
  }
  confirmDelete(): void {
    if (confirm('Bu taşınmazı silmek istediğinize emin misiniz?')) {
      this.tasinmazService.deleteTasinmaz(this.tasinmazId).subscribe(() => {
      //this.tasinmazService.deleteTasınmaz(this.tasinmazId).subscribe(() => {
        alert('Taşınmaz başarıyla silindi.');
        this.tasinmazDeleted.emit(this.tasinmazId);
      }, error => {
        console.error('Silme hatası:', error);
        alert('Silme sırasında bir hata oluştu.');
      });
    }
  }
}
