import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as L from 'leaflet';


const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  // Leaflet
  private map: any;
  private marker: any;
  // variables
  public formModal: FormGroup;

  constructor( private fb: FormBuilder) { 
    this.formModal = this.fb.group({
      latitud: [''],
      longitud: ['']
    });
  }

  ngOnInit(): void {
    // this.getPosition();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  // inicializa el mapa
  private initMap(): void {
    this.map = L.map('map', {
      center: [-17.77484, -63.15216],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  // obtiene la ubicacion
  getPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          // Obtiene la latitud y longitud de la posición
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;
          // marca en el mapa
          this.marker = L.marker([lat, lon], { draggable: true }).addTo(this.map);
          // obtiene la longitud y latitud del puntero al moverse
          this.marker.on('dragend', (event: any) => {
            var marker = event.target;
            var position = marker.getLatLng();
            this.actualizarPosicion(position.lat, position.lng);
          });
          // dibuja el pop-up
          const mensaje = `<h3>posición</h3>`;
          this.marker.bindPopup(mensaje).openPopup();
          // obtiene la latitud y longitud del marcador
          var latLngs = this.marker.getLatLng();
          // Centra la información   
          var markerBounds = L.latLngBounds([latLngs]);
          this.map.fitBounds(markerBounds, { maxZoom: this.map.getZoom() + 10 });
          this.actualizarPosicion(latLngs.lat, latLngs.lng);
        }
      });
    }
  }

  actualizarPosicion(lat: string, lon: string): void {    
    this.formModal.controls['latitud'].setValue(lat);
    this.formModal.controls['longitud'].setValue(lon);
  }

}
