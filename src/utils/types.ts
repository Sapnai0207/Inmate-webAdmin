export enum Gender {
  Woman = 'Эмэгтэй',
  Male = 'Эрэгтэй',
  Other = 'Бусад',
}

export enum TreatmentStates {
  Done = 'Дууссан',
  Cancel = 'Цуцлагдасан',
  Pending = 'Хүлээгдэж байгаа',
}

export interface MedicalHistoryType {
  _id: string
  diseaseDescription: string
  diseaseCause: string
  medicalTreatments: string
  physicalTreatments: string
  diagnosedDate: Date
  completelyRecovered: boolean
}
