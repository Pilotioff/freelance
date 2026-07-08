export type Categoria = 'frontend' | 'backend' | 'bd' | 'devops' | 'cloud' | 'herramientas';

export interface TecnologiaEvaluable {
  clave: string;
  label: string;
  categoria: Categoria;
}

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  bd: 'Bases de datos',
  devops: 'DevOps',
  cloud: 'Cloud',
  herramientas: 'Herramientas',
};

export const TECNOLOGIAS_EVALUACION: TecnologiaEvaluable[] = [
  { clave: 'html', label: 'HTML', categoria: 'frontend' },
  { clave: 'css', label: 'CSS', categoria: 'frontend' },
  { clave: 'javascript', label: 'JavaScript', categoria: 'frontend' },
  { clave: 'typescript', label: 'TypeScript', categoria: 'frontend' },
  { clave: 'react', label: 'React', categoria: 'frontend' },
  { clave: 'vue', label: 'Vue', categoria: 'frontend' },
  { clave: 'angular', label: 'Angular', categoria: 'frontend' },
  { clave: 'flutter', label: 'Flutter', categoria: 'frontend' },
  { clave: 'react_native', label: 'React Native', categoria: 'frontend' },

  { clave: 'nodejs', label: 'Node.js', categoria: 'backend' },
  { clave: 'express', label: 'Express', categoria: 'backend' },
  { clave: 'php', label: 'PHP', categoria: 'backend' },
  { clave: 'laravel', label: 'Laravel', categoria: 'backend' },
  { clave: 'python', label: 'Python', categoria: 'backend' },
  { clave: 'django', label: 'Django', categoria: 'backend' },
  { clave: 'java', label: 'Java', categoria: 'backend' },
  { clave: 'spring_boot', label: 'Spring Boot', categoria: 'backend' },
  { clave: 'csharp', label: 'C#', categoria: 'backend' },
  { clave: 'dotnet', label: '.NET', categoria: 'backend' },

  { clave: 'mysql', label: 'MySQL', categoria: 'bd' },
  { clave: 'postgresql', label: 'PostgreSQL', categoria: 'bd' },
  { clave: 'mongodb', label: 'MongoDB', categoria: 'bd' },

  { clave: 'docker', label: 'Docker', categoria: 'devops' },
  { clave: 'linux', label: 'Linux', categoria: 'devops' },

  { clave: 'aws', label: 'AWS', categoria: 'cloud' },
  { clave: 'azure', label: 'Azure', categoria: 'cloud' },
  { clave: 'google_cloud', label: 'Google Cloud', categoria: 'cloud' },

  { clave: 'git', label: 'Git', categoria: 'herramientas' },
  { clave: 'rest_apis', label: 'REST APIs', categoria: 'herramientas' },
  { clave: 'graphql', label: 'GraphQL', categoria: 'herramientas' },
];

export const TECNOLOGIAS_EVALUABLES = TECNOLOGIAS_EVALUACION.map((t) => t.clave);

export const NIVELES_ESTRELLA: Record<number, string> = {
  1: 'Nunca lo he usado',
  2: 'Conocimientos básicos',
  3: 'Puedo desarrollar proyectos sencillos',
  4: 'Trabajo profesionalmente con esta tecnología',
  5: 'Tengo dominio avanzado y puedo liderar proyectos',
};
