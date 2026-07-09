const TECNOLOGIAS = [
  'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular', 'flutter', 'react_native',
  'nodejs', 'express', 'php', 'laravel', 'python', 'django', 'java', 'spring_boot', 'csharp', 'dotnet',
  'mysql', 'postgresql', 'mongodb', 'docker', 'linux', 'aws', 'azure', 'google_cloud',
  'git', 'rest_apis', 'graphql',
];

const API_URL = 'http://localhost:3000/api';

describe('Login', () => {
  const email = `cypress-login-${Date.now()}@test.com`;
  const password = 'password123';

  before(() => {
    cy.request('POST', `${API_URL}/auth/registro`, {
      nombre: 'Cypress',
      apellido: 'Test',
      email,
      password,
    });

    cy.request('POST', `${API_URL}/freelancer-experience/evaluar`, {
      puntajes: TECNOLOGIAS.map((tecnologia) => ({ tecnologia, estrellas: 4 })),
    });
  });

  it('permite iniciar sesion con credenciales validas y llegar al dashboard', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button', 'Iniciar sesión').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('muestra un error con credenciales invalidas', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('no-existe@test.com');
    cy.get('input[type="password"]').type('claveIncorrecta');
    cy.contains('button', 'Iniciar sesión').click();

    cy.contains('Credenciales inválidas').should('be.visible');
  });
});
