const express = require( "express" );
const { criarConta, listarContas, atualizarConta, deletarConta, saldoConta } = require( '../Controladores/contaControladores' )
const { depositar, sacar, transferir, extrato } = require( '../Controladores/contaTransacoes' )
const { senhaDoBanco, validarCamposObrigatorios } = require( "../Intermediarios/validacaoIntermediario" );

const rotas = express();

rotas.get( '/contas', senhaDoBanco, listarContas );
rotas.get( '/contas/saldo', saldoConta )
rotas.get( '/contas/extrato', extrato )
rotas.post( '/contas', validarCamposObrigatorios, criarConta )
rotas.post( '/transacoes/depositar', depositar )
rotas.post( '/transacoes/sacar', sacar )
rotas.post( '/transacoes/transferir', transferir )
rotas.put( '/contas/:numeroConta/usuario', validarCamposObrigatorios, atualizarConta )
rotas.delete( '/contas/:numeroConta', deletarConta )


module.exports = rotas