type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

type Nationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese"


type Actress = Person & {
  most_famous_movies: [string, string, string]
  awards: string,
  nationality: Nationality
}

function isActress(data: any): data is Actress {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.id === "number" &&
    typeof data.name === "string" &&
    typeof data.birth_year === "number" &&
    typeof data.biography === "string" &&
    typeof data.image === "string" &&
    Array.isArray(data.most_famous_movies) &&
    data.most_famous_movies.length === 3 &&
    typeof data.awards === "string" &&
    typeof data.nationality === "string"
  )
}

async function getActress(id: number): Promise<Actress | null> {
  const response = await fetch(`http://localhost:3333/actresses/${id}`)

  if (!response.ok) return null

  const data = await response.json()

  return isActress(data) ? data : null
}

async function getAllActresses(): Promise<Actress[]> {
  const response = await fetch("http://localhost:3333/actresses")
  const actresses: Actress[] = await response.json()
  return actresses
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  return Promise.all(ids.map(id => getActress(id)))
}

