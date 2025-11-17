import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-rent-number',
  templateUrl: './rent-numbers.page.html',
  standalone: true,
  imports: [IonButton, IonItem, IonSelect, IonSelectOption, FormsModule, CommonModule],
})
export class RentNumbersPage implements OnInit {
  hosts = [
    {
      id: '1',
      name: 'Host A',
      requiresCountry: true,
      countries: [
        {
          name: 'Nigeria',
          services: [
            { name: 'MTN', price: 300 },
            { name: 'Airtel', price: 250 },
          ],
        },
        {
          name: 'Ghana',
          services: [
            { name: 'MTN Ghana', price: 320 },
            { name: 'Vodafone', price: 280 },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Host B',
      requiresCountry: false,
      services: [
        { name: 'Telegram', price: 150 },
        { name: 'WhatsApp', price: 200 },
        { name: 'Signal', price: 180 },
      ],
    },
    {
      id: '3',
      name: 'Host C',
      requiresCountry: true,
      countries: [
        {
          name: 'Kenya',
          services: [
            { name: 'Safaricom', price: 310 },
            { name: 'Airtel Kenya', price: 260 },
          ],
        },
        {
          name: 'South Africa',
          services: [
            { name: 'MTN SA', price: 350 },
            { name: 'Vodacom', price: 300 },
          ],
        },
      ],
    },
  ];

  hostSelected = this.hosts[0].id;

  get activeHost() {
    return this.hosts.find((h) => h.id === this.hostSelected) as (typeof this.hosts)[number];
  }

  selectedCountry = '';
  selectedService = '';
  totalCost = 0;

  countrySearchTerm = '';
  serviceSearchTerm = '';

  filteredCountries: string[] = [];
  filteredServices: { name: string; price: number }[] = [];

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
    const allCountries = this.activeHost.countries?.map((c: any) => c.name) || [];
    this.filteredCountries = allCountries.filter((c) => c.toLowerCase().includes(term));
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
    if (this.activeHost.requiresCountry) {
      // Country-based host
      const countries = this.activeHost.countries?.map((c: any) => c.name) || [];
      this.filteredCountries = [...countries];

      if (this.selectedCountry) {
        const selectedCountryData = this.activeHost.countries?.find(
          (c: any) => c.name === this.selectedCountry,
        );
        this.filteredServices = selectedCountryData?.services || [];
      } else {
        this.filteredServices = [];
      }
    } else {
      // Host defines services globally
      this.filteredCountries = [];
      this.filteredServices = this.activeHost.services || [];
    }
  }

  calculateTotal() {
    const service = this.filteredServices.find((s) => s.name === this.selectedService);
    this.totalCost = service ? service.price : 0;
  }

  confirmPurchase() {
    console.log('Host:', this.activeHost.name);
    console.log('Country:', this.selectedCountry);
    console.log('Service:', this.selectedService);
    console.log('Total:', this.totalCost);
  }
}
