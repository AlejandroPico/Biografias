import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AtlasMapComponent, AtlasPoint } from './atlas-map/atlas-map.component';
import { LocalMediaStoreService } from './core/local-media-store.service';
import {
  InterviewQuestion,
  LifeEvent,
  MediaItem,
  MemoryProfile,
  MemoryVaultService,
  PersonFormValue,
  RelationKind,
  Visibility,
} from './core/memory-vault.service';

type View =
  | 'home'
  | 'people'
  | 'person'
  | 'person-editor'
  | 'interview'
  | 'timeline'
  | 'family'
  | 'atlas'
  | 'archive'
  | 'messages'
  | 'privacy'
  | 'about';

interface NavigationItem {
  readonly id: View;
  readonly label: string;
  readonly icon: string;
  readonly protected?: boolean;
}

const emptyPersonForm = (): PersonFormValue => ({
  fullName: '',
  preferredName: '',
  relationship: '',
  birthDate: '',
  deathDate: '',
  isLiving: true,
  gender: '',
  pronouns: '',
  birthplace: '',
  residence: '',
  nationality: '',
  languages: '',
  occupation: '',
  education: '',
  militaryService: '',
  beliefs: '',
  summary: '',
  biography: '',
  tags: '',
  status: 'BORRADOR',
  dni: '',
  socialSecurityNumber: '',
  phone: '',
  email: '',
  consentProfile: false,
  consentInterview: false,
  consentMedia: false,
  consentPublicSharing: false,
  consentAiUse: false,
});

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, AtlasMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  readonly vault = inject(MemoryVaultService);
  private readonly mediaStore = inject(LocalMediaStoreService);

  readonly view = signal<View>('home');
  readonly selectedPerson = signal<MemoryProfile>(this.vault.people()[0]);
  readonly editingPersonId = signal<string | undefined>(undefined);
  readonly familyFocusId = signal(this.vault.people()[0].id);
  readonly selectedAtlasPersonId = signal('');
  readonly searchTerm = signal('');
  readonly darkMode = signal(localStorage.getItem('mindsage-theme') === 'dark');
  readonly mobileMenuOpen = signal(false);
  readonly authDialogOpen = signal(false);
  readonly authMode = signal<'login' | 'register'>('register');
  readonly eventDialogOpen = signal(false);
  readonly relationDialogOpen = signal(false);
  readonly placeDialogOpen = signal(false);
  readonly wisdomDialogOpen = signal(false);
  readonly composeDialogOpen = signal(false);
  readonly recording = signal(false);
  readonly recordingSeconds = signal(0);
  readonly activeQuestionIndex = signal(0);
  readonly currentInterviewId = signal<string | undefined>(undefined);
  readonly lastRecordingMediaId = signal<string | undefined>(undefined);
  readonly toast = signal('');
  readonly timelineFilter = signal('TODAS');
  readonly timelineScope = signal<'GENERAL' | 'PERSONAL'>('GENERAL');
  readonly mediaUrls = signal<Record<string, string>>({});
  readonly storageUsage = signal('Calculando…');
  readonly uploadInProgress = signal(false);

  readonly loginForm = { identifier: '', password: '' };
  readonly registerForm = {
    fullName: '',
    email: '',
    password: '',
    birthDate: '',
    dni: '',
    socialSecurityNumber: '',
    phone: '',
    acceptTerms: false,
  };
  personForm: PersonFormValue = emptyPersonForm();
  readonly eventForm = {
    year: new Date().getFullYear(),
    endYear: null as number | null,
    title: '',
    category: 'FAMILIA' as LifeEvent['category'],
    place: '',
    description: '',
    visibility: 'PRIVADA' as Visibility,
  };
  readonly relationForm = {
    kind: 'PROGENITOR' as RelationKind,
    targetPersonId: '',
    newPersonName: '',
    newPersonBirthYear: null as number | null,
    status: 'PENDIENTE' as 'CONFIRMADA' | 'RECUERDO' | 'PENDIENTE',
    notes: '',
    visibility: 'PRIVADA' as Visibility,
  };
  readonly placeForm = {
    label: '',
    country: 'España',
    startYear: null as number | null,
    endYear: null as number | null,
    latitude: null as number | null,
    longitude: null as number | null,
    kind: 'RESIDENCIA' as 'NACIMIENTO' | 'RESIDENCIA' | 'MIGRACIÓN' | 'VIAJE' | 'RECUERDO',
    notes: '',
    visibility: 'PRIVADA' as Visibility,
  };
  readonly wisdomForm = {
    title: '',
    quote: '',
    theme: '',
    audience: '',
    visibility: 'PRIVADA' as Visibility,
  };
  readonly interviewDraft = {
    transcript: '',
    notes: '',
    consentConfirmed: false,
  };
  readonly uploadForm = {
    title: '',
    description: '',
    place: '',
    capturedAt: '',
    visibility: 'PRIVADA' as Visibility,
    consentConfirmed: false,
  };
  readonly messageForm = {
    recipientPersonId: '',
    subject: '',
    body: '',
  };

  readonly primaryNavigation: readonly NavigationItem[] = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'people', label: 'Memorias', icon: 'people' },
    { id: 'interview', label: 'Entrevistar', icon: 'mic', protected: true },
    { id: 'timeline', label: 'Cronología', icon: 'timeline' },
    { id: 'family', label: 'Familia', icon: 'family', protected: true },
    { id: 'atlas', label: 'Atlas', icon: 'map' },
    { id: 'archive', label: 'Archivo', icon: 'archive', protected: true },
    { id: 'messages', label: 'Mensajes', icon: 'message', protected: true },
  ];

  readonly visiblePeople = computed(() => {
    const user = this.vault.currentUser();
    return this.vault
      .people()
      .filter(
        (person) =>
          person.status === 'PUBLICADA' ||
          Boolean(
            user &&
            (person.ownerUserId === user.id ||
              person.createdByUserId === user.id ||
              person.claimedByUserId === user.id),
          ),
      );
  });

  readonly filteredPeople = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase('es');
    if (!term) {
      return this.visiblePeople();
    }
    return this.visiblePeople().filter((person) =>
      [
        person.fullName,
        person.occupation,
        person.birthplace,
        person.residence,
        person.summary,
        ...person.tags,
      ]
        .join(' ')
        .toLocaleLowerCase('es')
        .includes(term),
    );
  });

  readonly ownedPeople = computed(() => {
    const user = this.vault.currentUser();
    return user
      ? this.vault
          .people()
          .filter(
            (person) =>
              person.ownerUserId === user.id ||
              person.createdByUserId === user.id ||
              person.claimedByUserId === user.id,
          )
      : [];
  });

  readonly allEvents = computed(() =>
    this.visiblePeople()
      .flatMap((person) =>
        person.events
          .filter((event) =>
            this.canSeeContribution(person.id, event.visibility, event.createdByUserId),
          )
          .map((event) => ({
            ...event,
            personId: person.id,
            personName: person.preferredName,
            avatar: person.avatar,
            accent: person.accent,
          })),
      )
      .sort((a, b) => a.year - b.year),
  );

  readonly visibleEvents = computed(() => {
    const category = this.timelineFilter();
    let events =
      this.timelineScope() === 'PERSONAL'
        ? this.allEvents().filter((event) => event.personId === this.selectedPerson().id)
        : this.allEvents();
    if (category !== 'TODAS') {
      events = events.filter((event) => event.category === category);
    }
    return events;
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

  readonly selectedRelations = computed(() => {
    const visibleIds = new Set(this.visiblePeople().map((person) => person.id));
    return this.vault
      .relationsFor(this.selectedPerson().id)
      .filter(
        (item) =>
          visibleIds.has(item.person.id) &&
          this.canSeeContribution(
            this.selectedPerson().id,
            item.relation.visibility,
            item.relation.createdByUserId,
          ),
      );
  });

  readonly selectedPersonEvents = computed(() =>
    this.selectedPerson().events.filter((event) =>
      this.canSeeContribution(this.selectedPerson().id, event.visibility, event.createdByUserId),
    ),
  );

  readonly selectedPersonWisdom = computed(() =>
    this.selectedPerson().wisdom.filter((wisdom) =>
      this.canSeeContribution(this.selectedPerson().id, wisdom.visibility, wisdom.createdByUserId),
    ),
  );

  readonly selectedPersonResidences = computed(() =>
    this.selectedPerson().residences.filter((residence) =>
      this.canSeeContribution(
        this.selectedPerson().id,
        residence.visibility,
        residence.createdByUserId,
      ),
    ),
  );

  readonly familyFocus = computed(
    () =>
      this.vault.people().find((person) => person.id === this.familyFocusId()) ??
      this.selectedPerson(),
  );

  readonly familyRelations = computed(() =>
    this.vault
      .relationsFor(this.familyFocus().id)
      .filter((item) =>
        this.canSeeContribution(
          this.familyFocus().id,
          item.relation.visibility,
          item.relation.createdByUserId,
        ),
      ),
  );

  readonly currentMedia = computed(() =>
    this.vault
      .media()
      .filter(
        (item) =>
          item.personId === this.selectedPerson().id &&
          (item.visibility === 'PUBLICADA' || item.ownerUserId === this.vault.currentUser()?.id),
      ),
  );

  readonly visibleArchiveMedia = computed(() => {
    const user = this.vault.currentUser();
    const visibleIds = new Set(this.visiblePeople().map((person) => person.id));
    return this.vault
      .media()
      .filter(
        (item) =>
          visibleIds.has(item.personId) &&
          (item.visibility === 'PUBLICADA' || Boolean(user && item.ownerUserId === user.id)),
      );
  });

  readonly currentInterviews = computed(() =>
    this.vault
      .interviews()
      .filter(
        (interview) =>
          interview.personId === this.selectedPerson().id &&
          interview.interviewerUserId === this.vault.currentUser()?.id,
      ),
  );

  readonly userMessages = computed(() => {
    const user = this.vault.currentUser();
    if (!user) {
      return [];
    }
    const selfPerson = this.vault.selfProfile();
    return this.vault
      .messages()
      .filter(
        (message) =>
          message.senderUserId === user.id || message.recipientPersonId === selfPerson?.id,
      );
  });

  readonly unreadMessages = computed(
    () => this.userMessages().filter((message) => !message.read).length,
  );

  readonly atlasPoints = computed<readonly AtlasPoint[]>(() =>
    this.visiblePeople().flatMap((person) =>
      person.residences
        .filter((place) =>
          this.canSeeContribution(person.id, place.visibility, place.createdByUserId),
        )
        .map((place) => ({
          id: place.id,
          personId: person.id,
          personName: person.fullName,
          label: place.label,
          country: place.country,
          latitude: place.latitude,
          longitude: place.longitude,
          kind: place.kind,
          period: `${place.startYear ?? 'Fecha desconocida'}${
            place.endYear ? `–${place.endYear}` : ''
          }`,
          notes: place.notes,
          accent: person.accent,
        })),
    ),
  );

  readonly archiveSize = computed(() =>
    this.visibleArchiveMedia().reduce((sum, item) => sum + item.size, 0),
  );

  readonly relationKinds: readonly RelationKind[] = [
    'MADRE',
    'PADRE',
    'PROGENITOR',
    'HIJA',
    'HIJO',
    'DESCENDIENTE',
    'HERMANA',
    'HERMANO',
    'PAREJA',
    'CÓNYUGE',
    'ABUELA',
    'ABUELO',
    'NIETA',
    'NIETO',
    'TÍA',
    'TÍO',
    'SOBRINA',
    'SOBRINO',
    'PRIMA',
    'PRIMO',
    'AMISTAD',
    'PERSONA_CLAVE',
    'OTRA',
  ];

  private recordingTimer?: ReturnType<typeof setInterval>;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private mediaRecorder?: MediaRecorder;
  private mediaStream?: MediaStream;
  private recordingChunks: Blob[] = [];
  private objectUrls = new Set<string>();

  constructor() {
    document.documentElement.dataset['theme'] = this.darkMode() ? 'dark' : 'light';
    void this.refreshStorageEstimate();
  }

  @HostListener('window:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.navigate('people');
      queueMicrotask(() =>
        document.querySelector<HTMLInputElement>('.global-search input')?.focus(),
      );
    }
    if (event.key === 'Escape') {
      this.closeDialogs();
    }
  }

  navigate(view: View): void {
    const item = this.primaryNavigation.find((candidate) => candidate.id === view);
    if (item?.protected && !this.vault.currentUser()) {
      this.openAuth('register');
      this.showToast('Crea un usuario local para acceder a esta función');
      return;
    }
    if (view === 'interview') {
      this.prepareInterview();
    }
    if (view === 'family') {
      const self = this.vault.selfProfile();
      this.familyFocusId.set(self?.id ?? this.selectedPerson().id);
    }
    if (view === 'archive') {
      void this.loadMediaUrls(this.visibleArchiveMedia());
      void this.refreshStorageEstimate();
    }
    this.view.set(view);
    this.mobileMenuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openPerson(person: MemoryProfile): void {
    this.selectedPerson.set(person);
    this.familyFocusId.set(person.id);
    void this.loadMediaUrls(
      this.vault
        .media()
        .filter(
          (item) =>
            item.personId === person.id &&
            (item.visibility === 'PUBLICADA' || item.ownerUserId === this.vault.currentUser()?.id),
        ),
    );
    this.navigate('person');
  }

  openSelfProfile(): void {
    const profile = this.vault.selfProfile();
    if (profile) {
      this.openPerson(profile);
    } else {
      this.openAuth('register');
    }
  }

  setTheme(): void {
    const isDark = !this.darkMode();
    this.darkMode.set(isDark);
    document.documentElement.dataset['theme'] = isDark ? 'dark' : 'light';
    localStorage.setItem('mindsage-theme', isDark ? 'dark' : 'light');
  }

  openAuth(mode: 'login' | 'register'): void {
    this.authMode.set(mode);
    this.authDialogOpen.set(true);
  }

  register(): void {
    try {
      const user = this.vault.register(this.registerForm);
      this.authDialogOpen.set(false);
      this.showToast(`Bienvenido, ${user.fullName}. Tu archivo local está listo.`);
      this.openSelfProfile();
    } catch (error) {
      this.showError(error);
    }
  }

  login(): void {
    try {
      const user = this.vault.login(this.loginForm.identifier, this.loginForm.password);
      this.authDialogOpen.set(false);
      this.showToast(`Sesión local iniciada como ${user.fullName}`);
      this.navigate('home');
    } catch (error) {
      this.showError(error);
    }
  }

  logout(): void {
    this.vault.logout();
    this.navigate('home');
    this.showToast('Sesión local cerrada');
  }

  startCreatePerson(): void {
    if (!this.requireSession()) {
      return;
    }
    this.editingPersonId.set(undefined);
    this.personForm = emptyPersonForm();
    this.navigate('person-editor');
  }

  startEditPerson(person = this.selectedPerson()): void {
    if (!this.requireSession()) {
      return;
    }
    if (!this.vault.canEdit(person.id)) {
      this.showToast(
        'Solo puedes editar fichas propias. Puedes entrevistarla, relacionarla o enviar una solicitud.',
      );
      return;
    }
    this.editingPersonId.set(person.id);
    this.personForm = this.personToForm(person);
    this.navigate('person-editor');
  }

  savePerson(): void {
    try {
      const person = this.vault.savePerson(this.personForm, this.editingPersonId());
      this.selectedPerson.set(person);
      this.showToast('Ficha guardada en este navegador');
      this.navigate('person');
    } catch (error) {
      this.showError(error);
    }
  }

  claimSelectedProfile(): void {
    try {
      const claimed = this.vault.claimProfile(this.selectedPerson().id);
      this.selectedPerson.set(claimed);
      this.showToast('Ficha vinculada a tu usuario local');
    } catch (error) {
      this.showError(error);
    }
  }

  openEventDialog(): void {
    if (!this.requireSession()) {
      return;
    }
    this.eventDialogOpen.set(true);
  }

  saveEvent(): void {
    try {
      this.vault.addEvent(this.selectedPerson().id, {
        year: Number(this.eventForm.year),
        endYear: Number(this.eventForm.endYear) || undefined,
        title: this.eventForm.title,
        category: this.eventForm.category,
        place: this.eventForm.place,
        description: this.eventForm.description,
        visibility: this.eventForm.visibility,
      });
      this.refreshSelectedPerson();
      this.eventDialogOpen.set(false);
      Object.assign(this.eventForm, {
        year: new Date().getFullYear(),
        endYear: null,
        title: '',
        category: 'FAMILIA',
        place: '',
        description: '',
        visibility: 'PRIVADA',
      });
      this.showToast('Acontecimiento añadido a la cronología');
    } catch (error) {
      this.showError(error);
    }
  }

  openRelationDialog(person = this.selectedPerson()): void {
    if (!this.requireSession()) {
      return;
    }
    this.selectedPerson.set(person);
    this.relationDialogOpen.set(true);
  }

  saveRelationship(): void {
    try {
      const relation = this.vault.addRelationship({
        fromPersonId: this.selectedPerson().id,
        toPersonId: this.relationForm.targetPersonId || undefined,
        newPersonName: this.relationForm.newPersonName || undefined,
        newPersonBirthYear: Number(this.relationForm.newPersonBirthYear) || undefined,
        kind: this.relationForm.kind,
        status: this.relationForm.status,
        notes: this.relationForm.notes,
        visibility: this.relationForm.visibility,
      });
      this.familyFocusId.set(relation.fromPersonId);
      this.relationDialogOpen.set(false);
      Object.assign(this.relationForm, {
        kind: 'PROGENITOR',
        targetPersonId: '',
        newPersonName: '',
        newPersonBirthYear: null,
        status: 'PENDIENTE',
        notes: '',
        visibility: 'PRIVADA',
      });
      this.showToast('Vínculo añadido; las personas ya están conectadas');
    } catch (error) {
      this.showError(error);
    }
  }

  savePlace(): void {
    try {
      const latitude = Number(this.placeForm.latitude);
      const longitude = Number(this.placeForm.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error('Indica latitud y longitud válidas para mostrar el lugar.');
      }
      this.vault.addResidence(this.selectedPerson().id, {
        label: this.placeForm.label,
        country: this.placeForm.country,
        startYear: Number(this.placeForm.startYear) || undefined,
        endYear: Number(this.placeForm.endYear) || undefined,
        latitude,
        longitude,
        kind: this.placeForm.kind,
        notes: this.placeForm.notes || undefined,
        visibility: this.placeForm.visibility,
      });
      this.refreshSelectedPerson();
      this.placeDialogOpen.set(false);
      Object.assign(this.placeForm, {
        label: '',
        country: 'España',
        startYear: null,
        endYear: null,
        latitude: null,
        longitude: null,
        kind: 'RESIDENCIA',
        notes: '',
        visibility: 'PRIVADA',
      });
      this.showToast('Lugar añadido al Atlas');
    } catch (error) {
      this.showError(error);
    }
  }

  saveWisdom(): void {
    try {
      this.vault.addWisdom(this.selectedPerson().id, {
        ...this.wisdomForm,
      });
      this.refreshSelectedPerson();
      this.wisdomDialogOpen.set(false);
      Object.assign(this.wisdomForm, {
        title: '',
        quote: '',
        theme: '',
        audience: '',
        visibility: 'PRIVADA',
      });
      this.showToast('Consejo conservado');
    } catch (error) {
      this.showError(error);
    }
  }

  prepareInterview(person = this.selectedPerson()): void {
    if (!this.vault.currentUser()) {
      return;
    }
    this.selectedPerson.set(person);
    try {
      const interview = this.vault.createInterview(person.id);
      this.currentInterviewId.set(interview.id);
    } catch (error) {
      this.showError(error);
    }
  }

  async toggleRecording(): Promise<void> {
    if (this.recording()) {
      this.stopRecording();
      return;
    }
    if (!this.requireSession()) {
      return;
    }
    if (!this.interviewDraft.consentConfirmed) {
      this.showToast('Confirma primero el permiso de la persona entrevistada');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      this.showToast('Este navegador no permite grabar audio con MediaRecorder');
      return;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const preferredType = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/webm'].find(
        (type) => MediaRecorder.isTypeSupported(type),
      );
      this.recordingChunks = [];
      this.mediaRecorder = new MediaRecorder(
        this.mediaStream,
        preferredType ? { mimeType: preferredType } : undefined,
      );
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size) {
          this.recordingChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => void this.storeRecording();
      this.mediaRecorder.start(500);
      this.recordingSeconds.set(0);
      this.recording.set(true);
      this.recordingTimer = setInterval(
        () => this.recordingSeconds.update((value) => value + 1),
        1000,
      );
    } catch {
      this.showToast('No se ha concedido acceso al micrófono');
      this.releaseMicrophone();
    }
  }

  saveInterviewAnswer(): void {
    const interviewId = this.currentInterviewId();
    if (!interviewId) {
      this.showToast('No hay una sesión de entrevista activa');
      return;
    }
    if (!this.interviewDraft.transcript.trim() && !this.lastRecordingMediaId()) {
      this.showToast('Graba audio o escribe una respuesta antes de guardarla');
      return;
    }
    try {
      this.vault.saveInterviewAnswer(
        interviewId,
        {
          questionId: this.activeQuestion().id,
          question: this.activeQuestion().question,
          transcript: this.interviewDraft.transcript.trim(),
          notes: this.interviewDraft.notes.trim(),
          mediaId: this.lastRecordingMediaId(),
        },
        this.interviewDraft.consentConfirmed,
      );
      this.interviewDraft.transcript = '';
      this.interviewDraft.notes = '';
      this.lastRecordingMediaId.set(undefined);
      this.nextQuestion();
      this.showToast('Respuesta guardada en la entrevista local');
    } catch (error) {
      this.showError(error);
    }
  }

  nextQuestion(): void {
    this.stopRecording();
    this.recordingSeconds.set(0);
    this.activeQuestionIndex.update((index) => (index + 1) % this.vault.questions.length);
  }

  previousQuestion(): void {
    this.stopRecording();
    this.recordingSeconds.set(0);
    this.activeQuestionIndex.update(
      (index) => (index - 1 + this.vault.questions.length) % this.vault.questions.length,
    );
  }

  async uploadFiles(event: Event): Promise<void> {
    if (!this.requireSession()) {
      return;
    }
    if (!this.uploadForm.consentConfirmed) {
      this.showToast('Confirma el permiso para conservar estos archivos');
      return;
    }
    const input = event.target as HTMLInputElement;
    const files = [...(input.files ?? [])];
    if (!files.length) {
      return;
    }

    this.uploadInProgress.set(true);
    let imported = 0;
    try {
      for (const file of files) {
        if (file.size > 25 * 1024 * 1024) {
          this.showToast(`${file.name} supera el límite local de 25 MB`);
          continue;
        }
        const metadata = this.vault.addMedia({
          personId: this.selectedPerson().id,
          name: file.name,
          title: this.uploadForm.title.trim() || file.name,
          description: this.uploadForm.description.trim(),
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          kind: this.mediaKind(file.type),
          capturedAt: this.uploadForm.capturedAt || undefined,
          place: this.uploadForm.place.trim() || undefined,
          visibility: this.uploadForm.visibility,
          consentConfirmed: true,
        });
        await this.mediaStore.put(metadata.id, file);
        this.setMediaUrl(metadata.id, URL.createObjectURL(file));
        imported += 1;
      }
      this.refreshSelectedPerson();
      await this.refreshStorageEstimate();
      this.showToast(`${imported} archivo(s) incorporado(s) a la biblioteca local`);
      input.value = '';
    } catch (error) {
      this.showError(error);
    } finally {
      this.uploadInProgress.set(false);
    }
  }

  async downloadMedia(item: MediaItem): Promise<void> {
    const blob = await this.mediaStore.get(item.id);
    if (!blob) {
      this.showToast('El archivo binario no existe en este navegador');
      return;
    }
    const url = URL.createObjectURL(blob);
    this.objectUrls.add(url);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = item.name;
    anchor.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(url);
    }, 1000);
  }

  async removeMedia(item: MediaItem): Promise<void> {
    try {
      this.vault.removeMedia(item.id);
      await this.mediaStore.delete(item.id);
      const url = this.mediaUrls()[item.id];
      if (url) {
        URL.revokeObjectURL(url);
        this.objectUrls.delete(url);
      }
      const next = { ...this.mediaUrls() };
      delete next[item.id];
      this.mediaUrls.set(next);
      this.refreshSelectedPerson();
      await this.refreshStorageEstimate();
      this.showToast('Archivo eliminado de este navegador');
    } catch (error) {
      this.showError(error);
    }
  }

  exportArchive(publicOnly = false): void {
    const payload = JSON.stringify(
      this.vault.exportSnapshot({
        publicOnly,
        currentUserOnly: !publicOnly,
      }),
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mindsage-${publicOnly ? 'publico' : 'mi-archivo'}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.showToast('Copia JSON preparada; los binarios se descargan por separado');
  }

  async importArchive(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    try {
      const payload = JSON.parse(await file.text()) as unknown;
      const count = this.vault.importSnapshot(payload);
      this.showToast(`${count} ficha(s) importada(s) como privadas`);
      input.value = '';
    } catch (error) {
      this.showError(error);
    }
  }

  openCompose(person?: MemoryProfile): void {
    if (!this.requireSession()) {
      return;
    }
    this.messageForm.recipientPersonId = person?.id ?? '';
    this.composeDialogOpen.set(true);
  }

  sendMessage(): void {
    try {
      this.vault.sendMessage(this.messageForm);
      this.composeDialogOpen.set(false);
      Object.assign(this.messageForm, {
        recipientPersonId: '',
        subject: '',
        body: '',
      });
      this.showToast(
        'Mensaje guardado en la bandeja local; el servidor lo entregará en producción',
      );
    } catch (error) {
      this.showError(error);
    }
  }

  setFamilyFocus(person: MemoryProfile): void {
    this.familyFocusId.set(person.id);
    this.selectedPerson.set(person);
  }

  selectPersonById(personId: string): void {
    const person = this.vault.people().find((candidate) => candidate.id === personId);
    if (person) {
      this.selectedPerson.set(person);
      void this.loadMediaUrls(
        this.vault
          .media()
          .filter(
            (item) =>
              item.personId === person.id &&
              (item.visibility === 'PUBLICADA' ||
                item.ownerUserId === this.vault.currentUser()?.id),
          ),
      );
    }
  }

  selectAtlasPerson(personId: string): void {
    this.selectedAtlasPersonId.set(this.selectedAtlasPersonId() === personId ? '' : personId);
  }

  lifespan(person: MemoryProfile): string {
    const birth = person.birthYear || 'Fecha pendiente';
    if (!person.isLiving && person.deathYear) {
      return `${birth} — ${person.deathYear}`;
    }
    return `${birth} — hoy`;
  }

  formatBytes(bytes: number): string {
    if (!bytes) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  trackEvent(_: number, event: LifeEvent): string {
    return event.id;
  }

  closeDialogs(): void {
    this.authDialogOpen.set(false);
    this.eventDialogOpen.set(false);
    this.relationDialogOpen.set(false);
    this.placeDialogOpen.set(false);
    this.wisdomDialogOpen.set(false);
    this.composeDialogOpen.set(false);
  }

  ngOnDestroy(): void {
    this.stopRecording();
    for (const url of this.objectUrls) {
      URL.revokeObjectURL(url);
    }
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private personToForm(person: MemoryProfile): PersonFormValue {
    return {
      fullName: person.fullName,
      preferredName: person.preferredName,
      relationship: person.relationship,
      birthDate: person.birthDate ?? '',
      deathDate: person.deathDate ?? '',
      isLiving: person.isLiving,
      gender: person.gender ?? '',
      pronouns: person.pronouns ?? '',
      birthplace: person.birthplace === 'Por documentar' ? '' : person.birthplace,
      residence: person.residence === 'Por documentar' ? '' : person.residence,
      nationality: person.nationality ?? '',
      languages: person.languages?.join(', ') ?? '',
      occupation: person.occupation === 'Por documentar' ? '' : person.occupation,
      education: person.education ?? '',
      militaryService: person.militaryService ?? '',
      beliefs: person.beliefs ?? '',
      summary: person.summary,
      biography: person.biography ?? '',
      tags: person.tags.join(', '),
      status: person.status,
      dni: person.privateIdentity?.dni ?? '',
      socialSecurityNumber: person.privateIdentity?.socialSecurityNumber ?? '',
      phone: person.privateIdentity?.phone ?? '',
      email: person.privateIdentity?.email ?? '',
      consentProfile: person.consent.profile,
      consentInterview: person.consent.interview,
      consentMedia: person.consent.media,
      consentPublicSharing: person.consent.publicSharing,
      consentAiUse: person.consent.aiUse,
    };
  }

  private refreshSelectedPerson(): void {
    const refreshed = this.vault.people().find((person) => person.id === this.selectedPerson().id);
    if (refreshed) {
      this.selectedPerson.set(refreshed);
    }
  }

  private stopRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.recording.set(false);
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = undefined;
    }
  }

  private async storeRecording(): Promise<void> {
    const mimeType = this.mediaRecorder?.mimeType || this.recordingChunks[0]?.type || 'audio/webm';
    const blob = new Blob(this.recordingChunks, { type: mimeType });
    this.releaseMicrophone();
    if (!blob.size) {
      this.showToast('La grabación no contenía audio');
      return;
    }
    try {
      const metadata = this.vault.addMedia({
        personId: this.selectedPerson().id,
        interviewId: this.currentInterviewId(),
        name: `entrevista-${this.selectedPerson().preferredName.toLocaleLowerCase('es')}-${Date.now()}.webm`,
        title: this.activeQuestion().question,
        description: 'Fragmento grabado durante una entrevista guiada.',
        mimeType,
        size: blob.size,
        kind: 'AUDIO',
        visibility: 'PRIVADA',
        consentConfirmed: this.interviewDraft.consentConfirmed,
      });
      await this.mediaStore.put(metadata.id, blob);
      this.lastRecordingMediaId.set(metadata.id);
      this.setMediaUrl(metadata.id, URL.createObjectURL(blob));
      this.refreshSelectedPerson();
      await this.refreshStorageEstimate();
      this.showToast('Audio real guardado en este navegador');
    } catch (error) {
      this.showError(error);
    }
  }

  private releaseMicrophone(): void {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = undefined;
    this.mediaRecorder = undefined;
    this.recordingChunks = [];
  }

  private async loadMediaUrls(items: readonly MediaItem[]): Promise<void> {
    const urls = { ...this.mediaUrls() };
    for (const item of items) {
      if (urls[item.id]) {
        continue;
      }
      const blob = await this.mediaStore.get(item.id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        urls[item.id] = url;
        this.objectUrls.add(url);
      }
    }
    this.mediaUrls.set(urls);
  }

  private setMediaUrl(id: string, url: string): void {
    this.objectUrls.add(url);
    this.mediaUrls.update((urls) => ({ ...urls, [id]: url }));
  }

  private mediaKind(mimeType: string): 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' {
    if (mimeType.startsWith('image/')) {
      return 'IMAGE';
    }
    if (mimeType.startsWith('audio/')) {
      return 'AUDIO';
    }
    if (mimeType.startsWith('video/')) {
      return 'VIDEO';
    }
    return 'DOCUMENT';
  }

  private async refreshStorageEstimate(): Promise<void> {
    try {
      const estimate = await navigator.storage?.estimate();
      this.storageUsage.set(
        estimate
          ? `${this.formatBytes(estimate.usage ?? 0)} usados de ${this.formatBytes(
              estimate.quota ?? 0,
            )}`
          : 'Estimación no disponible',
      );
    } catch {
      this.storageUsage.set('Estimación no disponible');
    }
  }

  private requireSession(): boolean {
    if (this.vault.currentUser()) {
      return true;
    }
    this.openAuth('register');
    this.showToast('Esta función requiere un usuario local');
    return false;
  }

  private canSeeContribution(
    personId: string,
    visibility?: Visibility,
    createdByUserId?: string,
  ): boolean {
    if (visibility === 'PUBLICADA' || (!visibility && !createdByUserId)) {
      return true;
    }
    const user = this.vault.currentUser();
    return Boolean(user && (createdByUserId === user.id || this.vault.canEdit(personId)));
  }

  private showError(error: unknown): void {
    this.showToast(error instanceof Error ? error.message : 'No se pudo completar la acción');
  }

  private showToast(message: string): void {
    this.toast.set(message);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => this.toast.set(''), 4200);
  }
}
