export type Visibility = 'PUBLICADA' | 'FAMILIAR' | 'PRIVADA' | 'BORRADOR';

export type LifeEventCategory =
  | 'INFANCIA'
  | 'FAMILIA'
  | 'TRABAJO'
  | 'MIGRACIÓN'
  | 'EDUCACIÓN'
  | 'COMUNIDAD'
  | 'VIAJE'
  | 'SALUD'
  | 'AMOR'
  | 'SERVICIO'
  | 'OTRO';

export type RelationKind =
  | 'MADRE'
  | 'PADRE'
  | 'PROGENITOR'
  | 'HIJA'
  | 'HIJO'
  | 'DESCENDIENTE'
  | 'HERMANA'
  | 'HERMANO'
  | 'PAREJA'
  | 'CÓNYUGE'
  | 'ABUELA'
  | 'ABUELO'
  | 'NIETA'
  | 'NIETO'
  | 'TÍA'
  | 'TÍO'
  | 'SOBRINA'
  | 'SOBRINO'
  | 'PRIMA'
  | 'PRIMO'
  | 'AMISTAD'
  | 'PERSONA_CLAVE'
  | 'OTRA';

export interface PrivateIdentity {
  readonly dni?: string;
  readonly socialSecurityNumber?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly address?: string;
}

export interface UserAccount {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly birthDate?: string;
  readonly privateIdentity: PrivateIdentity;
  readonly createdAt: string;
  readonly demoAccount: true;
}

export interface Session {
  readonly userId: string;
  readonly startedAt: string;
}

export interface LifeEvent {
  readonly id: string;
  readonly createdByUserId?: string;
  readonly year: number;
  readonly endYear?: number;
  readonly title: string;
  readonly description: string;
  readonly category: LifeEventCategory;
  readonly place: string;
  readonly relatedPersonIds?: readonly string[];
  readonly visibility?: Visibility;
}

export interface Wisdom {
  readonly id?: string;
  readonly createdByUserId?: string;
  readonly title: string;
  readonly quote: string;
  readonly theme: string;
  readonly audience: string;
  readonly visibility?: Visibility;
}

export interface Residence {
  readonly id: string;
  readonly createdByUserId?: string;
  readonly label: string;
  readonly country: string;
  readonly startYear?: number;
  readonly endYear?: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly kind: 'NACIMIENTO' | 'RESIDENCIA' | 'MIGRACIÓN' | 'VIAJE' | 'RECUERDO';
  readonly notes?: string;
  readonly visibility?: Visibility;
}

export interface MemoryProfile {
  readonly id: string;
  readonly ownerUserId?: string;
  readonly createdByUserId?: string;
  readonly claimedByUserId?: string;
  readonly fullName: string;
  readonly preferredName: string;
  readonly formerNames?: readonly string[];
  readonly initials: string;
  readonly relationship: string;
  readonly birthDate?: string;
  readonly birthYear: number;
  readonly deathDate?: string;
  readonly deathYear?: number;
  readonly isLiving: boolean;
  readonly gender?: string;
  readonly pronouns?: string;
  readonly birthplace: string;
  readonly residence: string;
  readonly nationality?: string;
  readonly languages?: readonly string[];
  readonly occupation: string;
  readonly education?: string;
  readonly militaryService?: string;
  readonly beliefs?: string;
  readonly summary: string;
  readonly biography?: string;
  readonly accent: string;
  readonly avatar: string;
  readonly completeness: number;
  readonly stories: number;
  readonly media: number;
  readonly minutes: number;
  readonly status: Visibility;
  readonly profileState: 'COMPLETA' | 'INCOMPLETA' | 'RECLAMABLE';
  readonly privateIdentity?: PrivateIdentity;
  readonly tags: readonly string[];
  readonly events: readonly LifeEvent[];
  readonly wisdom: readonly Wisdom[];
  readonly residences: readonly Residence[];
  readonly consent: {
    readonly profile: boolean;
    readonly interview: boolean;
    readonly media: boolean;
    readonly publicSharing: boolean;
    readonly aiUse: boolean;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface FamilyRelationship {
  readonly id: string;
  readonly fromPersonId: string;
  readonly toPersonId: string;
  readonly kind: RelationKind;
  readonly inverseKind: RelationKind;
  readonly status: 'CONFIRMADA' | 'RECUERDO' | 'PENDIENTE';
  readonly notes?: string;
  readonly visibility: Visibility;
  readonly createdByUserId: string;
  readonly createdAt: string;
}

export interface InterviewQuestion {
  readonly id: string;
  readonly category: string;
  readonly eyebrow: string;
  readonly question: string;
  readonly hint: string;
  readonly sensitivity: 'normal' | 'sensible';
}

export interface InterviewAnswer {
  readonly id: string;
  readonly questionId: string;
  readonly question: string;
  readonly transcript: string;
  readonly notes: string;
  readonly mediaId?: string;
  readonly createdAt: string;
}

export interface InterviewSession {
  readonly id: string;
  readonly personId: string;
  readonly interviewerUserId: string;
  readonly title: string;
  readonly consentConfirmed: boolean;
  readonly visibility: Visibility;
  readonly answers: readonly InterviewAnswer[];
  readonly startedAt: string;
  readonly updatedAt: string;
}

export interface MediaItem {
  readonly id: string;
  readonly ownerUserId: string;
  readonly personId: string;
  readonly interviewId?: string;
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly mimeType: string;
  readonly size: number;
  readonly kind: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
  readonly capturedAt?: string;
  readonly place?: string;
  readonly visibility: Visibility;
  readonly consentConfirmed: boolean;
  readonly createdAt: string;
}

export interface Message {
  readonly id: string;
  readonly senderUserId: string;
  readonly senderName: string;
  readonly recipientPersonId: string;
  readonly recipientName: string;
  readonly subject: string;
  readonly body: string;
  readonly createdAt: string;
  readonly read: boolean;
  readonly status: 'ENVIADO_LOCAL' | 'RECIBIDO_DEMO';
}

export interface VaultState {
  readonly format: 'mindsage-local-vault';
  readonly version: 2;
  readonly users: readonly UserAccount[];
  readonly session?: Session;
  readonly people: readonly MemoryProfile[];
  readonly relationships: readonly FamilyRelationship[];
  readonly interviews: readonly InterviewSession[];
  readonly media: readonly MediaItem[];
  readonly messages: readonly Message[];
}

export interface RegisterInput {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly birthDate?: string;
  readonly dni?: string;
  readonly socialSecurityNumber?: string;
  readonly phone?: string;
  readonly acceptTerms: boolean;
}

export interface PersonFormValue {
  fullName: string;
  preferredName: string;
  relationship: string;
  birthDate: string;
  deathDate: string;
  isLiving: boolean;
  gender: string;
  pronouns: string;
  birthplace: string;
  residence: string;
  nationality: string;
  languages: string;
  occupation: string;
  education: string;
  militaryService: string;
  beliefs: string;
  summary: string;
  biography: string;
  tags: string;
  status: Visibility;
  dni: string;
  socialSecurityNumber: string;
  phone: string;
  email: string;
  consentProfile: boolean;
  consentInterview: boolean;
  consentMedia: boolean;
  consentPublicSharing: boolean;
  consentAiUse: boolean;
}
