/// <reference types="cypress" />
import contrato from "../contracts/usuarios.contract"

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request("usuarios").then(response  =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      url: 'usuarios',
      method: 'GET'
    }).should(response =>{
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {

    let nomeRandomico = 'mestre dos magos - ' + Math.floor(Math.random() * 10000000)
    let emailRandomico = 'mestredosmagos' + Math.floor(Math.random() * 10000000) + '@gmail.com'

    cy.cadastrarUsuario(nomeRandomico,emailRandomico,'teste','true')
    .should(response => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {

    let nomeRandomico = 'mestre manhas - ' + Math.floor(Math.random() * 10000000) 

    cy.cadastrarUsuario(nomeRandomico,'mestremanhas@qa.com.br','teste','true')
    .should(response => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
    }) 
  });

  it('Deve editar um usuário previamente cadastrado', () => {

    let nomeRandomico = 'mestre dos magos - ' + Math.floor(Math.random() * 10000000)
    let emailRandomico = 'mestredosmagos' + Math.floor(Math.random() * 10000000) + '@gmail.com'

    cy.cadastrarUsuario(nomeRandomico,emailRandomico,'teste','true')
    .then(response =>{
      let id = response.body._id
      cy.request({
        url:`usuarios/${id}`,
        method: 'PUT',
        body: {
          "nome": nomeRandomico + 'nome editado',
          "email": emailRandomico,
          "password": "teste",
          "administrador": "true"
        }
      }).should(responserequest => {
        expect(responserequest.status).to.equal(200)
        expect(responserequest.body.message).to.equal('Registro alterado com sucesso')
      })
      
  }) 
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let nomeRandomico = 'mestre dos magos - ' + Math.floor(Math.random() * 10000000)
    let emailRandomico = 'mestredosmagos' + Math.floor(Math.random() * 10000000) + '@gmail.com'
    cy.cadastrarUsuario(nomeRandomico,emailRandomico,'teste','true')
    .then(response =>{
      let id = response.body._id
      cy.request({
        url:`usuarios/${id}`,
        method: 'DELETE'
      }).should(response =>{
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    }  
    )  
  });


});
