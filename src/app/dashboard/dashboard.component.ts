import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tasinmaz } from "../models/tasinmaz";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

  tasinmazlar: Tasinmaz[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTasinmazlar();
  }

  getTasinmazlar(){
    return this.http.get<Tasinmaz[]>("https://localhost:44348/api/TasinmazBilgi").subscribe((data) => {
      this.tasinmazlar = data;
      this.tasinmazlar.forEach(tasinmaz => tasinmaz.selected = false); // Her taşınmaz nesnesine `selected` alanını ekliyoruz
    });
  }

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.tasinmazlar.forEach(tasinmaz => tasinmaz.selected = isChecked);
  }
}
