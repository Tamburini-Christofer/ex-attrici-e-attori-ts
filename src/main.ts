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

function isActress(data: unknown): data is Actress {
  if (typeof data !== "object" || data === null) return false

  const a = data as Record<string, any>

  return (
    typeof a.id === "number" &&
    typeof a.name === "string" &&
    typeof a.birth_year === "number" &&
    (a.death_year === undefined || typeof a.death_year === "number") &&
    typeof a.biography === "string" &&
    typeof a.image === "string" &&
    Array.isArray(a.most_famous_movies) &&
    a.most_famous_movies.length === 3 &&
    a.most_famous_movies.every((m: unknown) => typeof m === "string") &&
    typeof a.awards === "string" &&
    typeof a.nationality === "string"
  )
}


async function getActress(id: number): Promise<Actress | null> {
  try {
  const response = await fetch(`http://localhost:3333/actresses/${id}`)
  const data: unknown = await response.json();
  if (!isActress(data)) {
    throw new Error("Dati non validi ricevuti dal server")
  }
  return data;
  } catch (error) {
    if(error instanceof Error) {
      console.error(`Errore durante il recupero `, error)
    } else {
      console.error('Errore sconosciuto durante il recupero')
    }
    return null
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch("http://localhost:3333/actresses")

    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!Array.isArray(data)) {
      throw new Error("La risposta non è un array")
    }

    return data.filter(isActress)
  } catch (error) {
    console.error("Errore durante il recupero delle attrici", error)
    return []
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const fetchPromises = ids.map(id => getActress(id))
    return await Promise.all(fetchPromises)
  } catch (error) {
    console.error("Errore durante il recupero delle attrici", error)
    return []
  }
}

