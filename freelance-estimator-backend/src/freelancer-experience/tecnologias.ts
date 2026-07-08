export type Categoria = 'frontend' | 'backend' | 'bd' | 'devops' | 'cloud' | 'herramientas';

export const PESO_CATEGORIA: Record<Categoria, number> = {
  frontend: 0.25,
  backend: 0.25,
  bd: 0.15,
  devops: 0.15,
  cloud: 0.10,
  herramientas: 0.10,
};

export const TECNOLOGIA_CATEGORIA: Record<string, Categoria> = {
  html: 'frontend',
  css: 'frontend',
  javascript: 'frontend',
  typescript: 'frontend',
  react: 'frontend',
  vue: 'frontend',
  angular: 'frontend',
  flutter: 'frontend',
  react_native: 'frontend',

  nodejs: 'backend',
  express: 'backend',
  php: 'backend',
  laravel: 'backend',
  python: 'backend',
  django: 'backend',
  java: 'backend',
  spring_boot: 'backend',
  csharp: 'backend',
  dotnet: 'backend',

  mysql: 'bd',
  postgresql: 'bd',
  mongodb: 'bd',

  docker: 'devops',
  linux: 'devops',

  aws: 'cloud',
  azure: 'cloud',
  google_cloud: 'cloud',

  git: 'herramientas',
  rest_apis: 'herramientas',
  graphql: 'herramientas',
};

export const TECNOLOGIAS_EVALUABLES = Object.keys(TECNOLOGIA_CATEGORIA);

export const LABELS_TECNOLOGIA: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  vue: 'Vue',
  angular: 'Angular',
  flutter: 'Flutter',
  react_native: 'React Native',
  nodejs: 'Node.js',
  express: 'Express',
  php: 'PHP',
  laravel: 'Laravel',
  python: 'Python',
  django: 'Django',
  java: 'Java',
  spring_boot: 'Spring Boot',
  csharp: 'C#',
  dotnet: '.NET',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  docker: 'Docker',
  linux: 'Linux',
  aws: 'AWS',
  azure: 'Azure',
  google_cloud: 'Google Cloud',
  git: 'Git',
  rest_apis: 'REST APIs',
  graphql: 'GraphQL',
};
