const { contas, saques, transferencias, depositos } = require( "../bancodedados" );

const agora = new Date()
const agoraFormatado = agora.toLocaleString()

const depositar = async ( req, res ) => {
    const { numero_conta, valor } = req.body

    if ( !numero_conta || !valor ) {
        return res.status( 400 ).json( { mensagem: 'Todos os campos devem ser preenchidos' } );
    }

    if ( valor <= 0 ) {
        return res.status( 400 ).json( { mensagem: 'Valor insuficiente para realizar um depósito' } );
    }


    const conta = contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numero_conta );
    } )

    if ( !conta ) {
        return res.status( 400 ).json( { mensagem: 'Conta não encontrada' } );
    }

    depositos.push( {
        data: agoraFormatado,
        numero_conta,
        valor
    } )

    conta.saldo = conta.saldo + valor;

    return res.status( 200 ).json( { mensagem: 'Depósito realizado com sucesso!' } );

}

const sacar = async ( req, res ) => {
    const { numero_conta, valor, senha } = req.body;


    const conta = contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numero_conta );
    } )

    if ( !numero_conta || !valor || !senha ) {
        return res.status( 400 ).json( { mensagem: 'Todos os campos devem ser preenchidos' } );
    }
    if ( !conta ) {
        return res.status( 404 ).json( { mensagem: 'Conta não encontrada' } );
    }
    if ( conta.usuario.senha !== senha ) {
        return res.status( 400 ).json( { mensagem: 'Senha incorreta' } )
    }
    if ( valor < 0 ) {
        return res.status( 400 ).json( { mensagem: 'insira um valor para saque válido' } )
    }
    if ( conta.saldo < valor ) {
        return res.status( 402 ).json( { mensagem: 'Saldo insuficiente na conta' } );
    }

    saques.push( {
        data: agoraFormatado,
        numero_conta,
        valor
    } )

    conta.saldo = conta.saldo - valor;

    saques.push( {
        data: new Date().toLocaleString(),
        numero_conta,
        valor
    } )


    return res.status( 200 ).json( { mensagem: 'Saque realizado com sucesso!' } );
}


const transferir = async ( req, res ) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if ( !numero_conta_origem || !numero_conta_destino || !valor || !senha ) {
        return res.status( 400 ).json( { mensagem: 'Todos os campos devem ser preenchidos' } );
    }

    if ( valor <= 0 ) {
        return res.status( 400 ).json( { mensagem: 'Valor insuficiente para realizar um depósito' } );
    }

    const contaOrigem = contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numero_conta_origem );
    } )
    const contaDestino = contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numero_conta_destino );
    } )
    if ( !contaDestino || !contaOrigem ) {
        return res.status( 404 ).json( { mensagem: 'Conta não encontrada' } );
    }

    if ( contaDestino == contaOrigem ) {
        return res.status( 404 ).json( { mensagem: 'Não é possível realizar transferências entre uma única conta ' } );
    }

    if ( contaOrigem.usuario.senha !== senha ) {
        return res.status( 400 ).json( { mensagem: 'Senha incorreta' } )
    }

    if ( contaOrigem.saldo < valor ) {
        return res.status( 402 ).json( { mensagem: 'Saldo insuficiente na conta' } );
    }

    contaOrigem.saldo = contaOrigem.saldo - valor;
    contaDestino.saldo = contaDestino.saldo + valor;

    transferencias.push( {
        data: agoraFormatado,
        numero_conta_origem,
        numero_conta_destino,
        valor
    } )

    return res.status( 200 ).json( { mensagem: 'Transferência realizada com sucesso!' } );

}

const extrato = ( req, res ) => {
    const { numero_conta, senha } = req.query

    const conta = contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numero_conta );
    } )

    if ( !numero_conta || !senha ) {
        return res.status( 400 ).json( { mensagem: 'Todos os campos devem ser preenchidos' } );
    }
    if ( !conta ) {
        return res.status( 404 ).json( { mensagem: 'Conta não encontrada' } );
    }
    if ( conta.usuario.senha !== senha ) {
        return res.status( 400 ).json( { mensagem: 'Senha incorreta' } )
    }



    const depositosFeitos = depositos.filter( deposito => deposito.numero_conta == numero_conta )
    const saquesFeitos = saques.filter( saque => saque.numero_conta == numero_conta )

    const transferenciasEnviadas = transferencias.filter( transferencia => transferencia.numero_conta_origem === numero_conta )
    const transferenciasRecebidas = transferencias.filter( transferencia => transferencia.numero_conta_destino === numero_conta )

    return res.status( 200 ).json( {
        depositos: depositosFeitos,
        saques: saquesFeitos,
        transferenciasEnviadas,
        transferenciasRecebidas
    } )
}

module.exports = {
    depositar,
    sacar,
    transferir,
    extrato
}