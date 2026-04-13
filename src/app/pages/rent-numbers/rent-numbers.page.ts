import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { countryToAlpha2 } from 'country-to-iso';
import {
  IonButton,
  IonItem,
  IonLoading,
  IonSpinner,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonLabel,
  IonButtons,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SmsService } from '../../core/services/sms.service';

@Component({
  selector: 'app-rent-number',
  templateUrl: './rent-numbers.page.html',
  styleUrls: ['./rent-numbers.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonItem,
    IonSpinner,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonLabel,
    IonButtons,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonNote,
    IonIcon,
    FormsModule,
    CommonModule,
  ],
})
export class RentNumbersPage implements OnInit {
  constructor() {
    addIcons({ chevronDownOutline });
  }
  hosts = signal<any[]>([]);

  private smsService = inject(SmsService);

  hostSelected = signal('');

  get activeHost() {
    return this.hosts().find((h) => h.name === this.hostSelected());
  }

  selectedCountry = signal('');
  selectedCountryName = signal('');
  selectedService = signal('');
  selectedServiceName = signal('');
  totalCost = signal(0);
  isCalculatingTotal = signal(false);

  countryPage = signal(1);
  servicePage = signal(1);
  hasMoreCountries = signal(true);
  hasMoreServices = signal(true);
  limit = 50;

  isCountryModalOpen = signal(false);
  isServiceModalOpen = signal(false);

  countrySearchTerm = signal('');
  serviceSearchTerm = signal('');
  private countrySearchSubject = new Subject<string>();
  private serviceSearchSubject = new Subject<string>();

  filteredCountries = signal<any[]>([]);
  filteredServices = signal<any[]>([]);
  isLoading = signal(false);
  isHostsLoading = signal(true);

  ngOnInit() {
    console.log(`loading`);
    this.loadHosts();
    console.log(`loading3`);

    this.countrySearchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.countrySearchTerm.set(term);
      this.resetCountryPagination();
      this.loadCountries();
    });

    this.serviceSearchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.serviceSearchTerm.set(term);
      this.resetServicePagination();
      this.loadServices();
    });
  }

  loadHosts() {
    console.log(`loading2`);
    this.isLoading.set(true);
    this.smsService.getServerStatus().subscribe({
      next: (res: { success: boolean; message: string; data: Record<string, boolean> }) => {
        const data = Object.entries(res.data)
          .map(([name, status]) => ({ name, status }))
          .sort((a, b) => Number(a.name) - Number(b.name));
        this.hosts.set(data);
        if (data.length > 0) {
          this.isLoading.set(false);
          this.hostSelected.set(data[0].name);
          this.loadCountries();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  setActiveHost(id: string) {
    this.hostSelected.set(id);
    this.resetSelections();
    this.loadCountries();
  }

  resetSelections() {
    this.selectedCountry.set('');
    this.selectedCountryName.set('');
    this.selectedService.set('');
    this.selectedServiceName.set('');
    this.totalCost.set(0);
    this.resetCountryPagination();
    this.resetServicePagination();
    this.serviceSearchTerm.set('');
    this.countrySearchTerm.set('');
  }

  resetCountryPagination() {
    this.countryPage.set(1);
    this.filteredCountries.set([]);
    this.hasMoreCountries.set(true);
  }

  resetServicePagination() {
    this.servicePage.set(1);
    this.filteredServices.set([]);
    this.hasMoreServices.set(true);
  }

  onCountrySearch(value: string) {
    this.countrySearchSubject.next(value);
  }

  onServiceSearch(value: string) {
    this.serviceSearchSubject.next(value);
  }

  loadCountries() {
    if (!this.hasMoreCountries() || this.isLoading()) return;
    this.isLoading.set(true);
    this.smsService
      .getCountries(this.hostSelected(), this.countryPage(), this.limit, this.countrySearchTerm())
      .subscribe({
        next: (res) => {
          this.filteredCountries.set([...this.filteredCountries(), ...res.data]);
          this.hasMoreCountries.set(this.filteredCountries().length < res.pagination.total);
          this.isLoading.set(false);
          this.isHostsLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
      });
  }

  loadServices() {
    if (!this.selectedCountry() || !this.hasMoreServices() || this.isLoading()) return;
    this.isLoading.set(true);
    this.smsService
      .getServices(
        this.hostSelected(),
        this.selectedCountry(),
        this.servicePage(),
        this.limit,
        this.serviceSearchTerm(),
      )
      .subscribe({
        next: (res) => {
          this.filteredServices.set([...this.filteredServices(), ...res.data]);
          this.hasMoreServices.set(this.filteredServices().length < res.pagination.total);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
      });
  }

  loadMoreCountries(event: any) {
    this.countryPage.set(this.countryPage() + 1);
    this.loadCountries();
    event.target.complete();
  }

  loadMoreServices(event: any) {
    this.servicePage.set(this.servicePage() + 1);
    this.loadServices();
    event.target.complete();
  }

  selectCountry(country: any) {
    this.selectedCountry.set(country.code);
    this.selectedCountryName.set(country.name);
    this.isCountryModalOpen.set(false);
    this.selectedService.set('');
    this.selectedServiceName.set('');
    this.totalCost.set(0);
    this.resetServicePagination();
    this.loadServices();
  }

  selectService(service: any) {
    this.selectedService.set(service.id);
    this.selectedServiceName.set(service.name);
    this.isServiceModalOpen.set(false);
    this.calculateTotal();
  }

  calculateTotal() {
    if (!this.selectedCountry() || !this.selectedService()) return;
    this.isCalculatingTotal.set(true);
    this.smsService
      .getPrice(this.hostSelected(), this.selectedService(), this.selectedCountry())
      .subscribe({
        next: (res) => {
          this.totalCost.set(res.data.price);
          this.isCalculatingTotal.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isCalculatingTotal.set(false);
          this.totalCost.set(0);
        },
      });
  }

  toggleCountryModal() {
    this.isCountryModalOpen.set(!this.isCountryModalOpen());
  }

  toggleServiceModal() {
    this.isServiceModalOpen.set(!this.isServiceModalOpen());
  }

  confirmPurchase() {
    this.isLoading.set(true);
    this.smsService
      .purchaseNumber(this.hostSelected(), this.selectedService(), this.selectedCountry())
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

  countryToAlpha(input: string) {
    return countryToAlpha2(input)?.toLowerCase();
  }
}
