export interface ApiError {
  detail: string | { type: string; loc: string[]; msg: string }[]
}
