import { Movie } from './Movie'

export interface List {
  id: number
  name: string
  movies: Movie[]
}
