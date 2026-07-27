import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: () => undefined,
    });
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the product promise', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('merecen ser recordadas');
  });

  it('keeps protected workspaces behind the local registration flow', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.navigate('archive');

    expect(app.view()).toBe('home');
    expect(app.authDialogOpen()).toBe(true);
    expect(app.authMode()).toBe('register');
  });

  it('registers a local user and saves a complete private profile', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    Object.assign(app.registerForm, {
      fullName: 'Elena de Prueba',
      email: 'elena@demo.local',
      password: 'prueba',
      acceptTerms: true,
    });

    app.register();
    app.startCreatePerson();
    Object.assign(app.personForm, {
      fullName: 'Pilar de Prueba',
      relationship: 'Abuela',
      summary: 'Una vida preparada para ser documentada.',
      status: 'PRIVADA',
      consentProfile: true,
    });
    app.savePerson();

    expect(app.vault.currentUser()?.fullName).toBe('Elena de Prueba');
    expect(app.selectedPerson().fullName).toBe('Pilar de Prueba');
    expect(app.selectedPerson().status).toBe('PRIVADA');
    expect(app.view()).toBe('person');
  });
});
