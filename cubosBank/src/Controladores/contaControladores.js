const bancoDedados = require( "../bancodedados" );


let numero = 1

const listarContas = async ( req, res ) => {
    return res.status( 200 ).json( bancoDedados.contas );
}


const criarConta = async ( req, res ) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    let saldo = 0

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const regexNascimento = /(19|20)\d{2}\-(0[1-9]|1[1,2])\-(0[1-9]|[12][0-9]|3[01])/


    let diaAtual = new Date()
    let anoAtual = diaAtual.getFullYear()
    let partesData = data_nascimento.split( '-' )
    let ano = parseInt( partesData[ 0 ] )

    const ehMaiorDeIdade = anoAtual - ano

    if ( !nome || !cpf || !email || !data_nascimento || !telefone || !senha ) {
        return res.status( 400 ).json( { mensagem: 'Preencha todos os campos' } )
    }


    // Validação E-mail
    if ( !regexEmail.test( email ) ) {
        return res.status( 400 ).json( { mensagem: 'E-mail inválido' } )
    }



    // Validação Data de nascimento
    if ( !regexNascimento.test( data_nascimento ) ) {
        return res.status( 400 ).json( { mensagem: 'Data de nascimento inválida' } )
    }

    //validação Data de nascimento com limite de idade mínima
    if ( ano >= anoAtual || ehMaiorDeIdade < 18 ) {
        return res.status( 400 ).json( { mensagem: 'É necessário ser maior de idade para criar uma conta no Dindin' } )
    }

    // Validação número de telefone
    if ( telefone.length == 9 && telefone[ 0 ] == 9 ) {
        return res.status( 400 ).json( { mensagem: 'Informe o DDD do número de telefone' } )
    }
    if ( telefone.length > 11 || telefone.length <= 10 ) {
        return res.status( 400 ).json( { mensagem: 'Número de telefone inválido' } )
    }


    const contaCriada = {
        numero: numero++,
        saldo,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }


    bancoDedados.contas.push( contaCriada )


    return res.status( 201 ).json( contaCriada )
}

const atualizarConta = async ( req, res ) => {
    const { numeroConta } = req.params;
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;

    const encontrarConta = bancoDedados.contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numeroConta )
    } );
    const encontrarCpf = bancoDedados.contas.some( ( conta ) => {
        return Number( conta.usuario.cpf ) === Number( cpf )
    } );
    const encontrarEmail = bancoDedados.contas.some( ( conta ) => {
        return conta.usuario.email === email
    } );


    if ( !numeroConta ) {
        return res.status( 400 ).json( { mensagem: 'Nenhuma conta foi informada' } );
    };
    if ( !encontrarConta ) {
        return res.status( 404 ).json( { mensagem: 'Conta não encontrada' } );
    };
    if ( !nome && !cpf && !data_nascimento && !telefone && !email && !senha ) {
        return res.status( 400 ).json( { mensagem: 'Pelo menos um campo deve ser informado' } );
    };
    if ( cpf ) {
        if ( encontrarCpf && encontrarCpf !== encontrarConta.usuario.cpf ) {
            return res.status( 400 ).json( { mensagem: 'este CPF já está cadastrado' } );
        };
        encontrarConta.usuario.cpf = cpf;
    };
    if ( email ) {
        if ( encontrarEmail && encontrarEmail !== encontrarConta.usuario.email ) {
            return res.status( 400 ).json( { mensagem: 'E-mail já cadastrado' } );
        };
        encontrarConta.usuario.email = email;
    };
    if ( nome ) {
        encontrarConta.usuario.nome = nome;
    };
    if ( telefone ) {
        encontrarConta.usuario.telefone = telefone;
    };
    if ( data_nascimento ) {
        encontrarConta.usuario.data_nascimento = data_nascimento;
    };
    if ( senha ) {
        encontrarConta.usuario.senha = senha;
    };

    return res.status( 200 ).json( { mensagem: 'Dados do usuário atualizados com sucesso' } );

}

const deletarConta = async ( req, res ) => {
    const { numeroConta } = req.params;

    const index = bancoDedados.contas.findIndex( ( conta ) => {
        return Number( conta.numero ) === Number( numeroConta );
    } );

    if ( index === -1 ) {
        return res.status( 404 ).json( { mensagem: 'A conta não foi encontrada' } );
    }

    const conta = bancoDedados.contas[ index ];

    if ( conta.saldo > 0 ) {
        return res.status( 400 ).json( { mensagem: 'A conta não pode ser excluída, pois possui saldo na conta' } );
    }

    bancoDedados.contas.splice( index, 1 );

    return res.status( 200 ).json( { mensagem: 'Conta excluída com sucesso!' } );
}

const saldoConta = async ( req, res ) => {
    const { numero_conta, senha } = req.query;

    const conta = bancoDedados.contas.find( ( conta ) => {
        return Number( conta.numero ) === Number( numero_conta );
    } )

    if ( !numero_conta || !senha ) {
        return res.status( 400 ).json( { mensagem: 'Deve ser informado, o numero da conta e senha' } );
    }
    if ( !conta ) {
        return res.status( 404 ).json( { mensagem: 'Conta não encontrada' } );
    }
    if ( conta.usuario.senha !== senha ) {
        return res.status( 400 ).json( { mensagem: 'Senha incorreta' } )
    }
    return res.status( 200 ).json( { saldo: conta.saldo } );
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    saldoConta
}