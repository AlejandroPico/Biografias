import { Injectable, signal } from '@angular/core';

export interface LifeEvent {
  readonly id: string;
  readonly year: number;
  readonly endYear?: number;
  readonly title: string;
  readonly description: string;
  readonly category:
    | 'INFANCIA'
    | 'FAMILIA'
    | 'TRABAJO'
    | 'MIGRACIÓN'
    | 'EDUCACIÓN'
    | 'COMUNIDAD'
    | 'VIAJE';
  readonly place: string;
}

export interface Wisdom {
  readonly title: string;
  readonly quote: string;
  readonly theme: string;
  readonly audience: string;
}

export interface MemoryProfile {
  readonly id: string;
  readonly fullName: string;
  readonly preferredName: string;
  readonly initials: string;
  readonly relationship: string;
  readonly birthYear: number;
  readonly deathYear?: number;
  readonly birthplace: string;
  readonly residence: string;
  readonly occupation: string;
  readonly summary: string;
  readonly accent: string;
  readonly avatar: string;
  readonly completeness: number;
  readonly stories: number;
  readonly media: number;
  readonly minutes: number;
  readonly status: 'PUBLICADA' | 'FAMILIAR' | 'BORRADOR';
  readonly tags: readonly string[];
  readonly events: readonly LifeEvent[];
  readonly wisdom: readonly Wisdom[];
}

export interface InterviewQuestion {
  readonly category: string;
  readonly eyebrow: string;
  readonly question: string;
  readonly hint: string;
  readonly sensitivity: 'normal' | 'sensible';
}

interface NewMemoryInput {
  readonly fullName: string;
  readonly relationship: string;
  readonly birthYear?: number;
  readonly summary: string;
}

const SEED_PEOPLE: readonly MemoryProfile[] = [
  {
    id: 'carmen-ruiz',
    fullName: 'Carmen Ruiz Navarro',
    preferredName: 'Carmen',
    initials: 'CR',
    relationship: 'Abuela materna',
    birthYear: 1938,
    birthplace: 'Alcaudete, Jaén',
    residence: 'Barcelona',
    occupation: 'Costurera',
    summary:
      'Costurera, madre y memoria viva de un barrio que cambió del campo a la ciudad.',
    accent: '#bd684b',
    avatar: 'carmen',
    completeness: 78,
    stories: 18,
    media: 42,
    minutes: 126,
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
        description:
          'Viajó con una maleta pequeña y una dirección escrita en un papel.',
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
        description:
          'Creció de aprendiza a encargada y enseñó el oficio a varias generaciones.',
        category: 'TRABAJO',
        place: 'Barcelona',
      },
    ],
    wisdom: [
      {
        title: 'La casa que uno construye',
        quote:
          'No esperes a tener tiempo para cuidar a los tuyos. El tiempo no se encuentra: se aparta.',
        theme: 'Familia',
        audience: 'Para mis nietos y para quien siempre va con prisa',
      },
      {
        title: 'Equivocarse con dignidad',
        quote: 'Pide perdón pronto. El orgullo ocupa mucho sitio y no da calor.',
        theme: 'Decisiones',
        audience: 'Para la juventud',
      },
    ],
  },
  {
    id: 'antonio-vega',
    fullName: 'Antonio Vega Martín',
    preferredName: 'Toni',
    initials: 'AV',
    relationship: 'Amigo de la familia',
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
    media: 26,
    minutes: 88,
    status: 'FAMILIAR',
    tags: ['Mar', 'Trabajo', 'Galicia', 'Viajes'],
    events: [
      {
        id: 'a-1',
        year: 1942,
        title: 'La casa frente al puerto',
        description:
          'Creció observando cómo los barcos regresaban y aprendió sus nombres antes que las capitales.',
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
        description:
          'Pasó semanas lejos de casa reparando motores y escribiendo cartas.',
        category: 'VIAJE',
        place: 'Atlántico Norte',
      },
    ],
    wisdom: [
      {
        title: 'Aprender de verdad',
        quote:
          'Cuando no sepas algo, dilo. La persona que pregunta puede aprender; la que finge saber pone a todos en peligro.',
        theme: 'Trabajo',
        audience: 'Para aprendices de cualquier oficio',
      },
    ],
  },
  {
    id: 'lucia-ferrer',
    fullName: 'Lucía Ferrer Soler',
    preferredName: 'Lucía',
    initials: 'LF',
    relationship: 'Tía abuela',
    birthYear: 1935,
    deathYear: 2022,
    birthplace: 'Morella, Castellón',
    residence: 'Valencia',
    occupation: 'Maestra',
    summary:
      'Maestra rural durante cuatro décadas y defensora de que cada niña pudiera estudiar.',
    accent: '#77639a',
    avatar: 'lucia',
    completeness: 91,
    stories: 27,
    media: 58,
    minutes: 204,
    status: 'PUBLICADA',
    tags: ['Educación', 'Mujeres', 'Mundo rural', 'Comunidad'],
    events: [
      {
        id: 'l-1',
        year: 1935,
        title: 'Inviernos en Morella',
        description:
          'Los libros prestados y las historias junto al fuego marcaron su infancia.',
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
        title: 'El regalo de estudiar',
        quote:
          'La educación no sirve para escapar de donde vienes, sino para comprenderlo y poder elegir adónde vas.',
        theme: 'Educación',
        audience: 'Para mis antiguos alumnos',
      },
    ],
  },
  {
    id: 'manuel-ortega',
    fullName: 'Manuel Ortega Campos',
    preferredName: 'Manuel',
    initials: 'MO',
    relationship: 'Vecino',
    birthYear: 1946,
    birthplace: 'Teruel',
    residence: 'L’Hospitalet',
    occupation: 'Electricista',
    summary:
      'Electricista industrial, aficionado a la radio y cronista informal de su comunidad.',
    accent: '#a47a38',
    avatar: 'manuel',
    completeness: 42,
    stories: 7,
    media: 13,
    minutes: 31,
    status: 'BORRADOR',
    tags: ['Industria', 'Radio', 'Barrio'],
    events: [
      {
        id: 'm-1',
        year: 1964,
        title: 'La fábrica y la noche',
        description:
          'Estudiaba electricidad al terminar el turno para conseguir la titulación.',
        category: 'TRABAJO',
        place: 'Barcelona',
      },
    ],
    wisdom: [],
  },
];

@Injectable({ providedIn: 'root' })
export class MemoryVaultService {
  readonly people = signal<MemoryProfile[]>(this.restore());

  readonly questions: readonly InterviewQuestion[] = [
    {
      category: 'Infancia',
      eyebrow: 'Empecemos por los sentidos',
      question: '¿Cuál es el primer lugar que recuerdas con claridad?',
      hint: 'Puedes preguntar por sonidos, olores, personas y rutinas.',
      sensitivity: 'normal',
    },
    {
      category: 'Decisiones',
      eyebrow: 'Un punto de inflexión',
      question:
        '¿Qué decisión cambió tu vida sin que lo supieras en aquel momento?',
      hint: 'Deja unos segundos de silencio antes de ofrecer ayuda.',
      sensitivity: 'normal',
    },
    {
      category: 'Amor y familia',
      eyebrow: 'Pregunta con cuidado',
      question: '¿Qué has aprendido sobre querer y dejarse querer?',
      hint: 'No presupongas pareja, matrimonio ni descendencia.',
      sensitivity: 'sensible',
    },
    {
      category: 'Legado',
      eyebrow: 'Para quienes vendrán',
      question:
        'Si pudieras dejar una sola idea a quienes aún no han nacido, ¿cuál sería?',
      hint: 'Después, pregunta qué experiencia sostiene esa idea.',
      sensitivity: 'normal',
    },
  ];

  addDraft(input: NewMemoryInput): MemoryProfile {
    const initials = input.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
    const firstName = input.fullName.trim().split(/\s+/)[0];
    const created: MemoryProfile = {
      id: crypto.randomUUID(),
      fullName: input.fullName.trim(),
      preferredName: firstName,
      initials,
      relationship: input.relationship.trim() || 'Persona cercana',
      birthYear: input.birthYear ?? new Date().getFullYear(),
      birthplace: 'Por documentar',
      residence: 'Por documentar',
      occupation: 'Por documentar',
      summary:
        input.summary.trim() ||
        'Una nueva memoria preparada para empezar a recoger su historia.',
      accent: '#5e776c',
      avatar: 'draft',
      completeness: 8,
      stories: 0,
      media: 0,
      minutes: 0,
      status: 'BORRADOR',
      tags: ['Nueva memoria'],
      events: [],
      wisdom: [],
    };

    this.people.update((people) => [created, ...people]);
    this.persist();
    return created;
  }

  exportSnapshot(): object {
    return {
      format: 'mindsage-memory-archive',
      version: 1,
      exportedAt: new Date().toISOString(),
      privacyNotice:
        'Los datos de demostración son ficticios. Revisa consentimiento y permisos antes de compartir datos reales.',
      people: this.people(),
    };
  }

  private restore(): MemoryProfile[] {
    try {
      const stored = localStorage.getItem('mindsage-local-vault-v1');
      return stored ? (JSON.parse(stored) as MemoryProfile[]) : [...SEED_PEOPLE];
    } catch {
      return [...SEED_PEOPLE];
    }
  }

  private persist(): void {
    localStorage.setItem(
      'mindsage-local-vault-v1',
      JSON.stringify(this.people()),
    );
  }
}
