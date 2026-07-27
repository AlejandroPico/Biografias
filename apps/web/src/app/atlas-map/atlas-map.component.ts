import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

export interface AtlasPoint {
  readonly id: string;
  readonly personId: string;
  readonly personName: string;
  readonly label: string;
  readonly country: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly kind: string;
  readonly period: string;
  readonly notes?: string;
  readonly accent: string;
}

@Component({
  selector: 'app-atlas-map',
  standalone: true,
  template:
    '<div #mapElement class="leaflet-host" aria-label="Mapa interactivo de lugares vividos"></div>',
  styleUrl: './atlas-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtlasMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) points: readonly AtlasPoint[] = [];
  @Input() selectedPersonId = '';

  @ViewChild('mapElement', { static: true })
  private mapElement!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private contentLayer?: L.LayerGroup;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, {
      zoomControl: true,
      minZoom: 2,
      worldCopyJump: true,
    }).setView([40.2, -1.2], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(this.map);

    this.contentLayer = L.layerGroup().addTo(this.map);
    this.renderPoints();
    queueMicrotask(() => this.map?.invalidateSize());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['points'] || changes['selectedPersonId'])) {
      this.renderPoints();
      queueMicrotask(() => this.map?.invalidateSize());
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderPoints(): void {
    if (!this.map || !this.contentLayer) {
      return;
    }
    this.contentLayer.clearLayers();

    const visible = this.selectedPersonId
      ? this.points.filter((point) => point.personId === this.selectedPersonId)
      : this.points;
    const bounds: L.LatLngExpression[] = [];
    const byPerson = new Map<string, AtlasPoint[]>();

    for (const point of visible) {
      bounds.push([point.latitude, point.longitude]);
      const popup = document.createElement('div');
      popup.className = 'mindsage-map-popup';
      const title = document.createElement('strong');
      title.textContent = point.label;
      const person = document.createElement('span');
      person.textContent = `${point.personName} · ${point.kind}`;
      const period = document.createElement('small');
      period.textContent = point.period;
      popup.append(title, person, period);
      if (point.notes) {
        const notes = document.createElement('p');
        notes.textContent = point.notes;
        popup.append(notes);
      }

      L.circleMarker([point.latitude, point.longitude], {
        radius: point.kind === 'NACIMIENTO' ? 10 : 8,
        color: '#fffdf8',
        weight: 3,
        fillColor: point.accent,
        fillOpacity: 0.95,
      })
        .bindPopup(popup)
        .bindTooltip(`${point.personName}: ${point.label}`, {
          direction: 'top',
          offset: [0, -8],
        })
        .addTo(this.contentLayer);

      byPerson.set(point.personId, [...(byPerson.get(point.personId) ?? []), point]);
    }

    for (const personPoints of byPerson.values()) {
      if (personPoints.length < 2) {
        continue;
      }
      const ordered = [...personPoints].sort(
        (a, b) => Number(a.period.slice(0, 4)) - Number(b.period.slice(0, 4)),
      );
      L.polyline(
        ordered.map((point) => [point.latitude, point.longitude]),
        {
          color: ordered[0].accent,
          weight: 3,
          opacity: 0.65,
          dashArray: '8 8',
        },
      ).addTo(this.contentLayer);
    }

    if (bounds.length === 1) {
      this.map.setView(bounds[0], 8);
    } else if (bounds.length > 1) {
      this.map.fitBounds(L.latLngBounds(bounds), {
        padding: [42, 42],
        maxZoom: 8,
      });
    }
  }
}
