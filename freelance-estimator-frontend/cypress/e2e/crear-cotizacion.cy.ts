const TECNOLOGIAS = [
  'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular', 'flutter', 'react_native',
  'nodejs', 'express', 'php', 'laravel', 'python', 'django', 'java', 'spring_boot', 'csharp', 'dotnet',
  'mysql', 'postgresql', 'mongodb', 'docker', 'linux', 'aws', 'azure', 'google_cloud',
  'git', 'rest_apis', 'graphql',
];

const API_URL = 'http://localhost:3000/api';

describe('Creación de cotización', () => {
  const email = `cypress-cotizacion-${Date.now()}@test.com`;
  const password = 'password123';

  before(() => {
    cy.request('POST', `${API_URL}/auth/registro`, {
      nombre: 'Cypress',
      apellido: 'Cotizador',
      email,
      password,
    });

    cy.request('POST', `${API_URL}/freelancer-experience/evaluar`, {
      puntajes: TECNOLOGIAS.map((tecnologia) => ({ tecnologia, estrellas: 4 })),
    });
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button', 'Iniciar sesión').click();
    cy.url().should('include', '/dashboard');
  });

  it('permite crear una cotización completa de principio a fin', () => {
    cy.contains('a, button', 'Cotizador').click();
    cy.url().should('include', '/cotizador');

    cy.contains(/manual/i).click();

    cy.contains('Siguiente').click();

    cy.contains('Web App').click();
    cy.contains('button', 'Siguiente').click();

    cy.get('input[placeholder="Mi proyecto web"]').type('Proyecto de prueba Cypress');
    cy.contains('button', 'Siguiente').click();

    cy.contains('VPS').click();
    cy.contains('1 mes').click();
    cy.contains('button', 'Siguiente').click();

    cy.contains('button', 'Generar cotización').click();

    cy.contains('¡Cotización creada!', { timeout: 10000 }).should('be.visible');
  });
});
