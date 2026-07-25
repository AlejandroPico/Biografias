import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  InterviewQuestion,
  LifeEvent,
  MemoryProfile,
  MemoryVaultService,
} from './core/memory-vault.service';

type View =
  | 'home'
  | 'people'
  | 'person'
  | 'interview'
  | 'timeline'
  | 'family'
  | 'atlas'
  | 'archive'
  | 'privacy';

interface NavigationItem {
  readonly id: View;
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  readonly vault = inject(MemoryVaultService);

  readonly view = signal<View>('home');
  readonly selectedPerson = signal<MemoryProfile>(this.vault.people()[0]);
  readonly searchTerm = signal('');
  readonly darkMode = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly createDialogOpen = signal(false);
  readonly recording = signal(false);
  readonly recordingSeconds = signal(0);
  readonly activeQuestionIndex = signal(0);
  readonly toast = signal('');
  readonly timelineFilter = signal('TODAS');

  readonly newMemory = {
    fullName: '',
    relationship: '',
    birthYear: null as number | null,
    summary: '',
  };

  readonly primaryNavigation: readonly NavigationItem[] = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'people', label: 'Memorias', icon: 'people' },
    { id: 'interview', label: 'Entrevistar', icon: 'mic' },
    { id: 'timeline', label: 'Cronología', icon: 'timeline' },
    { id: 'family', label: 'Familia', icon: 'family' },
    { id: 'atlas', label: 'Atlas', icon: 'map' },
    { id: 'archive', label: 'Archivo', icon: 'archive' },
  ];

  readonly filteredPeople = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase('es');
    if (!term) {
      return this.vault.people();
    }
    return this.vault.people().filter((person) =>
      [
        person.fullName,
        person.occupation,
        person.birthplace,
        person.summary,
        ...person.tags,
      ]
        .join(' ')
        .toLocaleLowerCase('es')
        .includes(term),
    );
  });

  readonly allEvents = computed(() =>
    this.vault
      .people()
      .flatMap((person) =>
        person.events.map((event) => ({
          ...event,
          personName: person.preferredName,
          avatar: person.avatar,
          accent: person.accent,
        })),
      )
      .sort((a, b) => a.year - b.year),
  );

  readonly visibleEvents = computed(() => {
    const category = this.timelineFilter();
    return category === 'TODAS'
      ? this.allEvents()
      : this.allEvents().filter((event) => event.category === category);
  });

  readonly activeQuestion = computed<InterviewQuestion>(
    () => this.vault.questions[this.activeQuestionIndex()],
  );

  readonly recordingClock = computed(() => {
    const minutes = Math.floor(this.recordingSeconds() / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.recordingSeconds() % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  private recordingTimer?: ReturnType<typeof setInterval>;
  private toastTimer?: ReturnType<typeof setTimeout>;

  navigate(view: View): void {
    this.view.set(view);
    this.mobileMenuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openPerson(person: MemoryProfile): void {
    this.selectedPerson.set(person);
    this.navigate('person');
  }

  setTheme(): void {
    const isDark = !this.darkMode();
    this.darkMode.set(isDark);
    document.documentElement.dataset['theme'] = isDark ? 'dark' : 'light';
  }

  toggleRecording(): void {
    if (this.recording()) {
      this.stopRecording();
      this.showToast('Fragmento guardado en el borrador local');
      return;
    }

    this.recording.set(true);
    this.recordingTimer = setInterval(
      () => this.recordingSeconds.update((value) => value + 1),
      1000,
    );
  }

  nextQuestion(): void {
    this.stopRecording();
    this.recordingSeconds.set(0);
    this.activeQuestionIndex.update(
      (index) => (index + 1) % this.vault.questions.length,
    );
  }

  previousQuestion(): void {
    this.stopRecording();
    this.recordingSeconds.set(0);
    this.activeQuestionIndex.update(
      (index) =>
        (index - 1 + this.vault.questions.length) %
        this.vault.questions.length,
    );
  }

  saveNewMemory(): void {
    if (!this.newMemory.fullName.trim()) {
      this.showToast('Escribe al menos el nombre de la persona');
      return;
    }

    const created = this.vault.addDraft({
      fullName: this.newMemory.fullName,
      relationship: this.newMemory.relationship,
      birthYear: Number(this.newMemory.birthYear) || undefined,
      summary: this.newMemory.summary,
    });
    this.selectedPerson.set(created);
    this.createDialogOpen.set(false);
    Object.assign(this.newMemory, {
      fullName: '',
      relationship: '',
      birthYear: null,
      summary: '',
    });
    this.showToast('Memoria creada en este dispositivo');
    this.navigate('person');
  }

  exportArchive(): void {
    const payload = JSON.stringify(this.vault.exportSnapshot(), null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mindsage-archivo-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.showToast('Copia del archivo preparada');
  }

  trackEvent(_: number, event: LifeEvent): string {
    return event.id;
  }

  ngOnDestroy(): void {
    this.stopRecording();
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private stopRecording(): void {
    this.recording.set(false);
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = undefined;
    }
  }

  private showToast(message: string): void {
    this.toast.set(message);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => this.toast.set(''), 3200);
  }
}
