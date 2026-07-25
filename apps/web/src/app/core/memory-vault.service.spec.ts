import { TestBed } from '@angular/core/testing';

import { MemoryVaultService } from './memory-vault.service';

describe('MemoryVaultService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('creates a private draft and persists it locally', () => {
    const service = TestBed.inject(MemoryVaultService);

    const created = service.addDraft({
      fullName: 'Rosa Navarro López',
      relationship: 'Abuela paterna',
      birthYear: 1936,
      summary: 'Una vida por documentar.',
    });

    expect(created.status).toBe('BORRADOR');
    expect(created.completeness).toBe(8);
    expect(service.people()[0].fullName).toBe('Rosa Navarro López');
    expect(localStorage.getItem('mindsage-local-vault-v1')).toContain(
      'Rosa Navarro López',
    );
  });

  it('exports a versioned portable snapshot', () => {
    const service = TestBed.inject(MemoryVaultService);
    const snapshot = service.exportSnapshot() as {
      format: string;
      version: number;
      people: unknown[];
    };

    expect(snapshot.format).toBe('mindsage-memory-archive');
    expect(snapshot.version).toBe(1);
    expect(snapshot.people.length).toBeGreaterThan(0);
  });
});
