import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonSpinner,
} from '@ionic/angular/standalone';
import { SmsService } from '../../core/services/sms.service';

@Component({
  selector: 'app-rent-number',
  templateUrl: './rent-numbers.page.html',
  standalone: true,
  imports: [IonButton, IonItem, IonSelect, IonSelectOption, IonSpinner, FormsModule, CommonModule],
})
export class RentNumbersPage implements OnInit {
  hosts = [
    { id: 'host_1', name: 'Host A', requiresCountry: true },
    { id: 'host_2', name: 'Host B', requiresCountry: true },
    { id: 'host_3', name: 'Host C', requiresCountry: true },
  ];

  private smsService = inject(SmsService);

  hostSelected = this.hosts[0].id;

  get activeHost() {
    return this.hosts.find((h) => h.id === this.hostSelected) as (typeof this.hosts)[number];
  }

  selectedCountry = '';
  selectedService = '';
  totalCost = 0;

  countrySearchTerm = '';
  serviceSearchTerm = '';

  filteredCountries: any[] = [];
  filteredServices: any[] = [];
  isLoading = signal(false);

  ngOnInit() {
    this.updateFilteredOptions();
  }

  setActiveHost(id: string) {
    this.hostSelected = id;
    this.resetSelections();
    this.updateFilteredOptions();
  }

  resetSelections() {
    this.selectedCountry = '';
    this.selectedService = '';
    this.totalCost = 0;
    this.filteredCountries = [];
    this.filteredServices = [];
  }

  filterCountries() {
    const term = this.countrySearchTerm.toLowerCase();
    this.filteredCountries = this.filteredCountries.filter((c) =>
      c.name.toLowerCase().includes(term),
    );
  }

  filterServices() {
    const term = this.serviceSearchTerm.toLowerCase();
    this.filteredServices = this.filteredServices.filter((s) =>
      s.name.toLowerCase().includes(term),
    );
  }

  onCountryChange() {
    this.selectedService = '';
    this.totalCost = 0;
    this.updateFilteredOptions();
  }

  updateFilteredOptions() {
    this.isLoading.set(true);
    if (this.selectedCountry) {
      this.smsService.getServices(this.hostSelected, this.selectedCountry).subscribe({
        next: (res) => {
          this.filteredServices = res.data;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
      });
    } else {
      this.smsService.getCountries(this.hostSelected).subscribe({
        next: (res) => {
          this.filteredCountries = res.data;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
      });
    }
  }

  calculateTotal() {
    const service = this.filteredServices.find((s) => s.id === this.selectedService);
    this.totalCost = service ? service.price : 0;
  }

  confirmPurchase() {
    this.isLoading.set(true);
    this.smsService
      .purchaseNumber(this.hostSelected, this.selectedService, this.selectedCountry)
      .subscribe({
        next: (res) => {
          console.log('Purchase successful:', res.data);
          this.isLoading.set(false);
          // Redirect or show success
        },
        error: (err) => {
          console.error('Purchase failed:', err);
          this.isLoading.set(false);
        },
      });
  }
}
