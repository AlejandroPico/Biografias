import { computed, Injectable, signal } from '@angular/core';

import {
  FamilyRelationship,
  InterviewAnswer,
  InterviewQuestion,
  InterviewSession,
  LifeEvent,
  MediaItem,
  MemoryProfile,
  Message,
  PersonFormValue,
  RegisterInput,
  RelationKind,
  Residence,
  Session,
  UserAccount,
  VaultState,
  Visibility,
  Wisdom,
} from './mindsage.models';

export type {
  FamilyRelationship,
  InterviewAnswer,
  InterviewQuestion,
  InterviewSession,
  LifeEvent,
  MediaItem,
  MemoryProfile,
  Message,
  PersonFormValue,
  RegisterInput,
  RelationKind,
  Residence,
  UserAccount,
  Visibility,
  Wisdom,
} from './mindsage.models';

const STORAGE_KEY = 'mindsage-local-vault-v2';
const LEGACY_STORAGE_KEY = 'mindsage-local-vault-v1';

const now = (): string => new Date().toISOString();

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('es'))
    .join('');

const yearFromDate = (value?: string): number => (value ? Number(value.slice(0, 4)) || 0 : 0);

const seedPerson = (
  value: Partial<MemoryProfile> &
    Pick<
      MemoryProfile,
      | 'id'
      | 'fullName'
      | 'relationship'
      | 'birthYear'
      | 'birthplace'
      | 'residence'
      | 'occupation'
      | 'summary'
      | 'accent'
      | 'avatar'
      | 'completeness'
      | 'stories'
      | 'media'
      | 'minutes'
      | 'status'
      | 'tags'
      | 'events'
      | 'wisdom'
      | 'residences'
    >,
): MemoryProfile => ({
  id: value.id,
  ownerUserId: value.ownerUserId,
  createdByUserId: value.createdByUserId,
  claimedByUserId: value.claimedByUserId,
  fullName: value.fullName,
  preferredName: value.preferredName ?? value.fullName.split(/\s+/)[0],
  formerNames: value.formerNames ?? [],
  initials: value.initials ?? initials(value.fullName),
  relationship: value.relationship,
  birthDate: value.birthDate,
  birthYear: value.birthYear,
  deathDate: value.deathDate,
  deathYear: value.deathYear,
  isLiving: value.isLiving ?? !value.deathYear,
  gender: value.gender ?? '',
  pronouns: value.pronouns ?? '',
  birthplace: value.birthplace,
  residence: value.residence,
  nationality: value.nationality ?? 'Española',
  languages: value.languages ?? ['Castellano'],
  occupation: value.occupation,
  education: value.education ?? '',
  militaryService: value.militaryService ?? '',
  beliefs: value.beliefs ?? '',
  summary: value.summary,
  biography: value.biography ?? value.summary,
  accent: value.accent,
  avatar: value.avatar,
  completeness: value.completeness,
  stories: value.stories,
  media: value.media,
  minutes: value.minutes,
  status: value.status,
  profileState: value.profileState ?? 'COMPLETA',
  privateIdentity: value.privateIdentity,
  tags: value.tags,
  events: value.events,
  wisdom: value.wisdom,
  residences: value.residences,
  consent: value.consent ?? {
    profile: true,
    interview: true,
    media: true,
    publicSharing: value.status === 'PUBLICADA',
    aiUse: false,
  },
  createdAt: value.createdAt ?? '2026-07-25T00:00:00.000Z',
  updatedAt: value.updatedAt ?? '2026-07-25T00:00:00.000Z',
});

const SEED_PEOPLE: readonly MemoryProfile[] = [
  seedPerson({
    id: 'carmen-ruiz',
    fullName: 'Carmen Ruiz Navarro',
    relationship: 'Abuela materna',
    birthDate: '1938-04-12',
    birthYear: 1938,
    birthplace: 'Alcaudete, Jaén',
    residence: 'Barcelona',
    occupation: 'Costurera',
    education: 'Escuela primaria y formación en confección',
    summary: 'Costurera, madre y memoria viva de un barrio que cambió del campo a la ciudad.',
    biography:
      'Carmen creció entre olivos y emigró a Barcelona siendo joven. Convirtió un oficio aprendido con paciencia en una forma de independencia y de comunidad.',
    accent: '#bd684b',
    avatar: 'carmen',
    completeness: 78,
    stories: 18,
    media: 0,
    minutes: 0,
    status: 'PUBLICADA',
    tags: ['Familia', 'Migración', 'Oficios', 'Barcelona'],
    events: [
      {
        id: 'c-1',
        year: 1938,
        title: 'Una infancia entre olivos',
        description:
          'Las cosechas, las canciones de su madre y una escuela pequeña son sus primeros recuerdos.',
        category: 'INFANCIA',
        place: 'Alcaudete',
      },
      {
        id: 'c-2',
        year: 1958,
        title: 'El tren hacia Barcelona',
        description: 'Viajó con una maleta pequeña y una dirección escrita en un papel.',
        category: 'MIGRACIÓN',
        place: 'Barcelona',
      },
      {
        id: 'c-3',
        year: 1962,
        title: 'La boda en el barrio',
        description:
          'Un patio interior se convirtió en salón de baile para familias recién llegadas.',
        category: 'FAMILIA',
        place: 'Poble-sec',
      },
      {
        id: 'c-4',
        year: 1974,
        endYear: 1998,
        title: 'El taller de confección',
        description: 'Creció de aprendiza a encargada y enseñó el oficio a varias generaciones.',
        category: 'TRABAJO',
        place: 'Barcelona',
      },
    ],
    wisdom: [
      {
        id: 'cw-1',
        title: 'La casa que uno construye',
        quote:
          'No esperes a tener tiempo para cuidar a los tuyos. El tiempo no se encuentra: se aparta.',
        theme: 'Familia',
        audience: 'Para mis nietos y para quien siempre va con prisa',
      },
      {
        id: 'cw-2',
        title: 'Equivocarse con dignidad',
        quote: 'Pide perdón pronto. El orgullo ocupa mucho sitio y no da calor.',
        theme: 'Decisiones',
        audience: 'Para la juventud',
      },
    ],
    residences: [
      {
        id: 'cp-1',
        label: 'Alcaudete, Jaén',
        country: 'España',
        startYear: 1938,
        endYear: 1958,
        latitude: 37.5909,
        longitude: -4.0836,
        kind: 'NACIMIENTO',
        notes: 'Infancia y adolescencia.',
      },
      {
        id: 'cp-2',
        label: 'Barcelona',
        country: 'España',
        startYear: 1958,
        latitude: 41.3874,
        longitude: 2.1686,
        kind: 'MIGRACIÓN',
        notes: 'Trabajo, familia y vida comunitaria.',
      },
    ],
  }),
  seedPerson({
    id: 'antonio-vega',
    fullName: 'Antonio Vega Martín',
    preferredName: 'Toni',
    relationship: 'Amigo de la familia',
    birthDate: '1942-09-02',
    birthYear: 1942,
    birthplace: 'A Coruña',
    residence: 'Badalona',
    occupation: 'Mecánico naval',
    summary:
      'Mecánico naval jubilado; aprendió el oficio escuchando y enseñó siempre con paciencia.',
    accent: '#347e83',
    avatar: 'antonio',
    completeness: 64,
    stories: 11,
    media: 0,
    minutes: 0,
    status: 'PUBLICADA',
    tags: ['Mar', 'Trabajo', 'Galicia', 'Viajes'],
    events: [
      {
        id: 'a-1',
        year: 1942,
        title: 'La casa frente al puerto',
        description: 'Aprendió los nombres de los barcos antes que los de muchas capitales.',
        category: 'INFANCIA',
        place: 'A Coruña',
      },
      {
        id: 'a-2',
        year: 1957,
        title: 'Aprendiz en el astillero',
        description:
          'Descubrió que la precisión y la confianza de una tripulación eran inseparables.',
        category: 'TRABAJO',
        place: 'Ferrol',
      },
      {
        id: 'a-3',
        year: 1969,
        title: 'Primera travesía larga',
        description: 'Pasó semanas lejos de casa reparando motores y escribiendo cartas.',
        category: 'VIAJE',
        place: 'Atlántico Norte',
      },
    ],
    wisdom: [
      {
        id: 'aw-1',
        title: 'Aprender de verdad',
        quote:
          'Cuando no sepas algo, dilo. La persona que pregunta puede aprender; la que finge saber pone a todos en peligro.',
        theme: 'Trabajo',
        audience: 'Para aprendices de cualquier oficio',
      },
    ],
    residences: [
      {
        id: 'ap-1',
        label: 'A Coruña',
        country: 'España',
        startYear: 1942,
        latitude: 43.3623,
        longitude: -8.4115,
        kind: 'NACIMIENTO',
      },
      {
        id: 'ap-2',
        label: 'Badalona',
        country: 'España',
        startYear: 1974,
        latitude: 41.4469,
        longitude: 2.245,
        kind: 'RESIDENCIA',
      },
    ],
  }),
  seedPerson({
    id: 'lucia-ferrer',
    fullName: 'Lucía Ferrer Soler',
    relationship: 'Tía abuela',
    birthDate: '1935-01-18',
    birthYear: 1935,
    deathDate: '2022-11-03',
    deathYear: 2022,
    isLiving: false,
    birthplace: 'Morella, Castellón',
    residence: 'Valencia',
    occupation: 'Maestra',
    education: 'Magisterio',
    summary: 'Maestra rural durante cuatro décadas y defensora de que cada niña pudiera estudiar.',
    accent: '#77639a',
    avatar: 'lucia',
    completeness: 91,
    stories: 27,
    media: 0,
    minutes: 0,
    status: 'PUBLICADA',
    tags: ['Educación', 'Mujeres', 'Mundo rural', 'Comunidad'],
    events: [
      {
        id: 'l-1',
        year: 1935,
        title: 'Inviernos en Morella',
        description: 'Los libros prestados y las historias junto al fuego marcaron su infancia.',
        category: 'INFANCIA',
        place: 'Morella',
      },
      {
        id: 'l-2',
        year: 1954,
        title: 'Su primera escuela',
        description:
          'Una escuela unitaria con una estufa, mapas gastados y alumnado de todas las edades.',
        category: 'EDUCACIÓN',
        place: 'Els Ports',
      },
      {
        id: 'l-3',
        year: 1971,
        title: 'La biblioteca de las familias',
        description:
          'Organizó una biblioteca circulante para que los libros llegaran a cada masía.',
        category: 'COMUNIDAD',
        place: 'Castellón',
      },
    ],
    wisdom: [
      {
        id: 'lw-1',
        title: 'El regalo de estudiar',
        quote:
          'La educación no sirve para escapar de donde vienes, sino para comprenderlo y poder elegir adónde vas.',
        theme: 'Educación',
        audience: 'Para mis antiguos alumnos',
      },
    ],
    residences: [
      {
        id: 'lp-1',
        label: 'Morella',
        country: 'España',
        startYear: 1935,
        latitude: 40.6199,
        longitude: -0.0983,
        kind: 'NACIMIENTO',
      },
      {
        id: 'lp-2',
        label: 'Valencia',
        country: 'España',
        startYear: 1980,
        latitude: 39.4699,
        longitude: -0.3763,
        kind: 'RESIDENCIA',
      },
    ],
  }),
  seedPerson({
    id: 'manuel-ortega',
    fullName: 'Manuel Ortega Campos',
    relationship: 'Vecino',
    birthYear: 1946,
    birthplace: 'Teruel',
    residence: 'L’Hospitalet',
    occupation: 'Electricista',
    summary: 'Electricista industrial, aficionado a la radio y cronista informal de su comunidad.',
    accent: '#a47a38',
    avatar: 'manuel',
    completeness: 42,
    stories: 7,
    media: 0,
    minutes: 0,
    status: 'PUBLICADA',
    profileState: 'RECLAMABLE',
    tags: ['Industria', 'Radio', 'Barrio'],
    events: [
      {
        id: 'm-1',
        year: 1964,
        title: 'La fábrica y la noche',
        description: 'Estudiaba electricidad al terminar el turno para conseguir la titulación.',
        category: 'TRABAJO',
        place: 'Barcelona',
      },
    ],
    wisdom: [],
    residences: [
      {
        id: 'mp-1',
        label: 'Teruel',
        country: 'España',
        startYear: 1946,
        latitude: 40.3456,
        longitude: -1.1065,
        kind: 'NACIMIENTO',
      },
      {
        id: 'mp-2',
        label: 'L’Hospitalet de Llobregat',
        country: 'España',
        startYear: 1963,
        latitude: 41.3662,
        longitude: 2.1169,
        kind: 'MIGRACIÓN',
      },
    ],
  }),
];

const EMPTY_STATE: VaultState = {
  format: 'mindsage-local-vault',
  version: 2,
  users: [],
  people: SEED_PEOPLE,
  relationships: [],
  interviews: [],
  media: [],
  messages: [],
};

const INVERSE_RELATIONS: Record<RelationKind, RelationKind> = {
  MADRE: 'HIJA',
  PADRE: 'HIJO',
  PROGENITOR: 'DESCENDIENTE',
  HIJA: 'MADRE',
  HIJO: 'PADRE',
  DESCENDIENTE: 'PROGENITOR',
  HERMANA: 'HERMANA',
  HERMANO: 'HERMANO',
  PAREJA: 'PAREJA',
  CÓNYUGE: 'CÓNYUGE',
  ABUELA: 'NIETA',
  ABUELO: 'NIETO',
  NIETA: 'ABUELA',
  NIETO: 'ABUELO',
  TÍA: 'SOBRINA',
  TÍO: 'SOBRINO',
  SOBRINA: 'TÍA',
  SOBRINO: 'TÍO',
  PRIMA: 'PRIMA',
  PRIMO: 'PRIMO',
  AMISTAD: 'AMISTAD',
  PERSONA_CLAVE: 'PERSONA_CLAVE',
  OTRA: 'OTRA',
};

@Injectable({ providedIn: 'root' })
export class MemoryVaultService {
  private readonly state = signal<VaultState>(this.restore());

  readonly people = computed(() => [...this.state().people]);
  readonly users = computed(() => [...this.state().users]);
  readonly relationships = computed(() => [...this.state().relationships]);
  readonly interviews = computed(() => [...this.state().interviews]);
  readonly media = computed(() => [...this.state().media]);
  readonly messages = computed(() => [...this.state().messages]);
  readonly session = computed(() => this.state().session);
  readonly currentUser = computed(() => {
    const session = this.state().session;
    return session ? this.state().users.find((user) => user.id === session.userId) : undefined;
  });

  readonly questions: readonly InterviewQuestion[] = [
    {
      id: 'q-infancia-lugar',
      category: 'Infancia',
      eyebrow: 'Empecemos por los sentidos',
      question: '¿Cuál es el primer lugar que recuerdas con claridad?',
      hint: 'Pregunta por sonidos, olores, personas y rutinas.',
      sensitivity: 'normal',
    },
    {
      id: 'q-infancia-familia',
      category: 'Infancia',
      eyebrow: 'El hogar de entonces',
      question: '¿Cómo era tu familia cuando eras niño o niña?',
      hint: 'No presupongas que todos los vínculos fueron fáciles.',
      sensitivity: 'sensible',
    },
    {
      id: 'q-educacion',
      category: 'Educación',
      eyebrow: 'Aprender y crecer',
      question: '¿Quién te enseñó algo que todavía conservas?',
      hint: 'Puede ser una maestra, un familiar, un oficio o la propia experiencia.',
      sensitivity: 'normal',
    },
    {
      id: 'q-trabajo',
      category: 'Trabajo',
      eyebrow: 'Una vida de oficio',
      question: '¿Qué trabajo te hizo sentir más orgulloso o orgullosa?',
      hint: 'Pregunta también por el trabajo no remunerado y los cuidados.',
      sensitivity: 'normal',
    },
    {
      id: 'q-migracion',
      category: 'Migraciones',
      eyebrow: 'Lugares que cambian una vida',
      question: '¿Tuviste que dejar alguna vez tu hogar? ¿Qué llevaste contigo?',
      hint: 'Permite omitir detalles si hubo exilio, violencia o pérdida.',
      sensitivity: 'sensible',
    },
    {
      id: 'q-historia',
      category: 'Historia',
      eyebrow: 'Testigo de una época',
      question: '¿Qué acontecimiento histórico cambió tu vida cotidiana?',
      hint: 'Distingue claramente lo vivido, lo oído y lo conocido después.',
      sensitivity: 'sensible',
    },
    {
      id: 'q-amor',
      category: 'Amor y familia',
      eyebrow: 'Pregunta con cuidado',
      question: '¿Qué has aprendido sobre querer y dejarse querer?',
      hint: 'No presupongas pareja, matrimonio ni descendencia.',
      sensitivity: 'sensible',
    },
    {
      id: 'q-decision',
      category: 'Decisiones',
      eyebrow: 'Un punto de inflexión',
      question: '¿Qué decisión cambió tu vida sin que lo supieras en aquel momento?',
      hint: 'Deja unos segundos de silencio antes de ofrecer ayuda.',
      sensitivity: 'normal',
    },
    {
      id: 'q-error',
      category: 'Aprendizajes',
      eyebrow: 'Mirar atrás sin juzgar',
      question: '¿Qué error te enseñó algo que no habrías aprendido de otro modo?',
      hint: 'Evita convertir la conversación en una confesión obligatoria.',
      sensitivity: 'sensible',
    },
    {
      id: 'q-felicidad',
      category: 'Felicidad',
      eyebrow: 'Lo que de verdad importó',
      question: '¿En qué momentos sentiste que estabas viviendo una vida buena?',
      hint: 'Pregunta por personas, lugares y gestos concretos.',
      sensitivity: 'normal',
    },
    {
      id: 'q-cambio',
      category: 'Cambios',
      eyebrow: 'El mundo visto en perspectiva',
      question: '¿Qué costumbre desaparecida te gustaría que conociéramos?',
      hint: 'También puede hablar de cambios que considera positivos.',
      sensitivity: 'normal',
    },
    {
      id: 'q-legado',
      category: 'Legado',
      eyebrow: 'Para quienes vendrán',
      question: 'Si pudieras dejar una sola idea a quienes aún no han nacido, ¿cuál sería?',
      hint: 'Después, pregunta qué experiencia sostiene esa idea.',
      sensitivity: 'normal',
    },
  ];

  register(input: RegisterInput): UserAccount {
    if (!input.fullName.trim() || !input.email.trim() || !input.acceptTerms) {
      throw new Error('Completa nombre, correo y aceptación de la demostración.');
    }

    const email = input.email.trim().toLocaleLowerCase('es');
    const existing = this.state().users.find((user) => user.email === email);
    if (existing) {
      this.setSession(existing.id);
      return existing;
    }

    const user: UserAccount = {
      id: crypto.randomUUID(),
      fullName: input.fullName.trim(),
      email,
      birthDate: input.birthDate || undefined,
      privateIdentity: {
        dni: input.dni?.trim() || undefined,
        socialSecurityNumber: input.socialSecurityNumber?.trim() || undefined,
        phone: input.phone?.trim() || undefined,
        email,
      },
      createdAt: now(),
      demoAccount: true,
    };

    const person = this.createSelfProfile(user);
    this.updateState({
      users: [...this.state().users, user],
      people: [person, ...this.state().people],
      session: { userId: user.id, startedAt: now() },
      messages: [
        {
          id: crypto.randomUUID(),
          senderUserId: 'mindsage-system',
          senderName: 'Equipo MindSage',
          recipientPersonId: person.id,
          recipientName: user.fullName,
          subject: 'Tu archivo privado ya está preparado',
          body: 'Puedes completar tu ficha, crear personas, relacionarlas, grabar entrevistas y exportar tu archivo. Todo permanece en este navegador.',
          createdAt: now(),
          read: false,
          status: 'RECIBIDO_DEMO',
        },
        ...this.state().messages,
      ],
    });
    return user;
  }

  login(identifier: string, password: string): UserAccount {
    const cleaned = identifier.trim();
    if (!cleaned || !password.trim()) {
      throw new Error('Escribe un nombre o correo y una contraseña de prueba.');
    }

    const normalized = cleaned.toLocaleLowerCase('es');
    const existing = this.state().users.find(
      (user) => user.email === normalized || user.fullName.toLocaleLowerCase('es') === normalized,
    );
    if (existing) {
      this.setSession(existing.id);
      return existing;
    }

    const looksLikeEmail = normalized.includes('@');
    return this.register({
      fullName: looksLikeEmail
        ? normalized
            .split('@')[0]
            .split(/[._-]/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
        : cleaned,
      email: looksLikeEmail ? normalized : `${normalized.replace(/\s+/g, '.')}@demo.mindsage.local`,
      password,
      acceptTerms: true,
    });
  }

  logout(): void {
    const { session: _session, ...withoutSession } = this.state();
    this.state.set(withoutSession);
    this.persist();
  }

  selfProfile(): MemoryProfile | undefined {
    const user = this.currentUser();
    return user ? this.state().people.find((person) => person.ownerUserId === user.id) : undefined;
  }

  savePerson(value: PersonFormValue, personId?: string): MemoryProfile {
    const user = this.requireUser();
    if (!value.fullName.trim()) {
      throw new Error('El nombre completo es obligatorio.');
    }
    if (value.status === 'PUBLICADA' && !value.consentPublicSharing) {
      throw new Error('Para publicar la ficha debes documentar el consentimiento de publicación.');
    }

    const existing = personId
      ? this.state().people.find((person) => person.id === personId)
      : undefined;
    if (existing && !this.canEdit(existing.id)) {
      throw new Error('No tienes permisos para editar esta ficha.');
    }

    const birthYear = yearFromDate(value.birthDate) || existing?.birthYear || 0;
    const deathYear = value.isLiving
      ? undefined
      : yearFromDate(value.deathDate) || existing?.deathYear;
    const tags = value.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const languages = value.languages
      .split(',')
      .map((language) => language.trim())
      .filter(Boolean);

    const person: MemoryProfile = {
      id: existing?.id ?? crypto.randomUUID(),
      ownerUserId: existing?.ownerUserId,
      createdByUserId: existing?.createdByUserId ?? user.id,
      claimedByUserId: existing?.claimedByUserId,
      fullName: value.fullName.trim(),
      preferredName: value.preferredName.trim() || value.fullName.trim().split(/\s+/)[0],
      initials: initials(value.fullName),
      relationship: value.relationship.trim() || 'Persona cercana',
      birthDate: value.birthDate || undefined,
      birthYear,
      deathDate: value.isLiving ? undefined : value.deathDate || undefined,
      deathYear,
      isLiving: value.isLiving,
      gender: value.gender.trim() || undefined,
      pronouns: value.pronouns.trim() || undefined,
      birthplace: value.birthplace.trim() || 'Por documentar',
      residence: value.residence.trim() || 'Por documentar',
      nationality: value.nationality.trim() || undefined,
      languages,
      occupation: value.occupation.trim() || 'Por documentar',
      education: value.education.trim() || undefined,
      militaryService: value.militaryService.trim() || undefined,
      beliefs: value.beliefs.trim() || undefined,
      summary: value.summary.trim() || 'Una memoria preparada para empezar a recoger su historia.',
      biography: value.biography.trim() || undefined,
      accent: existing?.accent ?? '#5e776c',
      avatar: existing?.avatar ?? 'draft',
      completeness: this.calculateCompleteness(value),
      stories: existing?.events.length ?? 0,
      media: existing
        ? this.state().media.filter((item) => item.personId === existing.id).length
        : 0,
      minutes: existing?.minutes ?? 0,
      status: value.status,
      profileState: existing?.profileState ?? 'INCOMPLETA',
      privateIdentity: {
        dni: value.dni.trim() || undefined,
        socialSecurityNumber: value.socialSecurityNumber.trim() || undefined,
        phone: value.phone.trim() || undefined,
        email: value.email.trim() || undefined,
      },
      tags,
      events: existing?.events ?? [],
      wisdom: existing?.wisdom ?? [],
      residences: existing?.residences ?? [],
      consent: {
        profile: value.consentProfile,
        interview: value.consentInterview,
        media: value.consentMedia,
        publicSharing: value.consentPublicSharing,
        aiUse: value.consentAiUse,
      },
      createdAt: existing?.createdAt ?? now(),
      updatedAt: now(),
    };

    this.replacePerson(person);
    return person;
  }

  addDraft(input: {
    readonly fullName: string;
    readonly relationship: string;
    readonly birthYear?: number;
    readonly summary: string;
  }): MemoryProfile {
    const birthDate = input.birthYear ? `${input.birthYear}-01-01` : '';
    return this.savePerson({
      fullName: input.fullName,
      preferredName: input.fullName.split(/\s+/)[0],
      relationship: input.relationship,
      birthDate,
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
      summary: input.summary,
      biography: '',
      tags: 'Nueva memoria',
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
  }

  canEdit(personId: string): boolean {
    const user = this.currentUser();
    const person = this.state().people.find((candidate) => candidate.id === personId);
    return Boolean(
      user &&
      person &&
      (person.ownerUserId === user.id ||
        person.createdByUserId === user.id ||
        person.claimedByUserId === user.id),
    );
  }

  canContribute(personId: string): boolean {
    return Boolean(this.currentUser() && this.state().people.some((p) => p.id === personId));
  }

  claimProfile(personId: string): MemoryProfile {
    const user = this.requireUser();
    const person = this.requirePerson(personId);
    if (person.profileState !== 'RECLAMABLE') {
      throw new Error('Esta ficha no está marcada como reclamable.');
    }
    const updated: MemoryProfile = {
      ...person,
      ownerUserId: user.id,
      claimedByUserId: user.id,
      profileState: 'INCOMPLETA',
      status: 'PRIVADA',
      updatedAt: now(),
    };
    this.replacePerson(updated);
    return updated;
  }

  addEvent(personId: string, event: Omit<LifeEvent, 'id'>): LifeEvent {
    const user = this.requireUser();
    this.requireContribution(personId);
    const person = this.requirePerson(personId);
    const created: LifeEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdByUserId: user.id,
    };
    this.replacePerson({
      ...person,
      events: [...person.events, created].sort((a, b) => a.year - b.year),
      stories: person.events.length + 1,
      updatedAt: now(),
    });
    return created;
  }

  addWisdom(personId: string, wisdom: Omit<Wisdom, 'id'>): Wisdom {
    const user = this.requireUser();
    this.requireContribution(personId);
    const person = this.requirePerson(personId);
    const created: Wisdom = {
      ...wisdom,
      id: crypto.randomUUID(),
      createdByUserId: user.id,
    };
    this.replacePerson({
      ...person,
      wisdom: [...person.wisdom, created],
      updatedAt: now(),
    });
    return created;
  }

  addResidence(personId: string, residence: Omit<Residence, 'id'>): Residence {
    const user = this.requireUser();
    this.requireContribution(personId);
    const person = this.requirePerson(personId);
    const created: Residence = {
      ...residence,
      id: crypto.randomUUID(),
      createdByUserId: user.id,
    };
    this.replacePerson({
      ...person,
      residences: [...person.residences, created],
      residence:
        residence.kind === 'RESIDENCIA' || residence.kind === 'MIGRACIÓN'
          ? residence.label
          : person.residence,
      updatedAt: now(),
    });
    return created;
  }

  addRelationship(input: {
    readonly fromPersonId: string;
    readonly toPersonId?: string;
    readonly newPersonName?: string;
    readonly newPersonBirthYear?: number;
    readonly kind: RelationKind;
    readonly status: FamilyRelationship['status'];
    readonly notes?: string;
    readonly visibility: Visibility;
  }): FamilyRelationship {
    const user = this.requireUser();
    this.requireContribution(input.fromPersonId);

    let toPersonId = input.toPersonId;
    if (!toPersonId && input.newPersonName?.trim()) {
      const found = this.findPersonByName(input.newPersonName);
      toPersonId =
        found?.id ??
        this.createPlaceholder(input.newPersonName, input.newPersonBirthYear, user.id).id;
    }
    if (!toPersonId || toPersonId === input.fromPersonId) {
      throw new Error('Selecciona o crea una persona distinta.');
    }
    this.requirePerson(toPersonId);

    const duplicate = this.state().relationships.find(
      (relation) =>
        relation.fromPersonId === input.fromPersonId &&
        relation.toPersonId === toPersonId &&
        relation.kind === input.kind,
    );
    if (duplicate) {
      return duplicate;
    }

    const relation: FamilyRelationship = {
      id: crypto.randomUUID(),
      fromPersonId: input.fromPersonId,
      toPersonId,
      kind: input.kind,
      inverseKind: INVERSE_RELATIONS[input.kind] ?? 'OTRA',
      status: input.status,
      notes: input.notes?.trim() || undefined,
      visibility: input.visibility,
      createdByUserId: user.id,
      createdAt: now(),
    };
    this.updateState({
      relationships: [...this.state().relationships, relation],
    });
    return relation;
  }

  relationsFor(personId: string): readonly {
    relation: FamilyRelationship;
    person: MemoryProfile;
    label: RelationKind;
  }[] {
    return this.state()
      .relationships.flatMap((relation) => {
        if (relation.fromPersonId === personId) {
          const person = this.state().people.find(
            (candidate) => candidate.id === relation.toPersonId,
          );
          return person ? [{ relation, person, label: relation.kind }] : [];
        }
        if (relation.toPersonId === personId) {
          const person = this.state().people.find(
            (candidate) => candidate.id === relation.fromPersonId,
          );
          return person ? [{ relation, person, label: relation.inverseKind }] : [];
        }
        return [];
      })
      .sort((a, b) => a.label.localeCompare(b.label, 'es'));
  }

  createInterview(personId: string, title?: string): InterviewSession {
    const user = this.requireUser();
    this.requireContribution(personId);
    const existing = this.state().interviews.find(
      (session) =>
        session.personId === personId &&
        session.interviewerUserId === user.id &&
        session.answers.length < this.questions.length,
    );
    if (existing) {
      return existing;
    }
    const session: InterviewSession = {
      id: crypto.randomUUID(),
      personId,
      interviewerUserId: user.id,
      title: title?.trim() || `Entrevista del ${new Date().toLocaleDateString('es-ES')}`,
      consentConfirmed: false,
      visibility: 'PRIVADA',
      answers: [],
      startedAt: now(),
      updatedAt: now(),
    };
    this.updateState({ interviews: [session, ...this.state().interviews] });
    return session;
  }

  saveInterviewAnswer(
    interviewId: string,
    answer: Omit<InterviewAnswer, 'id' | 'createdAt'>,
    consentConfirmed: boolean,
  ): InterviewSession {
    const user = this.requireUser();
    const interview = this.state().interviews.find((candidate) => candidate.id === interviewId);
    if (!interview || interview.interviewerUserId !== user.id) {
      throw new Error('No se ha encontrado la sesión de entrevista.');
    }
    if (!consentConfirmed) {
      throw new Error('Confirma el permiso antes de guardar la respuesta.');
    }
    const created: InterviewAnswer = {
      ...answer,
      id: crypto.randomUUID(),
      createdAt: now(),
    };
    const updated: InterviewSession = {
      ...interview,
      consentConfirmed: true,
      answers: [...interview.answers, created],
      updatedAt: now(),
    };
    this.updateState({
      interviews: this.state().interviews.map((candidate) =>
        candidate.id === interviewId ? updated : candidate,
      ),
    });
    return updated;
  }

  addMedia(item: Omit<MediaItem, 'id' | 'ownerUserId' | 'createdAt'>): MediaItem {
    const user = this.requireUser();
    this.requireContribution(item.personId);
    if (!item.consentConfirmed) {
      throw new Error('Confirma el permiso para conservar este archivo.');
    }
    const created: MediaItem = {
      ...item,
      id: crypto.randomUUID(),
      ownerUserId: user.id,
      createdAt: now(),
    };
    this.updateState({ media: [created, ...this.state().media] });
    this.refreshPersonMetrics(item.personId);
    return created;
  }

  removeMedia(mediaId: string): void {
    const user = this.requireUser();
    const item = this.state().media.find((candidate) => candidate.id === mediaId);
    if (!item || item.ownerUserId !== user.id) {
      throw new Error('No puedes eliminar este archivo.');
    }
    this.updateState({
      media: this.state().media.filter((candidate) => candidate.id !== mediaId),
    });
    this.refreshPersonMetrics(item.personId);
  }

  sendMessage(input: {
    readonly recipientPersonId: string;
    readonly subject: string;
    readonly body: string;
  }): Message {
    const user = this.requireUser();
    const recipient = this.requirePerson(input.recipientPersonId);
    if (!input.subject.trim() || !input.body.trim()) {
      throw new Error('Escribe un asunto y un mensaje.');
    }
    const message: Message = {
      id: crypto.randomUUID(),
      senderUserId: user.id,
      senderName: user.fullName,
      recipientPersonId: recipient.id,
      recipientName: recipient.fullName,
      subject: input.subject.trim(),
      body: input.body.trim(),
      createdAt: now(),
      read: true,
      status: 'ENVIADO_LOCAL',
    };
    this.updateState({ messages: [message, ...this.state().messages] });
    return message;
  }

  markMessageRead(messageId: string): void {
    this.updateState({
      messages: this.state().messages.map((message) =>
        message.id === messageId ? { ...message, read: true } : message,
      ),
    });
  }

  exportSnapshot(options?: {
    readonly publicOnly?: boolean;
    readonly currentUserOnly?: boolean;
  }): object {
    const user = this.currentUser();
    let people = this.state().people;
    if (options?.publicOnly || !user) {
      people = people.filter((person) => person.status === 'PUBLICADA');
    } else if (options?.currentUserOnly) {
      const ownedIds = new Set(
        people
          .filter(
            (person) =>
              person.ownerUserId === user.id ||
              person.createdByUserId === user.id ||
              person.claimedByUserId === user.id,
          )
          .map((person) => person.id),
      );
      people = people.filter((person) => ownedIds.has(person.id));
    }
    const ids = new Set(people.map((person) => person.id));
    const publicExport = Boolean(options?.publicOnly || !user);
    const safePeople = people.map((person) => {
      if (!publicExport) {
        return person;
      }
      const {
        privateIdentity: _privateIdentity,
        ownerUserId: _ownerUserId,
        createdByUserId: _createdByUserId,
        claimedByUserId: _claimedByUserId,
        ...publicPerson
      } = person;
      return {
        ...publicPerson,
        events: person.events
          .filter((event) => this.isPublicContribution(event))
          .map(({ createdByUserId: _eventAuthor, ...event }) => event),
        wisdom: person.wisdom
          .filter((entry) => this.isPublicContribution(entry))
          .map(({ createdByUserId: _wisdomAuthor, ...entry }) => entry),
        residences: person.residences
          .filter((residence) => this.isPublicContribution(residence))
          .map(({ createdByUserId: _placeAuthor, ...residence }) => residence),
      };
    });
    return {
      format: 'mindsage-memory-archive',
      version: 2,
      exportedAt: now(),
      scope: options?.publicOnly || !user ? 'PUBLICO' : 'ARCHIVO_AUTORIZADO_LOCAL',
      privacyNotice:
        'Revisa consentimiento, derechos de terceros y datos privados antes de compartir esta copia.',
      people: safePeople,
      relationships: this.state()
        .relationships.filter(
          (relation) =>
            ids.has(relation.fromPersonId) &&
            ids.has(relation.toPersonId) &&
            (!publicExport || relation.visibility === 'PUBLICADA'),
        )
        .map((relation) => {
          if (!publicExport) {
            return relation;
          }
          const { createdByUserId: _relationAuthor, ...publicRelation } = relation;
          return publicRelation;
        }),
      interviews:
        options?.publicOnly || !user
          ? []
          : this.state().interviews.filter(
              (interview) => interview.interviewerUserId === user.id && ids.has(interview.personId),
            ),
      media:
        options?.publicOnly || !user
          ? this.state()
              .media.filter((item) => item.visibility === 'PUBLICADA' && ids.has(item.personId))
              .map(({ ownerUserId: _ownerUserId, ...item }) => item)
          : this.state().media.filter(
              (item) => item.ownerUserId === user.id && ids.has(item.personId),
            ),
      binaryFilesIncluded: false,
    };
  }

  importSnapshot(payload: unknown): number {
    this.requireUser();
    if (!payload || typeof payload !== 'object') {
      throw new Error('El archivo no contiene un objeto válido.');
    }
    const candidate = payload as { format?: string; people?: MemoryProfile[] };
    if (candidate.format !== 'mindsage-memory-archive' || !Array.isArray(candidate.people)) {
      throw new Error('No es un archivo de MindSage compatible.');
    }
    const existingIds = new Set(this.state().people.map((person) => person.id));
    const imported = candidate.people
      .filter((person) => person?.id && person?.fullName)
      .map((person) => ({
        ...person,
        id: existingIds.has(person.id) ? crypto.randomUUID() : person.id,
        createdByUserId: this.currentUser()!.id,
        ownerUserId: undefined,
        claimedByUserId: undefined,
        status: 'PRIVADA' as Visibility,
        updatedAt: now(),
      }));
    this.updateState({ people: [...imported, ...this.state().people] });
    return imported.length;
  }

  resetDemo(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    this.state.set(EMPTY_STATE);
    this.persist();
  }

  private createSelfProfile(user: UserAccount): MemoryProfile {
    const birthYear = yearFromDate(user.birthDate);
    return seedPerson({
      id: crypto.randomUUID(),
      ownerUserId: user.id,
      createdByUserId: user.id,
      fullName: user.fullName,
      relationship: 'Mi propia ficha',
      birthDate: user.birthDate,
      birthYear,
      birthplace: 'Por documentar',
      residence: 'Por documentar',
      occupation: 'Por documentar',
      summary: 'Mi historia está preparada para empezar a ser documentada.',
      accent: '#347e83',
      avatar: 'draft',
      completeness: 12,
      stories: 0,
      media: 0,
      minutes: 0,
      status: 'PRIVADA',
      profileState: 'INCOMPLETA',
      privateIdentity: user.privateIdentity,
      tags: ['Mi historia'],
      events: [],
      wisdom: [],
      residences: [],
      consent: {
        profile: true,
        interview: false,
        media: false,
        publicSharing: false,
        aiUse: false,
      },
      createdAt: now(),
      updatedAt: now(),
    });
  }

  private createPlaceholder(
    fullName: string,
    birthYear: number | undefined,
    userId: string,
  ): MemoryProfile {
    const person = seedPerson({
      id: crypto.randomUUID(),
      createdByUserId: userId,
      fullName: fullName.trim(),
      relationship: 'Persona mencionada',
      birthYear: birthYear ?? 0,
      birthplace: 'Por documentar',
      residence: 'Por documentar',
      occupation: 'Por documentar',
      summary: 'Ficha incompleta creada al mencionar a esta persona en otra historia.',
      accent: '#8ca89a',
      avatar: 'draft',
      completeness: 5,
      stories: 0,
      media: 0,
      minutes: 0,
      status: 'PRIVADA',
      profileState: 'RECLAMABLE',
      tags: ['Persona mencionada', 'Pendiente de identificar'],
      events: [],
      wisdom: [],
      residences: [],
      consent: {
        profile: false,
        interview: false,
        media: false,
        publicSharing: false,
        aiUse: false,
      },
      createdAt: now(),
      updatedAt: now(),
    });
    this.updateState({ people: [person, ...this.state().people] });
    return person;
  }

  private findPersonByName(fullName: string): MemoryProfile | undefined {
    const normalized = fullName.trim().toLocaleLowerCase('es');
    return this.state().people.find(
      (person) => person.fullName.toLocaleLowerCase('es') === normalized,
    );
  }

  private calculateCompleteness(value: PersonFormValue): number {
    const fields = [
      value.fullName,
      value.preferredName,
      value.birthDate,
      value.birthplace,
      value.residence,
      value.nationality,
      value.languages,
      value.occupation,
      value.education,
      value.summary,
      value.biography,
      value.tags,
    ];
    const completed = fields.filter((field) => field.trim()).length;
    return Math.max(8, Math.round((completed / fields.length) * 100));
  }

  private isPublicContribution(value: {
    readonly visibility?: Visibility;
    readonly createdByUserId?: string;
  }): boolean {
    return value.visibility === 'PUBLICADA' || (!value.visibility && !value.createdByUserId);
  }

  private refreshPersonMetrics(personId: string): void {
    const person = this.requirePerson(personId);
    const media = this.state().media.filter((item) => item.personId === personId);
    const audioBytes = media
      .filter((item) => item.kind === 'AUDIO')
      .reduce((sum, item) => sum + item.size, 0);
    this.replacePerson({
      ...person,
      media: media.length,
      minutes: Math.max(person.minutes, Math.round(audioBytes / 120_000)),
      updatedAt: now(),
    });
  }

  private requireUser(): UserAccount {
    const user = this.currentUser();
    if (!user) {
      throw new Error('Regístrate o inicia sesión para continuar.');
    }
    return user;
  }

  private requirePerson(personId: string): MemoryProfile {
    const person = this.state().people.find((candidate) => candidate.id === personId);
    if (!person) {
      throw new Error('No se ha encontrado la ficha.');
    }
    return person;
  }

  private requireContribution(personId: string): void {
    this.requireUser();
    this.requirePerson(personId);
  }

  private setSession(userId: string): void {
    const session: Session = { userId, startedAt: now() };
    this.updateState({ session });
  }

  private replacePerson(person: MemoryProfile): void {
    const exists = this.state().people.some((candidate) => candidate.id === person.id);
    this.updateState({
      people: exists
        ? this.state().people.map((candidate) => (candidate.id === person.id ? person : candidate))
        : [person, ...this.state().people],
    });
  }

  private updateState(patch: Partial<VaultState>): void {
    this.state.update((state) => ({ ...state, ...patch }) as VaultState);
    this.persist();
  }

  private restore(): VaultState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VaultState;
        if (parsed.format === 'mindsage-local-vault' && parsed.version === 2) {
          return parsed;
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return EMPTY_STATE;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
  }
}
