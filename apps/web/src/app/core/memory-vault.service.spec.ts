import { TestBed } from '@angular/core/testing';

import { MemoryVaultService } from './memory-vault.service';

describe('MemoryVaultService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('registers a local user and creates their private self profile', () => {
    const service = TestBed.inject(MemoryVaultService);

    const user = service.register({
      fullName: 'Alejandro de Prueba',
      email: 'alejandro@demo.local',
      password: 'cualquier-valor',
      acceptTerms: true,
    });

    expect(service.currentUser()?.id).toBe(user.id);
    expect(service.selfProfile()?.fullName).toBe('Alejandro de Prueba');
    expect(service.selfProfile()?.status).toBe('PRIVADA');
    expect(localStorage.getItem('mindsage-local-vault-v2')).toContain('alejandro@demo.local');
  });

  it('creates and persists a private biographical draft after login', () => {
    const service = TestBed.inject(MemoryVaultService);
    service.login('Usuario de prueba', 'clave');

    const created = service.addDraft({
      fullName: 'Rosa Navarro López',
      relationship: 'Abuela paterna',
      birthYear: 1936,
      summary: 'Una vida por documentar.',
    });

    expect(created.status).toBe('BORRADOR');
    expect(created.completeness).toBeGreaterThanOrEqual(8);
    expect(service.people()[0].fullName).toBe('Rosa Navarro López');
    expect(localStorage.getItem('mindsage-local-vault-v2')).toContain('Rosa Navarro López');
  });

  it('turns a mentioned name into a linked incomplete profile', () => {
    const service = TestBed.inject(MemoryVaultService);
    service.login('Entrevistadora', 'clave');
    const self = service.selfProfile()!;

    const relation = service.addRelationship({
      fromPersonId: self.id,
      newPersonName: 'Francisco García',
      newPersonBirthYear: 1940,
      kind: 'ABUELO',
      status: 'PENDIENTE',
      visibility: 'PRIVADA',
    });

    const related = service.relationsFor(self.id);
    expect(relation.kind).toBe('ABUELO');
    expect(related[0].person.fullName).toBe('Francisco García');
    expect(related[0].person.profileState).toBe('RECLAMABLE');
  });

  it('exports a public snapshot without private identity or private contributions', () => {
    const service = TestBed.inject(MemoryVaultService);
    service.login('Autora', 'clave');
    const publicPerson = service.people().find((person) => person.status === 'PUBLICADA')!;
    service.addEvent(publicPerson.id, {
      year: 2026,
      title: 'Nota privada',
      description: 'Este texto no debe exportarse.',
      category: 'OTRO',
      place: 'Privado',
      visibility: 'PRIVADA',
    });

    const snapshot = service.exportSnapshot({ publicOnly: true }) as {
      format: string;
      version: number;
      people: {
        privateIdentity?: unknown;
        ownerUserId?: string;
        events: { title: string; createdByUserId?: string }[];
      }[];
    };

    expect(snapshot.format).toBe('mindsage-memory-archive');
    expect(snapshot.version).toBe(2);
    expect(snapshot.people.length).toBeGreaterThan(0);
    expect(snapshot.people.every((person) => !person.privateIdentity)).toBe(true);
    expect(snapshot.people.every((person) => !person.ownerUserId)).toBe(true);
    expect(
      snapshot.people
        .flatMap((person) => person.events)
        .some((event) => event.title === 'Nota privada' || Boolean(event.createdByUserId)),
    ).toBe(false);
  });
});
