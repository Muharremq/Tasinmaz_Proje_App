import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tasinmaz } from "../models/tasinmaz";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

  constructor( private http: HttpClient) { 

  }

  tasinmazlar: Tasinmaz []= [];

  ngOnInit() {
    this.getTasinmazlar();
  }

  getTasinmazlar(){
    return this.http.get<Tasinmaz[]>("https://localhost:5001/api/TasinmazBilgi").subscribe((data) => {
      this.tasinmazlar = data;
    });
  }
}
